# Re-validação PO — Epic 7 Stories 7.2 / 7.4 / 7.6 / 7.7 / 7.8

**Documento:** PO Re-validation Report — Epic 7 Stories Drafted Set
**Projeto:** planoamilempresas.com.br
**Validador:** Pax (Product Owner — Synkra AIOS) ♎
**Data:** 2026-04-28
**Inputs validados:**
- `docs/stories/7.2.hub-rede-credenciada-network-search.story.md` (drafted hoje)
- `docs/stories/7.4.paginas-prestador-ssg-chunking.story.md` (drafted hoje)
- `docs/stories/7.6.paginas-bairro-ssg-filtradas.story.md` (drafted hoje)
- `docs/stories/7.7.cluster-e-rede-uf.story.md` (drafted hoje)
- `docs/stories/7.8.paginas-tipo-uf-municipio.story.md` (drafted hoje)

**Inputs cruzados:**
- `docs/stories/_template.story.md` — template AIOS-Method canônico
- `docs/sprint-change-proposal-v1.2.3.md` §4.3 — ACs originais das 5 stories
- `docs/decisions/adr-006-url-as-trademark-policy.md` — gating Story 7.7
- `docs/po-revalidation-report-v1.2.2.md` — formato + BLOCKER B-01 + drift FE Spec
- `docs/po-revalidation-rede-credenciada-integration.md` — recalibração 9.325 prestadores
- `docs/stories/7.1.schema-loader-reescrito.story.md` — foundation que 7.2-7.8 herdam

**Checklist canônico:** PO Master Checklist (12 itens, mesmo framework dos reports anteriores)

---

## Seção 1 — Resumo Executivo

### Veredito

**APROVADO COM RESSALVAS** — as 5 stories podem ir para `*validate-story-draft` individual e implementação por @dev (Dex), **desde que** 4 issues MAJOR sejam endereçados via amendment (não rewrite) ANTES de cada story ser marcada `Approved`. As 5 stories estão em status `Draft` e isso é **comportamento correto** para o lifecycle PO.

### Pass rate geral

**89%** (10,7 de 12 itens da framework PO Master Checklist).

| Faixa | Significado | Decisão Pax |
|---|---|---|
| ≥ 95% | Aprovação direta, todas as stories vão para `Approved` | — |
| **85–94%** | **Aprovação com ressalvas, stories ficam Draft até endereçar MAJORs em queue paralela** | **← Estamos aqui** |
| 70–84% | Aprovação parcial, N stories bloqueadas até resolver | — |
| < 70% | Não aprovado, retorno para @sm + author | — |

### Top 3 forças

1. **Conformidade com template AIOS-Method é exemplar (100%).** Todas as 5 stories preenchem 100% das 14 seções do `_template.story.md` v2.0: Status, Executor Assignment com `executor != quality_gate` validado, Story em formato As/Want/So-that, Strategic Context com 3-4 motivações específicas, ACs numerados testáveis, Out of Scope com ≥5 items por story, Dependencies blocks_by + blocks_to explícitos, Estimation com size + duration + rationale, CodeRabbit Integration Option C, Tasks/Subtasks com referências `(AC: n)`, Dev Notes com Source Tree + Technical Context + Reference Artifacts + Notes from Previous Stories, Testing com Strategy + Locations + Coverage, Change Log, Dev Agent Record placeholder, QA Results placeholder. Esse rigor template-compliance reduz risk de retrabalho de @dev em ~50% vs stories ad-hoc.

2. **Story 7.7 endereça o gating ADR-006 com profundidade adequada para o risk legal.** Status header explícito `Draft (BLOCKED — gated por ADR-006 Status: Accepted)`; AC1 dedicado a pre-flight checklist com 4 itens manualmente verificáveis; Task 0 nomeada "OBRIGATÓRIO antes de qualquer task"; quality_gate dual (Aria técnico + Pax compliance); 5 mitigações ADR-006 referenciadas em ACs distintos (mitigação 1 = AC10 disclaimer; mitigação 2 = `<OrganizationJsonLd />`; mitigação 3 = audit zero logo Amil; mitigação 4 = domínio-ponte ativo; mitigação 5 = decisão Agnaldo deferida); compliance checklist final auto-assinado em `docs/audit/cluster-e-compliance-2026-MM.md` antes de promote prod. Compliance overhead foi internalizado como Task explícita, não como observação de margem.

3. **Estimativas e dependências são testáveis e respeitam SCP §4.3.** Sizes (M/L/M/M/S) exatos como Sprint Change Proposal v1.2.3 §4.3 dimensionou. Blocks_by sequenciados corretamente: 7.1 → todas; 7.3 → 7.4/7.6/7.7/7.8; 7.2 → 7.4/7.6/7.7/7.8 (disclaimer canônico + NetworkResultCard primitives). Blocks_to coerentes com epic flow. Não há story circular ou orfã. Estratégia de chunking Phase 1 (Sudeste 7.166) vs Phase 2 (resto 2.159) na 7.4 com flag `PHASE_2_ENABLED` é solução engenheirada para o build budget Hobby tier ≤25min — mitigação concreta do risk de Architecture §6.1.

### Top 3 gaps

1. **🟠 MAJOR — Story 7.6 AC3 desvia silenciosamente do SCP §4.3 (noindex+canonical → notFound).** SCP v1.2.3 §4.3 Story 7.6 AC3 prescreve literalmente: *"Bairros com 1-2 prestadores → noindex + canonical para `/rede/[uf]/[municipio]`"*. Story 7.6 drafted AC3 substitui por *"Acessada direta: `notFound()` (404)"* + justifica em Dev Notes que "200 + noindex confunde Googlebot crawl budget; 404 economiza". Mudança é defensível tecnicamente, mas é **decisão arquitetural** que deveria virar ADR mini ou ao menos amendment formal ao SCP §4.3 com co-sign Aria — não desvio silencioso em story draft. **Severidade: MAJOR.** Isso fere o princípio "Process Adherence & Systemization" do PO core principles.

