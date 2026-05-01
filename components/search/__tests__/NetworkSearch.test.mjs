/**
 * Tests Story 7.2 — NetworkSearch.tsx (helpers + index integration)
 *
 * Roda com: node --test components/search/__tests__/NetworkSearch.test.mjs
 *
 * Como NetworkSearch.tsx é Client Component (depende de fetch + DOM),
 * testamos as funções puras (slugify) e a integridade do MiniSearch
 * index via load do JSON pré-built.
 *
 * Cobre 8 invariantes:
 *   1. slugify normaliza acentos
 *   2. slugify remove caracteres especiais
 *   3. slugify usa hyphens em espaços
 *   4. master MiniSearch index é hidratável
 *   5. master index busca por município retorna hit
 *   6. shard MiniSearch index é hidratável
 *   7. shard busca por nome retorna hit conhecido
 *   8. shard busca prefix funciona
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import MiniSearch from 'minisearch';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..', '..', '..');
const INDEX_DIR = join(ROOT, 'public', 'search-index');

// Mirror de slugifyClient — Story 7.2 NetworkSearch.tsx
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

describe('NetworkSearch — slugify helper', () => {
  it('1. normaliza acentos pt-BR', () => {
    assert.equal(slugify('São Paulo'), 'sao-paulo');
    assert.equal(slugify('Niterói'), 'niteroi');
    assert.equal(slugify('Município'), 'municipio');
  });

  it('2. remove caracteres especiais', () => {
    assert.equal(slugify('Hospital Albert Einstein!'), 'hospital-albert-einstein');
    assert.equal(slugify('Copa D\'Or'), 'copa-dor');
  });

  it('3. usa hyphens em espaços e idempotente', () => {
    assert.equal(slugify('  Rio  de  Janeiro  '), 'rio-de-janeiro');
    assert.equal(slugify('rio-de-janeiro'), 'rio-de-janeiro');
  });
});

describe('NetworkSearch — master MiniSearch index', () => {
  let master;
  let masterMini;

  before(() => {
    if (!existsSync(join(INDEX_DIR, 'master.json'))) {
      throw new Error('Rode `npm run build:search-index` antes');
    }
    master = JSON.parse(readFileSync(join(INDEX_DIR, 'master.json'), 'utf8'));
    masterMini = MiniSearch.loadJS(master.miniSearchIndex, {
      fields: ['municipio', 'uf'],
      storeFields: ['uf', 'municipio', 'total'],
      idField: 'id',
      searchOptions: { boost: { municipio: 2 }, prefix: true, fuzzy: 0.2 },
    });
  });

  it('4. master index é hidratável via MiniSearch.loadJS', () => {
    assert.ok(masterMini);
    assert.equal(typeof masterMini.search, 'function');
  });

  it('5. busca por "rio" retorna ao menos um município', () => {
    const hits = masterMini.search('rio', { prefix: true });
    assert.ok(hits.length > 0, 'esperava hits para "rio"');
    // RJ deve estar nos resultados via "Rio de Janeiro"
    const rjMatch = hits.some(
      (h) => typeof h.municipio === 'string' && /rio/i.test(h.municipio),
    );
    assert.ok(rjMatch, 'esperava match com municipio contendo "rio"');
  });
});

describe('NetworkSearch — shard MiniSearch index (RJ)', () => {
  let shard;
  let shardMini;

  before(() => {
    const shardPath = join(INDEX_DIR, 'rj.json');
    if (!existsSync(shardPath)) {
      throw new Error('Rode `npm run build:search-index` antes');
    }
    shard = JSON.parse(readFileSync(shardPath, 'utf8'));
    shardMini = MiniSearch.loadJS(shard.miniSearchIndex, {
      fields: ['nome', 'municipio', 'bairro'],
      storeFields: ['n', 'm', 'b', 't'],
      idField: 'id',
      searchOptions: { boost: { nome: 3, municipio: 2 }, prefix: true, fuzzy: 0.2 },
    });
  });

  it('6. shard RJ é hidratável via MiniSearch.loadJS', () => {
    assert.ok(shardMini);
    assert.equal(shard.uf, 'RJ');
    assert.ok(shard.lookup.length > 0);
  });

  it('7. busca por "copacabana" retorna hits no shard RJ', () => {
    const hits = shardMini.search('copacabana', { prefix: true, fuzzy: 0.2 });
    assert.ok(hits.length > 0, 'esperava hits para "copacabana" no shard RJ');
  });

  it('8. busca prefix por "hosp" retorna hits hospital no RJ', () => {
    const hits = shardMini.search('hosp', { prefix: true });
    assert.ok(hits.length > 0, 'esperava hits para prefix "hosp"');
    // Lookup deve ter codigo+slug
    const firstId = hits[0].id;
    const meta = shard.lookup.find((l) => l.id === firstId);
    assert.ok(meta, 'lookup deve mapear id → {c, s}');
    assert.equal(typeof meta.c, 'string');
    assert.equal(typeof meta.s, 'string');
  });
});
