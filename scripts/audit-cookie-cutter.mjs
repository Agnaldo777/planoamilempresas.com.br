#!/usr/bin/env node
/**
 * Story 5.7 — Auditoria Anti-Cookie-Cutter (NFR25).
 *
 * Detecta cookie-cutter (texto > 70% idêntico entre instâncias) em páginas
 * programáticas/template via Jaccard similarity sobre n-grams de palavras.
 *
 * Uso:
 *   node scripts/audit-cookie-cutter.mjs
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/audit-cookie-cutter.mjs
 *   AUDIT_BASE_URL=https://preview.vercel.app node scripts/audit-cookie-cutter.mjs --template=sub-redes
 *
 * Args:
 *   --template=<all|sub-redes|blog-categorias|city-pages>  (default: all)
 *   --output=<path-md>                                     (default: docs/qa/cookie-cutter-report-YYYY-MM.md)
 *   --ngram=<int>                                          (default: 3)
 *   --threshold=<float>                                    (default: from config/qa-thresholds.json)
 *   --no-write                                             (apenas console; não grava report)
 *
 * Saída:
 *   - stdout: resumo (mediana, p95, max + verdict PASS/FAIL)
 *   - docs/qa/cookie-cutter-report-YYYY-MM.md (a menos que --no-write)
 *
 * Exit codes:
 *   0 = PASS (nenhuma página violou threshold)
 *   1 = FAIL (cookie-cutter detectado)
 *   2 = erro técnico (fetch falhou, HTML malformado)
 *
 * Algoritmo: ver lib/qa/jaccard.ts. Performance: O(N²) sobre amostra
 * (N=30 → 435 pares; <60s alvo).
 *
 * Owner: Quinn (QA Engineer) — Story 5.7
 */

import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─────────────────────────────────────────────────────────────────
// Setup paths + thresholds
// ─────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(__filename));
const CONFIG_PATH = join(ROOT, 'config', 'qa-thresholds.json');

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));

// ─────────────────────────────────────────────────────────────────
// Argument parsing (zero deps)
// ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const found = args.find((a) => a.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  if (args.includes(`--${name}`)) return true;
  return fallback;
}

const TEMPLATE = getArg('template', 'all');
const NGRAM = Number(getArg('ngram', config.jaccard.ngram));
const THRESHOLD = Number(getArg('threshold', config.jaccard.cookieCutter));
const PAIR_FAIL = Number(getArg('pair-fail', config.jaccard.individualPairFail));
const NO_WRITE = getArg('no-write', false) === true;
const BASE_URL =
  process.env.AUDIT_BASE_URL || 'http://localhost:3000';

const now = new Date();
const YYYY_MM = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
const DEFAULT_OUTPUT = join(ROOT, 'docs', 'qa', `cookie-cutter-report-${YYYY_MM}.md`);
const OUTPUT_PATH = getArg('output', DEFAULT_OUTPUT);

// ─────────────────────────────────────────────────────────────────
// Jaccard helpers (espelho de lib/qa/jaccard.ts — sync manual)
// ─────────────────────────────────────────────────────────────────

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

export function jaccardSimilarity(text1, text2, { ngram = 3, stripDiacritics = true } = {}) {
  const norm1 = normalizeText(text1, { stripDiacritics });
  const norm2 = normalizeText(text2, { stripDiacritics });
  const set1 = new Set(ngrams(tokenize(norm1), ngram));
  const set2 = new Set(ngrams(tokenize(norm2), ngram));
  return jaccardSets(set1, set2);
}

// ─────────────────────────────────────────────────────────────────
// HTML extraction — extrai <main> (ou [role="main"]) e strip tags
// ─────────────────────────────────────────────────────────────────

/**
 * Extrai conteúdo textual do `<main>` da página. Strip de tags HTML,
 * remove header/footer/nav globais. Implementação regex (zero deps)
 * — robustez ≈ 95% em HTML bem formado de Next.js (Story 5.7
 * CodeRabbit Focus #2).
 *
 * Trade-off: jsdom é mais robusto mas requer install ad-hoc. Para
 * páginas geradas por Next.js (HTML válido), regex é suficiente +
 * 5x mais rápido.
 */
