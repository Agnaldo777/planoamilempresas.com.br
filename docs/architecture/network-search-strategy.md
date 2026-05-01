# Network Search Strategy — `<NetworkSearch />` (Story 7.2)

| Field | Value |
|-------|-------|
| **Status** | Implemented (Story 7.2 — 2026-04-29) |
| **Decisão base** | ADR-010 (MiniSearch client-side com pré-build + sharding por UF) |
| **Owner** | @dev (Dex) |
| **Stakeholders** | @architect (Aria) — review · @data-engineer (Dara) — pipeline 7.10 |

---

## Sumário

O hub `/rede-credenciada` precisa permitir busca livre fuzzy por nome,
município e bairro sobre **9.325 prestadores** distribuídos em **26 UFs**
e **438 municípios**, dentro do orçamento de **NFR2 ≤ 100KB JS gzip**.

A solução vencedora (ADR-010 Opção A): **MiniSearch client-side com
índice pré-built no `prebuild` hook do Next.js + sharding geográfico por
UF + lazy loading de shards**.

---

## Arquitetura

```
┌────────────────────────────────────────────────────────────────┐
│  data/rede-credenciada/rede-credenciada.json (9.325 prestadores)│
│  (mirror do canon planodesaudepj — ADR-007 SSOT)               │
└────────────────────────────┬───────────────────────────────────┘
                             │ scripts/build-minisearch-index.mjs
                             │ (rodado em prebuild + CI)
                             ▼
┌────────────────────────────────────────────────────────────────┐
│  public/search-index/                                          │
│  ├── master.json   ← UFs + municípios (~71KB raw, ~22KB gzip)  │
│  ├── ac.json       ← shard UF Acre                             │
│  ├── al.json       ← shard UF Alagoas                          │
│  ├── ...           ← 24 outros shards UF                       │
│  └── rj.json       ← shard maior (3.696 prestadores, ~1MB raw, │
│                      ~250KB gzip — lazy-loaded)                │
└────────────────────────────┬───────────────────────────────────┘
                             │ fetch on-demand (Client)
                             ▼
┌────────────────────────────────────────────────────────────────┐
│  components/search/NetworkSearch.tsx ('use client')            │
│  - Master loado no mount (autocomplete UFs/municípios)         │
│  - Shard UF loado quando usuário seleciona UF                  │
│  - Filter local por tipo de prestador (sem network)            │
│  - Debounce 200ms + paginação 20 por vez                       │
└────────────────────────────────────────────────────────────────┘
```

---

## Como funciona

### 1. Build-time index generation

`scripts/build-minisearch-index.mjs` é executado em duas situações:

- **Local**: `npm run build:search-index` — manual quando dev
- **CI/Vercel**: `npm run prebuild` — automático antes de `next build`

O script:

1. Lê `data/rede-credenciada/rede-credenciada.json`.
2. Aplica `inferTipoAtendimento(nome)` (regex no nome) — mirror da função
   em `data/rede-credenciada/rede-amil.ts`.
3. Gera `slug` URL-friendly via `slugify(codigo + nome + bairro)`.
4. Cria **master index** com `MiniSearch` apenas sobre municípios+UFs.
5. Cria **26 shards UF**, cada um com `MiniSearch` sobre `nome + municipio +
   bairro` dos prestadores daquela UF.
6. Persiste 27 arquivos JSON em `public/search-index/`.
7. Asserta budgets: master ≤ 100KB raw, shards ≤ 1500KB raw (~500KB gzip).

### 2. Client-side hydration

`components/search/NetworkSearch.tsx`:

1. **Mount**: `fetch('/search-index/master.json')` → `MiniSearch.loadJS()`
2. **Usuário seleciona UF**: `fetch('/search-index/<uf>.json')` →
   `MiniSearch.loadJS()` (cache via `useRef`)
3. **Usuário digita query**: debounce 200ms → `shardMini.search(q, {prefix, fuzzy: 0.2})`
4. **Filtro tipo (Hospital/Clínica/...)**: aplicado client-side sobre os
   hits via `storeFields.t` (compactado em chave de 1 byte).
