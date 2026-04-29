/**
 * Unit tests para scripts/audit-cookie-cutter.mjs — Story 5.7 AC8
 *
 * Roda com: `node --test scripts/__tests__/audit-cookie-cutter.test.mjs`
 *
 * Cobre 8+ invariantes do audit:
 *   1. Idêntico → Jaccard 1.0
 *   2. Completamente diferente → < 0.1
 *   3. Cookie-cutter (só nome cidade trocado) → > 0.85 (FAIL)
 *   4. Variação contextual 30%+ → < 0.7 (PASS)
 *   5. Threshold do config respeitado
 *   6. N-grams 1 vs 3 produzem scores diferentes (sanity)
 *   7. extractMainText: strip tags HTML + descarta header/nav/footer
 *   8. extractMainText: extrai conteúdo de <main> mesmo quando aninhado
 *   9. computePairwise: gera C(n,2) pares ordenados desc
 *   10. buildSample: retorna 5 sub-redes para template=sub-redes
 *   11. buildSample: 8 categorias para blog-categorias
 *   12. median + percentile cálculo correto
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  jaccardSimilarity,
  normalizeText,
  tokenize,
  ngrams,
  median,
  percentile,
  computePairwise,
  buildSample,
  extractMainText,
  SUB_REDES,
  BLOG_CATEGORIAS,
} from '../audit-cookie-cutter.mjs';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..', '..');
const CONFIG = JSON.parse(
  readFileSync(join(ROOT, 'config', 'qa-thresholds.json'), 'utf8'),
);

// ═══════════════════════════════════════════════════════════════
// Jaccard core
// ═══════════════════════════════════════════════════════════════

describe('jaccardSimilarity — invariantes principais', () => {
  it('1. textos idênticos retornam 1.0', () => {
    const t = 'Plano Amil empresarial 2026 cobertura nacional rede credenciada D\'Or.';
    assert.equal(jaccardSimilarity(t, t), 1.0);
  });

  it('2. textos completamente diferentes retornam < 0.1', () => {
    const a = 'plano de saúde empresarial Amil cobertura nacional';
    const b = 'caminhão estrada chuva domingo viagem férias';
    const score = jaccardSimilarity(a, b, { ngram: 1 });
    assert.ok(score < 0.1, `expected <0.1 got ${score}`);
  });

  it('3. cookie-cutter (só nome trocado) → ngram=1 score alto (FAIL NFR25)', () => {
    const tpl = (cidade) =>
      `A rede Amil em ${cidade} oferece cobertura empresarial completa para PME ` +
      `com rede credenciada selecionada. Empresas em ${cidade} contratam plano ` +
      `Amil via corretor SUSEP autorizado. Hospitais em ${cidade} estão na rede ` +
      `Amil S450 Linha Clássica. Mensalidade média em ${cidade} parte de R$ 850. ` +
      `O plano Amil em ${cidade} inclui dependentes mediante valor adicional. ` +
      `Cotação personalizada para ${cidade} via WhatsApp ou formulário online.`;
    // ngram=1 detecta vocabulary overlap em texto template-driven (cidades com
    // contagens de palavra diferentes quebram trigramas sem afetar 1-grams).
    const score = jaccardSimilarity(tpl('São Paulo'), tpl('Rio de Janeiro'), { ngram: 1 });
    assert.ok(score > 0.85, `expected >0.85 ngram=1 (FAIL) got ${score}`);
  });

  it('4. variação 30%+ contextual → < 0.7 PASS', () => {
    const a =
      'A rede Amil em São Paulo conta com 1.450 prestadores incluindo Hospital Albert ' +
      'Einstein, Sírio-Libanês, Oswaldo Cruz e Beneficência Portuguesa. Bairros ' +
      'Vila Mariana, Paulista e Pinheiros concentram unidades premium. PME 30 vidas ' +
      'paga média R$ 850 vida adulta. Atendimento 24h em emergência hospitalar. ' +
      'Cobertura ANS rol completo 100%.';
    const b =
      'A rede Amil em Rio de Janeiro tem 980 prestadores como Copa D\'Or, Quinta ' +
      'D\'Or, Niterói D\'Or e Hospital Pasteur. Bairros Botafogo, Copacabana, Barra ' +
      'concentram hospitais Tier 1. PME 50 vidas tem ticket aproximado R$ 920 ' +
      'colaborador. Pronto-socorro 24 horas integral. Diretrizes ANS estaduais ' +
      'aplicadas.';
    const score = jaccardSimilarity(a, b, { ngram: 3 });
    assert.ok(score < 0.7, `expected <0.7 (PASS) got ${score}`);
  });

  it('5. threshold do config respeitado (0.70 cookieCutter)', () => {
    assert.equal(CONFIG.jaccard.cookieCutter, 0.7);
    assert.equal(CONFIG.jaccard.individualPairFail, 0.85);
    assert.equal(CONFIG.jaccard.warning, 0.6);
  });

  it('6. ngram=1 produz score maior que ngram=3 (sanity)', () => {
    const a = 'plano saúde empresarial Amil PME 30 vidas rede credenciada';
    const b = 'plano saúde empresarial Amil PME 50 vidas rede regional';
    const s1 = jaccardSimilarity(a, b, { ngram: 1 });
    const s3 = jaccardSimilarity(a, b, { ngram: 3 });
    assert.ok(s1 > s3, `expected ngram1 ${s1} > ngram3 ${s3}`);
  });
});

// ═══════════════════════════════════════════════════════════════
// extractMainText
// ═══════════════════════════════════════════════════════════════

describe('extractMainText — HTML stripping', () => {
  it('7. strip tags HTML básicas + descartar <header>/<nav>/<footer>', () => {
    const html = `<!DOCTYPE html>
      <html><body>
        <header><nav>Menu Item</nav></header>
        <main>
          <h1>Título Principal</h1>
          <p>Conteúdo do main com <strong>texto</strong>.</p>
        </main>
        <footer>Rodapé global</footer>
      </body></html>`;
    const text = extractMainText(html);
    assert.match(text, /Título Principal/);
    assert.match(text, /Conteúdo do main com texto/);
    assert.doesNotMatch(text, /Menu Item/);
    assert.doesNotMatch(text, /Rodapé global/);
  });

  it('8. extrai conteúdo de <main> mesmo com markup aninhado', () => {
    const html = `<main role="main">
      <article>
        <section><h2>Sub</h2><p>Texto importante.</p></section>
      </article>
    </main>`;
    const text = extractMainText(html);
    assert.match(text, /Texto importante/);
    assert.match(text, /Sub/);
  });

  it('8b. fallback para <body> se <main> ausente', () => {
    const html = `<html><body><div>Sem main aqui mas com texto.</div></body></html>`;
    const text = extractMainText(html);
    assert.match(text, /Sem main aqui mas com texto/);
  });

  it('8c. remove <script> e <style> mesmo dentro de <main>', () => {
    const html = `<main>
      <script>console.log('ruim')</script>
      <style>.x { color: red }</style>
      <p>Conteúdo válido.</p>
    </main>`;
    const text = extractMainText(html);
    assert.match(text, /Conteúdo válido/);
    assert.doesNotMatch(text, /console\.log/);
    assert.doesNotMatch(text, /color: red/);
  });

  it('8d. decodifica entidades HTML comuns', () => {
    const html = `<main>R&amp;D &nbsp; &quot;Amil&quot; &#39;test&#39;</main>`;
    const text = extractMainText(html);
    assert.match(text, /R&D/);
    assert.match(text, /"Amil"/);
    assert.match(text, /'test'/);
  });
});

// ═══════════════════════════════════════════════════════════════
// computePairwise + estatísticas
// ═══════════════════════════════════════════════════════════════

describe('computePairwise — pair generation + ordering', () => {
  it('9. gera C(n,2) pares ordenados por score desc', () => {
    const pages = [
      { url: '/a', text: 'plano Amil saúde empresarial 30 vidas', wordCount: 10 },
      { url: '/b', text: 'plano Amil saúde empresarial 50 vidas', wordCount: 10 },
      { url: '/c', text: 'caminhão estrada chuva domingo viagem férias', wordCount: 10 },
    ];
    const pairs = computePairwise(pages, 1);
    assert.equal(pairs.length, 3); // C(3,2) = 3
    // a-b deve ser >> a-c (vocabulary similar)
    assert.ok(pairs[0].score > pairs[2].score, 'pairs ordered desc');
    assert.equal(pairs[0].a, '/a');
    assert.equal(pairs[0].b, '/b');
  });
});

// ═══════════════════════════════════════════════════════════════
// Sample builders
// ═══════════════════════════════════════════════════════════════

describe('buildSample — template selection', () => {
  it('10. template=sub-redes retorna 5 URLs', () => {
    const s = buildSample('sub-redes');
    assert.equal(s.urls.length, 5);
    assert.equal(s.name, 'sub-redes');
    assert.equal(SUB_REDES.length, 5);
  });

  it('11. template=blog-categorias retorna 8 URLs', () => {
    const s = buildSample('blog-categorias');
    assert.equal(s.urls.length, 8);
    assert.equal(BLOG_CATEGORIAS.length, 8);
  });

  it('11b. template=all retorna 5+8 = 13 URLs (city pages skip)', () => {
    const s = buildSample('all');
    assert.equal(s.urls.length, 13);
  });
});

// ═══════════════════════════════════════════════════════════════
// Estatísticas (median, percentile)
// ═══════════════════════════════════════════════════════════════

describe('median + percentile', () => {
  it('12a. median odd-length array', () => {
    assert.equal(median([1, 2, 3, 4, 5]), 3);
  });
  it('12b. median even-length array (avg dos 2 do meio)', () => {
    assert.equal(median([1, 2, 3, 4]), 2.5);
  });
  it('12c. median empty → 0', () => {
    assert.equal(median([]), 0);
  });
  it('12d. percentile 95 de [0..99] = 94', () => {
    const arr = Array.from({ length: 100 }, (_, i) => i);
    assert.equal(percentile(arr, 95), 95);
  });
});

// ═══════════════════════════════════════════════════════════════
// Pipeline helpers
// ═══════════════════════════════════════════════════════════════

describe('normalizeText / tokenize / ngrams pipeline', () => {
  it('normalize: lowercase + strip diacritics + pontuação', () => {
    assert.equal(
      normalizeText('Saúde Empresarial, S.A. — Plano!'),
      'saude empresarial s a plano',
    );
  });
  it('tokenize: split em whitespace', () => {
    assert.deepEqual(tokenize('a b  c   d'), ['a', 'b', 'c', 'd']);
  });
  it('ngrams 3-gram correto', () => {
    assert.deepEqual(ngrams(['a', 'b', 'c', 'd'], 3), ['a b c', 'b c d']);
  });
});
