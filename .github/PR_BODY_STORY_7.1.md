## Summary

Foundation da Epic 7 (Programmatic SEO Rede Credenciada Amil). Schema + loader reescrito do zero compatível com dataset Power BI 2026-04-26 (9.325 prestadores · 26 UFs · 438 municípios · 11 redes ativas).

**Resolve BLOCKER B-01** flagrado por @po Pax em `docs/po-revalidation-rede-credenciada-integration.md` (loader legado tinha schema incompatível com dataset novo — 5 redes sumiram, 6 apareceram).

**Bloqueia 8 stories downstream** (7.2-7.10). Sem este merge, nenhuma página SSG de rede credenciada Amil pode ser construída.

## Story details

- **Story:** 7.1 — Schema + Loader Reescrito
- **Epic:** 7 — Programmatic SEO Rede Credenciada Amil
- **Size:** M (4-5 dev-days)
- **Status:** Ready for Review (QA gate PASS)
- **Story file:** `docs/stories/7.1.schema-loader-reescrito.story.md`
- **QA gate:** `docs/qa/gates/7.1-schema-loader-gate.yaml` (Quinn @qa, 2026-04-28)
- **PO revalidation:** `docs/po-revalidation-epic7-stories-7.2-7.8.md` (Pax @po amendments O-1 + M-03 aplicados)

## Acceptance Criteria (13/13 ✅)

| AC | Descrição | Status |
|----|-----------|--------|
| AC1 | `src/types/rede-credenciada-amil.ts` com 7 interfaces + 2 type guards (`isDatasetRedeAmil`, `isPrestadorAmilRaw`) | ✅ |
| AC2 | `src/lib/operadoras/amil/rede-credenciada-loader.ts` com **14 helpers** (1 acima do mínimo SCP) | ✅ |
| AC2-bis | **NOVO via amendment O-1**: `src/lib/operadoras/amil/slugs.ts` com `REDE_SLUGS` Record literal alinhado com ADR-006 §"Slug rules" | ✅ |
| AC3 | `inferTipoAtendimento(nome)` regex 9 categorias com ordem de prioridade (Maternidade > Hospital, Pronto-Socorro > Hospital) | ✅ |
| AC4 | Cache em memória com **8 índices Map** (`byUf`, `byMunicipioSlug`, `byBairroSlug`, `byPrestadorSlug`, `byRede`, `byTipo`, `municipios`, `estatisticas`) | ✅ |
| AC5 | `slugify(value)` NFD + lowercase + idempotente | ✅ |
| AC6 | `data/rede-credenciada/rede-amil.ts` deprecado com header + migration path | ✅ |
| AC7 | **81 tests Vitest** em 3 arquivos (`__tests__/`) — totalPrestadores===9325, totalUFs===26, AMIL S750 QP===4959 (count exato dataset) | ✅ |
| AC8 | Imports absolutos `@/types/*`, `@/lib/operadoras/*`, `@/data/operadoras/*` | ✅ |
| AC9 | `npm run build` verde (Next.js 16 SSG) | ✅ |
| AC10 | `npx eslint src/` — 0 warnings, 0 errors | ✅ |
| AC11 | NFR8: zero literal "Bradesco" em `src/` (grep verificado) | ✅ |
| AC12 | CI gates bipartite (amendment M-03): coverage ≥80% loader / ≥85% funções puras | ✅ |

## Quality metrics

```
Tests:         81 passed (3 files)  duração 2.89s
Coverage:      loader 97.9% / slugs.ts 100% / types 100%
TypeScript:    strict mode, zero errors
ESLint:        zero warnings, zero errors
Build:         Next.js 16 prerender ok
NFR8:          0 "Bradesco" literals em src/
```

## QA Gate decision: PASS

**Reviewer:** Quinn (@qa) — 2026-04-28
**Decision:** PASS (sem fixes obrigatórios)

| Severidade | Quantidade | Bloqueia merge? |
|-----------|------------|-----------------|
| 🚨 CRITICAL | 0 | — |
| 🟠 HIGH | 0 | — |
| 🟡 MEDIUM | 2 | ❌ Não (tech debt) |
| 🟢 LOW | 4 | ❌ Não (sugestões opcionais) |

**Tech debt registrado** (absorvível em Story 7.2):
- **MED-1** — fixture-based test para line 237 (cover via `vi.mock`); protege contra regressão Story 7.10
- **MED-2** — `buildCache()` redundância de iteração (5× → 1× fold opportunity)

**LOW** — sort estabilidade, `__resetCacheForTests` em prod, getEstatisticasByUF count exato, byPrestadorSlug collision dedup.