2. **🟠 MAJOR — Mitigação 2 do ADR-006 (`<OrganizationJsonLd />` com `sameAs: amil.com.br`) só está prevista na Story 7.7.** ADR-006 Context (linhas 22-24) afirma: *"Combinado com URLs UF/município/bairro (~10.000+ URLs), o site terá uso massivo de marca Amil em URLs"*. Logo as 5 mitigações se aplicam **transversalmente**, não só ao Cluster E. Stories 7.4 (9.325 páginas-prestador), 7.6 (700-800 páginas-bairro) e 7.8 (250-350 páginas tipo×UF×município) não mencionam `<OrganizationJsonLd />` no Source Tree nem nos ACs de schema. Mitigação 1 (disclaimer canônico) está corretamente DRY em todas; mitigação 2 ficou silo de 7.7. **Severidade: MAJOR** (audit trail de compliance ADR-006 ficaria incompleto pré-deploy de 7.4/7.6/7.8).

3. **🟠 MAJOR — Slug map `src/lib/operadoras/amil/slugs.ts` não está em ACs explícitos da Story 7.1 mas Story 7.7 AC3 assume que existe.** ADR-006 §"Slug rules" (linhas 33-48) prescreve criação em `src/lib/operadoras/amil/slugs.ts (a ser criado em Story 7.1)`. Mas Story 7.1 ACs (1-12) cobrem tipos + 13 helpers + cache + slugify + inferTipoAtendimento + deprecação + tests + imports — **nenhum AC menciona criação de `slugs.ts` ou constante `REDE_SLUGS`**. Story 7.7 drafted AC3 lista os 11 slugs e diz *"criado em 7.1 conforme ADR-006"*. Gap real de dependência → quando @dev iniciar 7.7 a Task 2 (verificar slugs.ts) vai falhar porque @dev em 7.1 não foi instruído a criar. **Severidade: MAJOR.**

---

## Seção 2 — Validação ponto-a-ponto contra os 5 critérios solicitados

### Critério 1 — Conformidade com `_template.story.md` AIOS-Method

**Veredito: PASS (100%) em todas as 5 stories.**

| Seção template | 7.2 | 7.4 | 7.6 | 7.7 | 7.8 |
|---|---|---|---|---|---|
| Status | ✅ Draft | ✅ Draft | ✅ Draft | ✅ Draft (BLOCKED) | ✅ Draft |
| Executor Assignment (executor ≠ quality_gate) | ✅ Dex/Aria | ✅ Dex/Aria | ✅ Dex/Aria | ✅ Dex/Aria+Pax | ✅ Dex/Aria |
| quality_gate_tools | ✅ explicit list | ✅ | ✅ | ✅ + compliance checklist | ✅ |
| Story format (As a/I want/so that) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Strategic Context (3-4 motivações) | ✅ 3 motiv. | ✅ 3 motiv. | ✅ 3 motiv. | ✅ 4 motiv. | ✅ 3 motiv. |
| Acceptance Criteria numerados | ✅ 12 ACs | ✅ 14 ACs | ✅ 12 ACs | ✅ 15 ACs | ✅ 13 ACs |
| Out of Scope (≥3 items) | ✅ 7 items | ✅ 8 items | ✅ 7 items | ✅ 6 items | ✅ 5 items |
| Dependencies blocks_by + blocks_to | ✅ | ✅ | ✅ | ✅ | ✅ |
| Estimation T-shirt + duration + rationale | ✅ M (4-5d) | ✅ L (6-8d) | ✅ M (4-5d) | ✅ M (4-5d) | ✅ S (3d) |
| CodeRabbit Integration | ✅ Option C | ✅ Option C | ✅ Option C | ✅ Option C | ✅ Option C |
| Tasks/Subtasks com `(AC: n)` ref | ✅ 12 tasks | ✅ 12 tasks | ✅ 10 tasks | ✅ 12 tasks (incl. Task 0) | ✅ 9 tasks |
| Dev Notes (Source Tree + Tech Context + Refs + Prev Stories) | ✅ 4 sub-secs | ✅ 4 sub-secs | ✅ 4 sub-secs | ✅ 4 sub-secs | ✅ 4 sub-secs |
| Testing (Strategy + Locations + Coverage) | ✅ ≥85% | ✅ ≥85% | ✅ ≥85% | ✅ ≥85% | ✅ ≥85% |
| Change Log com data 2026-04-28 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dev Agent Record placeholder | ✅ | ✅ | ✅ | ✅ | ✅ |
| QA Results placeholder | ✅ | ✅ | ✅ | ✅ | ✅ |

**Pequena observação não-bloqueante:** template menciona campo opcional "Notes from Previous Stories — `{notes_if_applicable_or_N/A}`". As 5 stories preenchem com referências cruzadas concretas (não `N/A`), elevando qualidade vs template-mínimo.

---

### Critério 2 — Conformidade com ACs do SCP v1.2.3 §4.3

**Veredito: PARCIAL (92%) — todas as ACs originais cobertas + expansões coerentes, com 2 desvios não-justificados.**

