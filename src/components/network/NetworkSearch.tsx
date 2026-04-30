'use client';

/**
 * `<NetworkSearch />` — Story 7.2 AC2/AC3/AC9.
 *
 * Client Component orquestrador da busca da rede credenciada Amil.
 * Carrega shards MiniSearch dinamicamente por UF, faz search com debounce,
 * aplica filtros (tipo + rede), exibe resultados via NetworkResultCard.
 *
 * Composição:
 *   - state: query (debounced), selectedUf, selectedTipos, selectedRede,
 *     loading, error, results
 *   - efeitos: load shard ao mudar UF, search ao mudar query+filters
 *   - subcomponentes: NetworkAdvancedFilters, NetworkResultCard
 *   - a11y: live region (role=status aria-live=polite) anuncia count
 *
 * AC2 — bundle budget ≤30KB para chunk NetworkSearch:
 *   MiniSearch é dynamic import (não conta no bundle inicial) e shards
 *   são fetched on-demand. Bundle do componente em si é ~5-8KB gzip.
 *
 * AC9 — a11y WCAG AA:
 *   - aria-autocomplete="list" no input
 *   - aria-controls aponta para listbox de resultados
 *   - live region anuncia count após cada search
 *   - foco visível em todos controles
 *   - debounce 120ms + useDeferredValue para INP ≤200ms
 */

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';

import { NetworkAdvancedFilters } from '@/components/network/NetworkAdvancedFilters';
import { NetworkResultCard } from '@/components/network/NetworkResultCard';
import {
  getPrestadorFromShard,
  loadShard,
  searchInShard,
  type ShardData,
} from '@/lib/operadoras/amil/minisearch-client';
import type {
  PrestadorAmil,
  RedeAmilNome,
  TipoAtendimentoInferido,
} from '@/types/rede-credenciada-amil';

interface NetworkSearchProps {
  /**
   * Lista de UFs disponíveis (em ordem alfabética). Default ['SP', 'RJ', 'DF', 'PR', 'MG'].
   * Componente precisa saber que UFs existem para renderizar o seletor.
   */
  availableUfs?: readonly string[];
  /**
   * UF default para busca inicial. Default 'SP' (maior mercado pós-RJ).
   */
  defaultUf?: string;
  /**
   * Limite de resultados visíveis. Default 25 (FE Spec linha 763).
   */
  resultsLimit?: number;
}

const DEFAULT_AVAILABLE_UFS = [
  'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG',
  'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO',
  'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
] as const;

const DEBOUNCE_MS = 120;

