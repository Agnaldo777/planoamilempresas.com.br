/**
 * Cliente de loading dos shards MiniSearch — Story 7.2 AC2.
 *
 * Helper isomorphic (client + server) para hidratar MiniSearch indices
 * pré-buildados em `src/data/operadoras/amil/minisearch/index/{ufSlug}.json`.
 *
 * Strategy de loading:
 *   - Cache em memória (Map<ufSlug, MiniSearch>) para evitar re-loading
 *   - Lookup data carregado em paralelo (lookup/{ufSlug}.json)
 *   - Failure isolada por UF (1 shard 404 não trava demais)
 *
 * Use cases:
 *   - <NetworkSearch /> client component dynamic import + loadShard
 *   - Tests usam fixture sem fetch real
 */

import MiniSearch from 'minisearch';

import type { PrestadorAmil } from '@/types/rede-credenciada-amil';

/**
 * Resultado do search dentro de um shard de UF.
 * `id` corresponde ao key do lookup map (sequencial 0..N dentro da UF).
 */
export interface ShardSearchHit {
  id: number;
  score: number;
  match: Record<string, string[]>;
  terms: string[];
}

/**
 * Shard hidratado em memória — pronto para search + retrieve.
 */
export interface ShardData {
  uf: string;
  ufSlug: string;
  geradoEm: string;
  totalPrestadores: number;
  miniSearch: MiniSearch;
  lookup: Record<number, PrestadorAmil>;
}

/**
 * Shape JSON dos arquivos pre-built (input).
 */
interface ShardIndexFile {
  uf: string;
  ufSlug: string;
  geradoEm: string;
  totalPrestadores: number;
  miniSearchIndex: object;
}

interface ShardLookupFile {
  uf: string;
  ufSlug: string;
  geradoEm: string;
  lookup: Record<string, PrestadorAmil>;
}

const cache = new Map<string, ShardData>();

/**
 * Reidrata MiniSearch index a partir do JSON pre-buildado.
 *
 * Configuração DEVE bater com `scripts/build-minisearch-index.mjs`
 * (fields, boost, fuzzy, prefix). Caso contrário, search retorna
 * resultados inconsistentes vs build-time.
 */
function rehydrateMiniSearch(indexJson: object): MiniSearch {
  return MiniSearch.loadJSON(JSON.stringify(indexJson), {
    fields: ['nome', 'municipio', 'bairro'],
    storeFields: ['id'],
    searchOptions: {
      boost: { nome: 2, municipio: 1.5, bairro: 1 },
      fuzzy: 0.2,
      prefix: true,
    },
  });
}

/**
 * Carrega + hidrata shard de uma UF (ex: 'sp', 'rj', 'df').
 *
 * Cache em memória — invocações múltiplas para mesma UF retornam mesma
 * instância. Use `clearShardCache()` em tests para isolar.
 *
 * `fetchFn` é injetável para tests (default: `globalThis.fetch`).
 *
 * @throws Error se shard não encontrada (404) ou JSON inválido.
 */
export async function loadShard(
  ufSlug: string,
  fetchFn: typeof fetch = fetch
): Promise<ShardData> {
  const slug = ufSlug.toLowerCase();
  const cached = cache.get(slug);
  if (cached) {
    return cached;
  }

  const [indexResp, lookupResp] = await Promise.all([
    fetchFn(`/data/operadoras/amil/minisearch/index/${slug}.json`),
    fetchFn(`/data/operadoras/amil/minisearch/lookup/${slug}.json`),
  ]);

  if (!indexResp.ok) {
    throw new Error(
      `Failed to load index shard for UF "${slug}": HTTP ${indexResp.status}`
    );
  }
  if (!lookupResp.ok) {
    throw new Error(
      `Failed to load lookup shard for UF "${slug}": HTTP ${lookupResp.status}`
    );
  }

  const indexFile = (await indexResp.json()) as ShardIndexFile;
  const lookupFile = (await lookupResp.json()) as ShardLookupFile;

  const miniSearch = rehydrateMiniSearch(indexFile.miniSearchIndex);

  // Convert lookup keys from string (JSON limitation) to number
  const lookupMap: Record<number, PrestadorAmil> = {};
  for (const [k, v] of Object.entries(lookupFile.lookup)) {
    lookupMap[Number(k)] = v;
  }

  const shard: ShardData = {
    uf: indexFile.uf,
    ufSlug: indexFile.ufSlug,
    geradoEm: indexFile.geradoEm,
    totalPrestadores: indexFile.totalPrestadores,
    miniSearch,
    lookup: lookupMap,
  };

  cache.set(slug, shard);
  return shard;
}

/**
 * Search dentro de um shard já carregado.
 *
 * Retorna IDs ordenados por relevância — caller resolve via `shard.lookup[id]`.
 */
export function searchInShard(
  shard: ShardData,
  query: string,
  options?: { limit?: number }
): readonly ShardSearchHit[] {
  const limit = options?.limit ?? 50;
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }
  const results = shard.miniSearch.search(trimmed) as Array<{
    id: number;
    score: number;
    match: Record<string, string[]>;
    terms: string[];
  }>;
  return results.slice(0, limit);
}

/**
 * Retrieve full prestador via lookup (post-search resolution).
 */
export function getPrestadorFromShard(
  shard: ShardData,
  id: number
): PrestadorAmil | null {
  return shard.lookup[id] ?? null;
}

/**
 * Limpa cache de shards. Usado APENAS em tests.
 *
 * @internal
 */
export function __clearShardCacheForTests(): void {
  cache.clear();
}
