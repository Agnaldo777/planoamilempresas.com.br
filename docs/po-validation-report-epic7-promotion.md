# PO Validation Report — Epic 7 Stories Promotion

**Documento:** Story Promotion Report — Epic 7 (Programmatic SEO Rede Credenciada Amil)
**Projeto:** planoamilempresas.com.br
**Validador:** Pax (Product Owner — Synkra AIOS) ♎
**Data:** 2026-04-28
**Comando executado:** `*validate-story-draft` em sequência para 7.1, 7.2, 7.4, 7.6, 7.7, 7.8

**Inputs validados:**
- 6 stories em `docs/stories/7.{1,2,4,6,7,8}.*.story.md` (versões pós-amendments O-1/O-2/O-3/O-4)
- Relatório de revalidation `docs/po-revalidation-epic7-stories-7.2-7.8.md`
- Sprint Change Proposal `docs/sprint-change-proposal-v1.2.3.md` §4.3
- Template canônico `docs/stories/_template.story.md` AIOS-Method v2.0
- ADR-006 (URL-as-Trademark Policy) — gate de Story 7.7

---

## Sumário Executivo

### Veredito

**6 STORIES PROMOVIDAS — 5 desbloqueadas para implementação + 1 BLOCKED pendente legal-compliance.**

| Story | Status anterior | Status final | Bloqueio? | Próximo passo |
|-------|-----------------|--------------|-----------|---------------|
| **7.1** | Draft | ✅ **Approved** | Não | Handoff @dev (Dex) — foundation |
| **7.2** | Draft | ✅ **Approved** | Não | Handoff @dev (Dex) + @ux (Uma) copy |
| **7.4** | Draft | ✅ **Approved** | Não (Phase 1 only; Phase 2 flag) | Handoff @dev (Dex) — L 6-8d |
| **7.6** | Draft | ✅ **Approved** | Não | Handoff @dev (Dex) |
| **7.7** | Draft | ✅ **Approved (BLOCKED)** | **SIM — ADR-006 Accepted** | Handoff @architect (Aria) + advogado (Story 2.4) |
| **7.8** | Draft | ✅ **Approved** | Não | Handoff @dev (Dex) |

**Pass rate de promoção: 6/6 stories validadas (100%) — 5/6 desbloqueadas (83%).**

### Veredito por critério (PO Master Checklist)

| # | Área | 7.1 | 7.2 | 7.4 | 7.6 | 7.7 | 7.8 |
|---|---|---|---|---|---|---|---|
| 1 | Goal Alignment SCP/PRD | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 | ACs cobertos + testáveis | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 | Template AIOS conformidade | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 | Out of Scope explícito | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 5 | Dependencies blocks_by/blocks_to | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6 | Estimation defensável | ✅ M | ✅ M | ✅ L | ✅ M | ✅ M | ✅ S |
| 7 | CodeRabbit Integration completa | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 8 | Tasks/Subtasks com ref AC | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 9 | Dev Notes com Source Tree + Refs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 10 | Testing strategy + locations | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 11 | Change Log com data + autor | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 12 | Quality gates (CI + manual) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Todas as 6 stories passam 12/12 itens.** Pass rate ponderado: 100%.

---

## Validação por story

### Story 7.1 — Schema + Loader Reescrito (Foundation Epic 7)

**Status:** Draft → **Approved** (1.2)
**Size:** M (4-5 dev-days)
**Executor:** @dev (Dex) | **Quality gate:** @architect (Aria)

**ACs validadas:** 1, 2, **2-bis (NOVO via O-1)**, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 = **13 ACs total**.

**Mudança crítica desde draft:**
- ✅ Amendment O-1 aplicado (2026-04-28): AC2-bis criando `src/lib/operadoras/amil/slugs.ts` com `REDE_SLUGS: Record<RedeAmilNome, string>` (ADR-006 §"Slug rules" literal). +1 task + tests bipartite (round-trip + snapshot cross-file ADR-006). Resolve MAJOR-03 da revalidation `po-revalidation-epic7-stories-7.2-7.8.md`.

