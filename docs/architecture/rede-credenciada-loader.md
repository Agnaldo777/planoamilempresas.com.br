# Rede Credenciada Loader — Arquitetura SSOT

**Status:** Active · **Owner:** @dev (Dex) · **Última atualização:** 2026-04-29
**Stories:** 7.1 (foundation) · 7.1 v2 (migração legacy) · 7.10 (pipeline ETL)
**ADRs:** ADR-007 (Dataset SSOT) · ADR-005 (SSG Strategy) · ADR-010 (Search Engine)

---

## 1. Visão geral

Loader canônico **único** da rede credenciada Amil para o site SEO `planoamilempresas.com.br`.

```
src/lib/operadoras/amil/rede-credenciada-loader.ts   ← canonical (ÚNICO ponto de entrada)
src/types/rede-credenciada-amil.ts                    ← types canônicos
src/data/operadoras/amil/rede-credenciada.json        ← mirror do canon (ADR-007 SSOT)
data/rede-credenciada/rede-credenciada.json           ← fonte legada (lida por sitemap.ts + build-minisearch)
```

Substitui o loader legado `data/rede-credenciada/rede-amil.ts` (deprecado em Story 7.1 AC6, removido em Story 7.1 v2).

## 2. ADR-007 — SSOT enforcement

- **Canon:** `planodesaudepj/src/data/operadoras/amil/rede-credenciada.json` (hub multi-operadora — repo separado)
- **Mirror:** `planoamilempresas/src/data/operadoras/amil/rede-credenciada.json` (este repo) — sincronizado mensalmente via Story 7.10 (GitHub Actions cron)
- **Origem dos dados:** scrape Playwright do Power BI público Amil (script `scrape_powerbi_amil.js`)

### Regra de ouro

> Todos os imports de dados rede credenciada **DEVEM** passar por
> `@/lib/operadoras/amil/rede-credenciada-loader`. Nunca importar
> diretamente do JSON em código de aplicação.

Exceções aceitas (lê o JSON cru):
- `app/sitemap.ts` — só usa `geradoEm` para `lastmod`
- `scripts/build-minisearch-index.mjs` — script .mjs pré-build (não consome TS)

## 3. Cache em memória — singleton

```ts
let cache: LoaderCache | null = null;

function getCache(): LoaderCache {
  if (cache === null) {
    cache = buildCache();
  }
  return cache;
}
```

- O cache é construído **uma vez por worker** (build-time RSC SSG/ISR) no primeiro `get*()` chamado.
- `LoaderCache` é congelado depois — pré-computa **9 índices** (`byUf`, `byMunicipioSlug`, `byBairroSlug`, `byPrestadorSlug`, `byRede`, `byTipo`, etc.) para queries O(1).
- Dataset (9.325 prestadores, ~1.8 MB JSON) carregado e enriquecido **uma vez**; queries subsequentes batem no Map.
- `getAllPrestadores()` retorna **mesma referência** em chamadas consecutivas (asserção em testes).

### Reset apenas em testes

```ts
import { __resetCacheForTests } from '@/lib/operadoras/amil/rede-credenciada-loader';

afterEach(() => {
  __resetCacheForTests();
});
```

Não exportar como API pública em produção.

## 4. API pública (14 helpers)

| Helper | Retorno | Uso |
|--------|---------|-----|
| `getAllPrestadores()` | `readonly PrestadorAmil[]` | Lista enriquecida (raw + tipoInferido + slug) |
| `getMunicipios()` | `readonly MunicipioRedeAmil[]` | UF×município ordenado desc |
| `getMunicipioBySlug(uf, cidade)` | `MunicipioRedeAmil \| null` | Resolve par de slugs |
| `getPrestadoresPorMunicipio(uf, cidade)` | `readonly PrestadorAmil[]` | Lista por município |
| `getPrestadoresPorBairro(uf, cidade, bairro)` | `readonly PrestadorAmil[]` | Story 7.6 bipartite filter |
| `getMunicipiosByUf(uf)` | `readonly MunicipioRedeAmil[]` | Todos municípios da UF |
| `getTopMunicipios(limit)` | `readonly MunicipioRedeAmil[]` | Top-N por contagem |
| `getBairrosDoMunicipio(prestadores)` | `readonly { bairro, total }[]` | Agregação dinâmica |
| `getPrestadoresPorRede(rede)` | `readonly PrestadorAmil[]` | Cluster E (Story 7.7) |
| `getPrestadoresPorTipo(tipo)` | `readonly PrestadorAmil[]` | Story 7.8 (tipo×UF×município) |
| `getEstatisticasRede()` | `EstatisticasRede` | Hub stats dataset-driven |
| `getEstatisticasByUF(uf)` | `EstatisticasUFAmil` | Story 7.5 (página-cidade) |
| `getPrestadorBySlug(uf, cidade, slug)` | `PrestadorAmil \| null` | Story 7.4 SSG |
| `prestadorSlug(p)` | `string` | Acessor canônico |
| `getDatasetMetadata()` | `{ geradoEm, fonte, ... }` | Validação de pipeline |