export function NetworkSearch({
  availableUfs = DEFAULT_AVAILABLE_UFS,
  defaultUf = 'SP',
  resultsLimit = 25,
}: NetworkSearchProps = {}): ReactElement {
  const [query, setQuery] = useState('');
  const [selectedUf, setSelectedUf] = useState(defaultUf);
  const [selectedTipos, setSelectedTipos] = useState<readonly TipoAtendimentoInferido[]>([]);
  const [selectedRede, setSelectedRede] = useState<RedeAmilNome | null>(null);
  const [shard, setShard] = useState<ShardData | null>(null);
  const [loadingShard, setLoadingShard] = useState(false);
  const [shardError, setShardError] = useState<string | null>(null);

  const deferredQuery = useDeferredValue(query);
  const debouncedQueryRef = useRef(query);

  // Debounce: só atualiza debouncedQuery após DEBOUNCE_MS sem mudança
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(deferredQuery);
      debouncedQueryRef.current = deferredQuery;
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [deferredQuery]);

  // Load shard quando UF muda
  useEffect(() => {
    let cancelled = false;
    setLoadingShard(true);
    setShardError(null);
    loadShard(selectedUf.toLowerCase())
      .then((s) => {
        if (!cancelled) {
          setShard(s);
          setLoadingShard(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setShardError(err.message);
          setLoadingShard(false);
          setShard(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedUf]);

  // Search + filters → results
  const results = useMemo<readonly PrestadorAmil[]>(() => {
    if (!shard) return [];
    const trimmed = debouncedQuery.trim();
    if (trimmed.length === 0) {
      // Sem query: lista filtrada apenas (todos da UF, primeiros N)
      const allFromShard = Object.values(shard.lookup);
      return applyFilters(allFromShard, selectedTipos, selectedRede).slice(0, resultsLimit);
    }
    if (trimmed.length < 2) {
      return [];
    }
    const hits = searchInShard(shard, trimmed, { limit: resultsLimit * 2 });
    const prestadores = hits
      .map((hit) => getPrestadorFromShard(shard, hit.id))
      .filter((p): p is PrestadorAmil => p !== null);
    return applyFilters(prestadores, selectedTipos, selectedRede).slice(0, resultsLimit);
  }, [shard, debouncedQuery, selectedTipos, selectedRede, resultsLimit]);

  function handleTipoChange(tipo: TipoAtendimentoInferido): void {
    setSelectedTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  }

  return (
    <section
      aria-labelledby="network-search-heading"
      className="my-8"
      data-testid="network-search"
    >
      <h2 id="network-search-heading" className="sr-only">
        Busca da rede credenciada Amil
      </h2>

      <div className="grid gap-4 md:grid-cols-[200px_1fr]">
        <div>
          <label htmlFor="network-search-uf" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="network-search-uf"
            value={selectedUf}
            onChange={(e) => setSelectedUf(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amil-blue focus:outline-none focus:ring-2 focus:ring-amil-blue/20"
            data-testid="network-search-uf"
            aria-label="Selecionar estado"
          >
            {availableUfs.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="network-search-input" className="block text-sm font-medium text-gray-700">
            Buscar prestador, cidade ou bairro
          </label>
          <input
            id="network-search-input"
            type="search"
            role="combobox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-autocomplete="list"
            aria-controls="network-search-results"
            aria-expanded={results.length > 0}
            aria-busy={loadingShard}
            placeholder="Ex.: Hospital São Lucas, Copacabana, Jardim Paulista..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amil-blue focus:outline-none focus:ring-2 focus:ring-amil-blue/20"
            data-testid="network-search-input"
          />
        </div>
      </div>

      <NetworkAdvancedFilters
        selectedTipos={selectedTipos}
        selectedRede={selectedRede}
        onTipoChange={handleTipoChange}
        onRedeChange={setSelectedRede}
      />

      {/* Live region — anuncia count para leitores de tela */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="network-search-live-region"
      >
        {loadingShard
          ? `Carregando rede credenciada de ${selectedUf}...`
          : shardError
            ? `Erro ao carregar rede: ${shardError}`
            : `${results.length} prestadores encontrados em ${selectedUf}`}
      </div>

      {/* UI feedback */}
      {loadingShard && (
        <p className="my-4 text-sm text-gray-600" aria-hidden="true">
          Carregando rede credenciada de {selectedUf}...
        </p>
      )}
      {shardError && (
        <p className="my-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800" aria-hidden="true">
          ⚠️ Erro ao carregar dados da {selectedUf}: {shardError}
        </p>
      )}

      <ul
        id="network-search-results"
        role="listbox"
        aria-label={`Resultados da busca em ${selectedUf}`}
        className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3"
        data-testid="network-search-results"
      >
        {results.map((prestador) => (
          <li key={`${prestador.codigo}-${prestador.slug}`} role="option" aria-selected="false">
            <NetworkResultCard prestador={prestador} maxRedeChips={3} />
          </li>
        ))}
      </ul>

      {!loadingShard && !shardError && results.length === 0 && debouncedQuery.trim().length >= 2 && (
        <p className="my-8 text-center text-sm text-gray-600">
          Nenhum prestador encontrado para &ldquo;{debouncedQuery}&rdquo; em {selectedUf}.
          Tente outros termos ou troque o estado.
        </p>
      )}
    </section>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────

function applyFilters(
  prestadores: readonly PrestadorAmil[],
  selectedTipos: readonly TipoAtendimentoInferido[],
  selectedRede: RedeAmilNome | null
): PrestadorAmil[] {
  return prestadores.filter((p) => {
    if (selectedTipos.length > 0 && !selectedTipos.includes(p.tipoInferido)) {
      return false;
    }
    if (selectedRede !== null && !p.redes.includes(selectedRede)) {
      return false;
    }
    return true;
  });
}
