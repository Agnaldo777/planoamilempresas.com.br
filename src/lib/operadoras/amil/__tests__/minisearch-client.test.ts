/**
 * Tests Story 7.2 AC2 — minisearch-client helper.
 *
 * Coverage:
 * - loadShard fetches both index + lookup
 * - rehydration produz MiniSearch funcional
 * - searchInShard retorna hits ordenados
 * - getPrestadorFromShard resolve via lookup
 * - cache funciona (mesma instância retorna)
 * - error handling em 404
 * - clearShardCacheForTests isola
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import MiniSearch from 'minisearch';

import {
  __clearShardCacheForTests,
  getPrestadorFromShard,
  loadShard,
  searchInShard,
} from '@/lib/operadoras/amil/minisearch-client';
import type { PrestadorAmil } from '@/types/rede-credenciada-amil';

afterEach(() => {
  __clearShardCacheForTests();
});

// ─── Fixture builders ──────────────────────────────────────────────────

function buildFixtureIndex(prestadores: Array<{ id: number; nome: string; municipio: string; bairro: string }>): {
  uf: string;
  ufSlug: string;
  geradoEm: string;
  totalPrestadores: number;
  miniSearchIndex: object;
} {
  const ms = new MiniSearch({
    fields: ['nome', 'municipio', 'bairro'],
    storeFields: ['id'],
    searchOptions: {
      boost: { nome: 2, municipio: 1.5, bairro: 1 },
      fuzzy: 0.2,
      prefix: true,
    },
  });
  ms.addAll(prestadores);
  return {
    uf: 'XX',
    ufSlug: 'xx',
    geradoEm: '2026-04-30T00:00:00.000Z',
    totalPrestadores: prestadores.length,
    miniSearchIndex: ms.toJSON(),
  };
}

function buildFixtureLookup(prestadores: PrestadorAmil[]): {
  uf: string;
  ufSlug: string;
  geradoEm: string;
  lookup: Record<string, PrestadorAmil>;
} {
  const lookup: Record<string, PrestadorAmil> = {};
  for (let i = 0; i < prestadores.length; i += 1) {
    lookup[String(i)] = prestadores[i];
  }
  return {
    uf: 'XX',
    ufSlug: 'xx',
    geradoEm: '2026-04-30T00:00:00.000Z',
    lookup,
  };
}

const fixturePrestadores: PrestadorAmil[] = [
  {
    codigo: '100',
    nome: 'HOSPITAL SAO LUIZ',
    uf: 'XX',
    municipio: 'CIDADE TESTE',
    bairro: 'CENTRO',
    redes: ['AMIL S750 QP'],
    tipoInferido: 'Hospital',
    slug: '100-hospital-sao-luiz-centro',
  },
  {
    codigo: '200',
    nome: 'LABORATORIO ALPHA',
    uf: 'XX',
    municipio: 'CIDADE TESTE',
    bairro: 'JARDIM',
    redes: ['AMIL S380 QP'],
    tipoInferido: 'Laboratório',
    slug: '200-laboratorio-alpha-jardim',
  },
];

function makeMockFetch(
  indexFile: object,
  lookupFile: object,
  options?: { indexStatus?: number; lookupStatus?: number }
): typeof fetch {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes('/index/')) {
      return {
        ok: (options?.indexStatus ?? 200) === 200,
        status: options?.indexStatus ?? 200,
        json: async () => indexFile,
      } as Response;
    }
    if (url.includes('/lookup/')) {
      return {
        ok: (options?.lookupStatus ?? 200) === 200,
        status: options?.lookupStatus ?? 200,
        json: async () => lookupFile,
      } as Response;
    }
    throw new Error(`Unexpected URL: ${url}`);
  }) as typeof fetch;
}

// ─── Tests ──────────────────────────────────────────────────────────────

describe('loadShard', () => {
  it('carrega + hidrata index + lookup com sucesso', async () => {
    const indexFile = buildFixtureIndex(
      fixturePrestadores.map((p, i) => ({
        id: i,
        nome: p.nome,
        municipio: p.municipio,
        bairro: p.bairro,
      }))
    );
    const lookupFile = buildFixtureLookup(fixturePrestadores);
    const mockFetch = makeMockFetch(indexFile, lookupFile);

    const shard = await loadShard('xx', mockFetch);

    expect(shard.uf).toBe('XX');
    expect(shard.ufSlug).toBe('xx');
    expect(shard.totalPrestadores).toBe(2);
    expect(shard.miniSearch).toBeDefined();
    expect(Object.keys(shard.lookup)).toHaveLength(2);
  });

  it('cache em memória — segunda chamada retorna mesma instância', async () => {
    const indexFile = buildFixtureIndex(
      fixturePrestadores.map((p, i) => ({
        id: i,
        nome: p.nome,
        municipio: p.municipio,
        bairro: p.bairro,
      }))
    );
    const lookupFile = buildFixtureLookup(fixturePrestadores);
    const mockFetch = makeMockFetch(indexFile, lookupFile);

    const first = await loadShard('xx', mockFetch);
    const second = await loadShard('xx', mockFetch);

    expect(first).toBe(second);
    expect(mockFetch).toHaveBeenCalledTimes(2); // só 2 fetches (index + lookup) total, não 4
  });

  it('UF case-insensitive (uppercase normalizado para slug)', async () => {
    const indexFile = buildFixtureIndex(
      fixturePrestadores.map((p, i) => ({
        id: i,
        nome: p.nome,
        municipio: p.municipio,
        bairro: p.bairro,
      }))
    );
    const lookupFile = buildFixtureLookup(fixturePrestadores);
    const mockFetch = makeMockFetch(indexFile, lookupFile);

    const lower = await loadShard('xx', mockFetch);
    const upper = await loadShard('XX', mockFetch);

    expect(lower).toBe(upper);
  });

  it('throw Error se index 404', async () => {
    const indexFile = buildFixtureIndex([]);
    const lookupFile = buildFixtureLookup([]);
    const mockFetch = makeMockFetch(indexFile, lookupFile, { indexStatus: 404 });

    await expect(loadShard('xx', mockFetch)).rejects.toThrow(/HTTP 404/);
  });

  it('throw Error se lookup 404', async () => {
    const indexFile = buildFixtureIndex([]);
    const lookupFile = buildFixtureLookup([]);
    const mockFetch = makeMockFetch(indexFile, lookupFile, { lookupStatus: 404 });

    await expect(loadShard('xx', mockFetch)).rejects.toThrow(/HTTP 404/);
  });
});

describe('searchInShard', () => {
  it('retorna hits para query válida', async () => {
    const indexFile = buildFixtureIndex(
      fixturePrestadores.map((p, i) => ({
        id: i,
        nome: p.nome,
        municipio: p.municipio,
        bairro: p.bairro,
      }))
    );
    const lookupFile = buildFixtureLookup(fixturePrestadores);
    const shard = await loadShard('xx', makeMockFetch(indexFile, lookupFile));

    const hits = searchInShard(shard, 'hospital');

    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].id).toBe(0); // HOSPITAL SAO LUIZ
  });

  it('retorna array vazio para query <2 chars', async () => {
    const indexFile = buildFixtureIndex(
      fixturePrestadores.map((p, i) => ({
        id: i,
        nome: p.nome,
        municipio: p.municipio,
        bairro: p.bairro,
      }))
    );
    const lookupFile = buildFixtureLookup(fixturePrestadores);
    const shard = await loadShard('xx', makeMockFetch(indexFile, lookupFile));

    expect(searchInShard(shard, '')).toEqual([]);
    expect(searchInShard(shard, 'a')).toEqual([]);
    expect(searchInShard(shard, '   ')).toEqual([]);
  });

  it('respeita limit (default 50)', async () => {
    const many = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      nome: `HOSPITAL ${i}`,
      municipio: 'CIDADE',
      bairro: 'CENTRO',
    }));
    const indexFile = buildFixtureIndex(many);
    const lookupFile = buildFixtureLookup(
      many.map((m) => ({
        codigo: String(m.id),
        nome: m.nome,
        uf: 'XX',
        municipio: m.municipio,
        bairro: m.bairro,
        redes: [],
        tipoInferido: 'Hospital' as const,
        slug: `${m.id}-h`,
      }))
    );
    const shard = await loadShard('xx', makeMockFetch(indexFile, lookupFile));

    expect(searchInShard(shard, 'hospital')).toHaveLength(50);
    expect(searchInShard(shard, 'hospital', { limit: 10 })).toHaveLength(10);
  });

  it('hits ordenados desc por score', async () => {
    const indexFile = buildFixtureIndex(
      fixturePrestadores.map((p, i) => ({
        id: i,
        nome: p.nome,
        municipio: p.municipio,
        bairro: p.bairro,
      }))
    );
    const lookupFile = buildFixtureLookup(fixturePrestadores);
    const shard = await loadShard('xx', makeMockFetch(indexFile, lookupFile));

    const hits = searchInShard(shard, 'sao');
    for (let i = 0; i < hits.length - 1; i += 1) {
      expect(hits[i].score).toBeGreaterThanOrEqual(hits[i + 1].score);
    }
  });
});

describe('getPrestadorFromShard', () => {
  it('resolve id válido via lookup', async () => {
    const indexFile = buildFixtureIndex(
      fixturePrestadores.map((p, i) => ({
        id: i,
        nome: p.nome,
        municipio: p.municipio,
        bairro: p.bairro,
      }))
    );
    const lookupFile = buildFixtureLookup(fixturePrestadores);
    const shard = await loadShard('xx', makeMockFetch(indexFile, lookupFile));

    const prestador = getPrestadorFromShard(shard, 0);
    expect(prestador).not.toBeNull();
    expect(prestador?.codigo).toBe('100');
  });

  it('retorna null para id inexistente', async () => {
    const indexFile = buildFixtureIndex(
      fixturePrestadores.map((p, i) => ({
        id: i,
        nome: p.nome,
        municipio: p.municipio,
        bairro: p.bairro,
      }))
    );
    const lookupFile = buildFixtureLookup(fixturePrestadores);
    const shard = await loadShard('xx', makeMockFetch(indexFile, lookupFile));

    expect(getPrestadorFromShard(shard, 999)).toBeNull();
  });
});

describe('__clearShardCacheForTests', () => {
  it('próximo loadShard após clear refetcha', async () => {
    const indexFile = buildFixtureIndex(
      fixturePrestadores.map((p, i) => ({
        id: i,
        nome: p.nome,
        municipio: p.municipio,
        bairro: p.bairro,
      }))
    );
    const lookupFile = buildFixtureLookup(fixturePrestadores);
    const mockFetch = makeMockFetch(indexFile, lookupFile);

    await loadShard('xx', mockFetch);
    __clearShardCacheForTests();
    await loadShard('xx', mockFetch);

    expect(mockFetch).toHaveBeenCalledTimes(4); // 2 + 2 (refetch após clear)
  });
});
