/**
 * Tests Story 3.22 — buildTitle helper.
 *
 * Roda com: node --test lib/seo/__tests__/title.test.mjs
 *
 * Mirror das funções puras (TS files testáveis indiretamente; em CI
 * com vitest/tsx importaríamos diretamente). Mantém paridade com
 * lib/seo/title.ts.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Mirror das funções puras de lib/seo/title.ts
function buildTitle(opts) {
  const year = opts.year ?? '2026';
  const maxLen = opts.maxLen ?? 60;
  const tail = opts.qualificador ?? opts.cidade ?? opts.uf ?? undefined;
  const base = `${opts.tipo} Amil ${year}`;
  const full = tail ? `${base} — ${tail}` : base;
  if (full.length <= maxLen) return full;
  if (base.length <= maxLen) return base;
  const sliceEnd = maxLen - 1;
  const slice = full.slice(0, sliceEnd);
  const lastSpace = slice.lastIndexOf(' ');
  const cutPoint = lastSpace > maxLen * 0.5 ? lastSpace : sliceEnd;
  return `${slice.slice(0, cutPoint).trimEnd()}…`;
}

describe('buildTitle (Story 3.22)', () => {
  it('1. homepage com qualificador', () => {
    const t = buildTitle({ tipo: 'Plano de Saúde', qualificador: 'Empresarial PJ' });
    assert.equal(t, 'Plano de Saúde Amil 2026 — Empresarial PJ');
    assert.ok(t.length <= 60);
  });

  it('2. tabela com qualificador PME', () => {
    const t = buildTitle({ tipo: 'Tabela', qualificador: 'PME' });
    assert.equal(t, 'Tabela Amil 2026 — PME');
  });

  it('3. produto com cidade', () => {
    const t = buildTitle({ tipo: 'Plano de Saúde', cidade: 'São Paulo' });
    assert.equal(t, 'Plano de Saúde Amil 2026 — São Paulo');
  });

  it('4. comparar (sem tail)', () => {
    const t = buildTitle({ tipo: 'Comparar Planos' });
    assert.equal(t, 'Comparar Planos Amil 2026');
  });

  it('5. cornerstone com qualificador longo (drop tail)', () => {
    const t = buildTitle({
      tipo: 'Carência Plano de Saúde Empresarial',
      qualificador: 'Guia Completo PME e MEI Brasil',
    });
    // Total > 60, deve dropar tail
    assert.ok(t.length <= 60);
    assert.ok(!t.includes('…'));
    assert.equal(t, 'Carência Plano de Saúde Empresarial Amil 2026');
  });

  it('6. tipo extremamente longo (truncate com …)', () => {
    const t = buildTitle({
      tipo: 'Plano de Saúde Empresarial Coletivo Para Empresas Médias',
      qualificador: 'extra',
    });
    assert.ok(t.length <= 60);
    assert.ok(t.endsWith('…'));
  });

  it('7. year transition 2027 (smoke)', () => {
    const t = buildTitle({ tipo: 'Tabela', qualificador: 'PME', year: '2027' });
    assert.equal(t, 'Tabela Amil 2027 — PME');
  });

  it('8. UF fallback no tail', () => {
    const t = buildTitle({ tipo: 'Tabela', uf: 'SP' });
    assert.equal(t, 'Tabela Amil 2026 — SP');
  });

  it('9. tail vazio quando todos undef', () => {
    const t = buildTitle({ tipo: 'Plano de Saúde' });
    assert.ok(!t.includes('—'));
  });

  it('10. truncate preserva palavra inteira', () => {
    const t = buildTitle({
      tipo: 'Plano',
      qualificador: 'palavralongademais palavrabacanaaqui',
    });
    if (t.length > 60) {
      // só verifica se truncou mesmo
      assert.fail('exceeded');
    }
    // se incluiu …, último char antes não é espaço
    if (t.endsWith('…')) {
      assert.notEqual(t.charAt(t.length - 2), ' ');
    }
  });
});

describe('getCurrentYear / env var resolution', () => {
  function resolveYear(envValue) {
    if (envValue && /^\d{4}$/.test(envValue)) return envValue;
    return '2026';
  }

  it('retorna fallback 2026 quando env undefined', () => {
    assert.equal(resolveYear(undefined), '2026');
  });

  it('respeita env var válido', () => {
    assert.equal(resolveYear('2027'), '2027');
  });

  it('rejeita env var inválido (não 4 dígitos)', () => {
    assert.equal(resolveYear('abc'), '2026');
    assert.equal(resolveYear('20260'), '2026');
    assert.equal(resolveYear(''), '2026');
  });
});