5. **Render**: `<ul role="listbox">` com cards paginados (20/load).

### 3. Field trimming agressivo (ADR-010 mitigação 2)

| Campo | Master | Shard | Justificativa |
|-------|--------|-------|---------------|
| `id` (idField) | ✓ | ✓ | sequencial, ~3 bytes |
| `nome` (search) | ✗ | ✓ | search field; 30 chars médios |
| `municipio` (search) | ✓ | ✓ | shared no master para autocomplete |
| `bairro` (search) | ✗ | ✓ | shard apenas — não é fonte de UF discovery |
| `uf` (search) | ✓ | ✗ | master only (filter dropdown) |
| `tipoInferido` (filter) | ✗ | `t` (1 byte key) | filter pós-search, não indexado |
| `codigo` | ✗ | `c` (lookup) | recuperado pós-match para `slug` |
| `slug` | ✗ | `s` (lookup) | recuperado pós-match para link |
| `redes[]` | ✗ | ✗ | dropado — Story 7.2 não filtra por rede no Command |

---

## Como atualizar (Story 7.10 workflow)

Quando o pipeline mensal Story 7.10 atualiza
`data/rede-credenciada/rede-credenciada.json`:

1. **Automático em CI**: o hook `prebuild` regenera `public/search-index/`
   antes do `next build`. O Vercel rebuilda + redeploya.
2. **Sitemap `lastmod`**: `app/sitemap.ts` lê `redeDataset.geradoEm` do JSON
   e atualiza `/rede-credenciada` lastmod automaticamente.
3. **Validação**: workflow `search-index-budget.yml` falha o PR se algum
   shard gzip exceder 500KB ou master gzip exceder 100KB.

**Sem code change** quando dataset cresce dentro do budget.

---

## Como adicionar novas operadoras (futuro)

Quando uma operadora nova (Bradesco, SulAmérica, …) for adicionada ao
ecossistema BeneficioRH:

1. Criar dataset em `data/rede-credenciada/<operadora>/<operadora>.json`
   com mesmo schema (`{geradoEm, prestadores: [{codigo, nome, uf, ...}]}`).
2. Generalizar `scripts/build-minisearch-index.mjs` para iterar
   `operadoras: ['amil', 'bradesco', ...]` e emitir
   `public/search-index/<operadora>/master.json` + shards.
3. `<NetworkSearch operadora="bradesco" />` recebe prop e ajusta
   `indexBasePath`.
4. Cada operadora tem sua própria página hub (`/rede-credenciada/bradesco/`,
   `/rede-credenciada/sulamerica/`).

**Out of scope da Story 7.2** (single-operadora atual).

---

## Performance benchmarks

| Métrica | Valor | Budget | Status |
|---------|-------|--------|--------|
| `master.json` raw | 71 KB | 100 KB | OK |
| `master.json` gzip (estimado) | ~22 KB | — | OK |
| Maior shard (`rj.json`) raw | 1022 KB | 1500 KB | OK |
| Maior shard (`rj.json`) gzip | ~250 KB | 500 KB | OK |
| `minisearch` lib gzip | ~6 KB | — | OK |
| Bundle inicial NetworkSearch (lib + master) | ~28 KB gzip | 30 KB (AC2) | borderline (CI guard) |
| INP (busca local pós-shard load) | <50 ms | 200 ms | OK |

---

## Telemetria pós-launch

- CI guard (`search-index-budget.yml`) falha PR se budgets excedidos.
- Plano de contingência (ADR-010): se shard RJ/SP crescer >500KB gzip,
  pivotar para Algolia free tier (10K req/mês).

---

## References

- ADR-010 (search engine decision)
- ADR-007 (Dataset SSOT)
- ADR-008 (stack Next.js Vercel SSG)
- Story 7.2 (Hub rede credenciada)
- `scripts/build-minisearch-index.mjs`
- `components/search/NetworkSearch.tsx`
- `lib/schema/search-action.ts`