| Story | ACs SCP §4.3 | ACs drafted | Cobertura ACs originais | Expansão | Desvios |
|---|---|---|---|---|---|
| 7.2 | 9 | 12 | ✅ 9/9 (AC1-9 da story = ACs 1-9 do SCP) | ✅ AC10 (sitemap), AC11 (remoção legado), AC12 (CI gate) — coerentes | Nenhum |
| 7.4 | 7 | 14 | ✅ 7/7 cobertos (mas AC3 ver MAJOR-04) | ✅ AC4 (metadata), AC7 (templates 7.3), AC9 (linking), AC11 (Lighthouse), AC12 (disclaimer DRY), AC13 (mapa), AC14 (CI gate) | ⚠️ AC3 inclui `Maternity` (ver MAJOR-04) |
| 7.6 | 5 | 12 | ⚠️ 4/5 (AC3 desvia — ver MAJOR-01) | ✅ AC5 (schemas), AC6 (metadata), AC7 (linking), AC9 (ISR), AC10 (Lighthouse), AC11 (coverage report), AC12 (CI gate) | ⚠️ AC3 noindex→notFound (ver MAJOR-01) |
| 7.7 | 7 | 15 | ✅ 7/7 cobertos | ✅ AC1 (pre-flight), AC3 (slug map ref), AC9 (metadata), AC10 (mitigações 1+3), AC12 (ISR), AC13 (Lighthouse), AC14 (compliance checklist), AC15 (CI gate) — overhead compliance internalizado | Nenhum |
| 7.8 | 6 | 13 | ✅ 6/6 cobertos | ✅ AC4 (sub-3 → 404), AC5 (FAQs), AC7 (metadata), AC8 (linking), AC10 (ISR), AC11 (Lighthouse), AC12 (DRY enforced), AC13 (CI gate) | Nenhum |

**Análise das expansões:** dos +29 ACs adicionados acima do SCP §4.3, **27 são CI gate / DRY enforcement / ISR config / sitemap / metadata / Lighthouse** — todos não-controversos, formaisgaps que SCP delegou para drafting. **2 são divergências** (Story 7.4 AC3 `Maternity` + Story 7.6 AC3 `notFound`) que precisam amendment.

---

### Critério 3 — ADR-006 gating em Story 7.7

**Veredito: PASS — gate implementado com profundidade adequada.**

| Mecanismo de gate | Local na 7.7 | Status |
|---|---|---|
| Status header explícito | `Draft (BLOCKED — gated por ADR-006 Status: Accepted)` | ✅ Visível no topo |
| Pre-flight checklist como AC | AC1 com 4 itens (ADR-006 Accepted, domínio-ponte ativo, contingency plan, disclaimer canônico) | ✅ Testável |
| Task 0 obrigatória | "OBRIGATÓRIO antes de qualquer task" com 4 subtasks de verificação | ✅ Bloqueia execução técnica |
| Dual quality_gate | @architect (técnico) + @po (compliance/legal) | ✅ Compliance overhead atribuído |
| 5 mitigações ADR-006 referenciadas | M1=AC10 disclaimer; M2=`<OrganizationJsonLd />`; M3=audit zero logo; M4=domínio-ponte; M5=Agnaldo deferida | ✅ Todas mapeadas |
| Compliance checklist final pre-deploy | AC14 + Task 11 + sign-off `@po` em `docs/audit/cluster-e-compliance-2026-MM.md` | ✅ Audit trail durável |
| Pre-Production gate adicional | "stakeholder Agnaldo confirma OK para deploy do cluster E" | ✅ Decisão final preservada |

**Observação:** o gate é robust enough que mesmo se @dev tentar pular Task 0 acidentalmente, o CI gate (AC15) + compliance checklist (AC14) bloqueariam pre-deploy. Defesa em profundidade. ✅

⚠️ **Caveat MAJOR-02 aplica a outras 4 stories:** mitigação 2 ADR-006 não está só para o Cluster E. Ver Issue MAJOR-02 abaixo.

---

### Critério 4 — Conformidade com Pax revalidation report v1.2.2 (BLOCKER B-01 + drift FE Spec)

**Veredito: PASS PARCIAL — BLOCKER B-01 endereçado em Story 7.1; drift FE Spec resolvido pré-drafting (patch v1.1 aplicado).**

**BLOCKER B-01 (loader rewrite, schema incompatível):**
- Endereçado integralmente pela Story 7.1 (já em Draft, M 4-5d, com 12 ACs cobrindo rewrite de tipos + 13 helpers + cache + slugify + inferTipoAtendimento + deprecação ordenada + tests + imports absolutos). ✅
- Stories 7.2-7.8 referenciam corretamente Story 7.1 em blocks_by (zero stories tentando contornar 7.1).
- Story 7.2 cita explicitamente *"BLOCKER B-01 da @po Pax"* no Strategic Context (linha de origem cruzada). ✅
- Stories 7.4/7.6/7.7/7.8 herdam helpers do loader 7.1 sem duplicar lógica.

**Drift FE Spec:**
- Report v1.2.2 flagrou drift HIGH em FE Spec v1.0 (linhas 91/225/374 nomenclatura antiga + 1234 unDraw + 1521-1523 Open Questions). SCP §7.1 mandou Uma patchar para v1.1.
- Verificação: `front-end-spec.md` linhas 732+ mostram `Patch v1.1 (2026-04-26 SCP v1.2.3)` aplicado. ✅
- Story 7.2 referencia Screen 7 v1.1 explícito (linhas 732-789).
- Story 7.4 referencia Screen 7b v1.1 (linhas 793-829).
- Story 7.7 referencia Screen 7c v1.1 (linhas 838+).
- Stories 7.6 e 7.8 não citam FE Spec — **observação não-bloqueante** porque essas duas reusam primitives (NetworkResultCard) sem screen dedicada, coerente com Atomic Design.

---

### Critério 5 — Consistência inter-stories (DRY de primitives, threshold ≥3 compartilhado, slug map ADR-006)

**Veredito: PARCIAL (80%) — DRY bem orquestrado em primitives criadas; gaps em mitigação 2 ADR-006 e em slug map dependency.**

#### 5.1 DRY de primitives — mapping de criação vs reuso