**Validações PO específicas:**
- ✅ BLOCKER B-01 da Pax revalidation v1.2.2 (loader rewrite, schema incompatível) endereçado via 13 helpers + tipos novos
- ✅ Re-tamanhamento S→M (4-5d) preservado
- ✅ Coverage target ≥80% (vs ≥85% das demais — diferença justificada em loader heavy-branching; MINOR-03 fica em backlog técnico Aria)
- ✅ Imports absolutos `@/types/rede-credenciada-amil`, `@/lib/operadoras/amil/{rede-credenciada-loader, slugs}`
- ✅ Zero literal "Bradesco" em código novo (NFR8)

**Pendências residuais:** zero — pronta para implementação.

**Handoff:** @dev (Dex) inicia Tasks 1-13 sequencial. Coverage gate ≥80% no loader. Esta story desbloqueia 8 stories downstream (7.2-7.10).

---

### Story 7.2 — Hub `/rede-credenciada` + `<NetworkSearch />`

**Status:** Draft → **Approved** (0.3)
**Size:** M (4-5 dev-days)
**Executor:** @dev (Dex) + @ux (Uma) handoff copy | **Quality gate:** @architect (Aria)

**ACs validadas:** 1, 2, 3, 4, 5, **5-bis (NOVO via O-2)**, 6, 7, 8, 9, 10, 11, 12 = **13 ACs total**.

**Mudança crítica desde draft:**
- ✅ Amendment O-2 aplicado (2026-04-28): AC5-bis criando `<OrganizationJsonLd />` em `src/components/schema/OrganizationJsonLd.tsx` como **primitive transversal Epic 7** (ADR-006 mit. 2). Renderiza `Organization` com `sameAs: ['https://www.amil.com.br']`. +Task 7-bis. Resolve MAJOR-02 cross-stories.

**Validações PO específicas:**
- ✅ FE Spec Screen 7 v1.1 referenciado corretamente (drift v1.0 já corrigido por Uma no SCP §7.1)
- ✅ Bundle budget ≤30KB do MiniSearch index é gate testável (CI step extrai size via webpack-bundle-analyzer)
- ✅ A11y WCAG AA: aria-autocomplete, live region, foco visível — testável via @axe-core/playwright
- ✅ Performance gates NFR1: Perf ≥92, LCP ≤2.0s, INP ≤200ms, CLS ≤0.05
- ✅ Disclaimer canônico em `src/content/disclaimers/amil-rede.ts` é primitive criada aqui (DRY)

**Pendências residuais:** zero — pronta para implementação.

**Handoff:** @ux (Uma) entrega copy das 8 FAQs + 11 chip labels rede + 5 chip labels UF (~30min). @dev (Dex) inicia Tasks 1-12 paralelo após receber copy. Esta story cria 6 primitives reusáveis (NetworkSearch, NetworkResultCard, NetworkAdvancedFilters, UfShortcutChips, RedeCredenciadaFAQ, OrganizationJsonLd) consumidas por 7.4/7.6/7.8.

---

### Story 7.4 — Páginas-Prestador SSG por Chunking

**Status:** Draft → **Approved** (0.4)
**Size:** L (6-8 dev-days) — **maior story do Epic 7**
**Executor:** @dev (Dex) | **Quality gate:** @architect (Aria)

**ACs validadas:** 1, 2, 3, **3-bis (NOVO via O-2)**, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 = **15 ACs total**.

**Mudanças críticas desde draft:**
- ✅ Amendment O-2 aplicado: AC3-bis reusando `<OrganizationJsonLd />` da Story 7.2 nas 9.325 páginas-prestador (ADR-006 mit. 2 transversal)
- ✅ Amendment O-4 aplicado (2026-04-28): AC3 reescrita removendo `Maternity` (tipo Schema.org inválido); tipo `'Maternidade'` mapeia para `Hospital` com `medicalSpecialty.name = 'Obstetrics'`. Discriminated union 6 → 5 branches + 1 prop opcional. Resolve MAJOR-04.

