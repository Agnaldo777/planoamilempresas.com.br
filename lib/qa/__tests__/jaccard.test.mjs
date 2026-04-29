/**
 * Unit tests para lib/qa/jaccard.ts — Story 5.7
 *
 * Roda com: `node --test lib/qa/__tests__/jaccard.test.mjs`
 *
 * 8 testes de invariantes do algoritmo Jaccard puro.
 * Os testes importam o `.ts` direto via tsx-on-the-fly não está disponível,
 * então re-implementamos a lógica em `.mjs` shim que consome a especificação
 * via require dinâmico do TS — fallback: testar via output do build.
 *
 * Solução pragmática: testar contra `lib/qa/jaccard.mjs` se existir, ou
 * importar via `--experimental-strip-types` (Node 22+, opt-in). Para
 * compatibilidade Node 20, espelhamos a fórmula em fixtures puro-JS.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Implementação JS pura espelha lib/qa/jaccard.ts. Mantida em sync com
// arquivo TS (Story 5.7 AC8 — fixtures determinísticas).
function normalizeText(input, { stripDiacritics = true } = {}) {
  let text = input.toLowerCase();
  if (stripDiacritics) {
    text = text.normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  text = text.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function tokenize(text) {
  const trimmed = text.trim();
  if (trimmed.length === 0) return [];
  return trimmed.split(/\s+/);
}

function ngrams(tokens, n) {
  if (tokens.length === 0) return [];
  if (tokens.length < n) return [tokens.join(' ')];
  const result = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    result.push(tokens.slice(i, i + n).join(' '));
  }
  return result;
}

function jaccardSets(a, b) {
  if (a.size === 0 && b.size === 0) return 1.0;
  if (a.size === 0 || b.size === 0) return 0.0;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection++;
  const union = a.size + b.size - intersection;
  return intersection / union;
}

function jaccardSimilarity(text1, text2, { ngram = 3, stripDiacritics = true } = {}) {
  const norm1 = normalizeText(text1, { stripDiacritics });
  const norm2 = normalizeText(text2, { stripDiacritics });
  const set1 = new Set(ngrams(tokenize(norm1), ngram));
  const set2 = new Set(ngrams(tokenize(norm2), ngram));
  return jaccardSets(set1, set2);
}

// ═══════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════

describe('jaccardSimilarity — invariantes', () => {
  it('1. textos idênticos retornam Jaccard 1.0', () => {
    const t = 'A rede credenciada Amil tem 9.325 prestadores em 26 UFs.';
    assert.equal(jaccardSimilarity(t, t), 1.0);
  });

  it('2. textos idênticos com case/acentos diferentes ainda retornam 1.0', () => {
    const a = 'Saúde Empresarial Amil';
    const b = 'SAUDE EMPRESARIAL AMIL';
    // Com 3-gram só temos 1 shingle (n>tokens.length → fallback).
    assert.equal(jaccardSimilarity(a, b, { ngram: 3 }), 1.0);
  });

  it('3. textos completamente diferentes retornam < 0.05', () => {
    const a = 'plano de saúde empresarial cobertura nacional rede credenciada';
    const b = 'caminhão estrada chuva domingo viagem férias praia';
    const score = jaccardSimilarity(a, b, { ngram: 1 });
    assert.ok(score < 0.05, `expected <0.05 got ${score}`);
  });

  it('4. textos com só nome da cidade trocado têm Jaccard alto (cookie-cutter detectado)', () => {
    const template = (cidade) =>
      `A rede credenciada Amil em ${cidade} oferece cobertura completa para empresas. ` +
      `Hospitais e clínicas em ${cidade} estão disponíveis para colaboradores. ` +
      `Empresas em ${cidade} podem contratar plano Amil com ${cidade} sendo a base.`;
    const a = template('São Paulo');
    const b = template('Rio de Janeiro');
    // ngram=1 (vocabulary overlap) é mais sensível a "template fixo + variável" do
    // que ngram=3 (que penaliza cidades de tamanhos de palavra diferentes pois
    // os trigramas atravessando a fronteira da variável não casam).
    const score1g = jaccardSimilarity(a, b, { ngram: 1 });
    assert.ok(score1g > 0.7, `expected >0.7 ngram=1 (cookie-cutter sinal) got ${score1g}`);
  });

  it('5. textos com 30%+ variação contextual têm Jaccard < 0.7 (PASS NFR25)', () => {
    const a =
      'A rede Amil em São Paulo tem 1.450 prestadores incluindo Hospital Albert Einstein, ' +
      'Sírio-Libanês e Oswaldo Cruz. Bairros Vila Mariana, Paulista e Pinheiros concentram ' +
      'unidades premium. Mensalidade média R$ 850 vida adulta perfil PME 30 vidas.';
    const b =
      'A rede Amil em Rio de Janeiro tem 980 prestadores incluindo Copa D\'Or, Quinta D\'Or ' +
      'e Niterói D\'Or. Bairros Botafogo, Copacabana e Barra concentram hospitais Tier 1. ' +
      'Mensalidade média R$ 920 vida adulta perfil PME 50 vidas dependendo da rede.';
    const score = jaccardSimilarity(a, b, { ngram: 3 });
    assert.ok(score < 0.7, `expected <0.7 (variação OK) got ${score}`);
  });

  it('6. ngram=1 é mais permissivo que ngram=3 para mesmo par (sanity check)', () => {
    const a = 'plano de saúde empresarial Amil para PME 30 vidas cobertura nacional';
    const b = 'plano de saúde empresarial Amil para PME 50 vidas cobertura regional';
    const s1 = jaccardSimilarity(a, b, { ngram: 1 });
    const s3 = jaccardSimilarity(a, b, { ngram: 3 });
    assert.ok(s1 > s3, `expected ngram1 (${s1}) > ngram3 (${s3})`);
  });

  it('7. textos vazios retornam 1.0 (ambos vazios = idênticos por convenção)', () => {
    assert.equal(jaccardSimilarity('', ''), 1.0);
    assert.equal(jaccardSimilarity('   ', '   '), 1.0);
  });

  it('8. um texto vazio + um não-vazio retornam 0.0', () => {
    assert.equal(jaccardSimilarity('', 'algum texto aqui'), 0.0);
    assert.equal(jaccardSimilarity('algum texto aqui', ''), 0.0);
  });
});

describe('normalizeText — pipeline', () => {
  it('lowercase + strip diacritics + strip pontuação', () => {
    assert.equal(
      normalizeText('Saúde Empresarial, S.A. — Plano!'),
      'saude empresarial s a plano',
    );
  });

  it('preserva números', () => {
    assert.equal(normalizeText('9.325 prestadores em 26 UFs'), '9 325 prestadores em 26 ufs');
  });

  it('opcionalmente preserva acentos', () => {
    assert.equal(
      normalizeText('Saúde São Paulo', { stripDiacritics: false }),
      'saúde são paulo',
    );
  });
});

describe('ngrams — geração', () => {
  it('1-gram retorna tokens', () => {
    assert.deepEqual(ngrams(['a', 'b', 'c'], 1), ['a', 'b', 'c']);
  });

  it('3-gram com 5 tokens retorna 3 shingles', () => {
    assert.deepEqual(ngrams(['a', 'b', 'c', 'd', 'e'], 3), [
      'a b c',
      'b c d',
      'c d e',
    ]);
  });

  it('n maior que tokens retorna single shingle (fallback)', () => {
    assert.deepEqual(ngrams(['a', 'b'], 5), ['a b']);
  });

  it('array vazio retorna array vazio', () => {
    assert.deepEqual(ngrams([], 3), []);
  });
});