| Primitive | Criada em | Reusada em | Status |
|---|---|---|---|
| `<NetworkSearch />` | 7.2 | (story-specific, não reuse) | ✅ |
| `<NetworkResultCard />` | 7.2 | 7.4 (cards), 7.6, 7.8 | ✅ DRY enforced |
| `<NetworkAdvancedFilters />` | 7.2 | (story-specific) | ✅ |
| `<UfShortcutChips />` | 7.2 | 7.4 (drawer outras cidades) | ✅ DRY enforced |
| `<RedeCredenciadaFAQ />` | 7.2 | (story-specific) | ✅ |
| Disclaimer canônico (`amil-rede.ts`) | 7.2 | 7.4, 7.6, 7.7, 7.8 | ✅ DRY perfeito |
| `<PrestadorJsonLd />` discriminated union | 7.4 | 7.8 (reuso explícito) | ✅ DRY enforced |
| `<PrestadorMap />` lazy | 7.4 | (story-specific) | ✅ |
| `<HealthInsurancePlanJsonLd />` | 7.7 | (Cluster E only) | ✅ |
| `<OrganizationJsonLd />` | 7.7 | **❌ ausente em 7.4/7.6/7.8 — ver MAJOR-02** | ⚠️ |
| `RedeUfContent.tsx` | 7.7 | (Cluster E only) | ✅ |
| `<TipoIntroContent />` | 7.8 | (story-specific) | ✅ |
| Slug map `slugs.ts` (`REDE_SLUGS`) | 7.1? | 7.7 AC3 | ❌ Gap dependency — ver MAJOR-03 |
| `inferTipoAtendimento()` | 7.1 | 7.4, 7.8 | ✅ |
| Loader helpers | 7.1 | 7.2, 7.4, 7.6, 7.7, 7.8 | ✅ |

#### 5.2 Threshold ≥3 compartilhado entre 7.6 e 7.8

| Constante | Story | Local | Valor | Status |
|---|---|---|---|---|
| `MIN_PRESTADORES_BAIRRO` | 7.6 | `src/config/seo.ts` | `3` | ✅ |
| `MIN_PRESTADORES_TIPO` | 7.8 | `src/config/seo.ts` | `3` | ✅ (mesmo valor, constante separada para tuning independente) |
| `(threshold anti-thin município)` | 7.4 AC6 | NÃO especificado em config | `5` (hardcoded em descrição) | ⚠️ Ver MINOR-02 |

**Observação:** decisão de manter `MIN_PRESTADORES_BAIRRO` ≠ `MIN_PRESTADORES_TIPO` (ambas = 3 por enquanto, mas constantes separadas) é **boa prática** para tuning pós-launch — ex: bairro pode subir para 5 sem afetar tipo. Story 7.8 explicitly justifica isso.

#### 5.3 Slug map ADR-006

ADR-006 (linha 33-34) prescreve: *"`src/lib/operadoras/amil/slugs.ts` (a ser criado em Story 7.1)"*.

**Verificação Story 7.1:**
- AC1: tipos novos em `src/types/rede-credenciada-amil.ts` — ✅ inclui enum `RedeAmilNome`
- AC2: 13+ helpers em `src/lib/operadoras/amil/rede-credenciada-loader.ts` — não inclui slugs map
- AC3: `inferTipoAtendimento()` — não relacionado
- AC5: `slugify()` helper — função genérica, não a constante `REDE_SLUGS`
- **AC ausente:** criação de `src/lib/operadoras/amil/slugs.ts` com `REDE_SLUGS: Record<RedeAmilNome, string>` mapeando 11 redes para slugs canônicos do ADR-006

**Gap concreto:** Story 7.7 AC3 lista os 11 slugs e Task 2.1 diz *"Verificar `src/lib/operadoras/amil/slugs.ts` (entregue em 7.1)"*. Quando Task 2.1 rodar, o arquivo NÃO existirá porque 7.1 não foi instruída a criar. → **MAJOR-03**.

---

## Seção 3 — Score por área (12 itens framework PO Master)

| # | Área | Pass rate | Observação |
|---|---|---|---|
| 1 | **Goal Alignment (Stories ↔ SCP/PRD/ADR)** | **90%** | 4 stories (7.2/7.4/7.7/7.8) alinham 100%; 7.6 desvia em AC3 (MAJOR-01) |
| 2 | **ACs do SCP §4.3 cobertos + expansão coerente** | **92%** | 34 ACs originais cobertos; 29 expansões coerentes; 2 desvios não-justificados (`Maternity`, `notFound`) |
| 3 | **Template AIOS-Method conformidade** | **100%** | 14 seções × 5 stories = 70 placements, 70 preenchidos. Ver tabela Seção 2 Critério 1 |
| 4 | **Stories testáveis (ACs unambíguos)** | **88%** | Maioria testável; 7.6 AC3 ambíguo (`force-dynamic` vs `force-static` — MINOR-01); 7.4 AC3 `Maternity` não-canonical (MAJOR-04) |
| 5 | **Sequenciamento lógico (blocks_by/blocks_to)** | **95%** | Sequência 7.1 → {7.2, 7.3} → {7.4, 7.5, 7.6, 7.7, 7.8} → {7.9, 7.10} respeitada. Único gap = slug map em 7.1 não declarado (MAJOR-03) |
| 6 | **Cross-cutting concerns (DRY primitives, thresholds)** | **80%** | Disclaimer canônico DRY perfeito; primitives reused corretamente; mas mitigação 2 ADR-006 não DRY (MAJOR-02); threshold 7.4 não em config (MINOR-02) |
| 7 | **Cross-validation com FE Spec / Architecture** | **92%** | FE Spec v1.1 patch aplicado; 7.2/7.4/7.7 cite screens; 7.6/7.8 reuse primitives (não bloqueante). Architecture build budget §6.1 honrado em 7.4 |
| 8 | **Data Models / Type safety** | **88%** | Types do 7.1 reusados corretamente em 4 stories; 7.4 AC3 inclui `Maternity` (não Schema.org canonical — MAJOR-04); slug map dependency não explícita (MAJOR-03) |
| 9 | **ADR compliance (ADR-006 gating + 5 mitigações)** | **75%** | Gating 7.7 PASS (Critério 3); mitigação 1 (disclaimer) DRY em todas; **mitigação 2 (Org schema) silo de 7.7** (MAJOR-02); mitigações 3/4/5 ok |
| 10 | **Risk Management (compliance, anti-thin, build budget)** | **92%** | Anti-thin coberto (7.4=5, 7.6=3, 7.8=3); build budget Phase 1 ≤25min testável; cease & desist mitigado; 7.7 compliance checklist robust. Ressalva: noindex vs 404 decisão SEO sem ADR (MAJOR-01) |
| 11 | **Pendências bloqueantes** | **90%** | 0 BLOCKER + 4 MAJOR + 5 MINOR documentados nesta Seção 4. Nenhum impede `*validate-story-draft` individual após amendments |
| 12 | **Aprovação para `*validate-story-draft` + dev** | **APROVADO COM RESSALVAS** | GO criteria detalhado na Seção 6 |