**Validações PO específicas:**
- ✅ Chunking Phase 1 (Sudeste 7.166) vs Phase 2 (resto 2.159) com env flag `PHASE_2_ENABLED=false` no MVP — risk de build budget Hobby ≤25min mitigado
- ✅ NoIndex anti-thin: município <5 prestadores → meta robots noindex,follow + canonical para cidade-pai (consistente com pattern 7.6)
- ✅ Schema markup discriminated union 5 subtipos canônicos Schema.org (Hospital, MedicalClinic, MedicalLaboratory, EmergencyService, MedicalOrganization fallback) — Schema.org validator passa em CI
- ✅ Mapa Leaflet centroide bairro com lazy-load (não bloqueia LCP)
- ✅ Sitemap shard `sitemap-prestadores.xml` com lastmod = `dataset.geradoEm`

**Pendências residuais (não bloqueantes):**
- ⚠️ MINOR-02: threshold `5` (anti-thin município) ainda hardcoded em descrição — não centralizado em `src/config/seo.ts`. Aplicar em backlog (5min) ou durante implementação por @dev.
- ⚠️ MINOR-04: tipo `'Diagnóstico por Imagem'` cai em fallback `MedicalOrganization` — Schema.org `MedicalImagingService` seria mais específico. Out-of-scope MVP, registrar em backlog Phase 2.

**Handoff:** @dev (Dex) inicia Phase 1 sequencial com Tasks 1-12. Build performance é gate crítico (Task 9 — `time pnpm build` ≤25min). Phase 2 ativação é decisão pós-validação SERP (não nesta sprint).

---

### Story 7.6 — Páginas-Bairro SSG (noindex+canonical Caminho A)

**Status:** Draft → **Approved** (0.4)
**Size:** M (4-5 dev-days)
**Executor:** @dev (Dex) | **Quality gate:** @architect (Aria)

**ACs validadas:** 1, 2, 3, 4, 5, **5-bis (NOVO via O-2)**, 6, 7, 8, 9, 10, 11, 12 = **13 ACs total**.

**Mudanças críticas desde draft:**
- ✅ Amendment O-2 aplicado: AC5-bis reusando `<OrganizationJsonLd />` da Story 7.2 (ADR-006 mit. 2 transversal nas 700-800 páginas-bairro viáveis)
- ✅ Amendment O-3 Caminho A aplicado (2026-04-28, com confirmação stakeholder): AC1 reescrita (`generateStaticParams` lista TODOS os ~1.687 bairros com ≥1 prestador); AC2 ganha helper bipartite (`getTodosBairrosPorCidade` + `getBairrosViaveisPorCidade`); AC3 reescrita literal SCP §4.3 (200 noindex+canonical em vez de 404 notFound); AC12 CI gate bipartite. Resolve MAJOR-01 + MINOR-01.

**Validações PO específicas:**
- ✅ Decisão noindex+canonical preserva link equity de backlinks externos (Googlebot crawla, segue links, não indexa) — preferida sobre 404 + 301 catch-all (perda ~10% PageRank)
- ✅ Sitemap shard `sitemap-rede-bairros.xml` lista APENAS os ~700-800 viáveis indexáveis (consistency check anti-leak no CI)
- ✅ Build budget impact: ~1.687 páginas SSG × 3-4ms = +5-7s no Phase 1 — dentro do orçamento ≤25min
- ✅ Slug bairro+município+UF desambiguação via path completo (loader 7.1 já entrega `bairroSlug`)
- ✅ Anti-thin coverage report mensal auto-gerado em `docs/audit/rede-bairros-coverage-{YYYY-MM}.md`

**Pendências residuais:** zero — pronta para implementação.

**Handoff:** @dev (Dex) inicia Tasks 1-10. Test fixture bipartite obrigatório (bairro denso ≥10 + bairro borderline 3 + bairro sub-3 com noindex+canonical).

---

### Story 7.7 — Cluster E `/rede/[redeSlug]/[uf]/` (HIGH-CONVERSION, BLOCKED)

**Status:** Draft → **Approved (BLOCKED)** (0.3)
**Size:** M (4-5 dev-days) — após desbloqueio
**Executor:** @dev (Dex) — após desbloqueio | **Quality gate:** @architect (Aria) técnico + @po (Pax) compliance

**ACs validadas:** 1 (pre-flight gate), 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 (compliance checklist), 15 = **15 ACs total**.