Re-exporta tipos: `PrestadorAmil`, `PrestadorAmilRaw`, `RedeAmilNome`, `TipoAtendimentoInferido`, `MunicipioRedeAmil`, `EstatisticasRede`, `EstatisticasUFAmil`, `DatasetRedeAmil`, `REDES_AMIL_ATIVAS`.

## 5. Validações de boot

```ts
function loadDataset(): DatasetRedeAmil {
  if (!isDatasetRedeAmil(datasetRaw)) {
    throw new Error('Failed to load rede-credenciada dataset: shape inválido. ...');
  }

  const slugCoverage = validateRedeSlugsCoverage();
  if (!slugCoverage.ok) {
    throw new Error(`Failed to load rede-credenciada slugs: drift entre RedeAmilNome e REDE_SLUGS. ...`);
  }

  return datasetRaw;
}
```

- **Type guard** runtime contra dataset corrompido (drift hub→mirror).
- **Slug coverage** invariante — falha se `RedeAmilNome` (11 redes) drifta de `REDE_SLUGS` em `slugs.ts`.
- Erros de shape causam **fail fast** no build, não silently undefined em runtime das páginas.

## 6. Como atualizar dataset (mensal)

1. **Hub canon:** ETL externo (`scrape_powerbi_amil.js`) sobrescreve `planodesaudepj/src/data/operadoras/amil/rede-credenciada.json` com snapshot novo do Power BI Amil.
2. **Pipeline Story 7.10:** GitHub Actions cron (mensal) abre auto-PR sincronizando o canon → mirror neste repo (`planoamilempresas/src/data/operadoras/amil/rede-credenciada.json` + `data/rede-credenciada/rede-credenciada.json`).
3. **CI gate:** typecheck + tests + `audit:rede` validam que o dataset novo não quebra invariantes (totals, redes ativas, etc.).
4. **Detecção pelo loader:** `getDatasetMetadata().geradoEm` reflete `dataset.geradoEm` automaticamente. Sitemap.ts usa para `lastmod`.

## 7. Como adicionar novas operadoras (Bradesco, SulAmérica)

Pattern modular `src/lib/operadoras/[op]/`:

```
src/lib/operadoras/
├── amil/
│   ├── rede-credenciada-loader.ts      ← este loader
│   ├── slugs.ts
│   ├── chunked-static-params.ts
│   └── sub-redes-helpers.ts
├── bradesco/                            ← futuro
│   ├── rede-credenciada-loader.ts
│   └── slugs.ts
└── sulamerica/                          ← futuro
    └── rede-credenciada-loader.ts
```

Cada operadora terá:
- Dataset próprio em `src/data/operadoras/[op]/rede-credenciada.json`
- Types em `src/types/rede-credenciada-[op].ts`
- Loader com cache singleton independente

Convenção: helpers públicos com mesma assinatura (`getAllPrestadores`, `getEstatisticasRede`, etc.) → swap drop-in em páginas multi-operadora.

## 8. Performance

- Boot do worker: ~150-300ms para parse JSON + build cache (9.325 entries × 8 índices).
- Queries pós-cache: O(1) Map lookups ou O(n) filtragens linear sobre array imutável.
- Build full SSG (`BUILD_FULL_PROVIDERS=true`): cache reutilizado entre as 7.166-9.325 páginas geradas.
- Memory footprint runtime: ~30-50 MB (dataset + índices + slugs).

## 9. Testes

- `src/lib/operadoras/amil/__tests__/rede-credenciada-loader.test.ts` — vitest, 14 helpers + slugify + inferTipoAtendimento + cache singleton (45+ assertions).
- `src/lib/operadoras/amil/__tests__/sub-redes-helpers.test.mjs` — node:test, 11 testes contra dataset real.
- `src/lib/operadoras/amil/__tests__/chunked-static-params.test.mjs` — node:test, 10+ testes Phase 1 / Phase 2 / MVP cap.

## 10. Histórico de migração

| Data | Story | Mudança |
|------|-------|---------|
| 2026-04-26 | 7.1 | Loader canônico criado em `src/lib/operadoras/amil/` (paralelo ao legacy) |
| 2026-04-28 | 7.1 AC6 | Legacy `data/rede-credenciada/rede-amil.ts` marcado `@deprecated` |
| 2026-04-29 | 7.1 v2 | Migração completa: 7 imports refatorados; legacy deletado; doc criado |

## 11. TODOs

- **Aria:** validar pattern `src/lib/operadoras/[op]/` em ADR formal (ADR-011?) antes de adicionar Bradesco/SulAmérica.
- **Pax:** confirmar que story 7.1 v2 foi atendida (legacy excluído + zero imports remanescentes) e fechar gate `7.1-schema-loader-gate.yaml`.