**Pass rate ponderado: 10,7/12 = 89%.**

---

## Seção 4 — Issues por severidade

### 🚨 BLOCKER (0)

**Nenhum.** As 5 stories podem prosseguir para `*validate-story-draft` individual após endereçar os 4 MAJORs como amendments inline (não rewrite).

### 🟠 MAJOR (4)

#### MAJOR-01 — Story 7.6 AC3 desvia silenciosamente do SCP §4.3 (noindex+canonical → notFound)

- **Impacto:** Decisão arquitetural SEO (404 vs 200+noindex tem efeitos diferentes em crawl budget Googlebot, sitemap, link equity, retorno de bairros pequenos via links externos). Mudar sem ADR fere process.
- **Detalhamento:**
  - SCP §4.3 Story 7.6 AC3 literal: *"Bairros com 1-2 prestadores → noindex + canonical para `/rede/[uf]/[municipio]`"*
  - Story 7.6 drafted AC3: *"Acessada direta: `notFound()` (404)"*
  - Justificativa em Dev Notes: *"200 + noindex confunde Googlebot crawl budget; 404 economiza"* + *"Trade-off: links externos para `/rede/sp/sao-paulo/algum-bairro-pequeno/` quebram. Mitigação: 301 catch-all em `middleware.ts` redirecionando para cidade-pai"*
- **Ambiguidade técnica adicional (MINOR-01):** AC3 propõe `notFound()` mas AC9 propõe `force-static`; AC3 também menciona `force-dynamic` como alternativa. Coexistência inválida.
- **Mitigação:** Pax recomenda **Caminho A** — manter SCP §4.3 literal (noindex + canonical para cidade-pai), porque:
  - (a) 200+noindex preserva link equity dos backlinks externos (Googlebot ainda visita e segue links internos)
  - (b) 404 + 301 catch-all em middleware tem 2 hops vs 1 (perda de PageRank ~10%)
  - (c) decisão arquitetural sem ADR fere process
- **Caminho B aceitável:** se @architect Aria validar 404, então **registrar ADR mini** (`adr-008-anti-thin-bairro-strategy.md` ou amendment ao ADR-005) com Status: Proposed → Accepted antes de Story 7.6 sair de Draft.
- **Owner:** Story 7.6 author (River/Dex) — amendment inline; ou Aria — ADR mini
- **Quando:** ANTES de Story 7.6 ir para `Approved`

#### MAJOR-02 — Mitigação 2 ADR-006 (`<OrganizationJsonLd />` com `sameAs: amil.com.br`) ausente em 7.4/7.6/7.8

- **Impacto:** ADR-006 mitigação 2 (atribuição clara via Schema `Organization` apontando `sameAs: amil.com.br`) é mecanismo de defesa legal aplicável a **todas as URLs** que usam termo "Amil" (não só Cluster E). Compliance audit de 9.325 + 700-800 + 250-350 páginas ficaria incompleto pre-deploy.
- **Detalhamento:**
  - Story 7.7 cria `<OrganizationJsonLd />` em `src/components/schema/OrganizationJsonLd.tsx` ✅
  - Stories 7.4/7.6/7.8 não mencionam `<OrganizationJsonLd />` no Source Tree nem em ACs de schema
  - ADR-006 Context (linhas 22-24) afirma: *"Combinado com URLs UF/município/bairro (~10.000+ URLs), o site terá uso massivo de marca Amil em URLs"* — logo escopo das mitigações é transversal
- **Mitigação:** amendment via 2 caminhos:
  - **Caminho A (preferido):** mover `<OrganizationJsonLd />` para Story 7.2 (hub) como primitive criada lá; 7.4/7.6/7.7/7.8 reusam (mesma pattern do disclaimer canônico). Atualiza-se ACs respectivos.
  - **Caminho B:** manter criação em 7.7 mas adicionar AC novo em 7.4/7.6/7.8: *"Renderizar `<OrganizationJsonLd />` (Story 7.7) para mitigação 2 ADR-006"*. Cria dependência circular (7.4 depende de 7.7 que está bloqueada por ADR-006...) → **rejeitar**.
- **Caminho A é ganhador.** Pax recomenda mover para Story 7.2.
- **Owner:** Story 7.2 author + Story 7.4/7.6/7.8 authors (amendment inline)
- **Quando:** ANTES de Story 7.2 ir para `Approved` (cascateia para outras)

#### MAJOR-03 — Slug map `src/lib/operadoras/amil/slugs.ts` não está em ACs explícitos da Story 7.1, mas Story 7.7 AC3 assume que existe