**Mudança crítica desde draft:**
- ✅ Amendment O-2 aplicado (2026-04-28): `<OrganizationJsonLd />` agora é REUSADA da Story 7.2 (não mais criada localmente). AC10 reescrita para citar mit. 1+2+3 com referência cruzada à 7.2. Source Tree marca primitive como `[já existe — 7.2]`. Slug map ref atualizada para `7.1 AC2-bis`. Resolve MAJOR-02 + MAJOR-03 cross-refs.

**Validações PO específicas:**
- ✅ **PO validation passa** — story estruturalmente completa, dependências bem definidas, pre-flight gate (AC1) acionável, compliance checklist final (AC14) auto-assinado por Pax pre-deploy
- ⚠️ **BLOQUEIO de implementação persiste** — não é bloqueio de PO, é **gate legal-compliance**: ADR-006 deve ter Status `Accepted` com co-sign de advogado revisor (deliverable Story 2.4). Status atual ADR-006: `Proposed` (2026-04-28).
- ✅ 5 mitigações ADR-006 mapeadas em ACs: M1 (disclaimer canônico) AC10; M2 (`<OrganizationJsonLd />` reusado) AC10 + AC3-bis-equiv; M3 (zero logo Amil) AC10; M4 (domínio-ponte ADR-004) AC1 pre-flight; M5 (pre-emptive outreach) deferida Agnaldo
- ✅ CR hipotética 5-8% Cluster E está em `docs/_internal/conversion-hypotheses-rede-credenciada.md` (não em material rastreável publicamente, conforme `feedback_claims_metricas.md`)

**Pendências residuais:**
- 🚨 **Hard gate externo:** Story 2.4 (legal review packet + advogado revisor) deve ser concluída para ADR-006 mover de Proposed → Accepted. Sem isso, @dev NÃO pode iniciar Task 0 (pre-flight checklist).
- ⏳ Decisão M5 (pre-emptive outreach Amil Compliance) é deferida Agnaldo + advogado pós-Story 2.4.

**Handoff:** @architect (Aria) coordena com advogado revisor (deliverable Story 2.4). Quando ADR-006 → Accepted, Pax remove flag BLOCKED via amendment + Status header → "Approved" puro. Implementação @dev então segue Task 0 → 12.

---

### Story 7.8 — Páginas Tipo × UF × Município

**Status:** Draft → **Approved** (0.3)
**Size:** S (3 dev-days) — **mais barata do Epic 7**
**Executor:** @dev (Dex) | **Quality gate:** @architect (Aria)

**ACs validadas:** 1, 2, 3, 4, 5, 6, **6-bis (NOVO via O-2)**, 7, 8, 9, 10, 11, 12, 13 = **14 ACs total**.

**Mudança crítica desde draft:**
- ✅ Amendment O-2 aplicado (2026-04-28): AC6-bis reusando `<OrganizationJsonLd />` da Story 7.2 nas 250-350 páginas tipo×UF×município. Resolve MAJOR-02.

**Validações PO específicas:**
- ✅ ~70% reuso de primitives 7.2/7.4/7.6 (NetworkResultCard, PrestadorJsonLd, OrganizationJsonLd, disclaimer canônico) — DRY enforced via CodeRabbit
- ✅ Tipo allowlist 8 entradas em `TIPO_SLUGS_VALIDOS`; tipo `'Outro'` explicitamente excluído via 404 (test obrigatório)
- ✅ Threshold `MIN_PRESTADORES_TIPO = 3` em `src/config/seo.ts` separado de `MIN_PRESTADORES_BAIRRO` (mesmo valor, tuning independente)
- ✅ `<PrestadorJsonLd />` discriminated union (de 7.4) cobre 8 tipos válidos — sem necessidade de novo branch

**Pendências residuais:** zero — pronta para implementação.

**Handoff:** @dev (Dex) inicia Tasks 1-9. Story menor + alta reuso = entrega rápida (~3d). Recomendado executar pós-7.4 (que cria `<PrestadorJsonLd />`) para evitar mock.

---

## Issues residuais consolidadas (MINORs não-bloqueantes)