Detalhes completos em `docs/qa/gates/7.1-schema-loader-gate.yaml`.

## PO amendments aplicados durante revalidation (2026-04-28)

- **O-1 (MAJOR):** AC2-bis adicionada para criar `slugs.ts` com `REDE_SLUGS` per ADR-006 §"Slug rules" — resolve gap onde Story 7.7 dependia desse arquivo mas Story 7.1 não o criava
- **M-03 (MINOR):** AC12 reescrito para coverage gates bipartite — justifica divergência intencional 80% loader (heavy-branching) vs 85% funções puras

## Files changed

**Novos arquivos:**
- `src/types/rede-credenciada-amil.ts` (190 lines)
- `src/types/__tests__/rede-credenciada-amil.test.ts` (133 lines, 17 tests)
- `src/lib/operadoras/amil/slugs.ts` (84 lines)
- `src/lib/operadoras/amil/__tests__/slugs.test.ts` (131 lines, 18 tests)
- `src/lib/operadoras/amil/rede-credenciada-loader.ts` (534 lines)
- `src/lib/operadoras/amil/__tests__/rede-credenciada-loader.test.ts` (396 lines, 46 tests)
- `src/data/operadoras/amil/rede-credenciada.json` (canon dataset 2026-04-26, 1.8MB)
- `vitest.config.ts` (38 lines, coverage thresholds bipartite)

**Arquivos modificados:**
- `package.json` (+ scripts test/test:watch/test:coverage + Vitest devDeps)
- `tsconfig.json` (paths granulares para src/ vs root coexistence)
- `data/rede-credenciada/rede-amil.ts` (header @deprecated + migration path)
- `docs/stories/7.1.schema-loader-reescrito.story.md` (PO amendments + Dev Agent Record + QA Results)

**Total:** 13 files, +2.104 linhas

## Decisões técnicas registradas em Dev Agent Record

1. **Pre-Task 0 — setup Vitest:** projeto não tinha tooling de tests (Story 1.1 fork não migrou Vitest do template original)
2. **Pre-Task 1 — coexistência src/ vs root legado:** migração massiva (~50 arquivos) explodiria scope M → L; solução com `tsconfig` paths granulares (Story 1.x retroativa absorve migração total)
3. **Cache strategy:** 8 índices Map para O(1) lookup (vs O(n) filter no loader legado)
4. **Schema validator no boot:** falha-fast com mensagem orientada para detecção de drift hub→mirror (ADR-007 SSOT)

## Test plan

- [x] `npm test` — 81/81 tests passed
- [x] `npm run test:coverage` — coverage gates passam (97.9% / 100% / 100%)
- [x] `npx tsc --noEmit` — strict mode, 0 errors
- [x] `npx eslint src/` — 0 warnings, 0 errors
- [x] `npm run build` — Next.js 16 SSG verde
- [x] Snapshot cross-file ADR-006 — 11 slugs literalmente alinhados
- [x] NFR8 grep "Bradesco" — 0 occurrences em src/
- [ ] Reviewer (you) — verificar coverage report html em `coverage/index.html`
- [ ] Reviewer — validar slug map em `src/lib/operadoras/amil/slugs.ts` vs `docs/decisions/adr-006-url-as-trademark-policy.md`

## Branches affected

- Base: `main`
- Source: `feat/story-7.1-schema-loader`
- Commits: 2 (`927bd33` PO amendments + `f6844c2` implementation)

## Next stories unblocked

Após merge, 8 stories Epic 7 ficam desbloqueadas:
- 7.2 (Hub `/rede-credenciada` + `<NetworkSearch />`) — Approved, ready
- 7.3 (Templates editoriais) — Approved, ready
- 7.4 (Páginas-prestador SSG) — Approved, ready
- 7.5 (Páginas-cidade) — em progresso
- 7.6 (Páginas-bairro) — Approved, ready
- 7.7 (Cluster E rede × UF) — Approved BLOCKED por ADR-006
- 7.8 (Tipo × UF × município) — Approved, ready
- 7.9, 7.10 — depend chain

## Related

- Epic 7 — `docs/sprint-change-proposal-v1.2.3.md` §4.3
- ADR-006 — `docs/decisions/adr-006-url-as-trademark-policy.md` (URL-as-Trademark Policy)
- ADR-007 — `docs/decisions/adr-007-dataset-ssot.md` (Dataset SSOT)
- PO revalidation — `docs/po-revalidation-epic7-stories-7.2-7.8.md`
- Quality gate — `docs/qa/gates/7.1-schema-loader-gate.yaml`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