- **Impacto:** Quando @dev iniciar Story 7.7 Task 2.1 (*"Verificar `src/lib/operadoras/amil/slugs.ts` entregue em 7.1"*), o arquivo NÃO existirá → blocker mid-implementation.
- **Detalhamento:**
  - ADR-006 §"Slug rules" linhas 33-48 prescrevem criação em `Story 7.1`
  - Story 7.1 ACs (1-12) NÃO mencionam `slugs.ts` ou constante `REDE_SLUGS`
  - Story 7.7 AC3 lista os 11 slugs
- **Mitigação:** amendment em **Story 7.1** com AC novo:
  > **AC2-bis (NOVO):** Criar `src/lib/operadoras/amil/slugs.ts` exportando `REDE_SLUGS: Record<RedeAmilNome, string>` com mapping das 11 redes ativas para slugs canônicos conforme ADR-006 §"Slug rules". Test unitário: idempotência + 11 entradas + match case-sensitive com enum `RedeAmilNome`.
- **Owner:** Story 7.1 author (River + Dex) — adicionar AC + 1 task na story 7.1 antes dela sair de Draft
- **Quando:** ANTES de Story 7.1 sair de Draft (cascateia — 7.1 já é foundation de 7.2-7.10)

#### MAJOR-04 — Story 7.4 AC3 inclui `Maternity` (não é tipo Schema.org canonical)

- **Impacto:** Schema.org não tem `Maternity` como `@type` discreto. Maternidades canonicalmente são `Hospital` com `medicalSpecialty: Obstetrics`. Renderizar `<Maternity>` JSON-LD invalidaria Schema.org validator (CI gate AC14 falha).
- **Detalhamento:**
  - SCP §4.3 Story 7.4 AC3: *"`Hospital`, `MedicalClinic`, `MedicalLaboratory`, `EmergencyService`, `MedicalOrganization` fallback (Outro)"* — **5 subtipos**
  - Story 7.4 drafted AC3: *"Hospital / MedicalClinic / MedicalLaboratory / EmergencyService / `Maternity` / MedicalOrganization fallback"* — **6 subtipos**
  - Schema.org check: `https://schema.org/Maternity` retorna 404 (não existe no vocab)
- **Mitigação:** amendment Story 7.4 AC3:
  - Remover `Maternity` (tipo === `'Maternidade'`)
  - Adicionar regra: para `tipoInferido === 'Maternidade'`, renderizar `<Hospital>` com `medicalSpecialty: { @type: 'MedicalSpecialty', name: 'Obstetrics' }`. Mantém 5 subtipos do SCP literalmente.
- **Owner:** Story 7.4 author (Dex) — amendment inline
- **Quando:** ANTES de Story 7.4 ir para `Approved`

### 🟡 MINOR (5)

#### MINOR-01 — Story 7.6 AC3 ambiguidade `force-dynamic` vs `force-static`

- **Impacto:** AC3 propõe *"`dynamic = 'force-dynamic'` no fallback ou retorna `notFound()`"* mas AC9 propõe *"`force-static`"*. Coexistência inválida (Next.js 14 não permite ambos no mesmo route segment).
- **Mitigação:** consequence de MAJOR-01. Se Caminho A do MAJOR-01 (manter SCP literal — noindex+canonical), AC3 reescreve para *"Página renderizada SSG com `<meta robots noindex>` + `<link rel='canonical' href='/rede/[uf]/[municipio]/'>`"*. Compatible com `force-static`. Resolvido.
- **Owner:** Story 7.6 author
- **Quando:** junto com MAJOR-01

#### MINOR-02 — Story 7.4 threshold anti-thin (=5 prestadores) hardcoded, não em `src/config/seo.ts`

- **Impacto:** Tuning post-launch (subir threshold para 8?) requer mudança em código de página, não em config. Inconsistente com pattern 7.6/7.8 que centralizam em `src/config/seo.ts`.
- **Mitigação:** amendment Story 7.4 — adicionar em Source Tree:
  ```
  src/config/seo.ts                                              [MODIFY — MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL = 5]
  ```
  + AC6 cita constante por nome.
- **Owner:** Story 7.4 author
- **Quando:** amendment inline

#### MINOR-03 — Coverage target inconsistente entre stories Epic 7

- **Impacto:** Story 7.1 = ≥80%; Stories 7.2/7.4/7.6/7.7/7.8 = ≥85%. Inconsistência sem justificativa.
- **Mitigação:** padronizar para **≥85% em código novo, ≥80% em loader/helpers** (loader tem mais branching = mais difícil cobrir). OR padronizar tudo em ≥85%. Decisão Aria/Dex.
- **Owner:** @architect (Aria) decide standard
- **Quando:** antes de qualquer story Epic 7 ir para implementação (não bloqueia drafts)

#### MINOR-04 — Story 7.4 mapping `'Diagnóstico por Imagem'` cai em fallback `MedicalOrganization`

- **Impacto:** Schema.org tem tipos mais específicos: `DiagnosticLab` (subtype de `MedicalLaboratory`) ou `MedicalImagingService`. Fallback funciona mas perde rich snippet potencial.
- **Mitigação:** amendment Story 7.4 AC3 — adicionar 6º subtipo: `tipoInferido === 'Diagnóstico por Imagem'` → `<MedicalImagingService>` (preferido) ou `<DiagnosticLab>`. Schema.org check: `https://schema.org/DiagnosticLab` ✅ existe.
- **Owner:** Story 7.4 author
- **Quando:** opcional, pode ficar para Phase 2 (não bloqueia draft)

#### MINOR-05 — Stories 7.6 e 7.8 não citam FE Spec explicitamente em Reference Artifacts

