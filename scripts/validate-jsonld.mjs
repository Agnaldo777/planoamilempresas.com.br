#!/usr/bin/env node
/**
 * Story 1.3 — schema-validation workflow.
 * Extrai JSON-LD do HTML servido pelo preview Vercel e valida @types
 * obrigatórios por rota. Falha o workflow se JSON-LD não-parseável.
 *
 * Uso (CI):
 *   PREVIEW_URL=https://planoamilempresas-pr-123.vercel.app node scripts/validate-jsonld.mjs
 *
 * Uso (manual):
 *   PREVIEW_URL=http://localhost:3000 node scripts/validate-jsonld.mjs
 */
import { JSDOM } from 'jsdom';

const base = process.env.PREVIEW_URL;
if (!base) {
  console.error('Error: PREVIEW_URL env var not set');
  process.exit(1);
}

const PAGES = [
  '/',
  '/empresarial',
  '/planos',
  '/rede-credenciada',
  '/cotacao-online',
  '/perguntas-frequentes',
];

/**
 * Mapeamento de @types JSON-LD esperados por rota.
 * Apenas warning (não-fail) por enquanto — Story 1.4 canary é a primeira
 * com JSON-LD obrigatório; demais rotas serão preenchidas em Stories Epic 3+.
 */
const REQUIRED_TYPES = {
  '/': ['Organization', 'WebSite'],
  '/empresarial': ['Service', 'BreadcrumbList'],
  '/planos': ['Product'],
  '/rede-credenciada': ['BreadcrumbList'],
  '/cotacao-online': ['BreadcrumbList'],
  '/perguntas-frequentes': ['FAQPage'],
};

/**
 * @param {string} url
 * @returns {Promise<Set<string>>}
 */
async function extractJsonLdTypes(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const html = await res.text();
  const dom = new JSDOM(html);
  const scripts = Array.from(
    dom.window.document.querySelectorAll('script[type="application/ld+json"]'),
  );
  /** @type {Set<string>} */
  const types = new Set();
  for (const s of scripts) {
    const text = s.textContent ?? '';
    if (!text.trim()) continue;
    /** @type {unknown} */
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown';
      throw new Error(`Invalid JSON-LD at ${url}: ${message}`);
    }
    const items = Array.isArray(parsed) ? parsed : [parsed];
    for (const item of items) {
      if (item && typeof item === 'object' && '@type' in item) {
        const t = /** @type {{ '@type': unknown }} */ (item)['@type'];
        if (typeof t === 'string') types.add(t);
        else if (Array.isArray(t)) {
          for (const x of t) if (typeof x === 'string') types.add(x);
        }
      }
    }
  }
  return types;
}

let hardFailures = 0;
let warnings = 0;

for (const path of PAGES) {
  const url = base.replace(/\/$/, '') + path;
  console.log(`::group::${path}`);
  try {
    const types = await extractJsonLdTypes(url);
    if (types.size === 0) {
      console.warn(`::warning::No JSON-LD found at ${path}`);
      warnings++;
    } else {
      console.log(`Found JSON-LD @types: ${[...types].join(', ')}`);
    }
    const required = REQUIRED_TYPES[path] ?? [];
    for (const r of required) {
      if (!types.has(r)) {
        console.warn(
          `::warning::Page ${path} missing required @type=${r} (found: ${[...types].join(', ') || 'none'})`,
        );
        warnings++;
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error(`::error::${path}: ${message}`);
    hardFailures++;
  } finally {
    console.log('::endgroup::');
  }
}

console.log(`\nSummary: ${hardFailures} hard failure(s), ${warnings} warning(s)`);

if (hardFailures > 0) {
  console.error('Schema validation FAILED — JSON-LD non-parseable on some pages');
  process.exit(1);
}

console.log('Schema validation PASSED');
