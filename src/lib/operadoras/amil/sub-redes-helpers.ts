/**
 * Sub-Redes Amil — helpers para filtragem de prestadores por sub-rede
 * (Story 7.11 FR44).
 *
 * Estratégia de classificação (em ordem de prioridade):
 *
 * 1. **Hospitais flagship por nome (lista nominal):** se o nome do prestador
 *    contém qualquer entry de `hospitaisFlagship`, classifica como
 *    pertencente àquela sub-rede. Captura especialmente Rede D'Or (que não
 *    tem código de rede no dataset).
 *
 * 2. **Match por `redesDataset`:** se algum dos `redes: string[]` do
 *    prestador casa com `redesDataset` da sub-rede, classifica.
 *
 * 3. **Fallback:** prestador não pertence à sub-rede.
 *
 * **GAP de dataset (TODO Atlas):**
 * O Power BI Amil não exporta campo "tipo de rede" — toda classificação
 * é heurística. Precisão estimada ~85% (similar à inferência de tipo
 * em `inferTipoAtendimento`).
 */

import {
  getAllPrestadores,
  type PrestadorAmil,
} from '@/lib/operadoras/amil/rede-credenciada-loader'
import {
  SUB_REDES_AMIL,
  type SubRedeAmil,
  type SubRedeSlug,
} from '@/data/operadoras/amil/sub-redes-rede-credenciada'

/**
 * Verifica se o nome do prestador casa com algum hospital flagship da sub-rede.
 *
 * Comparação UPPERCASE para tolerar variações do dataset (ex: "COPA D OR" vs "Copa D'Or").
 */
function matchHospitalFlagship(
  prestador: PrestadorAmil,
  flagships: readonly string[],
): boolean {
  if (flagships.length === 0) return false
  const nomeUpper = prestador.nome.toUpperCase()
  return flagships.some((flagship) => nomeUpper.includes(flagship))
}

/**
 * Verifica se o prestador tem alguma rede do dataset que case com a sub-rede.
 */
function matchRedeDataset(
  prestador: PrestadorAmil,
  redesAlvo: readonly string[],
): boolean {
  if (redesAlvo.length === 0) return false
  return prestador.redes.some((r) => redesAlvo.includes(r))
}

/**
 * Retorna prestadores que pertencem a uma sub-rede.
 *
 * Estratégia combinada: flagships por nome OR redes do dataset.
 *
 * Para sub-rede 'hospitais-dor':
 *   - Match primário: nome contém "D OR" / "COPA D OR" / etc.
 *   - Match secundário: rede inclui AMIL ONE/BLACK (dão acesso à D'Or)
 *
 * Para sub-rede 'classica':
 *   - Match primário: rede inclui AMIL S450/S580/S750
 */
export function getPrestadoresPorSubRede(slug: SubRedeSlug): PrestadorAmil[] {
  const subRede = SUB_REDES_AMIL[slug]
  const todos = getAllPrestadores()

  return todos.filter((p) => {
    const matchFlagship = matchHospitalFlagship(p, subRede.hospitaisFlagship)
    const matchRede = matchRedeDataset(p, subRede.redesDataset)
    return matchFlagship || matchRede
  })
}

/**
 * Retorna apenas hospitais flagship "nominados" da sub-rede
 * (subset da função acima — usado no template para destaque editorial).
 *
 * Para sub-redes sem `hospitaisFlagship` (Clássica, Fácil, Medial),
 * retorna lista vazia — caller deve usar `getPrestadoresPorSubRede` direto.
 */
export function getHospitaisFlagshipPorSubRede(
  slug: SubRedeSlug,
): PrestadorAmil[] {
  const subRede = SUB_REDES_AMIL[slug]
  if (subRede.hospitaisFlagship.length === 0) return []
  const todos = getAllPrestadores()
  return todos.filter((p) =>
    matchHospitalFlagship(p, subRede.hospitaisFlagship),
  )
}

/**
 * Estatísticas agregadas da sub-rede para hero/header da página.
 */
export interface EstatisticasSubRede {
  slug: SubRedeSlug
  nome: string
  totalPrestadores: number
  totalUFs: number
  totalMunicipios: number
  topUFs: { uf: string; total: number }[]
  porTipo: Record<string, number>
}

/**
 * Estatísticas agregadas para uma sub-rede.
 *
 * Usado no hero da página + AC14 (validação dataset coverage ≥30 prestadores).
 */
export function getEstatisticasSubRede(
  slug: SubRedeSlug,
): EstatisticasSubRede {
  const prestadores = getPrestadoresPorSubRede(slug)
  const subRede: SubRedeAmil = SUB_REDES_AMIL[slug]

  const ufs = new Set<string>()
  const municipios = new Set<string>()
  const porUF = new Map<string, number>()
  const porTipo = new Map<string, number>()

  for (const p of prestadores) {
    ufs.add(p.uf)
    municipios.add(`${p.uf}|${p.municipio}`)
    porUF.set(p.uf, (porUF.get(p.uf) ?? 0) + 1)
    porTipo.set(p.tipoInferido, (porTipo.get(p.tipoInferido) ?? 0) + 1)
  }

  const topUFs = Array.from(porUF.entries())
    .map(([uf, total]) => ({ uf, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  return {
    slug,
    nome: subRede.nome,
    totalPrestadores: prestadores.length,
    totalUFs: ufs.size,
    totalMunicipios: municipios.size,
    topUFs,
    porTipo: Object.fromEntries(porTipo),
  }
}

/**
 * AC14 — Validação de threshold mínimo de prestadores por sub-rede.
 *
 * Sub-redes com cobertura < threshold são candidatas a `noindex` + canonical
 * para `/rede-credenciada/`.
 */
export const MIN_PRESTADORES_SUB_REDE = 30 as const

export function isSubRedeViavel(slug: SubRedeSlug): boolean {
  return getPrestadoresPorSubRede(slug).length >= MIN_PRESTADORES_SUB_REDE
}
