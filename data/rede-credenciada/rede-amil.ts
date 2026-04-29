/**
 * @deprecated Substituído por `src/lib/operadoras/amil/rede-credenciada-loader.ts`
 * (Story 7.1 AC6). Tipos centralizados em `src/types/rede-credenciada-amil.ts` e
 * slug map em `src/lib/operadoras/amil/slugs.ts` (AC2-bis amendment O-1).
 *
 * Este arquivo permanece como SHIM de compatibilidade até Story 7.2 (hub
 * `<NetworkSearch />`) marcar para remoção definitiva — qualquer import novo
 * DEVE usar os paths canônicos `@/lib/operadoras/amil/*` e `@/types/*`.
 *
 * Migration:
 *   - import { getAllPrestadores } from 'data/rede-credenciada/rede-amil'
 *   + import { getAllPrestadores } from '@/lib/operadoras/amil/rede-credenciada-loader'
 *
 * Rede Credenciada Amil — Plano de Saúde Empresarial
 *
 * Versão: REAL (schema oficial v2 do dataset Power BI — 2026-04-26)
 * Origem dos dados: scraping Playwright do Power BI público Amil
 * Pipeline: scrape_powerbi_amil.js (em C:\Users\benef\) — fonte canônica em hub planodesaudepj (ADR-007 SSOT)
 *
 * Dataset (geradoEm: 2026-04-26T02:21:13.770Z):
 * - 9.325 prestadores
 * - 26 UFs (incluindo Norte parcial: AM, AP, RR — Amil expandiu cobertura)
 * - 11 redes/produtos ATIVAS (header anuncia 49 — investigação em Story 7.0a)
 * - Schema raiz: { geradoEm, fonte, totalRedes, totalPrestadores, redes[], prestadores[] }
 * - Snapshot: Amil atualiza diariamente ~03:30 BRT
 *
 * MIGRAÇÃO v1 → v2 (SCP v1.2.3):
 * - v1 schema: { headers, totalLinhas, prestadores[].{Prestador, ...10 booleanos} }
 * - v2 schema: { geradoEm, totalPrestadores, redes[], prestadores[].{codigo, nome, uf, municipio, bairro, redes: string[]} }
 * - 5 redes do enum v1 SUMIRAM: REDE 300/200 NACIONAL BLUE, AMIL ONE S2500 QP, PLATINUM MAIS, PLATINUM QP
 * - 6 redes NOVAS apareceram: ADESÃO OURO MAIS, AMIL S380 QP/QC, AMIL S450 QC, ADESÃO BRONZE RJ/SP
 *
 * Path final pós Story 1.1 (fork+strip) e Story 7.1 (loader rewrite):
 *   data/rede-credenciada/rede-amil.ts          → @deprecated (este arquivo)
 *   data/rede-credenciada/rede-credenciada.json → src/data/operadoras/amil/rede-credenciada.json (mirror — ADR-007)
 *   ↓
 *   src/lib/operadoras/amil/rede-credenciada-loader.ts (substituto canônico)
 *   src/types/rede-credenciada-amil.ts (types separados)
 *
 * Single Source of Truth (ADR-007):
 * - Canon: planodesaudepj/src/data/operadoras/amil/rede-credenciada.json
 * - Mirror: planoamilempresas/data/rede-credenciada/rede-credenciada.json (este arquivo lê)
 * - Pipeline mensal: Story 7.10 (GitHub Actions cron — auto-PR canon → mirror)
 *
 * GAPs conhecidos (afetam stories Epic 7):
 * - Sem Especialidade médica (filtro Power BI não vem na export)
 * - Sem endereço completo, telefone, CEP, coordenadas geográficas
 * - Sem dados Norte de RR/AC (apenas AM/AP capturados)
 * - Tipo de atendimento INFERIDO via regex no nome (Hospital/Clínica/Lab/...)
 * - Header redes[] anuncia 49, mas só 11 estão populadas em prestadores[].redes (Story 7.0a investiga)
 *
 * Owner: Agnaldo Silva (corretor SUSEP 201054484, BeneficioRH)
 */

import dataset from './rede-credenciada.json'

// ──────────────────────────────────────────────────────────────────────
// Types — schema oficial v2 do dataset
// ──────────────────────────────────────────────────────────────────────

/**
 * 11 redes/produtos Amil ATIVOS no dataset 2026-04-26.
 *
 * Header dataset.redes[] anuncia 49 strings, mas apenas 11 têm prestadores associados
 * em prestadores[].redes — investigação formal em Story 7.0a.
 *
 * Cross-reference com 6 segmentações Bronze→Platinum Mais (data/tabelas-amil.ts):
 * confirmação stakeholder pendente em Story 7.0a AC5.
 */