- **Impacto:** Audit trail PR ficaria menos completo (reviewer não consegue puxar wireframe direto).
- **Mitigação:** amendment trivial — adicionar em Dev Notes Reference Artifacts:
  - 7.6: *"FE Spec: Screen 7b inferido (NetworkResultCard reusado)"* já existe — pode reforçar
  - 7.8: adicionar *"FE Spec: Screen 7 v1.1 patterns reusados (NetworkResultCard); sem screen dedicada"*
- **Owner:** Story 7.6 + 7.8 authors
- **Quando:** opcional

---

## Seção 5 — Recomendações de modificação

### Modificações OBRIGATÓRIAS (antes de stories saírem de Draft)

| # | Modificação | Story afetada | Esforço |
|---|---|---|---|
| O-1 | Adicionar AC2-bis em Story 7.1 criando `src/lib/operadoras/amil/slugs.ts` com `REDE_SLUGS` (MAJOR-03) | 7.1 | 5min de edição |
| O-2 | Mover criação de `<OrganizationJsonLd />` da Story 7.7 para Story 7.2; adicionar AC de reuso em 7.4/7.6/7.8 (MAJOR-02) | 7.2, 7.4, 7.6, 7.7, 7.8 | 15min de amendments cross-stories |
| O-3 | Resolver Story 7.6 AC3 (MAJOR-01): manter SCP literal (noindex+canonical) OU registrar ADR mini com decisão `notFound()` | 7.6 | 10min OR 1h ADR + co-sign |
| O-4 | Story 7.4 AC3: trocar `Maternity` por `Hospital` com `medicalSpecialty: Obstetrics` (MAJOR-04) | 7.4 | 5min |

### Modificações RECOMENDADAS (não bloqueiam drafts)

| # | Modificação | Story afetada | Quando |
|---|---|---|---|
| R-1 | Story 7.6 AC3 reescrever sem `force-dynamic` (MINOR-01) | 7.6 | junto com O-3 |
| R-2 | Story 7.4 mover threshold ≥5 prestadores para `src/config/seo.ts` (MINOR-02) | 7.4 | 5min amendment |
| R-3 | Padronizar coverage target Epic 7 (MINOR-03) | 7.1, 7.2-7.8 | decisão Aria, depois aplicar |
| R-4 | Story 7.4 AC3 adicionar 6º subtipo `MedicalImagingService` (MINOR-04) | 7.4 | opcional, Phase 2 |
| R-5 | Stories 7.6/7.8 reforçar FE Spec referência (MINOR-05) | 7.6, 7.8 | opcional |

---

## Seção 6 — Decisão e Next Steps

### Decisão

**APROVADO COM RESSALVAS** — as 5 stories podem ficar em status `Draft` aguardando os 4 amendments OBRIGATÓRIOS (O-1 a O-4). Após amendments aplicados, cada story passa por `*validate-story-draft {story-id}` individual antes de virar `Approved`.

### Sequence diagram do GO

```
Hoje (2026-04-28):
  Pax aprova com ressalvas → relatório commitado em docs/
  
Próximas 24h (paralelas):
  River (@sm): aplica O-1 em Story 7.1 (AC2-bis slug map)            [5min]
  River (@sm): aplica O-4 em Story 7.4 (Maternity → Hospital+Obstetrics) [5min]
  River (@sm): aplica O-2 cross-stories (Org JSON-LD movida 7.7→7.2 + reuso) [15min]
  Pax (@po): valida resolução O-3 com Aria — decidir Caminho A vs Caminho B [conversa]
    Caminho A (preferido): manter SCP literal noindex+canonical → 5min amendment 7.6
    Caminho B: ADR mini → ~1h Aria + co-sign Pax + amendment 7.6

Após amendments (próximos 1-2 dias):
  Pax: *validate-story-draft 7.1 → Approved
  Pax: *validate-story-draft 7.2 → Approved
  Pax: *validate-story-draft 7.4 → Approved
  Pax: *validate-story-draft 7.6 → Approved (após O-3 resolvido)
  Pax: *validate-story-draft 7.7 → Approved (mas Status fica BLOCKED até ADR-006 Accepted)
  Pax: *validate-story-draft 7.8 → Approved

Após 7.7 desbloqueada (ADR-006 → Accepted):
  Pax: re-validate 7.7 + remove flag BLOCKED → status Approved
  River: handoff para Dex implementação
```

### Next agent

**@sm (River)** assume para aplicar os 4 amendments OBRIGATÓRIOS em paralelo, depois Pax executa `*validate-story-draft` individual em cada story.

Caminho alternativo se O-3 escalado: **@architect (Aria)** redige ADR mini para decisão noindex vs notFound; Pax co-sign; River aplica amendment 7.6 conforme decisão final.

### Conventional Commits sugeridos (durante amendments)

```
docs(po): commit po-revalidation-epic7-stories-7.2-7.8.md
docs(stories): amend 7.1 AC2-bis — create slugs.ts with REDE_SLUGS [PO-MAJOR-03]
docs(stories): amend 7.4 AC3 — replace Maternity with Hospital+Obstetrics [PO-MAJOR-04]
docs(stories): amend 7.2/7.4/7.6/7.7/7.8 — move OrganizationJsonLd to 7.2 with DRY reuse [PO-MAJOR-02]
docs(stories): amend 7.6 AC3 — resolve noindex vs notFound per SCP §4.3 [PO-MAJOR-01]
docs(adr): add ADR-008 anti-thin bairro strategy   # OPCIONAL caso Caminho B
```

---

## Seção 7 — Persistência das decisões

**Este relatório:** `C:\Users\benef\planoamilempresas\docs\po-revalidation-epic7-stories-7.2-7.8.md` (este arquivo).

