/**
 * Chunked Static Params — Story 7.4 (FR45) infra SSG.
 *
 * Estratégia de chunking para 9.325 páginas-prestador SSG:
 *
 * **Por que chunking:**
 * - 9.325 páginas SSG no Hobby tier Vercel ≈ 25-30 minutos de build (no limite)
 * - Build pode estourar 30min e ser rejeitado pelo gate CI (AC10)
 * - Solução: dividir em phases configuráveis via env vars
 *
 * **Phase strategy (ADR-005 v2):**
 * - **Phase 1 (default):** Sudeste apenas (RJ+SP+MG+ES) ≈ 7.166 prestadores (~77% volume)
 * - **Phase 2 (env opt-in):** demais 22 UFs ≈ 2.159 prestadores
 * - **MVP build (default):** apenas top-N municípios — 30-50 páginas por UF (~2.000 total)
 *
 * **Env vars:**
 * - `BUILD_FULL_PROVIDERS=true` → Phase 1 completa (7.166 páginas)
 * - `PHASE_2_ENABLED=true` → adiciona Phase 2 (sobe para 9.325 páginas)
 * - default (nenhum env) → MVP-build (30 prestadores top-densidade por UF Sudeste)
 *
 * **Anti-thin (AC6):** prestadores em municípios com <5 prestadores totais
 * são gerados mas com `noindex` (handled na page.tsx com `MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL`).
 *
 * **Configurabilidade pós-launch:** mudança de threshold ou phase é env-var
 * change + redeploy — sem code change.
 */

import {
  getAllPrestadores,
  type PrestadorAmil,
} from '@/lib/operadoras/amil/rede-credenciada-loader'

/**
 * UFs do Sudeste (Phase 1).
 *
 * Critério: 77% do volume de prestadores + ~80% da demanda histórica de busca
 * (`docs/decisions/adr-005-programmatic-seo-depth-strategy.md`).
 */
export const PHASE_1_UFS = ['RJ', 'SP', 'MG', 'ES'] as const

/**
 * Threshold mínimo de prestadores no município para indexar
 * a página-prestador individual.
 *
 * < threshold = `noindex,follow` + canonical para `/rede/[uf]/[municipio]/`.
 * Evita classificação Thin Content pelo Google (Helpful Content Update).
 */
export const MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL = 5 as const

/**
 * MVP-build: cap por UF para reduzir build time durante desenvolvimento.
 *
 * Override via `BUILD_FULL_PROVIDERS=true`.
 */
export const MVP_BUILD_CAP_PER_UF = 30 as const

export interface PrestadorParams {
  uf: string
  municipio: string
  prestadorSlug: string
}

interface ChunkedParamsConfig {
  /** Se true, gera Phase 1 completa (7.166 páginas Sudeste). Default: false (MVP cap). */
  buildFullProviders?: boolean
  /** Se true, inclui Phase 2 (demais UFs). Default: false. */
  phase2Enabled?: boolean
}

/**
 * Resolve config a partir de env vars.
 *
 * Permite override em build time sem alteração de código.
 */
export function resolveChunkConfig(): ChunkedParamsConfig {
  return {
    buildFullProviders: process.env.BUILD_FULL_PROVIDERS === 'true',
    phase2Enabled: process.env.PHASE_2_ENABLED === 'true',
  }
}

/**
 * Aplica filtro de Phase + cap MVP sobre array de prestadores.
 */
function applyChunkFilter(
  prestadores: readonly PrestadorAmil[],
  config: ChunkedParamsConfig,
): PrestadorAmil[] {
  // Filtro Phase 1 vs Phase 2
  const filtered = prestadores.filter((p) => {
    const isSudeste = (PHASE_1_UFS as readonly string[]).includes(p.uf)
    if (config.phase2Enabled) return true // ambas as phases
    return isSudeste // só Phase 1
  })

  // Aplica cap MVP por UF se não for full build
  if (config.buildFullProviders) return filtered

  const capByUf = new Map<string, number>()
  return filtered.filter((p) => {
    const cur = capByUf.get(p.uf) ?? 0
    if (cur >= MVP_BUILD_CAP_PER_UF) return false
    capByUf.set(p.uf, cur + 1)
    return true
  })
}

/**
 * Gera lista de `{uf, municipio, prestadorSlug}` para `generateStaticParams`.
 *
 * Comportamento por config:
 * - Default (sem env vars): ~120 páginas (4 UFs × 30 cap)
 * - `BUILD_FULL_PROVIDERS=true`: 7.166 páginas (Phase 1 completa)
 * - `BUILD_FULL_PROVIDERS=true` + `PHASE_2_ENABLED=true`: 9.325 páginas
 */
export function getPrestadorStaticParams(
  configOverride?: ChunkedParamsConfig,
): PrestadorParams[] {
  const config = configOverride ?? resolveChunkConfig()
  const todos = getAllPrestadores()
  const filtered = applyChunkFilter(todos, config)

  return filtered.map((p) => ({
    uf: p.uf.toLowerCase(),
    municipio: slugifyMunicipio(p.municipio),
    prestadorSlug: p.slug,
  }))
}

/**
 * Slug normalizer para municipio — espelha lógica do loader.
 */
function slugifyMunicipio(municipio: string): string {
  return municipio
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Helper para reportar volume de páginas que SERÃO geradas — útil em CI.
 */
export interface ChunkReport {
  config: ChunkedParamsConfig
  totalPages: number
  byUf: Record<string, number>
}

export function reportChunkVolume(
  configOverride?: ChunkedParamsConfig,
): ChunkReport {
  const config = configOverride ?? resolveChunkConfig()
  const params = getPrestadorStaticParams(config)
  const byUf: Record<string, number> = {}
  for (const p of params) {
    byUf[p.uf] = (byUf[p.uf] ?? 0) + 1
  }
  return { config, totalPages: params.length, byUf }
}