export type RedeAmilNome =
  | 'AMIL S380 QP'
  | 'AMIL S380 QC'
  | 'AMIL S450 QP'
  | 'AMIL S450 QC'
  | 'AMIL S580 QP'
  | 'AMIL S750 QP'
  | 'AMIL ONE S6500 BLACK QP'
  | 'BLACK'
  | 'ADESÃO OURO MAIS'
  | 'ADESÃO BRONZE RJ'
  | 'ADESÃO BRONZE SP'

/** 9 tipos de atendimento inferidos via regex no nome do prestador */
export type TipoAtendimentoInferido =
  | 'Hospital'
  | 'Pronto-Socorro'
  | 'Maternidade'
  | 'Clínica'
  | 'Laboratório'
  | 'Diagnóstico por Imagem'
  | 'Odontologia'
  | 'Centro/Instituto'
  | 'Outro'

/** Estrutura raw de cada prestador no JSON v2 */
export interface PrestadorAmilRaw {
  codigo: string
  nome: string
  uf: string
  municipio: string
  bairro: string
  redes: string[]
}

/** Estrutura processada — usada nas páginas SEO (com tipo inferido + slug) */
export interface PrestadorAmil extends PrestadorAmilRaw {
  redes: RedeAmilNome[]
  tipoInferido: TipoAtendimentoInferido
  slug: string
}

export interface MunicipioRedeAmil {
  uf: string
  municipio: string
  cidadeSlug: string
  ufSlug: string
  totalPrestadores: number
}

export interface DatasetRedeAmil {
  geradoEm: string
  fonte: string
  totalRedes: number
  totalPrestadores: number
  redes: string[]
  prestadores: PrestadorAmilRaw[]
}

// ──────────────────────────────────────────────────────────────────────
// Constantes — listas exportadas
// ──────────────────────────────────────────────────────────────────────

/** 11 redes ATIVAS no dataset 2026-04-26 (ordem: por contagem de prestadores desc) */
export const REDE_KEYS: RedeAmilNome[] = [
  'ADESÃO OURO MAIS',
  'AMIL S380 QP',
  'AMIL S380 QC',
  'BLACK',
  'AMIL S580 QP',
  'AMIL S750 QP',
  'AMIL S450 QC',
  'AMIL S450 QP',
  'AMIL ONE S6500 BLACK QP',
  'ADESÃO BRONZE RJ',
  'ADESÃO BRONZE SP',
]

export const TIPOS_ATENDIMENTO_KEYS: TipoAtendimentoInferido[] = [
  'Hospital',
  'Pronto-Socorro',
  'Maternidade',
  'Clínica',
  'Laboratório',
  'Diagnóstico por Imagem',
  'Odontologia',
  'Centro/Instituto',
  'Outro',
]

/**
 * Slug URL-friendly para nome de produto/rede.
 * Uso em URLs como /rede/amil-s750-qp/sp (decisão ADR-006 v1 — slugs canônicos).
 */
export const REDE_SLUGS: Record<RedeAmilNome, string> = {
  'ADESÃO OURO MAIS': 'adesao-ouro-mais',
  'AMIL S380 QP': 'amil-s380-qp',
  'AMIL S380 QC': 'amil-s380-qc',
  'BLACK': 'black',
  'AMIL S580 QP': 'amil-s580-qp',
  'AMIL S750 QP': 'amil-s750-qp',
  'AMIL S450 QC': 'amil-s450-qc',
  'AMIL S450 QP': 'amil-s450-qp',
  'AMIL ONE S6500 BLACK QP': 'amil-one-s6500-black-qp',
  'ADESÃO BRONZE RJ': 'adesao-bronze-rj',
  'ADESÃO BRONZE SP': 'adesao-bronze-sp',
}

// ──────────────────────────────────────────────────────────────────────
// Inferência de tipo (regex no nome — gap suprido sem dado oficial)
// Precisão estimada: ~85-90% (75% "Outro" no dataset 2026-04-26 — regex precisa enriquecimento)
// ──────────────────────────────────────────────────────────────────────

export function inferTipoAtendimento(nome: string): TipoAtendimentoInferido {
  const n = nome.toUpperCase()
  if (/PRONTO\s*SOCORRO|\bPS\b/.test(n)) return 'Pronto-Socorro'
  if (/MATERNIDADE/.test(n)) return 'Maternidade'
  if (/HOSPITAL|\bHOSP\b/.test(n)) return 'Hospital'
  if (/LABORAT[OÓ]RIO|\bLAB\b|AN[ÁA]LISES\s*CL[IÍ]NICAS|PATOLOGIA/.test(n)) {
    return 'Laboratório'
  }
  if (/IMAGEM|RADIOLOG|RAIO[\s-]?X|TOMOGR|RESSON|ULTRASSOM|ULTRASSON/.test(n)) {
    return 'Diagnóstico por Imagem'
  }
  if (/ODONT|DENT[IÁ]RI|ORTODONTIA/.test(n)) return 'Odontologia'
  if (/CL[IÍ]NICA/.test(n)) return 'Clínica'
  if (/INSTITUTO|CENTRO\b|FUNDA[CÇ][AÃ]O/.test(n)) return 'Centro/Instituto'
  return 'Outro'
}

