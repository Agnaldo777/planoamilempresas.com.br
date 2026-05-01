#!/usr/bin/env node
/**
 * check-editorial-cadence.mjs — Story 6.11.e (AC2)
 *
 * Calcula `daysSinceLastPost` e severidade da cadência editorial.
 * Outputs para GitHub Actions via $GITHUB_OUTPUT (env file).
 *
 * Severidade:
 *   - days < threshold_warn (default 14)  → ok
 *   - threshold_warn ≤ days < threshold_crit (30) → warning
 *   - days ≥ threshold_crit → critical
 *
 * Modos:
 *   default       → calcula severidade + escreve $GITHUB_OUTPUT
 *   --append-history → atualiza docs/editorial/cadence-history.md
 *                       com linha do mês corrente
 *   --json        → imprime resultado em JSON
 *
 * Source de dados:
 *   - Sanity GROQ se SANITY_PROJECT_ID + SANITY_API_READ_TOKEN
 *   - fallback: data/blog/mock-posts.ts (parsing estático)
 *
 * Exit code: sempre 0 (severidade comunicada via output, não exit).
 * Razão: workflow precisa atingir steps de issue creation.
 */

import { existsSync, readFileSync, appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const THRESHOLD_WARN = Number(process.env.THRESHOLD_WARN ?? '14');
const THRESHOLD_CRIT = Number(process.env.THRESHOLD_CRIT ?? '30');

/**
 * Parse mock-posts.ts e devolve `{ title, publishedAt, slug }[]`.
 * @returns {Array<{title:string, publishedAt:string, slug:string}>}
 */
function loadMockPosts() {
  const file = path.join(ROOT, 'data', 'blog', 'mock-posts.ts');
  if (!existsSync(file)) return [];
  const source = readFileSync(file, 'utf-8');
  const blocks = source.split(/(?=_id:\s*['"`])/g);
  const fieldRe = (key) => new RegExp(`${key}:\\s*['"\`]([^'"\`]+)['"\`]`);
  const enabledRe = /enabled:\s*(true|false)/;
  const posts = [];
  for (const block of blocks) {
    const idMatch = block.match(fieldRe('_id'));
    if (!idMatch) continue;
    const titleMatch = block.match(fieldRe('title'));
    const slugMatch = block.match(fieldRe('slug'));
    const pubMatch = block.match(fieldRe('publishedAt'));
    const enabledMatch = block.match(enabledRe);
    if (!titleMatch || !pubMatch) continue;
    if (enabledMatch && enabledMatch[1] === 'false') continue;
    posts.push({
      title: titleMatch[1],
      publishedAt: pubMatch[1],
      slug: slugMatch ? slugMatch[1] : '',
    });
  }
  return posts.sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
  );
}

async function loadSanityPosts() {
  // Stub: requer next-sanity; em CI opcional.
  // TODO Aria: integrar @sanity/client direto (sem next).
  return loadMockPosts();
}

/**
 * Calcula severidade dado lastPost + thresholds.
 * @param {Date} now
 * @param {Date|null} lastPostDate
 * @param {number} warn
 * @param {number} crit
 * @returns {{severity: 'ok'|'warning'|'critical'|'no-data', daysSince: number|null}}
 */
export function computeSeverity(now, lastPostDate, warn, crit) {
  if (!lastPostDate) return { severity: 'no-data', daysSince: null };
  const daysSince = Math.floor(
    (now.getTime() - lastPostDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysSince >= crit) return { severity: 'critical', daysSince };
  if (daysSince >= warn) return { severity: 'warning', daysSince };
  return { severity: 'ok', daysSince };
}

/**
 * Conta posts publicados nos últimos N dias.
 * @param {Array<{publishedAt:string}>} posts
 * @param {Date} now
 * @param {number} windowDays
 */
export function postsInWindow(posts, now, windowDays) {
  const cutoff = now.getTime() - windowDays * 24 * 60 * 60 * 1000;
  return posts.filter((p) => new Date(p.publishedAt).getTime() >= cutoff).length;
}

function setOutput(key, value) {
  const outFile = process.env.GITHUB_OUTPUT;
  const line = `${key}=${String(value).replace(/\n/g, ' ')}\n`;
  if (outFile) {
    appendFileSync(outFile, line);
  }
  console.warn(`[cadence] ${line.trim()}`);
}

function appendHistory({ monthLabel, daysSince, postsLastMonth, severity }) {
  const dir = path.join(ROOT, 'docs', 'editorial');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'cadence-history.md');
  if (!existsSync(file)) {
    const header = [
      '# Editorial Cadence History',
      '',
      'Histórico mensal automatizado pela GitHub Action `editorial-cadence.yml`.',
      '',
      '| Mês | Posts no mês | Dias desde último | Severidade |',
      '|-----|--------------|-------------------|------------|',
      '',
    ].join('\n');
    appendFileSync(file, header);
  }
  const row = `| ${monthLabel} | ${postsLastMonth ?? '—'} | ${daysSince ?? '—'} | ${severity} |\n`;
  appendFileSync(file, row);
  console.warn(`[cadence] history appended → ${file}`);
}

async function main() {
  const args = process.argv.slice(2);
  const jsonOut = args.includes('--json');
  const appendMode = args.includes('--append-history');

  if (appendMode) {
    appendHistory({
      monthLabel: process.env.MONTH ?? new Date().toISOString().slice(0, 7),
      daysSince: process.env.DAYS,
      postsLastMonth: process.env.POSTS_LAST_MONTH,
      severity: process.env.SEVERITY ?? 'unknown',
    });
    return;
  }

  const usingSanity = Boolean(
    process.env.SANITY_PROJECT_ID && process.env.SANITY_API_READ_TOKEN,
  );
  const posts = usingSanity ? await loadSanityPosts() : loadMockPosts();
  const now = new Date();

  if (posts.length === 0) {
    console.error('[cadence] nenhum post encontrado (mock ou Sanity)');
    setOutput('severity', 'no-data');
    setOutput('days_since', '');
    setOutput('last_title', '');
    setOutput('last_date', '');
    setOutput('posts_last_month', '0');
    setOutput('month_label', now.toISOString().slice(0, 7));
    return;
  }

  const last = posts[0];
  const lastDate = new Date(last.publishedAt);
  const { severity, daysSince } = computeSeverity(
    now,
    lastDate,
    THRESHOLD_WARN,
    THRESHOLD_CRIT,
  );
  const postsLast30 = postsInWindow(posts, now, 30);

  const result = {
    severity,
    daysSince,
    lastTitle: last.title,
    lastDate: last.publishedAt,
    postsLast30,
    monthLabel: now.toISOString().slice(0, 7),
    source: usingSanity ? 'sanity' : 'mock',
  };

  if (jsonOut) {
    console.log(JSON.stringify(result, null, 2));
  }

  setOutput('severity', severity);
  setOutput('days_since', daysSince ?? '');
  setOutput('last_title', last.title);
  setOutput('last_date', last.publishedAt);
  setOutput('posts_last_month', postsLast30);
  setOutput('month_label', result.monthLabel);
}

if (
  import.meta.url === pathToFileURL(process.argv[1] ?? '').href ||
  process.argv[1]?.endsWith('check-editorial-cadence.mjs')
) {
  main().catch((err) => {
    console.error('[cadence] erro fatal:', err);
    process.exit(1);
  });
}