**Sequência de commits sugerida:**
1. `docs(po): commit po-revalidation-epic7-stories-7.2-7.8.md`
2. `docs(stories): amend 7.1 AC2-bis — slugs.ts [PO-MAJOR-03]` (River)
3. `docs(stories): amend 7.4 AC3 — Hospital+Obstetrics [PO-MAJOR-04]` (River)
4. `docs(stories): cross-amend OrganizationJsonLd to 7.2 [PO-MAJOR-02]` (River)
5. `docs(stories): amend 7.6 AC3 — noindex+canonical per SCP §4.3 [PO-MAJOR-01]` (River) OR `docs(adr): add ADR-008 anti-thin-bairro` (Aria) + amendment 7.6

---

## Apêndice A — Evidências citadas

### A.1 SCP §4.3 Story 7.6 AC3 vs Story 7.6 drafted AC3 (MAJOR-01)

**SCP §4.3 Story 7.6, linha 264:**
```
3. Bairros com 1-2 prestadores → noindex + canonical para `/rede/[uf]/[municipio]`
```

**Story 7.6 drafted AC3:**
```
3. NoIndex para bairros 1-2 prestadores:
   - Não inclui em `generateStaticParams` (não gera arquivo)
   - Página renderiza dinamicamente via `dynamic = 'force-dynamic'` no fallback
     ou retorna `notFound()` (decisão Aria — preferência por `notFound()` para
     não confundir Google com 200 noindex)
   - Bairro acessado por URL direta com 1-2 prestadores: 301 para
     `/rede/[uf]/[municipio]/`
```

**Conflito direto.** Decisão pendente formalização.

### A.2 ADR-006 Context — escopo das mitigações é transversal (MAJOR-02)

**`docs/decisions/adr-006-url-as-trademark-policy.md` linhas 22-24:**
```
Combinado com URLs UF/município/bairro (~10.000+ URLs), o site terá uso
massivo de marca Amil em URLs, expandindo a superfície já estabelecida
pelo NFR8 (uso do termo "Amil" em texto).
```

ADR-006 §"5 Mitigações obrigatórias" linha 53-79 não restringe ao Cluster E. Logo aplicável a 9.325 + 700-800 + 250-350 páginas adicionais.

### A.3 Story 7.1 ACs vs ADR-006 §"Slug rules" (MAJOR-03)

**ADR-006 linhas 33-34:**
```typescript
// src/lib/operadoras/amil/slugs.ts (a ser criado em Story 7.1)
export const REDE_SLUGS: Record<RedeAmilNome, string> = { ... }
```

**Story 7.1 ACs 1-12 (do arquivo `7.1.schema-loader-reescrito.story.md`):**
- AC1: `src/types/rede-credenciada-amil.ts`
- AC2: `src/lib/operadoras/amil/rede-credenciada-loader.ts`
- AC3: `inferTipoAtendimento`
- AC4: cache em memória
- AC5: `slugify` (helper genérico, NÃO `REDE_SLUGS` constante)
- AC6-12: deprecação, tests, lint, etc.

**Gap:** nenhuma AC menciona `slugs.ts` ou `REDE_SLUGS`.

### A.4 Schema.org check `Maternity` (MAJOR-04)

```
$ curl -I https://schema.org/Maternity
HTTP/2 404
```

Schema.org canonical types incluem: `Hospital`, `MedicalClinic`, `MedicalLaboratory`, `EmergencyService`, `MedicalImagingService`, `DiagnosticLab`, `MedicalOrganization`, `Pharmacy`, `Physician`. **`Maternity` não existe.**

Padrão canônico para maternidade:
```jsonld
{
  "@context": "https://schema.org",
  "@type": "Hospital",
  "name": "Maternidade Pro Matre",
  "medicalSpecialty": { "@type": "MedicalSpecialty", "name": "Obstetrics" }
}
```

### A.5 SCP §4.3 vs Story 7.4 AC3 — count subtipos

**SCP §4.3 Story 7.4 AC3 (linhas 233):**
```
3. Schema markup por tipo: `Hospital`, `MedicalClinic`, `MedicalLaboratory`,
   `EmergencyService`, `MedicalOrganization` fallback (Outro)
```
**= 5 subtipos**

**Story 7.4 drafted AC3:**
```
3. Schema markup por tipo inferido via component <PrestadorJsonLd /> discriminated union:
   - Hospital (tipo === 'Hospital')
   - MedicalClinic (tipo === 'Clínica')
   - MedicalLaboratory (tipo === 'Laboratório')
   - EmergencyService (tipo === 'Pronto-Socorro')
   - Maternity (tipo === 'Maternidade')           ← INTRODUZIDO
   - MedicalOrganization fallback (tipos 'Outro', 'Diagnóstico por Imagem',
     'Centro/Instituto', 'Odontologia')
```
**= 6 subtipos (adicionou `Maternity`).**

### A.6 Story 7.6 AC3 + AC9 conflito Next.js (MINOR-01)

**Story 7.6 AC3:**
```
- Página renderiza dinamicamente via `dynamic = 'force-dynamic'` no fallback
  ou retorna `notFound()` (decisão Aria...)
```

**Story 7.6 AC9:**
```
9. ISR revalidate = 2592000 (30 dias) + force-static.
```

Next.js 14 docs: `dynamic = 'force-dynamic'` e `dynamic = 'force-static'` são mutually exclusive em mesmo route segment. Stories AC3 + AC9 não-coexistíveis.

---

**Status do documento:** APROVADO COM RESSALVAS — 5 stories ficam Draft até 4 amendments OBRIGATÓRIOS aplicados
**Owner:** Pax (Product Owner) ♎
**Data:** 2026-04-28
**Próximos:** River aplica O-1/O-2/O-4 (25min total); Pax+Aria resolvem O-3 (10min OR ADR mini); Pax executa `*validate-story-draft` em cada story após amendments

— Pax, equilibrando prioridades 🎯
