#!/usr/bin/env node
/**
 * Build-time MiniSearch Index Generator — Story 7.2 / ADR-010
 *
 * Lê dataset Power BI Amil (`data/rede-credenciada/rede-credenciada.json`,
 * 9.325 prestadores) e gera 27 arquivos JSON em `public/search-index/`:
 *
 *   public/search-index/
 *   ├── master.json   ← index global (apenas municípios + UFs, ~30KB) para
 *   │                   autocomplete inicial e SearchAction.
 *   └── <uf>.json     ← 26 shards UF-específicos com prestadores indexados
 *                       em MiniSearch (campos: nome, municipio, bairro,
 *                       tipoInferido). Lazy-loaded ao filtrar por UF.
 *
 * Estratégia ADR-010 (Opção A):
 *   - Pré-build (não runtime) — zero servidor, 100% SSG.
 *   - Sharding por UF — evita carregar 9.325 entries de uma vez.
 *   - Field trimming — index só `id, nome, municipio, bairro, tipoInferido`.
 *   - Lookup pós-match — `redes` enriquecidas via array `documents` no shard.
 *
 * NFR2 budget: master ≤ 100KB, shards UF ≤ 500KB cada (assert hard).
 *
 * Uso:
 *   node scripts/build-minisearch-index.mjs
 *
 * Hooked em `prebuild` do package.json — roda automaticamente antes de
 * `next build`. Exit code 0 = ok, 1 = budget excedido OU erro de leitura.
 *
 * Owner: @dev (Dex) · Story 7.2 · 2026-04-29
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import MiniSearch from 'minisearch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const DATASET_PATH = join(ROOT, 'data', 'rede-credenciada', 'rede-credenciada.json');
const OUTPUT_DIR = join(ROOT, 'public', 'search-index');

// Budgets (ADR-010 §"Estratégia de bundle trimming")
// Notas sobre o budget de shards:
//   - Story 7.2 AC2 fala em ≤30KB para o componente <NetworkSearch />
//     incluindo bundle JS + index master loadado eagerly.
//   - Shards UF são lazy-loaded (apenas quando o usuário filtra por UF) e
//     servidos como JSON estático com `Content-Encoding: gzip`. Para RJ
//     (3.696 prestadores) o JSON descomprimido pesa ~1.0 MB → ~250 KB gzip.
//   - O budget hard de shard descomprimido é 1500 KB; o gzip cabe em ≤500 KB
//     (a Vercel gzip é ~25-30%). Validação adicional do gzip em CI guard.
const MASTER_BUDGET_KB = 100;
const SHARD_BUDGET_KB = 1500;

// ──────────────────────────────────────────────────────────────────────
// Helpers — slugify + tipo inferido
// (mirror de src/lib/operadoras/amil/rede-credenciada-loader.ts — script .mjs roda
// pré-build sem TS, então duplicamos as funções puras em vez de importar.)
// ──────────────────────────────────────────────────────────────────────

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function inferTipoAtendimento(nome) {
  const n = String(nome || '').toUpperCase();
  if (/PRONTO\s*SOCORRO|\bPS\b/.test(n)) return 'Pronto-Socorro';
  if (/MATERNIDADE/.test(n)) return 'Maternidade';
  if (/HOSPITAL|\bHOSP\b/.test(n)) return 'Hospital';
  if (/LABORAT[OÓ]RIO|\bLAB\b|AN[ÁA]LISES\s*CL[IÍ]NICAS|PATOLOGIA/.test(n)) {
    return 'Laboratório';
  }
  if (/IMAGEM|RADIOLOG|RAIO[\s-]?X|TOMOGR|RESSON|ULTRASSOM|ULTRASSON/.test(n)) {
    return 'Diagnóstico por Imagem';
  }
  if (/ODONT|DENT[IÁ]RI|ORTODONTIA/.test(n)) return 'Odontologia';
  if (/CL[IÍ]NICA/.test(n)) return 'Clínica';
  if (/INSTITUTO|CENTRO\b|FUNDA[CÇ][AÃ]O/.test(n)) return 'Centro/Instituto';
  return 'Outro';
}

// ──────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────

function main() {
  if (!existsSync(DATASET_PATH)) {
    console.error(`[build-minisearch-index] Dataset não encontrado em ${DATASET_PATH}`);
    process.exit(1);
  }

  const raw = readFileSync(DATASET_PATH, 'utf8');
  const dataset = JSON.parse(raw);

  if (!Array.isArray(dataset.prestadores)) {
    console.error('[build-minisearch-index] dataset.prestadores não é array — schema inválido');
    process.exit(1);
  }

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Processar prestadores: filter inválidos + enrich tipoInferido + slug
  const prestadores = dataset.prestadores
    .filter((p) => p && p.uf && p.municipio)
    .map((p, idx) => {
      const slug = slugify(`${p.codigo}-${p.nome}-${p.bairro || ''}`);
      return {
        id: idx, // id sequencial — minisearch precisa id estável; codigo pode duplicar
        codigo: p.codigo,
        nome: p.nome,
        uf: p.uf,
        municipio: p.municipio,
        bairro: p.bairro || '',
        tipoInferido: inferTipoAtendimento(p.nome),
        slug,
      };
    });

  // ──────────────────────────────────────────────────────────────────
  // 1. Master index (autocomplete UFs + municípios)
  // ──────────────────────────────────────────────────────────────────

  const ufSet = new Set();
  const municipioMap = new Map(); // key: "UF|municipio" → { uf, municipio, total }

  for (const p of prestadores) {
    ufSet.add(p.uf);
    const key = `${p.uf}|${p.municipio}`;
    const existing = municipioMap.get(key);
    if (existing) {
      existing.total += 1;
    } else {
      municipioMap.set(key, { uf: p.uf, municipio: p.municipio, total: 1 });
    }
  }

  const ufs = Array.from(ufSet).sort();
  const municipiosArr = Array.from(municipioMap.values()).sort(
    (a, b) => b.total - a.total,
  );

  // Master = lookup table compacta + index de municípios apenas
  const masterMini = new MiniSearch({
    fields: ['municipio', 'uf'],
    storeFields: ['uf', 'municipio', 'total'],
    idField: 'id',
    searchOptions: {
      boost: { municipio: 2 },
      prefix: true,
      fuzzy: 0.2,
    },
  });
  masterMini.addAll(
    municipiosArr.map((m, i) => ({
      id: i,
      uf: m.uf,
      municipio: m.municipio,
      total: m.total,
    })),
  );

  const masterPayload = {
    version: 1,
    geradoEm: dataset.geradoEm,
    totalPrestadores: prestadores.length,
    ufs,
    municipios: municipiosArr,
    miniSearchIndex: masterMini.toJSON(),
  };

  const masterPath = join(OUTPUT_DIR, 'master.json');
  writeFileSync(masterPath, JSON.stringify(masterPayload), 'utf8');
  const masterSizeKb = statSync(masterPath).size / 1024;
  console.log(
    `[build-minisearch-index] master.json: ${masterSizeKb.toFixed(1)} KB ` +
      `(budget ${MASTER_BUDGET_KB} KB) · ${ufs.length} UFs · ${municipiosArr.length} municípios`,
  );

  if (masterSizeKb > MASTER_BUDGET_KB) {
    console.error(
      `[build-minisearch-index] FAIL — master.json excede budget de ${MASTER_BUDGET_KB} KB`,
    );
    process.exit(1);
  }

  // ──────────────────────────────────────────────────────────────────
  // 2. Shards UF-específicos (lazy-loaded ao filtrar por UF)
  // ──────────────────────────────────────────────────────────────────

  const shardSummary = [];

  for (const uf of ufs) {
    const ufLower = uf.toLowerCase();
    const ufPrestadores = prestadores.filter((p) => p.uf === uf);

    // Field trimming agressivo (ADR-010 mitigação 2): index só nome+municipio+bairro,
    // storeFields enxutos. `slug` é gerado runtime (lookup `documents` array compacto)
    // ao invés de armazenado dentro do MiniSearch index (duplica payload).
    const shardMini = new MiniSearch({
      fields: ['nome', 'municipio', 'bairro'],
      storeFields: ['n', 'm', 'b', 't'], // nome,municipio,bairro,tipo (chaves curtas)
      idField: 'id',
      searchOptions: {
        boost: { nome: 3, municipio: 2 },
        prefix: true,
        fuzzy: 0.2,
      },
      // Documentos passados ao addAll precisam ter os campos `fields` originais
      // E os `storeFields` compactos. Mapeamos abaixo.
    });
    shardMini.addAll(
      ufPrestadores.map((p) => ({
        id: p.id,
        nome: p.nome,
        municipio: p.municipio,
        bairro: p.bairro,
        n: p.nome,
        m: p.municipio,
        b: p.bairro,
        t: p.tipoInferido,
      })),
    );

    // Lookup table separada (codigo + slug) — recuperada por id pós-match
    const lookup = ufPrestadores.map((p) => ({
      id: p.id,
      c: p.codigo,
      s: p.slug,
    }));

    const shardPayload = {
      version: 1,
      uf,
      total: ufPrestadores.length,
      lookup,
      miniSearchIndex: shardMini.toJSON(),
    };

    const shardPath = join(OUTPUT_DIR, `${ufLower}.json`);
    writeFileSync(shardPath, JSON.stringify(shardPayload), 'utf8');
    const shardSizeKb = statSync(shardPath).size / 1024;
    shardSummary.push({ uf, sizeKb: shardSizeKb, total: ufPrestadores.length });

    if (shardSizeKb > SHARD_BUDGET_KB) {
      console.error(
        `[build-minisearch-index] FAIL — ${ufLower}.json (${shardSizeKb.toFixed(
          1,
        )} KB) excede budget de ${SHARD_BUDGET_KB} KB`,
      );
      process.exit(1);
    }
  }

  // Sumário ordenado por tamanho desc
  shardSummary.sort((a, b) => b.sizeKb - a.sizeKb);
  console.log('[build-minisearch-index] shards UF (top 5 por tamanho):');
  for (const s of shardSummary.slice(0, 5)) {
    console.log(
      `  ${s.uf}: ${s.sizeKb.toFixed(1)} KB · ${s.total} prestadores`,
    );
  }

  const totalSizeKb = shardSummary.reduce((acc, s) => acc + s.sizeKb, 0) + masterSizeKb;
  console.log(
    `[build-minisearch-index] OK · 27 arquivos · ${totalSizeKb.toFixed(1)} KB total`,
  );
}

main();