| # | Severidade | Story | Descrição | Ação |
|---|---|---|---|---|
| MINOR-02 | 🟡 baixa | 7.4 | Threshold `5` (anti-thin município) hardcoded; centralizar em `src/config/seo.ts` | Backlog técnico Dex (5min durante implementação) |
| MINOR-03 | 🟡 baixa | 7.1 vs 7.2-7.8 | Coverage 80% (loader) vs 85% (UI) — sem padronização | Decisão Aria; pode ficar como-é (justificativa: branching em loader) |
| MINOR-04 | 🟡 baixa | 7.4 | `'Diagnóstico por Imagem'` cai em fallback; `MedicalImagingService` seria canonical | Backlog Phase 2 (não MVP) |
| MINOR-05 | 🟡 baixa | 7.6, 7.8 | Reference Artifacts não citam FE Spec explicitamente | Opcional — sem impacto em implementação |

**Nenhum MINOR bloqueia o lifecycle Approved → InProgress.** Aplicáveis durante PR review ou em backlog.

---

## Cadeia de implementação recomendada

```
Sprint atual (paralelo onde possível):

  Day 1-5:
    @dev (Dex): Story 7.1 (foundation, M 4-5d) — sequencial puro
    @ux (Uma): Copy 7.2 (FAQs + chip labels) — paralelo
    
  Day 6 (após 7.1 Approved + tests verdes):
    @dev (Dex): Story 7.2 (hub, M 4-5d)
    @architect (Aria): Story 2.4 + ADR-006 → Accepted (paralelo)
    
  Day 11 (após 7.2 + 7.3 templates editoriais):
    @dev (Dex): Story 7.4 Phase 1 (L 6-8d, Sudeste 7.166)
    @dev (Dex) em paralelo se houver capacity: Story 7.6 (M 4-5d)
    
  Day 17-19:
    @dev (Dex): Story 7.8 (S 3d) — após 7.4 entregar PrestadorJsonLd
    
  Após ADR-006 → Accepted:
    Pax: amendment 7.7 remove flag BLOCKED
    @dev (Dex): Story 7.7 Cluster E (M 4-5d)
    @po (Pax): compliance checklist final pre-deploy
```

**Total estimado Epic 7 (5 stories desbloqueadas + 7.7 pós-gate):** 22-27 dev-days + 4-5 dev-days da 7.7 = **26-32 dev-days totais**.

---

## Handoffs explícitos

| Agent | Recebe | Quando |
|-------|--------|--------|
| **@dev (Dex)** | Stories 7.1 → 7.2 → 7.4 → 7.6 → 7.8 (sequência implementação) | Imediato (após este relatório) |
| **@dev (Dex)** | Story 7.7 (Cluster E) | Após ADR-006 → Accepted |
| **@ux (Uma)** | Copy de 8 FAQs hub + 11 chip labels rede + chip labels UF + 3 wireframes para Story 7.2 | Imediato (paralelo a 7.1) |
| **@architect (Aria)** | Coordenar Story 2.4 (legal review packet) com advogado revisor para destravar ADR-006 | Imediato (paralelo) |
| **@po (Pax)** | Compliance checklist pre-deploy de 7.7 (`docs/audit/cluster-e-compliance-2026-MM.md`) | Pós-implementação 7.7, pre-deploy |
| **@qa (Quinn)** | QA review de cada story após `Review` | Sequencial pós-PR |
| **@devops (Gage)** | Vercel deploy de cada story após `Done` | Sequencial pós-QA |

---

## Aprovações registradas

**PO (Pax):** ✅ 6/6 stories validadas e promovidas Draft → Approved (Story 7.7 Approved+BLOCKED)
**Data:** 2026-04-28
**Próximo PO action:** após @dev(Dex) marcar story como `Review`, executar `*close-story` para fechar lifecycle

---

## Referências cruzadas

- `docs/po-revalidation-epic7-stories-7.2-7.8.md` (revalidation que originou os 4 amendments)
- `docs/sprint-change-proposal-v1.2.3.md` §4.3 (ACs source-of-truth)
- `docs/decisions/adr-006-url-as-trademark-policy.md` (gate Story 7.7)
- `docs/po-revalidation-rede-credenciada-integration.md` (BLOCKER B-01 endereçado em 7.1)
- `docs/po-revalidation-report-v1.2.2.md` (drift FE Spec resolvido em SCP §7.1)

---

— Pax, equilibrando prioridades 🎯
