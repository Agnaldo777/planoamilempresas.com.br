'use client';

/**
 * <NetworkSearch /> — Story 7.2 / ADR-010
 *
 * Client Component (única ilha JS do hub `/rede-credenciada`) que oferece
 * busca livre fuzzy sobre a rede credenciada Amil (9.325 prestadores).
 *
 * Estratégia (ADR-010 Opção A):
 *   1. **Master index** (`/search-index/master.json`) carregado no mount —
 *      contém municípios + UFs para autocomplete inicial.
 *   2. **Shards UF** (`/search-index/<uf>.json`) carregados sob demanda
 *      ao usuário selecionar UF — evita 9.325 entries de uma vez.
 *   3. **Debounce 200ms** + state local React (sem libraries externas).
 *   4. **WCAG AA combobox**: `role="combobox"`, `aria-autocomplete="list"`,
 *      `aria-expanded`, `aria-controls`, live region com count.
 *
 * Inputs:
 *   - URL `?q=` pré-popula a query (SearchAction integration).
 *
 * Outputs:
 *   - Lista paginada (20 por vez) com nome, município, bairro, tipo.
 *   - Link `/rede/[uf]/[municipio]/[prestadorSlug]` (placeholder até Story 7.4).
 *
 * Performance:
 *   - Master payload ~71 KB (compresses a ~22 KB gzip).
 *   - MiniSearch lib ~6 KB gzip.
 *   - Total bundle inicial estimado ~28-32 KB gzip (próximo ao budget AC2).
 *
 * Owner: @dev (Dex) · 2026-04-29
 */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import MiniSearch from 'minisearch';

// ──────────────────────────────────────────────────────────────────────
// Types — payloads servidos por public/search-index/
// ──────────────────────────────────────────────────────────────────────

interface MunicipioMaster {
  uf: string;
  municipio: string;
  total: number;
}

interface MasterPayload {
  version: number;
  geradoEm: string;
  totalPrestadores: number;
  ufs: string[];
  municipios: MunicipioMaster[];
  miniSearchIndex: unknown;
}

interface ShardLookupEntry {
  id: number;
  c: string; // codigo
  s: string; // slug
}

interface ShardPayload {
  version: number;
  uf: string;
  total: number;
  lookup: ShardLookupEntry[];
  miniSearchIndex: unknown;
}

interface SearchHit {
  codigo: string;
  nome: string;
  uf: string;
  municipio: string;
  bairro: string;
  tipo: string;
  slug: string;
}

const TIPOS = [
  'Hospital',
  'Pronto-Socorro',
  'Maternidade',
  'Clínica',
  'Laboratório',
  'Diagnóstico por Imagem',
  'Odontologia',
  'Centro/Instituto',
] as const;

type TipoFiltro = (typeof TIPOS)[number] | 'Todos';

const PAGE_SIZE = 20;
const DEBOUNCE_MS = 200;

const MINISEARCH_OPTIONS_SHARD = {
  fields: ['nome', 'municipio', 'bairro'],
  storeFields: ['n', 'm', 'b', 't'],
  idField: 'id',
  searchOptions: {
    boost: { nome: 3, municipio: 2 },
    prefix: true,
    fuzzy: 0.2,
  },
};

// ──────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────

interface NetworkSearchProps {
  /** Path raiz para o cards de detalhes de prestador (placeholder até 7.4). */
  prestadorBasePath?: string;
  /** Caminho de servir os índices estáticos. Default `/search-index`. */
  indexBasePath?: string;
}

