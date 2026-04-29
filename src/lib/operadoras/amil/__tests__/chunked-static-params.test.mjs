/**
 * Tests Story 7.4 — Chunked static params (SSG infra).
 *
 * Roda com: node --test src/lib/operadoras/amil/__tests__/chunked-static-params.test.mjs
 *
 * Testa os invariantes de chunking contra o dataset real
 * `data/rede-credenciada/rede-credenciada.json`. Replica lógica em JS
 * para evitar dependência de TS runtime.
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATASET_PATH = resolve(
  __dirname,
  '../../../../../data/rede-credenciada/rede-credenciada.json',
)

const dataset = JSON.parse(readFileSync(DATASET_PATH, 'utf-8'))

// Mirror das constantes (sync com src/lib/operadoras/amil/chunked-static-params.ts)
const PHASE_1_UFS = ['RJ', 'SP', 'MG', 'ES']
const MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL = 5
const MVP_BUILD_CAP_PER_UF = 30

function applyChunkFilter(prestadores, config) {
  const filtered = prestadores.filter((p) => {
    const isSudeste = PHASE_1_UFS.includes(p.uf)
    if (config.phase2Enabled) return true
    return isSudeste
  })

  if (config.buildFullProviders) return filtered

  const capByUf = new Map()
  return filtered.filter((p) => {
    const cur = capByUf.get(p.uf) ?? 0
    if (cur >= MVP_BUILD_CAP_PER_UF) return false
    capByUf.set(p.uf, cur + 1)
    return true
  })
}

// ────────────────────────────────────────────────────────────

describe('Story 7.4 — Chunked static params', () => {
  it('default config (MVP cap): retorna ≤120 páginas (4 UFs × 30 cap)', () => {
    const result = applyChunkFilter(dataset.prestadores, {})
    assert.ok(
      result.length <= 4 * MVP_BUILD_CAP_PER_UF,
      `MVP cap deveria limitar a ${4 * MVP_BUILD_CAP_PER_UF}, mas retornou ${result.length}`,
    )
    assert.ok(result.length > 0, 'MVP cap não pode ser zero')
  })

  it('MVP cap: máximo 30 prestadores por UF', () => {
    const result = applyChunkFilter(dataset.prestadores, {})
    const byUf = {}
    for (const p of result) {
      byUf[p.uf] = (byUf[p.uf] ?? 0) + 1
    }
    for (const [uf, count] of Object.entries(byUf)) {
      assert.ok(
        count <= MVP_BUILD_CAP_PER_UF,
        `UF ${uf} excedeu cap (${count} > ${MVP_BUILD_CAP_PER_UF})`,
      )
    }
  })

  it('MVP cap: apenas UFs Phase 1 (Sudeste)', () => {
    const result = applyChunkFilter(dataset.prestadores, {})
    for (const p of result) {
      assert.ok(
        PHASE_1_UFS.includes(p.uf),
        `UF ${p.uf} fora de Phase 1 (Sudeste) — não deveria aparecer no MVP`,
      )
    }
  })

  it('BUILD_FULL_PROVIDERS=true: Phase 1 completa (≥7000 páginas Sudeste)', () => {
    const result = applyChunkFilter(dataset.prestadores, {
      buildFullProviders: true,
    })
    assert.ok(
      result.length >= 7000,
      `Phase 1 full deveria ter ≥7000, mas tem ${result.length}`,
    )
    // Mas <9325 (Phase 2 não ativada)
    assert.ok(result.length < dataset.prestadores.length)
    for (const p of result) {
      assert.ok(PHASE_1_UFS.includes(p.uf))
    }
  })

  it('Phase 1 + Phase 2 full: matches total dataset (9.325)', () => {
    const result = applyChunkFilter(dataset.prestadores, {
      buildFullProviders: true,
      phase2Enabled: true,
    })
    assert.equal(result.length, dataset.prestadores.length)
  })

  it('threshold anti-thin: MIN_PRESTADORES = 5', () => {
    assert.equal(MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL, 5)
  })

  it('Phase 1 UFs: exatamente Sudeste', () => {
    assert.deepEqual([...PHASE_1_UFS].sort(), ['ES', 'MG', 'RJ', 'SP'])
  })
})
