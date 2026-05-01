# ADR-010: Search Engine para Hub `/rede-credenciada/` (9.325 prestadores)

| Field | Value |
|-------|-------|
| **Status** | ✅ **Accepted** — co-signed pelo stakeholder em 2026-04-29 |
| **Story** | 7.2 (Hub `/rede-credenciada` + `<NetworkSearch />`) |
| **Date** | 2026-04-27 (proposto) · 2026-04-29 (aceito) |
| **Decider** | Agnaldo Silva (stakeholder) + @architect (Aria) — co-sign |
| **Author** | @dev (Dex) |
| **Co-sign** | Agnaldo Silva (stakeholder) — 2026-04-29 via decisão registrada em chat (escolha "B" autorizando MiniSearch + Story 7.2 completa) |
| **Related** | ADR-005 (depth strategy), ADR-007 (Dataset SSOT) |

---

## Contexto

Story 7.2 entrega o hub `/rede-credenciada/` — porta de entrada de toda a rede credenciada Amil (9.325 prestadores · 26 UFs · 438 municípios). O componente `<NetworkSearch />` precisa permitir busca livre por:

- **Cidade** (438 municípios distintos)
- **Bairro** (~1.687 combinações UF×município×bairro)
- **Nome de prestador** (9.325 entries)
- **Filtros adicionais:** UF, tipo de prestador (8 categorias), rede Amil (11 ativas)

### Restrições

| Restrição | Origem |
|-----------|--------|
| Bundle JS total ≤ 100KB gzip | NFR2 |
| Index search ≤ 30KB gzip (do bundle total) | Story 7.2 AC2 |
| LCP ≤ 2.0s (mobile) | NFR1 |
| INP ≤ 200ms | NFR1 |
| Sem ofuscação de paywall (gratuito ou no-cost open-source) | Decisão SCP v1.2.3 |
| Build SSG (sem servidor sempre-ligado) | ADR-008 (stack Vercel Hobby) |
| Compatibilidade com Next 16 + React 19 | ADR-008 |

### Dataset

- **9.325 entries** × ~5 fields (nome, município, bairro, UF, redes[])
- Index naive (sem trim) ≈ 150-200KB descomprimido
- Comprimido (gzip ~30%) ≈ 50-70KB → **excede 30KB**

---

## Opções avaliadas

### Opção A: MiniSearch client-side (cliente puro)

**Como funciona:** index pré-built em prebuild (`scripts/build-minisearch-index.ts`) → JSON estático servido como chunk lazy → carregado client-side via dynamic import → fuzzy search 100% client.

| Critério | Análise |
|----------|---------|
| Bundle | 50-70KB comprimido (excede 30KB sem otimizações). Mitigação: dropar fields não-críticos (`tipoInferido`, `redes`), shard por UF lazy-load |
| Performance | INP excelente (busca local, sem network) |
| Funcionalidade | Fuzzy match nativo, scoring TF-IDF, prefix search |
| Dependência | `minisearch@^7` (~6KB gzip lib) |
| Custo | $0 (open-source MIT) |
| Complexidade | M — prebuild script + Radix Command + lazy-load |
| **Risco** | **Bundle estourar 30KB se dataset crescer** (dataset escala em pipeline mensal) |

**Bundle math:**
- 9.325 entries × {id: 4 chars, nome: ~30 chars, municipio: ~10, bairro: ~12, uf: 2} ≈ 60 chars/entry
- ~560KB raw → ~140KB JSON → ~45-55KB gzip
- Mitigation: dropar `bairro` e `tipoInferido` do index → ~35-40KB. Dropar `redes` (lookup pós-match) → ~28-32KB.
- **Borderline.** Risco de estourar 30KB se dataset crescer pós-pipeline 7.10.

### Opção B: Lunr.js client-side

| Critério | Análise |
|----------|---------|
| Bundle | Index Lunr para 9.325 entries ≈ 280-350KB raw → 70-90KB gzip. **Excede 30KB significativamente.** |
| Performance | INP bom (mas Lunr é menos otimizado que MiniSearch) |
| Funcionalidade | Boolean queries, stemming PT-BR via `lunr-languages` (+8KB) |
| Dependência | `lunr@^2.3` (~8KB gzip lib) + `lunr-languages` (+8KB) |
| Custo | $0 |
| Complexidade | M |
| **Risco** | **Bundle inviável** sem chunking pesado por UF |

**Veredito:** descartar — overhead de bundle não compensa.

### Opção C: Algolia (managed search SaaS)

| Critério | Análise |
|----------|---------|
| Bundle | ~15KB gzip (cliente JS oficial) — passa folgado em 30KB |
| Performance | INP excelente (server-side, response em <100ms p99) |
| Funcionalidade | Tudo + typo-tolerance + analytics + relevância tunável + facets |
| Dependência | `algoliasearch@^5` + `instantsearch.js` |
| Custo | **Plano gratuito: 10K requests/mês**. Paid: $0.50/1K requests acima do free tier. Para tráfego MVP, free tier suficiente. Pós-launch >100K MAU, custo ~$50-100/mês. |
| Complexidade | M-L — config de índice (sync via API), curva de aprendizado |
| **Risco** | **Vendor lock-in**. **Dependência externa ativa** (uptime SLA Algolia). **Custo escalonável** |

### Opção D: Fuse.js client-side