// ──────────────────────────────────────────────────────────────────────
// Slug helper (URL-friendly, idempotente)
// ──────────────────────────────────────────────────────────────────────

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ──────────────────────────────────────────────────────────────────────
// Type guard runtime (validação de shape do dataset)
// ──────────────────────────────────────────────────────────────────────

function assertDatasetRedeAmil(x: unknown): asserts x is DatasetRedeAmil {
  if (!x || typeof x !== 'object') {
    throw new Error('rede-credenciada.json shape inválido — não é objeto (SCP v1.2.3)')
  }
  const d = x as Partial<DatasetRedeAmil>
  if (
    typeof d.geradoEm !== 'string' ||
    typeof d.totalPrestadores !== 'number' ||
    !Array.isArray(d.redes) ||
    !Array.isArray(d.prestadores)
  ) {
    throw new Error(
      'rede-credenciada.json shape inválido — esperado schema v2 (SCP v1.2.3). ' +
        'Verificar sync hub→mirror (ADR-007 SSOT)',
    )
  }
}

// ──────────────────────────────────────────────────────────────────────
// Parser e cache
// ──────────────────────────────────────────────────────────────────────

const rawDataset: unknown = dataset
assertDatasetRedeAmil(rawDataset)
const dados: DatasetRedeAmil = rawDataset

function parsePrestador(row: PrestadorAmilRaw): PrestadorAmil {
  // Filtra apenas redes que ESTÃO no enum RedeAmilNome (defensivo contra dataset com lixo)
  const redesValidas = (row.redes || []).filter((r): r is RedeAmilNome =>
    (REDE_KEYS as string[]).includes(r),
  )
  const slug = slugify(`${row.codigo}-${row.nome}-${row.bairro || ''}`)
  return {
    codigo: row.codigo,
    nome: row.nome,
    uf: row.uf,
    municipio: row.municipio,
    bairro: row.bairro || '',
    redes: redesValidas,
    tipoInferido: inferTipoAtendimento(row.nome),
    slug,
  }
}

let cachePrestadores: PrestadorAmil[] | null = null
let cacheMunicipios: MunicipioRedeAmil[] | null = null

// ──────────────────────────────────────────────────────────────────────
// API pública — funções de consulta usadas pelas páginas SEO
// ──────────────────────────────────────────────────────────────────────

/** Retorna todos os prestadores processados (com cache) */
export function getAllPrestadores(): PrestadorAmil[] {
  if (cachePrestadores) return cachePrestadores
  cachePrestadores = dados.prestadores
    .map(parsePrestador)
    .filter((p) => p.uf && p.municipio)
  return cachePrestadores
}

/** Retorna lista agregada de municípios com contagem de prestadores */
export function getMunicipios(): MunicipioRedeAmil[] {
  if (cacheMunicipios) return cacheMunicipios
  const grouped = new Map<string, MunicipioRedeAmil>()
  for (const p of getAllPrestadores()) {
    const key = `${p.uf}|${p.municipio}`
    const existing = grouped.get(key)
    if (existing) {
      existing.totalPrestadores += 1
    } else {
      grouped.set(key, {
        uf: p.uf,
        municipio: p.municipio,
        ufSlug: p.uf.toLowerCase(),
        cidadeSlug: slugify(p.municipio),
        totalPrestadores: 1,
      })
    }
  }
  cacheMunicipios = Array.from(grouped.values()).sort(
    (a, b) => b.totalPrestadores - a.totalPrestadores,
  )
  return cacheMunicipios
}

export function getMunicipioBySlug(
  ufSlug: string,
  cidadeSlug: string,
): MunicipioRedeAmil | null {
  return (
    getMunicipios().find(
      (m) =>
        m.ufSlug === ufSlug.toLowerCase() &&
        m.cidadeSlug === cidadeSlug.toLowerCase(),
    ) ?? null
  )
}

export function getPrestadoresPorMunicipio(
  ufSlug: string,
  cidadeSlug: string,
): PrestadorAmil[] {
  const municipio = getMunicipioBySlug(ufSlug, cidadeSlug)
  if (!municipio) return []
  return getAllPrestadores().filter(
    (p) => p.uf === municipio.uf && p.municipio === municipio.municipio,
  )
}

export function getMunicipiosByUf(uf: string): MunicipioRedeAmil[] {
  return getMunicipios()
    .filter((m) => m.uf.toLowerCase() === uf.toLowerCase())
    .sort((a, b) => b.totalPrestadores - a.totalPrestadores)
}

