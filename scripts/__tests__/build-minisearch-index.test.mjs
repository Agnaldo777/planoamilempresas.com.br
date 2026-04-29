/**
 * Tests Story 7.2 — build-minisearch-index.mjs
 *
 * Roda com: node --test scripts/__tests__/build-minisearch-index.test.mjs
 *
 * Pré-condição: scripts/build-minisearch-index.mjs foi executado e gerou
 * arquivos em public/search-index/. Em CI, o `prebuild` hook garante.
 *
 * Cobre 6 invariantes:
 *   1. master.json existe + tem ufs unique + municípios non-empty
 *   2. master.json budget ≤ 100KB
 *   3. cada shard UF (26 arquivos) existe
 *   4. cada shard tem `lookup` array + miniSearchIndex
 *   5. shard RJ (maior) tem prestadores correspondentes ao dataset
 *   6. budget hard de shard ≤ 1500KB (descomprimido)
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..', '..');
const INDEX_DIR = join(ROOT, 'public', 'search-index');
const DATASET_PATH = join(ROOT, 'data', 'rede-credenciada', 'rede-credenciada.json');

const MASTER_BUDGET_KB = 100;
const SHARD_BUDGET_KB = 1500;

let dataset;
let master;

before(() => {
  if (!existsSync(INDEX_DIR)) {
    throw new Error(
      `public/search-index/ não existe — rode "node scripts/build-minisearch-index.mjs" antes`,
    );
  }
  dataset = JSON.parse(readFileSync(DATASET_PATH, 'utf8'));
  master = JSON.parse(readFileSync(join(INDEX_DIR, 'master.json'), 'utf8'));
});

describe('build-minisearch-index — master', () => {
  it('1. master.json existe + shape mínimo', () => {
    assert.equal(master.version, 1);
    assert.ok(typeof master.geradoEm === 'string');
    assert.ok(Array.isArray(master.ufs));
    assert.ok(Array.isArray(master.municipios));
    assert.ok(master.miniSearchIndex);
  });

  it('2. master.ufs tem 26 entries únicos e ordenados', () => {
    assert.equal(master.ufs.length, 26);
    const sorted = [...master.ufs].sort();
    assert.deepEqual(master.ufs, sorted);
    const unique = new Set(master.ufs);
    assert.equal(unique.size, 26);
  });

  it('3. master.json budget ≤ 100KB', () => {
    const sizeKb = statSync(join(INDEX_DIR, 'master.json')).size / 1024;
    assert.ok(
      sizeKb <= MASTER_BUDGET_KB,
      `master.json ${sizeKb.toFixed(1)}KB excede budget ${MASTER_BUDGET_KB}KB`,
    );
  });
});

describe('build-minisearch-index — shards UF', () => {
  it('4. cada UF do master tem shard correspondente', () => {
    for (const uf of master.ufs) {
      const shardPath = join(INDEX_DIR, `${uf.toLowerCase()}.json`);
      assert.ok(existsSync(shardPath), `shard ${uf}.json deve existir`);
    }
  });

  it('5. shards têm lookup array + miniSearchIndex', () => {
    for (const uf of master.ufs.slice(0, 5)) {
      const shard = JSON.parse(
        readFileSync(join(INDEX_DIR, `${uf.toLowerCase()}.json`), 'utf8'),
      );
      assert.equal(shard.version, 1);
      assert.equal(shard.uf, uf);
      assert.ok(Array.isArray(shard.lookup));
      assert.ok(shard.lookup.length > 0);
      assert.ok(shard.miniSearchIndex);
      // lookup entries têm { id, c (codigo), s (slug) }
      for (const entry of shard.lookup.slice(0, 3)) {
        assert.equal(typeof entry.id, 'number');
        assert.equal(typeof entry.c, 'string');
        assert.equal(typeof entry.s, 'string');
      }
    }
  });

  it('6. shard RJ tem prestadores correspondentes ao dataset (≥3000)', () => {
    const rjPath = join(INDEX_DIR, 'rj.json');
    const rj = JSON.parse(readFileSync(rjPath, 'utf8'));
    const expectedRj = dataset.prestadores.filter(
      (p) => p && p.uf === 'RJ' && p.municipio,
    ).length;
    assert.equal(rj.lookup.length, expectedRj);
    assert.equal(rj.total, expectedRj);
    assert.ok(expectedRj >= 3000, `RJ deve ter ≥3000 prestadores, tem ${expectedRj}`);
  });

  it('7. todos os shards respeitam budget descomprimido', () => {
    for (const uf of master.ufs) {
      const sizeKb = statSync(join(INDEX_DIR, `${uf.toLowerCase()}.json`)).size / 1024;
      assert.ok(
        sizeKb <= SHARD_BUDGET_KB,
        `shard ${uf}.json ${sizeKb.toFixed(1)}KB excede budget ${SHARD_BUDGET_KB}KB`,
      );
    }
  });
});
