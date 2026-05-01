/**
 * Tests Story 7.11 — Sub-redes Amil helpers.
 *
 * Roda com: node --test src/lib/operadoras/amil/__tests__/sub-redes-helpers.test.mjs
 *
 * Testa os invariantes lógicos das sub-redes contra o dataset real
 * `data/rede-credenciada/rede-credenciada.json`. Como os módulos `.ts`
 * não rodam em node nativo, este teste replica a heurística de
 * classificação para validar que o dataset 2026-04-26 atinge thresholds.
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

// ────────────────────────────────────────────────────────────
// Mirror das listas hospitaisFlagship + redesDataset
// (atualizar em sync com src/data/operadoras/amil/sub-redes-rede-credenciada.ts)
// ────────────────────────────────────────────────────────────

const SUB_REDES_MIRROR = {
  'hospitais-dor': {
    flagships: [
      'COPA D OR',
      'BARRA D OR',
      'QUINTA D OR',
      'NORTE D OR',
      'OESTE D OR',
      'D OR',
      'SAO LUIZ',
      'PERINATAL',
      'SAMARITANO',
      'BANGU',
      'NIITEROI D OR',
    ],
    redes: ['AMIL ONE S6500 BLACK QP', 'BLACK'],
  },
  'amil-one-rede-selecionada': {
    flagships: [
      'ALBERT EINSTEIN',
      'SIRIO LIBANES',
      'OSWALDO CRUZ',
      'COPA D OR',
      'BARRA D OR',
      '9 DE JULHO',
      'NOVE DE JULHO',
    ],
    redes: ['AMIL ONE S6500 BLACK QP'],
  },
  'amil-facil-rede-selecionada': {
    flagships: [],
    redes: ['AMIL S380 QP', 'AMIL S380 QC'],
  },
  classica: {
    flagships: [],
    redes: ['AMIL S450 QP', 'AMIL S450 QC', 'AMIL S580 QP', 'AMIL S750 QP'],
  },
  'amil-medial': {
    flagships: [],
    redes: ['ADESÃO BRONZE RJ', 'ADESÃO BRONZE SP', 'ADESÃO OURO MAIS'],
  },
}

const MIN_PRESTADORES_SUB_REDE = 30

function classify(prestador, subRedeKey) {
  const sub = SUB_REDES_MIRROR[subRedeKey]
  const nomeUpper = prestador.nome.toUpperCase()
  const matchFlagship = sub.flagships.some((f) => nomeUpper.includes(f))
  const matchRede = (prestador.redes || []).some((r) => sub.redes.includes(r))
  return matchFlagship || matchRede
}

// ────────────────────────────────────────────────────────────
// Tests
// ────────────────────────────────────────────────────────────

describe('Story 7.11 — Sub-redes Amil dataset coverage', () => {
  it('dataset shape: tem prestadores e redes', () => {
    assert.equal(typeof dataset.geradoEm, 'string')
    assert.equal(Array.isArray(dataset.prestadores), true)
    assert.ok(dataset.prestadores.length >= 9000)
  })

  it('AC14: hospitais-dor tem ≥30 prestadores classificados', () => {
    const total = dataset.prestadores.filter((p) =>
      classify(p, 'hospitais-dor'),
    ).length
    assert.ok(
      total >= MIN_PRESTADORES_SUB_REDE,
      `hospitais-dor deveria ter ≥${MIN_PRESTADORES_SUB_REDE}, mas tem ${total}`,
    )
  })

  it('AC14: amil-one-rede-selecionada tem ≥30 prestadores', () => {
    const total = dataset.prestadores.filter((p) =>
      classify(p, 'amil-one-rede-selecionada'),
    ).length
    assert.ok(
      total >= MIN_PRESTADORES_SUB_REDE,
      `amil-one deveria ter ≥${MIN_PRESTADORES_SUB_REDE}, mas tem ${total}`,
    )
  })

  it('AC14: classica tem ≥30 prestadores', () => {
    const total = dataset.prestadores.filter((p) =>
      classify(p, 'classica'),
    ).length
    assert.ok(
      total >= MIN_PRESTADORES_SUB_REDE,
      `classica deveria ter ≥${MIN_PRESTADORES_SUB_REDE}, mas tem ${total}`,
    )
  })

  it('AC14: amil-facil-rede-selecionada tem ≥30 prestadores', () => {
    const total = dataset.prestadores.filter((p) =>
      classify(p, 'amil-facil-rede-selecionada'),
    ).length
    assert.ok(
      total >= MIN_PRESTADORES_SUB_REDE,
      `amil-facil deveria ter ≥${MIN_PRESTADORES_SUB_REDE}, mas tem ${total}`,
    )
  })

  it('AC14: amil-medial tem ≥30 prestadores', () => {
    const total = dataset.prestadores.filter((p) =>
      classify(p, 'amil-medial'),
    ).length
    assert.ok(
      total >= MIN_PRESTADORES_SUB_REDE,
      `amil-medial deveria ter ≥${MIN_PRESTADORES_SUB_REDE}, mas tem ${total}`,
    )
  })

  it("hospitais-dor classifica 'COPA D OR'", () => {
    const fixture = {
      nome: 'HOSPITAL COPA D OR',
      redes: [],
    }
    assert.equal(classify(fixture, 'hospitais-dor'), true)
  })

  it("amil-one classifica prestador com rede 'AMIL ONE S6500 BLACK QP'", () => {
    const fixture = {
      nome: 'INSTITUTO QUALQUER',
      redes: ['AMIL ONE S6500 BLACK QP'],
    }
    assert.equal(classify(fixture, 'amil-one-rede-selecionada'), true)
  })

  it("classica classifica prestador com rede 'AMIL S750 QP'", () => {
    const fixture = {
      nome: 'CLINICA NORMAL',
      redes: ['AMIL S750 QP'],
    }
    assert.equal(classify(fixture, 'classica'), true)
  })

  it("medial classifica prestador com rede 'ADESÃO BRONZE SP'", () => {
    const fixture = {
      nome: 'CENTRO MEDICO',
      redes: ['ADESÃO BRONZE SP'],
    }
    assert.equal(classify(fixture, 'amil-medial'), true)
  })

  it("classifica zero quando nenhum match", () => {
    const fixture = {
      nome: 'CLINICA INDEPENDENTE',
      redes: ['AMIL_REDE_FANTASMA'],
    }
    assert.equal(classify(fixture, 'hospitais-dor'), false)
    assert.equal(classify(fixture, 'amil-one-rede-selecionada'), false)
  })
})