export function getTopMunicipios(limit = 10): MunicipioRedeAmil[] {
  return getMunicipios().slice(0, limit)
}

export function getBairrosDoMunicipio(
  prestadores: PrestadorAmil[],
): { bairro: string; total: number }[] {
  const map = new Map<string, number>()
  for (const p of prestadores) {
    if (!p.bairro) continue
    map.set(p.bairro, (map.get(p.bairro) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .map(([bairro, total]) => ({ bairro, total }))
    .sort((a, b) => b.total - a.total)
}

/** Filtra prestadores por rede/produto Amil aceito */
export function getPrestadoresPorRede(rede: RedeAmilNome): PrestadorAmil[] {
  return getAllPrestadores().filter((p) => p.redes.includes(rede))
}

/** Filtra prestadores por tipo de atendimento (inferido) */
export function getPrestadoresPorTipo(
  tipo: TipoAtendimentoInferido,
): PrestadorAmil[] {
  return getAllPrestadores().filter((p) => p.tipoInferido === tipo)
}

/** Encontra prestador por slug (uso em SSG `/rede/[uf]/[municipio]/[prestadorSlug]`) */
export function getPrestadorBySlug(
  ufSlug: string,
  cidadeSlug: string,
  prestadorSlug: string,
): PrestadorAmil | null {
  const ufMatch = ufSlug.toLowerCase()
  const cidadeMatch = cidadeSlug.toLowerCase()
  return (
    getAllPrestadores().find(
      (p) =>
        p.uf.toLowerCase() === ufMatch &&
        slugify(p.municipio) === cidadeMatch &&
        p.slug === prestadorSlug,
    ) ?? null
  )
}

// ──────────────────────────────────────────────────────────────────────
// Estatísticas agregadas (úteis em landings programáticas)
// ──────────────────────────────────────────────────────────────────────

export interface EstatisticasRede {
  geradoEm: string
  totalPrestadores: number
  totalUFs: number
  totalMunicipios: number
  porTipo: Record<TipoAtendimentoInferido, number>
  porUF: Record<string, number>
  porRede: Record<RedeAmilNome, number>
}

export function getEstatisticasRede(): EstatisticasRede {
  const todos = getAllPrestadores()
  const ufs = new Set(todos.map((p) => p.uf))
  const municipios = new Set(todos.map((p) => `${p.uf}|${p.municipio}`))

  const porTipo = TIPOS_ATENDIMENTO_KEYS.reduce(
    (acc, t) => ({
      ...acc,
      [t]: todos.filter((p) => p.tipoInferido === t).length,
    }),
    {} as Record<TipoAtendimentoInferido, number>,
  )
  const porUF: Record<string, number> = {}
  for (const p of todos) {
    porUF[p.uf] = (porUF[p.uf] ?? 0) + 1
  }
  const porRede = REDE_KEYS.reduce(
    (acc, r) => ({
      ...acc,
      [r]: todos.filter((p) => p.redes.includes(r)).length,
    }),
    {} as Record<RedeAmilNome, number>,
  )

  return {
    geradoEm: dados.geradoEm,
    totalPrestadores: todos.length,
    totalUFs: ufs.size,
    totalMunicipios: municipios.size,
    porTipo,
    porUF,
    porRede,
  }
}

/** Estatísticas agregadas por UF */
export interface EstatisticasUFAmil {
  uf: string
  ufSlug: string
  totalPrestadores: number
  totalMunicipios: number
  porTipo: Record<TipoAtendimentoInferido, number>
  porRede: Record<RedeAmilNome, number>
}

export function getEstatisticasByUF(uf: string): EstatisticasUFAmil {
  const prestadores = getAllPrestadores().filter(
    (p) => p.uf.toLowerCase() === uf.toLowerCase(),
  )
  const municipios = new Set(prestadores.map((p) => p.municipio))

  const porTipo = TIPOS_ATENDIMENTO_KEYS.reduce(
    (acc, t) => ({
      ...acc,
      [t]: prestadores.filter((p) => p.tipoInferido === t).length,
    }),
    {} as Record<TipoAtendimentoInferido, number>,
  )
  const porRede = REDE_KEYS.reduce(
    (acc, r) => ({
      ...acc,
      [r]: prestadores.filter((p) => p.redes.includes(r)).length,
    }),
    {} as Record<RedeAmilNome, number>,
  )

  return {
    uf: uf.toUpperCase(),
    ufSlug: uf.toLowerCase(),
    totalPrestadores: prestadores.length,
    totalMunicipios: municipios.size,
    porTipo,
    porRede,
  }
}

/** Slug de prestador para URL: codigo-nome-bairro (já gerado em parsePrestador) */
export function prestadorSlug(p: PrestadorAmil): string {
  return p.slug
}
