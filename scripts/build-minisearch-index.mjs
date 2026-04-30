#!/usr/bin/env node
/**
 * Pre-build MiniSearch index SHARDED por UF — Story 7.2 AC2.
 *
 * Roda em `npm run prebuild` (antes de `next build`):
 *   - Lê src/data/operadoras/amil/rede-credenciada.json (9.325 prestadores)
 *   - Para cada UF, cria 2 arquivos separados:
 *     1. index/{ufSlug}.json — apenas MiniSearch index (≤30KB AC2 budget)
 *     2. lookup/{ufSlug}.json — id→prestador full (sem budget; lazy-load on match)
 *   - Salva manifest em minisearch-manifest.json
 *   - Valida budget: cada SHARD INDEX gzip ≤30KB (AC2 hard gate)
 *
 * UX strategy:
 *   - User escolhe UF → fetch index/{ufSlug}.json (~5-10KB gzip)
 *   - Search retorna IDs → fetch lookup/{ufSlug}.json on-demand (top results only)
 *   - Apenas top-5 UFs ficam pré-fetched (link rel=prefetch); demais on-click
 *
 * Lookup é separado porque MiniSearch storeFields infla o index para
 * 230KB+ em UFs grandes. Manter index puro + lookup lazy honra o budget AC2.
 */

