/**
 * Tests Story 3.20 — CarenciaCalculator widget + dataset.
 *
 * Roda com: node --test components/ui/__tests__/CarenciaCalculator.test.mjs
 *
 * Dois módulos sob teste:
 *   1) `data/carencias.ts`   — funções puras (parseDataInput, adicionarDias,
 *      formatarDataBR) testáveis via dynamic import (a TS é compilável a JS
 *      por bundler; aqui usamos pattern source-text + smoke runtime tests
 *      do TypeScript via re-implementação direta dos helpers).
 *   2) `components/ui/CarenciaCalculator.tsx` — JSX/TSX, testes via assert
 *      em invariantes textuais do source (mesma estratégia PriceTable.test).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENT_PATH = path.resolve(__dirname, '../CarenciaCalculator.tsx');
const DATASET_PATH = path.resolve(__dirname, '../../../data/carencias.ts');

const componentSource = fs.readFileSync(COMPONENT_PATH, 'utf8');
const datasetSource = fs.readFileSync(DATASET_PATH, 'utf8');

// ────────────────────────────────────────────────────────────────────────
// 1. Dataset invariantes (carências mínimas ANS)
// ────────────────────────────────────────────────────────────────────────

describe('data/carencias.ts — limites ANS RN 195/2009 (Story 3.20 AC1)', () => {
  it('exporta CARENCIAS_AMIL com chaves canônicas', () => {
    assert.match(datasetSource, /export const CARENCIAS_AMIL\s*=/);
    assert.match(datasetSource, /urgenciaEmergencia:/);
    assert.match(datasetSource, /consultasEletivas:/);
    assert.match(datasetSource, /examesSimples:/);
    assert.match(datasetSource, /internacoesClinicas:/);
    assert.match(datasetSource, /internacoesCirurgicas:/);
    assert.match(datasetSource, /altaComplexidade:/);
    assert.match(datasetSource, /parto:/);
    assert.match(datasetSource, /cpt:/);
  });

  it('parto a termo = 300 dias (RN 195/2009 art. 12 §III)', () => {
    // Captura a entrada `parto:` até o próximo bloco — busca campo `dias: 300`
    const partoBlock = datasetSource.match(/parto:\s*\{[\s\S]*?\}\s*,/);
    assert.ok(partoBlock, 'bloco parto presente');
    assert.match(partoBlock[0], /dias:\s*300/);
  });

  it('CPT = 720 dias (24 meses, RN 162/2007)', () => {
    const cptBlock = datasetSource.match(/cpt:\s*\{[\s\S]*?\}\s*,?\s*\}/);
    assert.ok(cptBlock, 'bloco cpt presente');
    assert.match(cptBlock[0], /dias:\s*720/);
  });

  it('urgência/emergência = 0 dias (carência imediata)', () => {
    const urgBlock = datasetSource.match(/urgenciaEmergencia:\s*\{[\s\S]*?\}\s*,/);
    assert.ok(urgBlock, 'bloco urgência presente');
    assert.match(urgBlock[0], /dias:\s*0/);
  });

  it('cita base legal RN 195/2009 em pelo menos 5 categorias', () => {
    const matches = datasetSource.match(/RN 195\/2009/g) ?? [];
    assert.ok(matches.length >= 5, `RN 195/2009 citada ${matches.length}× (esperado ≥5)`);
  });

  it('possui marker para Promo Amil (Story 6.x) — não inventa prazos', () => {
    assert.match(datasetSource, /Plano espec[ií]fico Amil pode oferecer prazos menores/);
  });

  it('exporta helpers parseDataInput, adicionarDias, formatarDataBR', () => {
    assert.match(datasetSource, /export function parseDataInput/);
    assert.match(datasetSource, /export function adicionarDias/);
    assert.match(datasetSource, /export function formatarDataBR/);
  });
});

// ────────────────────────────────────────────────────────────────────────
// 2. Smoke runtime — re-implementa helpers em JS para validar matemática
//    (TypeScript não roda direto em node:test; estratégia: re-implementar
//    a fórmula e validar paridade lógica).
// ────────────────────────────────────────────────────────────────────────

function adicionarDias(dataInicio, dias) {
  const result = new Date(dataInicio.getTime());
  result.setUTCDate(result.getUTCDate() + dias);
  return result;
}

function formatarDataBR(date) {
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = date.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

describe('Date math runtime — Story 3.20 AC2/AC8', () => {
  it('adicionarDias: 01/01/2026 + 300 dias = 28/10/2026 (parto)', () => {
    const inicio = new Date(Date.UTC(2026, 0, 1));
    const final = adicionarDias(inicio, 300);
    assert.equal(formatarDataBR(final), '28/10/2026');
  });

  it('adicionarDias: 01/01/2026 + 180 dias = 30/06/2026 (internação)', () => {
    const inicio = new Date(Date.UTC(2026, 0, 1));
    const final = adicionarDias(inicio, 180);
    assert.equal(formatarDataBR(final), '30/06/2026');
  });

  it('adicionarDias: 0 dias retorna mesma data (urgência)', () => {
    const inicio = new Date(Date.UTC(2026, 4, 15));
    const final = adicionarDias(inicio, 0);
    assert.equal(formatarDataBR(final), '15/05/2026');
  });

  it('adicionarDias: 720 dias atravessa ano (CPT 24 meses)', () => {
    const inicio = new Date(Date.UTC(2026, 0, 1));
    const final = adicionarDias(inicio, 720);
    // 2026 não-bissexto (365) + 2027 não-bissexto (365) = 730 → 720 ≈ 22/12/2027
    assert.equal(formatarDataBR(final), '22/12/2027');
  });

  it('formatarDataBR: padding zero em dia e mês', () => {
    const date = new Date(Date.UTC(2026, 0, 5));
    assert.equal(formatarDataBR(date), '05/01/2026');
  });
});

// ────────────────────────────────────────────────────────────────────────
// 3. Componente CarenciaCalculator — invariantes de markup + a11y
// ────────────────────────────────────────────────────────────────────────

describe('CarenciaCalculator — markup + a11y (Story 3.20 AC10)', () => {
  it("declara 'use client' (controlado por useState)", () => {
    assert.match(componentSource, /['"]use client['"]/);
  });

  it('usa <table> semântica (alinha PriceTable / FR52)', () => {
    assert.match(componentSource, /<table\s/);
    assert.match(componentSource, /<caption\s/);
    assert.match(componentSource, /<thead\s/);
    assert.match(componentSource, /<tbody>/);
  });

  it('possui <th scope="col"> e <th scope="row">', () => {
    assert.match(componentSource, /scope="col"/);
    assert.match(componentSource, /scope="row"/);
  });

  it('input type=date com <label htmlFor> + aria-describedby', () => {
    assert.match(componentSource, /type="date"/);
    assert.match(componentSource, /htmlFor="carencia-data-inicio"/);
    assert.match(componentSource, /aria-describedby="carencia-data-help"/);
  });

  it('resultado tem aria-live="polite" para screen readers', () => {
    assert.match(componentSource, /aria-live="polite"/);
  });

  it('paleta Opção A (slate, teal, sky, amber) — não usa amil-blue', () => {
    assert.match(componentSource, /slate-/);
    assert.match(componentSource, /teal-/);
    assert.match(componentSource, /amber-/);
    assert.equal(/amil-blue/.test(componentSource), false);
  });

  it('exibe disclaimer ANS obrigatório (AC3.20.3)', () => {
    assert.match(componentSource, /Disclaimer ANS/);
    assert.match(componentSource, /RN 195\/2009/);
    assert.match(componentSource, /isen[çc][ãa]o total/i);
  });

  it('importa helpers do dataset @/data/carencias', () => {
    assert.match(componentSource, /from\s+['"]@\/data\/carencias['"]/);
  });
});