| Critério | Análise |
|----------|---------|
| Bundle | Lib ~12KB gzip + index in-memory (não pré-built — gerado runtime) |
| Performance | INP medíocre para 9.325 entries (busca linear pesada). Aceitável com debounce + virtualization |
| Funcionalidade | Fuzzy match básico, sem stemming nativo |
| Dependência | `fuse.js@^7` |
| Custo | $0 |
| Complexidade | S |
| **Risco** | **Performance** em mobile lento (Moto G) — busca linear sobre 9.325 entries pode estourar INP 200ms |

### Opção E: Meilisearch self-hosted

| Critério | Análise |
|----------|---------|
| Bundle | Cliente JS ~20KB gzip |
| Performance | Excelente |
| Funcionalidade | Tudo + typo-tolerance + facets |
| Dependência | Meilisearch instance (Docker em VPS) ou Meilisearch Cloud ($30-50/mês) |
| Custo | $30-50/mês cloud, ou $0 self-hosted (mas requer VPS) |
| Complexidade | L — devops para self-hosted, ou config para cloud |
| **Risco** | **Sai da stack 100% Vercel.** Adiciona componente devops. ADR-008 diz "stack unificada Next.js Vercel" — esta opção fere ADR-008. |

### Opção F: Filter local Sanity-driven (sem search engine)

| Critério | Análise |
|----------|---------|
| Bundle | Mínimo (~2KB filter logic) |
| Performance | Excelente para <500 entries; **inviável para 9.325** |
| Funcionalidade | Filtro exato (UF, tipo, rede) — sem fuzzy match |
| Dependência | nenhuma |
| Custo | $0 |
| Complexidade | XS |
| **Risco** | **Não atende requisito busca livre** (apenas filtros) |

**Veredito:** descartar — não atende AC3 da Story 7.2.

---

## Comparação resumida

| Opção | Bundle | Performance | Custo | Risco | Recomenda? |
|-------|--------|-------------|-------|-------|-------------|
| **A. MiniSearch** | 28-32KB (borderline) | Excelente | $0 | Médio (bundle scaling) | **SIM (recomendado)** |
| B. Lunr | 70-90KB | Bom | $0 | Alto (bundle) | Não |
| C. Algolia | 15KB | Excelente | $0-100/mês | Médio (vendor lock-in) | **Plano B** |
| D. Fuse.js | 12KB | Medíocre | $0 | Médio (INP mobile) | Não |
| E. Meilisearch | 20KB | Excelente | $30-50/mês | Alto (fere ADR-008) | Não |
| F. Filter sem search | 2KB | Excelente | $0 | Não atende AC3 | Não |

---

## Recomendação

**Opção A — MiniSearch client-side com pré-build**, com Opção C (Algolia) como fallback se bundle estourar 30KB pós Story 7.10 (pipeline mensal escalar dataset).

### Justificativa

1. **Custo zero** — alinhado com fase MVP (zero ARR confirmado)
2. **Compatível com ADR-008** — 100% stack Vercel SSG, sem componente devops adicional
3. **Performance ótima** — busca local, INP <50ms
4. **Bundle borderline mas viável** — com field trimming chega a 28-32KB
5. **Plano de contingência** — se bundle estourar, pivotar para Algolia free tier (10K requests/mês cobre MVP)

### Estratégia de bundle trimming (mandatória para A)

Em ordem de aplicação:

1. **Index com fields apenas** `[id, nome, municipio, bairro]` (drop `redes`, `tipoInferido`, `uf`)
2. **Lookup pós-match** via map `id → PrestadorAmil` para enriquecer card
3. **Se ainda > 30KB:** shard por UF — lazy-load do shard apenas quando filtro UF ativo
4. **Plano D (Algolia):** se shard atingir limite gerencial, pivotar

### Telemetria pós-launch (validar decisão)

Adicionar bundle-size guard em CI:
- Falha PR se chunk `network-search.*.js` > 30KB gzip
- Alert Slack/email se bundle aproximar 28KB (warning threshold)

---

## Open questions (co-sign)

1. **@architect Aria:** validar que field trimming não quebra UX (busca por bairro funcionar mesmo sem `bairro` no index — pode reduzir matches)?
2. **@stakeholder Agnaldo:** aceitar plano de contingência Algolia free tier ($0 até 10K req/mês, ~$50/mês pós 100K MAU)?
3. **@data-engineer Dara:** pipeline Story 7.10 deve regenerar `minisearch-index.json` pós-update do dataset?

---

## Decision log

| Date | Author | Decision |
|------|--------|----------|
| 2026-04-27 | @dev (Dex) | ADR proposto — opções A-F avaliadas |
| TBD | @architect (Aria) | Co-sign técnico |
| TBD | Agnaldo Silva | Co-sign stakeholder (custo + lock-in) |

## References

- Story 7.2 — Hub `/rede-credenciada/` + `<NetworkSearch />` (Approved 2026-04-28)
- ADR-005 v2 — programmatic SEO depth strategy (volumes)
- ADR-007 — Dataset SSOT (origem dos 9.325 prestadores)
- ADR-008 — stack unificada Next.js Vercel (constrains Opção E)
- `data/rede-credenciada/rede-amil.ts` — loader que feed o index
- Bundle benchmark: https://bundlephobia.com/package/minisearch