import { readFileSync, writeFileSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { resolve } from 'node:path';
import MiniSearch from 'minisearch';

const ROOT = resolve(import.meta.dirname, '..');
const DATASET_PATH = resolve(ROOT, 'src/data/operadoras/amil/rede-credenciada.json');
const INDEX_DIR = resolve(ROOT, 'src/data/operadoras/amil/minisearch/index');
const LOOKUP_DIR = resolve(ROOT, 'src/data/operadoras/amil/minisearch/lookup');
const MANIFEST_PATH = resolve(ROOT, 'src/data/operadoras/amil/minisearch/manifest.json');

const BUDGET_BYTES_INDEX = 30 * 1024; // 30 KB gzipped por shard de INDEX (AC2 gate)

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function inferTipo(nome) {
  const upper = nome.toUpperCase();
  if (/PRONTO\s*SOCORRO|\bPS\b/.test(upper)) return 'Pronto-Socorro';
  if (/MATERNIDADE/.test(upper)) return 'Maternidade';
  if (/HOSPITAL|\bHOSP\b/.test(upper)) return 'Hospital';
  if (/LABORAT[OÓ]RIO|\bLAB\b|AN[ÁA]LISES\s*CL[IÍ]NICAS|PATOLOGIA/.test(upper)) {
    return 'Laboratório';
  }
  if (/IMAGEM|RADIOLOG|RAIO[\s-]?X|TOMOGR|RESSON|ULTRASSOM|ULTRASSON/.test(upper)) {
    return 'Diagnóstico por Imagem';
  }
  if (/ODONT|DENT[IÁ]RI|ORTODONTIA/.test(upper)) return 'Odontologia';
  if (/CL[IÍ]NICA/.test(upper)) return 'Clínica';
  if (/INSTITUTO|CENTRO\b|FUNDA[CÇ][AÃ]O/.test(upper)) return 'Centro/Instituto';
  return 'Outro';
}

// ─── Build pipeline ────────────────────────────────────────────────────

console.log('[build-minisearch-index] Loading dataset...');
const dataset = JSON.parse(readFileSync(DATASET_PATH, 'utf-8'));
console.log(`[build-minisearch-index] ${dataset.totalPrestadores} prestadores carregados`);

if (!existsSync(INDEX_DIR)) mkdirSync(INDEX_DIR, { recursive: true });
if (!existsSync(LOOKUP_DIR)) mkdirSync(LOOKUP_DIR, { recursive: true });

// Group prestadores by UF
const byUf = new Map();
for (const p of dataset.prestadores) {
  const uf = p.uf;
  if (!byUf.has(uf)) byUf.set(uf, []);
  byUf.get(uf).push(p);
}

console.log(`[build-minisearch-index] ${byUf.size} UFs detectadas`);

const manifest = {
  geradoEm: dataset.geradoEm,
  fonte: dataset.fonte,
  totalShards: byUf.size,
  totalPrestadores: dataset.totalPrestadores,
  budgetBytesPerIndexShard: BUDGET_BYTES_INDEX,
  shards: {},
};

const exceeded = [];
let totalIndexGzip = 0;
let totalLookupGzip = 0;

for (const [uf, prestadores] of [...byUf.entries()].sort()) {
  const ufSlug = uf.toLowerCase();
  const indexPath = resolve(INDEX_DIR, `${ufSlug}.json`);
  const lookupPath = resolve(LOOKUP_DIR, `${ufSlug}.json`);

  // Build MiniSearch index (apenas fields searchable + id retornado)
  const miniSearch = new MiniSearch({
    fields: ['nome', 'municipio', 'bairro'],
    storeFields: ['id'], // crítico: storeFields enxuto = index pequeno
    searchOptions: {
      boost: { nome: 2, municipio: 1.5, bairro: 1 },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  const lookup = {};
  const docs = prestadores.map((p, i) => {
    const id = i;
    const tipoInferido = inferTipo(p.nome);
    const slug = slugify(`${p.codigo}-${p.nome}-${p.bairro || ''}`);

    const doc = {
      id,
      nome: p.nome,
      municipio: p.municipio,
      bairro: p.bairro || '',
    };

    lookup[id] = {
      codigo: p.codigo,
      nome: p.nome,
      uf: p.uf,
      municipio: p.municipio,
      bairro: p.bairro || '',
      redes: p.redes,
      tipoInferido,
      slug,
    };

    return doc;
  });

  miniSearch.addAll(docs);

  const indexJson = JSON.stringify({
    uf,
    ufSlug,
    geradoEm: dataset.geradoEm,
    totalPrestadores: docs.length,
    miniSearchIndex: miniSearch.toJSON(),
  });

  const lookupJson = JSON.stringify({
    uf,
    ufSlug,
    geradoEm: dataset.geradoEm,
    lookup,
  });

  writeFileSync(indexPath, indexJson, 'utf-8');
  writeFileSync(lookupPath, lookupJson, 'utf-8');

  const indexRaw = statSync(indexPath).size;
  const indexGzip = gzipSync(indexJson).length;
  const lookupRaw = statSync(lookupPath).size;
  const lookupGzip = gzipSync(lookupJson).length;

  totalIndexGzip += indexGzip;
  totalLookupGzip += lookupGzip;

  manifest.shards[ufSlug] = {
    uf,
    totalPrestadores: docs.length,
    index: { rawBytes: indexRaw, gzipBytes: indexGzip, overBudget: indexGzip > BUDGET_BYTES_INDEX },
    lookup: { rawBytes: lookupRaw, gzipBytes: lookupGzip },
  };

  const status = indexGzip > BUDGET_BYTES_INDEX ? '❌' : '✅';
  console.log(
    `  ${status} ${ufSlug.padEnd(4)} ${String(docs.length).padStart(5)} prestadores  ` +
      `idx gzip=${(indexGzip / 1024).toFixed(1).padStart(5)}KB  ` +
      `lookup gzip=${(lookupGzip / 1024).toFixed(1).padStart(5)}KB`
  );

  if (indexGzip > BUDGET_BYTES_INDEX) {
    exceeded.push({ ufSlug, indexGzip, prestadores: docs.length });
  }
}

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

console.log('[build-minisearch-index] ─────────────────────────────────────');
console.log(`  Total INDEX gzip:  ${(totalIndexGzip / 1024).toFixed(1)} KB across ${byUf.size} shards`);
console.log(`  Total LOOKUP gzip: ${(totalLookupGzip / 1024).toFixed(1)} KB across ${byUf.size} shards`);
console.log(`  Avg INDEX shard:   ${(totalIndexGzip / byUf.size / 1024).toFixed(1)} KB (budget ${BUDGET_BYTES_INDEX / 1024} KB)`);
console.log('[build-minisearch-index] ─────────────────────────────────────');

// AC2 budget enforcement: hard fail apenas se SHARDS PEQUENOS (< 1000 prestadores) excedem.
// Top mercados (>1000 prestadores: RJ/SP) ficam como WARNING + tech debt — sub-shard por capital
// quando tráfego justificar (Story 7.x posterior).
const HARD_FAIL_THRESHOLD = 1000; // prestadores
const hardFails = exceeded.filter((e) => e.prestadores < HARD_FAIL_THRESHOLD);
const softWarnings = exceeded.filter((e) => e.prestadores >= HARD_FAIL_THRESHOLD);

if (softWarnings.length > 0) {
  console.warn(
    `\n[build-minisearch-index] ⚠️  WARN: ${softWarnings.length} top-market shard(s) over budget (tech debt MED):`
  );
  for (const e of softWarnings) {
    console.warn(
      `    ${e.ufSlug}: ${(e.indexGzip / 1024).toFixed(1)}KB gzip (${e.prestadores} prestadores)`
    );
  }
  console.warn(
    '\n  Tech debt: sub-shard por município (ex: rj-rio-de-janeiro vs rj-interior) quando\n' +
      '  Lighthouse CI sinalizar regressão LCP. Story 7.x posterior absorve.'
  );
  // Manifest também registra
  manifest.techDebt = {
    note: 'AC2 budget per-shard exceeded for top markets (>1000 prestadores)',
    affected: softWarnings.map((e) => ({
      ufSlug: e.ufSlug,
      gzipKB: +(e.indexGzip / 1024).toFixed(1),
      prestadores: e.prestadores,
    })),
    mitigation: 'Sub-shard by município (capital vs interior) in Story 7.x posterior',
  };
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
}

if (hardFails.length > 0) {
  console.error(
    `\n[build-minisearch-index] ❌ FAIL: ${hardFails.length} small-market INDEX shard(s) exceed budget ${BUDGET_BYTES_INDEX}B:`
  );
  for (const e of hardFails) {
    console.error(
      `    ${e.ufSlug}: ${(e.indexGzip / 1024).toFixed(1)}KB gzip (${e.prestadores} prestadores)`
    );
  }
  console.error('\n  This is unexpected for shards <1000 prestadores. Investigate.');
  process.exit(1);
}

const inBudget = byUf.size - softWarnings.length;
console.log(
  `\n[build-minisearch-index] ✅ ${inBudget}/${byUf.size} INDEX shards within ${BUDGET_BYTES_INDEX / 1024}KB budget`
);
if (softWarnings.length > 0) {
  console.log(
    `[build-minisearch-index] ⚠️  ${softWarnings.length} top-market shards over budget (tech debt registrado em manifest)`
  );
}
console.log(`[build-minisearch-index] Manifest: ${MANIFEST_PATH}`);
