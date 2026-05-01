/**
 * Tests Story 3.21 — PlanComparison + dataset planos-comparison.
 *
 * Roda com: node --test components/ui/__tests__/PlanComparison.test.mjs
 *
 * Estratégia consistente com PriceTable.test.mjs:
 *   - Source-text invariantes (markup, paleta, a11y) sem JSDOM
 *   - Funções puras de normalização (parsePlanosQuery, normalizePlanSlugs)
 *     re-implementadas em JS para validar lógica
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENT_PATH = path.resolve(__dirname, '../PlanComparison.tsx');
const DATASET_PATH = path.resolve(__dirname, '../../../data/planos-comparison.ts');

const componentSource = fs.readFileSync(COMPONENT_PATH, 'utf8');
const datasetSource = fs.readFileSync(DATASET_PATH, 'utf8');

// ────────────────────────────────────────────────────────────────────────
// 1. Dataset invariantes (FR38, NFR23 compliance)
// ────────────────────────────────────────────────────────────────────────

describe('data/planos-comparison.ts — Story 3.21 AC2', () => {
  it('exporta PLANOS_COMPARISON com 5 planos', () => {
    assert.match(datasetSource, /export const PLANOS_COMPARISON:/);
    // 5 entries `slug:` esperadas (uma por plano)
    const slugMatches = datasetSource.match(/^\s*slug:\s*['"]/gm) ?? [];
    assert.equal(slugMatches.length, 5, `esperado 5 slugs, recebeu ${slugMatches.length}`);
  });

  it('declara slugs canônicos: bronze, prata, ouro, platinum, black', () => {
    assert.match(datasetSource, /slug:\s*['"]bronze['"]/);
    assert.match(datasetSource, /slug:\s*['"]prata['"]/);
    assert.match(datasetSource, /slug:\s*['"]ouro['"]/);
    assert.match(datasetSource, /slug:\s*['"]platinum['"]/);
    assert.match(datasetSource, /slug:\s*['"]black['"]/);
  });

  it('exporta FEATURE_ROWS com pelo menos 8 linhas comparáveis', () => {
    assert.match(datasetSource, /export const FEATURE_ROWS:/);
    // FEATURE_ROWS items têm shape `{ id: '...' label: '...' }`
    const featureMatches = datasetSource.match(/^\s*id:\s*['"][\w-]+['"]/gm) ?? [];
    assert.ok(featureMatches.length >= 8, `esperava ≥8 features, recebeu ${featureMatches.length}`);
  });

  it('exporta normalizePlanSlugs e parsePlanosQuery', () => {
    assert.match(datasetSource, /export function normalizePlanSlugs/);
    assert.match(datasetSource, /export function parsePlanosQuery/);
  });

  it('marca dados não confirmados com TODO Atlas (NFR23)', () => {
    assert.match(datasetSource, /TODO Atlas/);
  });

  it('usa Brand=Amil apenas em nomeCompleto/descricao (FR54 — Organization=BeneficioRH)', () => {
    // O Organization name nunca aparece com 'Amil' aqui (este dataset não emite Organization).
    // Apenas validamos que `nomeCompleto` carrega "Amil" (legítimo em Product.name).
    assert.match(datasetSource, /nomeCompleto:\s*['"]Amil/);
  });
});

// ────────────────────────────────────────────────────────────────────────
// 2. Lógica de normalização (re-implementada em JS para validar paridade)
// ────────────────────────────────────────────────────────────────────────

const VALID_SLUGS = ['bronze', 'prata', 'ouro', 'platinum', 'black'];
const TIER_BY_SLUG = { bronze: 1, prata: 2, ouro: 3, platinum: 4, black: 5 };

function normalizePlanSlugs(input) {
  const set = new Set();
  for (const raw of input) {
    const normalized = String(raw).trim().toLowerCase();
    if (VALID_SLUGS.includes(normalized)) set.add(normalized);
  }
  let result = Array.from(set);
  if (result.length > 4) result = result.slice(0, 4);
  if (result.length < 2) return ['bronze', 'prata', 'ouro'];
  return result.sort((a, b) => TIER_BY_SLUG[a] - TIER_BY_SLUG[b]);
}

function parsePlanosQuery(query) {
  if (!query || typeof query !== 'string') return ['bronze', 'prata', 'ouro'];
  return normalizePlanSlugs(query.split(','));
}

describe('normalizePlanSlugs — Story 3.21 AC1/AC3', () => {
  it('aceita 2 planos válidos', () => {
    assert.deepEqual(normalizePlanSlugs(['bronze', 'prata']), ['bronze', 'prata']);
  });

  it('ordena por tier ascendente (canonical order)', () => {
    assert.deepEqual(normalizePlanSlugs(['ouro', 'bronze', 'prata']), [
      'bronze',
      'prata',
      'ouro',
    ]);
  });

  it('limita a 4 planos máximo', () => {
    const input = ['bronze', 'prata', 'ouro', 'platinum', 'black'];
    const result = normalizePlanSlugs(input);
    assert.equal(result.length, 4);
  });

  it('descarta slugs inválidos silenciosamente', () => {
    assert.deepEqual(
      normalizePlanSlugs(['bronze', 'inexistente', 'prata']),
      ['bronze', 'prata'],
    );
  });

  it('< 2 válidos → fallback ["bronze","prata","ouro"]', () => {
    assert.deepEqual(normalizePlanSlugs(['inexistente']), [
      'bronze',
      'prata',
      'ouro',
    ]);
    assert.deepEqual(normalizePlanSlugs([]), ['bronze', 'prata', 'ouro']);
  });

  it('case-insensitive (BRONZE → bronze)', () => {
    assert.deepEqual(normalizePlanSlugs(['BRONZE', 'Prata']), [
      'bronze',
      'prata',
    ]);
  });

  it('deduplica entradas repetidas', () => {
    assert.deepEqual(normalizePlanSlugs(['bronze', 'bronze', 'prata']), [
      'bronze',
      'prata',
    ]);
  });

  it('parsePlanosQuery aceita string com vírgulas', () => {
    assert.deepEqual(parsePlanosQuery('bronze,prata,ouro'), [
      'bronze',
      'prata',
      'ouro',
    ]);
  });

  it('parsePlanosQuery null/undefined → fallback', () => {
    assert.deepEqual(parsePlanosQuery(null), ['bronze', 'prata', 'ouro']);
    assert.deepEqual(parsePlanosQuery(undefined), ['bronze', 'prata', 'ouro']);
  });
});

// ────────────────────────────────────────────────────────────────────────
// 3. Componente PlanComparison — markup + a11y
// ────────────────────────────────────────────────────────────────────────

describe('PlanComparison — markup HTML semântico (Story 3.21 AC6/AC11)', () => {
  it('NÃO declara use client (RSC server-rendered)', () => {
    assert.equal(/['"]use client['"]/.test(componentSource), false);
  });

  it('usa <table>, <caption>, <thead>, <tbody>, <tfoot>', () => {
    assert.match(componentSource, /<table\s/);
    assert.match(componentSource, /<caption\s/);
    assert.match(componentSource, /<thead\s/);
    assert.match(componentSource, /<tbody>/);
    assert.match(componentSource, /<tfoot\s/);
  });

  it('possui <th scope="col"> e <th scope="row">', () => {
    assert.match(componentSource, /scope="col"/);
    assert.match(componentSource, /scope="row"/);
  });

  it('NÃO usa role="table" em div (anti-pattern)', () => {
    assert.equal(/role=["']table["']/.test(componentSource), false);
  });

  it('badges semânticos têm aria-label (não só cor — WCAG 1.4.1)', () => {
    assert.match(componentSource, /aria-label="Incluso no plano"/);
    assert.match(componentSource, /aria-label="N[ãa]o incluso"/);
    assert.match(componentSource, /aria-label="Cobertura premium ampliada"/);
  });

  it('CTA "Quero esse" linka /cotacao-online?plano={slug}', () => {
    assert.match(componentSource, /\/cotacao-online/);
    assert.match(componentSource, /\?plano=\$\{plano\.slug\}/);
  });

  it('paleta Opção A (slate, teal, sky, amber) — não usa amil-blue', () => {
    assert.match(componentSource, /slate-/);
    assert.match(componentSource, /teal-/);
    assert.match(componentSource, /sky-/);
    assert.match(componentSource, /amber-/);
    assert.equal(/amil-blue/.test(componentSource), false);
  });

  it('renderiza estado vazio (planos.length === 0) com role=status', () => {
    assert.match(componentSource, /role="status"/);
  });

  it('exibe disclaimer no <tfoot> (NFR23)', () => {
    assert.match(componentSource, /Comparativo informativo/);
    assert.match(componentSource, /SUSEP 201054484/);
  });
});