export function extractMainText(html) {
  // Remove <script>, <style>, <noscript> primeiro (conteúdo não-textual)
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ');

  // Tenta extrair conteúdo de <main>...</main>; se não existe, usa body
  const mainMatch = cleaned.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  let mainContent = mainMatch
    ? mainMatch[1]
    : (cleaned.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || cleaned);

  // Remove header/footer/nav explicitamente mesmo se inside main
  mainContent = mainContent
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ');

  // Strip todas as tags HTML restantes
  const text = mainContent
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

// ─────────────────────────────────────────────────────────────────
// Fetch — com timeout e retry leve
// ─────────────────────────────────────────────────────────────────

async function fetchPage(url, { timeoutMs = 15_000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'audit-cookie-cutter/5.7 (Quinn QA)' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

// ─────────────────────────────────────────────────────────────────
// Sample definitions — onde encontrar URLs por template
// ─────────────────────────────────────────────────────────────────

const SUB_REDES = [
  '/rede-credenciada/hospitais-dor',
  '/rede-credenciada/amil-one-rede-selecionada',
  '/rede-credenciada/amil-facil-rede-selecionada',
  '/rede-credenciada/classica',
  '/rede-credenciada/amil-medial',
];

const BLOG_CATEGORIAS = [
  '/blog/categoria/carencias',
  '/blog/categoria/coparticipacao',
  '/blog/categoria/reembolso',
  '/blog/categoria/rede-credenciada',
  '/blog/categoria/adesao-mei-pme',
  '/blog/categoria/ans-regulamentacao',
  '/blog/categoria/cobertura',
  '/blog/categoria/cancelamento',
];

/**
 * Carrega URLs city pages do dataset de prestadores se a rota
 * `/rede/[uf]/[municipio]/` estiver implementada (Story 7.5+).
 * Em estado atual (R1), retorna [] e marca como skip.
 */
function getCityPagesSample() {
  // Story 7.5/7.6 ainda não deployed — retornar vazio
  // Quando habilitado: ler data/rede-credenciada/rede-credenciada.json,
  // estratificar top-50 + 30 mid + 20 cauda.
  return [];
}

function buildSample(template) {
  switch (template) {
    case 'sub-redes':
      return { name: 'sub-redes', urls: SUB_REDES };
    case 'blog-categorias':
      return { name: 'blog-categorias', urls: BLOG_CATEGORIAS };
    case 'city-pages':
      return { name: 'city-pages', urls: getCityPagesSample() };
    case 'all':
    default:
      return {
        name: 'all',
        urls: [...SUB_REDES, ...BLOG_CATEGORIAS, ...getCityPagesSample()],
      };
  }
}

// ─────────────────────────────────────────────────────────────────
// Pair-wise Jaccard + estatísticas
// ─────────────────────────────────────────────────────────────────

function computePairwise(pages, ngram) {
  const pairs = [];
  for (let i = 0; i < pages.length; i++) {
    for (let j = i + 1; j < pages.length; j++) {
      const score = jaccardSimilarity(pages[i].text, pages[j].text, { ngram });
      pairs.push({
        a: pages[i].url,
        b: pages[j].url,
        score,
        wordCountA: pages[i].wordCount,
        wordCountB: pages[j].wordCount,
      });
    }
  }
  return pairs.sort((x, y) => y.score - x.score);
}

function median(arr) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function percentile(arr, p) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

// ─────────────────────────────────────────────────────────────────
// Markdown report generator
// ─────────────────────────────────────────────────────────────────

function buildReport({ sampleName, pages, pairs, threshold, pairFail, ngram, baseUrl, verdict }) {
  const scores = pairs.map((p) => p.score);
  const med = median(scores);
  const p95 = percentile(scores, 95);
  const max = scores.length > 0 ? Math.max(...scores) : 0;
  const violationsThreshold = pairs.filter((p) => p.score >= threshold);
  const violationsPair = pairs.filter((p) => p.score >= pairFail);

  const lines = [];
  lines.push(`# Cookie-Cutter Audit — ${YYYY_MM}`);
  lines.push('');
  lines.push(`**NFR25 (Anti-Cookie-Cutter / Helpful Content Update)** — Story 5.7`);
  lines.push('');
  lines.push(`- **Generated:** ${now.toISOString()}`);
  lines.push(`- **Base URL:** \`${baseUrl}\``);
  lines.push(`- **Sample:** \`${sampleName}\` (${pages.length} pages)`);
  lines.push(`- **Algorithm:** Jaccard similarity, ${ngram}-gram word level`);
  lines.push(`- **Threshold (median):** ${threshold} — falha se mediana ≥ threshold`);
  lines.push(`- **Threshold (par individual):** ${pairFail} — falha se qualquer par ≥`);
  lines.push(`- **Verdict:** **${verdict}**`);
  lines.push('');

  // ─── Estatísticas globais ────────────────────────────────────
  lines.push('## Estatísticas globais');
  lines.push('');
  lines.push('| Métrica | Valor |');
  lines.push('|---------|-------|');
  lines.push(`| Pares avaliados | ${pairs.length} |`);
  lines.push(`| Mediana Jaccard | ${med.toFixed(4)} |`);
  lines.push(`| P95 Jaccard | ${p95.toFixed(4)} |`);
  lines.push(`| Max Jaccard | ${max.toFixed(4)} |`);
  lines.push(`| Violações ≥ ${threshold} | ${violationsThreshold.length} |`);
  lines.push(`| Violações ≥ ${pairFail} (par fail) | ${violationsPair.length} |`);
  lines.push('');

  // ─── Top 5 pares mais similares ───────────────────────────────
  lines.push('## Top 5 pares mais similares');
  lines.push('');
  lines.push('| # | Página A | Página B | Jaccard | Flag |');
  lines.push('|---|----------|----------|---------|------|');
  pairs.slice(0, 5).forEach((p, i) => {
    const flag = p.score >= pairFail ? 'FAIL' : p.score >= threshold ? 'WARN' : 'OK';
    lines.push(
      `| ${i + 1} | \`${p.a}\` | \`${p.b}\` | ${p.score.toFixed(4)} | ${flag} |`,
    );
  });
  lines.push('');

  // ─── Word-count por página ────────────────────────────────────
  lines.push('## Word count por página');
  lines.push('');
  lines.push('| URL | Words | Status (≥600) |');
  lines.push('|-----|-------|---------------|');
  pages.forEach((pg) => {
    const status = pg.wordCount >= config.minWordCount ? 'OK' : 'WARN';
    lines.push(`| \`${pg.url}\` | ${pg.wordCount} | ${status} |`);
  });
  lines.push('');

  // ─── Recomendações ────────────────────────────────────────────
  lines.push('## Recomendações');
  lines.push('');
  if (verdict === 'PASS') {
    lines.push('- Auditoria PASS. Variação inter-instância >30% confirmada.');
    lines.push('- Comparar mediana com baseline (delta ≤ 5pp) na próxima execução mensal.');
  } else {
    lines.push('- Auditoria FAIL. Pelo menos um par excedeu threshold cookie-cutter.');
    lines.push('- Páginas envolvidas precisam de variação contextual mínima 30%:');
    const offenders = new Set();
    violationsThreshold.concat(violationsPair).forEach((p) => {
      offenders.add(p.a);
      offenders.add(p.b);
    });
    [...offenders].forEach((url) => lines.push(`  - \`${url}\``));
    lines.push('');
    lines.push('- Variação contextual recomendada:');
    lines.push('  - Hospitais reais por cidade (não apenas substituir nome)');
    lines.push('  - CNAE-specific copy (riscos ocupacionais por setor)');
    lines.push('  - Dados ANS por UF (cobertura, prazos, diretrizes locais)');
    lines.push('  - Bairros mencionados, faixa etária do perfil-alvo da cidade');
    lines.push('');
    lines.push('- Re-rodar audit após refactor: `node scripts/audit-cookie-cutter.mjs`.');
  }
  lines.push('');

  // ─── Audit trail ─────────────────────────────────────────────
  lines.push('## Audit trail');
  lines.push('');
  lines.push('- Spec: `docs/stories/5.7.auditoria-anti-cookie-cutter.story.md`');
  lines.push('- Algoritmo: `lib/qa/jaccard.ts`');
  lines.push('- Script: `scripts/audit-cookie-cutter.mjs`');
  lines.push('- Config: `config/qa-thresholds.json`');
  lines.push('- Workflow: `.github/workflows/cookie-cutter-audit.yml`');
  lines.push('');

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────

async function main() {
  const sample = buildSample(TEMPLATE);

  if (sample.urls.length === 0) {
    console.error(
      `[audit-cookie-cutter] amostra para template=${TEMPLATE} está vazia.\n` +
        '  Story 7.5/7.6 (city pages) ainda não deployed; usar --template=sub-redes ou blog-categorias.',
    );
    process.exit(2);
  }

  if (sample.urls.length < 2) {
    console.error(
      `[audit-cookie-cutter] amostra de ${sample.urls.length} URL(s) — precisa >=2 para Jaccard pair-wise.`,
    );
    process.exit(2);
  }

  console.log(
    `[audit-cookie-cutter] template=${sample.name} sample-size=${sample.urls.length} ngram=${NGRAM} threshold=${THRESHOLD} pair-fail=${PAIR_FAIL}`,
  );
  console.log(`[audit-cookie-cutter] base-url=${BASE_URL}`);

  // ─── Fetch + extract ──────────────────────────────────────────
  const pages = [];
  for (const path of sample.urls) {
    const url = `${BASE_URL}${path}`;
    try {
      const html = await fetchPage(url);
      const text = extractMainText(html);
      const wordCount = tokenize(normalizeText(text)).length;
      if (wordCount < 50) {
        console.warn(
          `[audit-cookie-cutter] WARN: ${path} text muito curto (${wordCount} words) — possível erro de extract`,
        );
      }
      pages.push({ url: path, text, wordCount });
    } catch (err) {
      console.error(`[audit-cookie-cutter] FAIL fetch ${url}: ${err.message}`);
      process.exit(2);
    }
  }

  // ─── Pair-wise Jaccard ────────────────────────────────────────
  const pairs = computePairwise(pages, NGRAM);
  const scores = pairs.map((p) => p.score);
  const med = median(scores);
  const max = scores.length > 0 ? Math.max(...scores) : 0;

  const medianFail = med >= THRESHOLD;
  const pairFail = pairs.some((p) => p.score >= PAIR_FAIL);
  const verdict = medianFail || pairFail ? 'FAIL' : 'PASS';

  // ─── Report ───────────────────────────────────────────────────
  const reportMd = buildReport({
    sampleName: sample.name,
    pages,
    pairs,
    threshold: THRESHOLD,
    pairFail: PAIR_FAIL,
    ngram: NGRAM,
    baseUrl: BASE_URL,
    verdict,
  });

  if (!NO_WRITE) {
    mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
    writeFileSync(OUTPUT_PATH, reportMd, 'utf8');
    console.log(`[audit-cookie-cutter] report: ${OUTPUT_PATH}`);
  }

  // ─── Console summary ──────────────────────────────────────────
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  COOKIE-CUTTER AUDIT — ${verdict}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Sample:     ${sample.name} (${pages.length} páginas, ${pairs.length} pares)`);
  console.log(`  Median:     ${med.toFixed(4)}  (threshold ${THRESHOLD})`);
  console.log(`  Max:        ${max.toFixed(4)}  (pair-fail ${PAIR_FAIL})`);
  console.log(`  Top pair:   ${pairs[0]?.score.toFixed(4)}  ${pairs[0]?.a} vs ${pairs[0]?.b}`);
  console.log('');

  process.exit(verdict === 'PASS' ? 0 : 1);
}

// Só roda main se invocado direto (permite import em tests)
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` ||
    import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  main().catch((err) => {
    console.error('[audit-cookie-cutter] uncaught error:', err);
    process.exit(2);
  });
}

// ─────────────────────────────────────────────────────────────────
// Exports para tests
// ─────────────────────────────────────────────────────────────────
export {
  normalizeText,
  tokenize,
  ngrams,
  jaccardSets,
  median,
  percentile,
  computePairwise,
  buildSample,
  SUB_REDES,
  BLOG_CATEGORIAS,
};
// extractMainText was already exported via `export function`