export function NetworkSearch({
  prestadorBasePath = '/rede',
  indexBasePath = '/search-index',
}: NetworkSearchProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') ?? '';

  // Estado UI
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedUf, setSelectedUf] = useState<string>('');
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('Todos');
  const [page, setPage] = useState(0);

  // Estado dos índices
  const [master, setMaster] = useState<MasterPayload | null>(null);
  const [masterError, setMasterError] = useState<string | null>(null);
  const [shard, setShard] = useState<ShardPayload | null>(null);
  const [shardLoading, setShardLoading] = useState(false);
  const [shardError, setShardError] = useState<string | null>(null);

  // Refs aos índices MiniSearch (evita reidratar em cada keystroke)
  const masterMiniRef = useRef<MiniSearch | null>(null);
  const shardMiniRef = useRef<MiniSearch | null>(null);
  const shardLookupRef = useRef<Map<number, ShardLookupEntry>>(new Map());

  // IDs para WCAG combobox
  const inputId = useId();
  const listboxId = useId();
  const liveRegionId = useId();

  // ─── Carregamento do master ───
  useEffect(() => {
    let cancelled = false;
    const url = `${indexBasePath}/master.json`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<MasterPayload>;
      })
      .then((data) => {
        if (cancelled) return;
        masterMiniRef.current = MiniSearch.loadJS(
          data.miniSearchIndex as Parameters<typeof MiniSearch.loadJS>[0],
          {
            fields: ['municipio', 'uf'],
            storeFields: ['uf', 'municipio', 'total'],
            idField: 'id',
            searchOptions: { boost: { municipio: 2 }, prefix: true, fuzzy: 0.2 },
          },
        );
        setMaster(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setMasterError(err instanceof Error ? err.message : 'erro desconhecido');
      });
    return () => {
      cancelled = true;
    };
  }, [indexBasePath]);

  // ─── Carregamento do shard UF ───
  useEffect(() => {
    if (!selectedUf) {
      setShard(null);
      shardMiniRef.current = null;
      shardLookupRef.current.clear();
      return;
    }
    let cancelled = false;
    setShardLoading(true);
    setShardError(null);
    const url = `${indexBasePath}/${selectedUf.toLowerCase()}.json`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<ShardPayload>;
      })
      .then((data) => {
        if (cancelled) return;
        shardMiniRef.current = MiniSearch.loadJS(
          data.miniSearchIndex as Parameters<typeof MiniSearch.loadJS>[0],
          MINISEARCH_OPTIONS_SHARD,
        );
        const lookup = new Map<number, ShardLookupEntry>();
        for (const entry of data.lookup) {
          lookup.set(entry.id, entry);
        }
        shardLookupRef.current = lookup;
        setShard(data);
        setShardLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setShardError(err instanceof Error ? err.message : 'erro desconhecido');
        setShardLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedUf, indexBasePath]);

  // ─── Debounce da query ───
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(0);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  // ─── Resultados (memoized) ───
  const results = useMemo<SearchHit[]>(() => {
    if (!master) return [];
    const trimmed = debouncedQuery.trim();

    // Sem UF selecionada e sem query = empty (UI orienta usuário)
    if (!selectedUf && !trimmed) return [];

    // Sem UF mas com query: buscar municípios no master para sugerir
    // (autocomplete) — não retorna prestadores ainda (precisa shard).
    if (!selectedUf) {
      return [];
    }

    if (!shard || !shardMiniRef.current) return [];

    interface RawHit {
      id: number;
      n?: string;
      m?: string;
      b?: string;
      t?: string;
    }

    let hits: RawHit[];
    if (trimmed.length === 0) {
      // Sem query: lista todos do shard, ordenado por nome
      const lookup = shardLookupRef.current;
      hits = Array.from(lookup.keys())
        .slice(0, 500) // cap defensivo p/ não travar render
        .map((id) => {
          // Recuperar via MiniSearch.getStoredFields seria ideal, mas
          // a API pública não expõe iteração; fazemos search vazia.
          return { id } as RawHit;
        });
      // Para query vazia, recorremos a search('') — minisearch retorna [].
      // Workaround: search por wildcard usando primeiros caracteres do
      // município mais comum não escala. Em vez disso, lemos via getStoredFields:
      const out: RawHit[] = [];
      for (const id of lookup.keys()) {
        const stored = shardMiniRef.current.getStoredFields(id) as
          | RawHit
          | undefined;
        if (stored) out.push({ ...stored, id });
        if (out.length >= 500) break;
      }
      hits = out;
    } else {
      const rawSearch = shardMiniRef.current.search(trimmed, {
        prefix: true,
        fuzzy: 0.2,
        boost: { nome: 3, municipio: 2 },
      });
      hits = rawSearch as unknown as RawHit[];
    }

    // Filtro tipo
    const filteredByTipo =
      tipoFiltro === 'Todos' ? hits : hits.filter((h) => h.t === tipoFiltro);

    // Map para SearchHit completo
    const lookup = shardLookupRef.current;
    return filteredByTipo
      .map<SearchHit | null>((h) => {
        const meta = lookup.get(h.id);
        if (!meta) return null;
        return {
          codigo: meta.c,
          slug: meta.s,
          nome: h.n ?? '',
          municipio: h.m ?? '',
          bairro: h.b ?? '',
          tipo: h.t ?? 'Outro',
          uf: shard.uf,
        };
      })
      .filter((x): x is SearchHit => x !== null);
  }, [master, shard, selectedUf, debouncedQuery, tipoFiltro]);

  const paginated = useMemo(
    () => results.slice(0, (page + 1) * PAGE_SIZE),
    [results, page],
  );

  const totalText = useMemo(() => {
    if (!selectedUf) {
      return master
        ? `${master.totalPrestadores.toLocaleString('pt-BR')} prestadores em 26 UFs. Selecione uma UF para começar.`
        : 'Carregando rede credenciada...';
    }
    if (shardLoading) return `Carregando prestadores de ${selectedUf}...`;
    if (shardError)
      return `Erro ao carregar prestadores de ${selectedUf}: ${shardError}`;
    return `${results.length.toLocaleString('pt-BR')} prestadores encontrados em ${selectedUf}${
      debouncedQuery.trim() ? ` para "${debouncedQuery.trim()}"` : ''
    }${tipoFiltro !== 'Todos' ? ` (${tipoFiltro})` : ''}.`;
  }, [
    master,
    selectedUf,
    shardLoading,
    shardError,
    results.length,
    debouncedQuery,
    tipoFiltro,
  ]);

  // ─── Handlers ───
  const onQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const onUfChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUf(e.target.value);
    setPage(0);
  }, []);

  const onTipoChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setTipoFiltro(e.target.value as TipoFiltro);
    setPage(0);
  }, []);

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDebouncedQuery(query);
  }, [query]);

  const onLoadMore = useCallback(() => setPage((p) => p + 1), []);

  // ─── Render ───
  return (
    <section
      aria-label="Busca da rede credenciada Amil"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="mb-3 text-xs text-slate-500">
        Aviso: BeneficioRH é corretora autorizada SUSEP 201054484. Amil é marca
        registrada da operadora. Consulte sempre o site oficial Amil para
        confirmar credenciamento.
      </p>

      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-12">
        <div className="md:col-span-6">
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-900"
          >
            Buscar prestador, município ou bairro
          </label>
          <input
            id={inputId}
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={paginated.length > 0}
            aria-describedby={liveRegionId}
            placeholder="Ex: Albert Einstein, Copacabana, Hospital"
            value={query}
            onChange={onQueryChange}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="md:col-span-3">
          <label
            htmlFor={`${inputId}-uf`}
            className="block text-sm font-medium text-slate-900"
          >
            UF
          </label>
          <select
            id={`${inputId}-uf`}
            value={selectedUf}
            onChange={onUfChange}
            disabled={!master}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:bg-slate-100"
          >
            <option value="">Selecione...</option>
            {master?.ufs.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <label
            htmlFor={`${inputId}-tipo`}
            className="block text-sm font-medium text-slate-900"
          >
            Tipo
          </label>
          <select
            id={`${inputId}-tipo`}
            value={tipoFiltro}
            onChange={onTipoChange}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="Todos">Todos</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </form>

      <p
        id={liveRegionId}
        role="status"
        aria-live="polite"
        className="mt-4 text-sm text-slate-600"
      >
        {masterError ? `Erro: ${masterError}` : totalText}
      </p>

      <ul
        id={listboxId}
        role="listbox"
        aria-label="Resultados da busca"
        className="mt-4 grid gap-3 md:grid-cols-2"
      >
        {paginated.map((hit) => (
          <li
            key={`${hit.uf}-${hit.codigo}-${hit.slug}`}
            role="option"
            aria-selected="false"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-teal-600"
          >
            <Link
              href={`${prestadorBasePath}/${hit.uf.toLowerCase()}/${slugifyClient(hit.municipio)}/${hit.slug}`}
              className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              <p className="text-sm font-semibold text-slate-900">{hit.nome}</p>
              <p className="mt-1 text-xs text-slate-600">
                {hit.bairro ? `${hit.bairro} · ` : ''}
                {hit.municipio} / {hit.uf}
              </p>
              <span className="mt-2 inline-block rounded-full bg-sky-600/10 px-2 py-0.5 text-xs font-medium text-sky-600">
                {hit.tipo}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {selectedUf && !shardLoading && results.length === 0 && (
        <p className="mt-4 rounded-md bg-amber-700/10 px-4 py-3 text-sm text-amber-700">
          Nenhum prestador encontrado para os filtros atuais.
        </p>
      )}

      {paginated.length < results.length && (
        <button
          type="button"
          onClick={onLoadMore}
          className="mt-4 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          Ver mais ({results.length - paginated.length} restantes)
        </button>
      )}
    </section>
  );
}

function slugifyClient(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
