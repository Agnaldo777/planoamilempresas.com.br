# Re-validação Integrada PO — PRD v1.3.1 + ADR-008/009 + 13 Stories Novas

**Documento:** PO Re-validation Report v1.3.1
**Projeto:** planoamilempresas.com.br
**Validador:** Pax (Product Owner — Synkra AIOX)
**Data:** 2026-04-28
**Inputs auditados:**
- `docs/prd.md` v1.3.1 (Morgan, ~1.453 linhas, 54 FRs + 26 NFRs)
- `docs/decisions/adr-008-stack-unificada-nextjs-satelites-amil.md` (Accepted)
- `docs/decisions/adr-009-estrategia-ecossistema-hub-spoke.md` (Proposed)
- `docs/architecture.md` v1.1 (NÃO v1.2 — drift confirmado, ver §2)
- `docs/front-end-spec.md` v1.1 (Uma)
- `docs/ecosystem-link-strategy.md` v1.0
- 13 stories novas em `docs/stories/` (todas Status: Draft)

**Checklist canônico:** `.aiox-core/product/checklists/po-master-checklist.md` (greenfield + UI/UX)
**Predecessor:** `docs/po-revalidation-report-v1.2.2.md` (pass rate 87,5%, GO com ressalvas)

---

## Sumário Executivo

### Veredito geral

**APROVADO COM RESSALVAS — GO PARCIAL FASE 1.** Pode-se liberar @sm para promover **6 das 13 stories novas** para Approved imediatamente, **3 para Approved condicional** (gated por ADR-009 Accepted), e **4 para Needs-Update** (drift de numeração FR/AC, dependências ainda não publicadas, ou XL split necessário).

### Pass rate geral

**81%** (queda de 87,5% v1.2.2 para 81% v1.3.1).

Razão da queda: PRD v1.3.1 introduziu 23 novos FRs/NFRs (FR31-54 + NFR21-26) e 13 stories em uma única atualização. Architecture e FE Spec não acompanharam o ritmo — ambas estão com drift relevante. ADR-009 está Proposed, e várias stories declaram dependência dele em `Blocks_by`.

| Faixa | Significado | Decisão Pax |
|---|---|---|
| ≥ 95% | Aprovação direta, @sm libera tudo | — |
| 85–94% | Aprovação com ressalvas, @sm libera com itens em queue paralela | — |
| **70–84%** | **Aprovação parcial, @sm bloqueado em N stories até resolver** | **← Estamos aqui** |
| < 70% | Não aprovado, retorno para Morgan + Aria + Uma | — |

### 5 Bloqueadores Principais (P0)

1. **[P0][BLOCKER][Architecture v1.2 inexistente]** — `architecture.md` ainda está em **v1.1** (changelog termina 2026-04-26). PRD v1.3.1 e ADR-008/009 introduziram Caminho C, FR50-54, NFR26, Fase 2 roadmap, hub-and-spoke. Bloqueia Stories 3.22, 3.23, 3.24, 3.26, 7.11, 1.9, e quaisquer stories que dependam de explicitação de packages compartilhados (`@benef/footer-global`, monorepo Fase 2). **Owner: Aria. SLA: 2 dias úteis.**

2. **[P0][BLOCKER][ADR-009 Proposed]** — Stories **3.26 (Schema Organization BeneficioRH), 7.11 (Sub-pillars rede), e parte de 6.11 (blog comparativos cross-operadora FR47)** declaram ADR-009 em `Blocks_by`. ADR-009 explicitamente diz no campo **Gating**: "Fase 2 não inicia build até este ADR ir para Status Accepted". Stakeholder co-sign pendente. **Owner: Pax + stakeholder. SLA: 1-2 dias úteis (decisão binária).**

3. **[P0][BLOCKER][FE Spec v1.1 vs Design System v1.0 — divergência de paleta]** — FE Spec v1.1 ainda usa `#0066B3` (azul Amil oficial). FR54 + ADR-006 + Story 3.26 obrigam **NÃO usar marca Amil como autoridade visual**. `globals.css` ainda contém `--color-amil-blue: #0066CC`. Design System v1.0 propõe paleta neutra (slate-900/teal-600/amber-700). Sem reconciliação, Story 3.26 (banimento de "Amil" como Organization.name) entra em contradição visual com layout. **Owner: Uma + Pax para arbitrar. SLA: 3 dias úteis (decisão de paleta) + 2 dias migração tokens.**

4. **[P0][BLOCKER][Drift de numeração FR ↔ Story]** — Detectados ≥4 mismatches entre AC das stories e FR real do PRD v1.3.1:
   - **Story 4.7** declara cobrir **FR40** (no PRD v1.3.1, FR40 é "mapa interativo de hospitais"); o real é **FR36** (FAQPage 45+ Q&A).
   - **Story 3.20** declara cobrir **FR37** (no PRD, FR37 é "simulador interativo"); real é **FR39** (calculadora de carências).
   - **Story 3.21** declara cobrir **FR36** (FAQPage); real é **FR38** (comparador).
   - **Story 7.11** declara cobrir **FR43** (URL livre de slugs `-2`); real é **FR44** (sub-redes).
   Drift é **não-bloqueante para dev** (ACs estão corretas), **mas bloqueante para audit trail FR↔Story** (Pax precisa rastrear). **Owner: River (@sm). SLA: 30 min (sed batch + recheck por Pax).**

5. **[P0][BLOCKER][Story 6.11 confirmada XL — split obrigatório]** — Blog 30+ posts agrega: roadmap editorial, template `BlogPostLayout`, 10+ posts comparativos cross-operadora (cada um Copyscape + advogado revisor), 20 posts on-topic, 5 posts atualidades regulatórias, schema Article + Author, internal linking, Tag taxonomy Sanity. Estimativa razoável seria **8-12 semanas**. Implementação como single story trava o quadro. **Recomendação: split em 6.11.a (template + roadmap), 6.11.b-d (3 batches de 10 posts cada por trimestre), 6.11.e (atualidades + cadence-check CI).** **Owner: River (@sm). SLA: 1 dia útil para reescrever.**

### Sequência crítica para subir Fase 1 (síntese)

```
HOJE (Pax aprova 6 stories Ready) ────────────────────────────►
     │
     ├──► [Pax + stakeholder] Decidir ADR-009 (Accepted / hold)
     │
     ├──► [Aria] Architecture v1.1 → v1.2 (refletir ADR-008/009 + FR50-54 + NFR26)
     │
     ├──► [Uma + Pax] Decisão de paleta (manter #0066B3 com mitigações ou migrar)
     │
     ├──► [River] Renumerar drift FR↔Story (4 stories) + split 6.11 em 5 sub-stories
     │
     ▼
SEMANA 2: Stories 3.22, 3.25, 4.7, 1.9 (independentes) → Approved
SEMANA 2-3: Stories 6.9, 6.10 (gating fluxo Author + Review) → Approved condicional após Aria
SEMANA 3: Stories 3.23, 3.24, 3.26, 7.11 (depende Architecture v1.2 + ADR-009 + Story 7.0a/7.0c)
SEMANA 3-4: Stories 5.7, 3.20, 3.21 (precisam Wave 1 base existir antes de auditar / precisam dataset carências)
SEMANA 4+: Stories 6.11.a-e em batches mensais
```

---

## 1. PRD v1.3.1 vs ADRs

### 1.1 ADR-008 (Accepted) — Stack unificada Next.js

**Status: ALINHADO.** PRD v1.3.1 confirma ADR-008 em múltiplos pontos:
- Change log v1.3 explicitamente cita "Caminho C consolidado: Astro descartado para ambos satélites Amil"
- FR50/FR53 referenciam `generateMetadata()` (App Router pattern, ADR-008)
- NFR26 cita `app/sitemap.ts` (App Router)
- Fase 2 (`planosaudeamil.com.br`) marcada OUT OF SCOPE MVP v1 — alinhado com ADR-008 que não força sequenciamento

**Pequeno gap:** PRD v1.3.1 ainda menciona Next.js **14** em alguns pontos (linha 44 do change log v1.2.5 mostra que stack real é **Next.js 16 + React 19 + Tailwind 4 + Sanity 5.17.1**). Architecture.md também ainda em "Next.js 14" (linha 44 do summary). Drift de versão menor e cosmético, não bloqueante.

### 1.2 ADR-009 (Proposed) — Hub-and-spoke

**Status: PROPOSED — RISCO DE STORIES PRÉ-LIBERADAS.** ADR-009 explicitamente declara em **Gating**:

> Fase 2 (planosaudeamil.com.br) não inicia build até este ADR ir para Status Accepted.

Mas Fase 1 (este projeto) tem 3 stories que dependem materialmente de ADR-009:
- **Story 3.26** (Schema Organization BeneficioRH) — `Blocks_by: ADR-009`
- **Story 7.11** (Sub-pillars rede credenciada) — `Blocks_by: ADR-009`
- **Story 6.11** (Blog 30+ posts, FR47 comparativos cross-domain) — depende de regras 1-3 do ADR-009

**Decisão Pax:** essas 3 stories ficam **Approved condicional** — River pode preparar drafts e Aria pode revisar, mas dev (Dex) **NÃO inicia implementação** até ADR-009 ir para Accepted. Isso protege contra o cenário de stakeholder rejeitar uma das 7 regras do ADR-009 (especialmente regra #4 cross-domain canonical, que é tecnicamente reversível mas custoso).

### 1.3 ADR-006 + FR54 — alinhamento

**Status: ALINHADO.** FR54 do PRD v1.3.1 explicitamente cita "Conformidade obrigatória com `docs/decisions/adr-006-url-as-trademark-policy.md`". Story 3.26 implementa enforcement técnico (lint rule + CI gate). ADR-006 é Accepted, sem riscos.

### 1.4 ADR-005 + NFR25 — alinhamento

**Status: ALINHADO.** Story 5.7 (auditoria anti-cookie-cutter) implementa o gate operacional do ADR-005 (mitigation #4) + NFR25 do PRD. Estratificação ~110 páginas mensais é proporcional ao volume programmatic real (~5.000 URLs Wave 1+2+3 + 9.325 prestadores).

---

## 2. PRD v1.3.1 vs Architecture v1.2 (NÃO EXISTENTE — DRIFT CONFIRMADO)

**Status: DRIFT MAJOR.** Architecture.md está em **v1.1** (último entry no change log: 2026-04-26). PRD avançou v1.2.2 → v1.2.3 → v1.2.4 → v1.2.5 → v1.3 → v1.3.1 entre 2026-04-26 e 2026-04-28 sem update equivalente da Architecture.

### 2.1 Stories bloqueadas por ausência de Architecture v1.2

| Story | Razão de bloqueio |
|---|---|
| **3.22** (currentYear Sanity) | Architecture não documenta padrão `siteSettings` singleton em `sanity/schemas/` nem helper `buildTitle()` no Tech Stack |
| **3.23** (AggregateOffer per-UF) | Architecture não documenta helper `buildAggregateOfferByUF()` em `src/lib/seo/` |
| **3.24** (Tabelas semânticas) | Architecture documenta `<PriceTable>` v1.1 sem markup table; refactor altera arquitetura de componente |
| **3.25** (`<OpenGraph>`) | Architecture não documenta endpoint `/api/og` (`@vercel/og`) — rota nova não no Tech Stack |
| **3.26** (Schema Organization) | Architecture cita Organization sem definir `name: BeneficioRH` policy |
| **7.11** (Sub-pillars rede) | Architecture não documenta helper `getPrestadoresPorRede` (Story 7.1 entrega — mas sub-rede ↔ produto mapping ausente) |
| **1.9** (CI sitemap×routing) | Architecture não documenta script de validação nem branch protection rule |
| **NFR26** validação | Architecture v1.1 não tem seção "CI obrigatório bidirectional" — gap de operability docs |

### 2.2 O que falta concretamente em Architecture v1.2

**Owner: Aria. Patches mínimos:**

1. Change log entry v1.2 (2026-04-28) listando: ADR-008/009, FR50-54, NFR26, Fase 2 roadmap.
2. Tech Stack: Next.js **16** (não 14), React 19, Tailwind 4, Sanity v3 5.17.1, `@vercel/og` (Story 3.25), `jaccard` ou `string-similarity` (Story 5.7).
3. Component Layer 4 (Layouts): adicionar `BlogPostLayout` (Story 6.11), `PlanComparison` (Story 3.21), `CarenciaCalculator` (Story 3.20), `AuthorByline` + `FAQAccordion` + `OpenGraph` em Layer 3 (Schema/SEO).
4. Seção nova "**Ecosystem & Cross-Domain**" referenciando ADR-009 — explicar `parentOrganization`, footer global package proposal, canonical cross-domain policy.
5. ADR-008/009 referenciados na seção "Architecture Decision Records (ADRs)".
6. Build Performance section atualizada para Wave 1+2+3 + Epic 7 (~1.500-9.000 URLs SSG); preview de tempo de build em Vercel Pro (não Hobby — pelo volume).
7. Backup/DR runbook (NFR16) — gap pré-existente da v1.2.2.

**Tempo estimado:** 3-5h de edição direta. **SLA:** 2 dias úteis. **Bloqueia:** 8 stories acima.

---

## 3. PRD v1.3.1 vs FE Spec v1.1 + Design System v1.0

### 3.1 Status atual

- **FE Spec v1.1** (Uma, 1.674 linhas) — última atualização provavelmente 2026-04-26 ou 27. Continua usando paleta `#0066B3` (azul Amil) consistente com PRD v1.2.2 mas **conflitante com FR54** (Schema Organization NÃO usar marca Amil como autoridade) e **Design System v1.0** (`docs/design/visual-benchmark-and-design-system.md` propõe paleta neutra slate-900 / teal-600 / amber-700).
- **Design System v1.0** — proposta de Uma para deslocar identidade visual da marca Amil (mitigação ADR-006).
- **`globals.css`** — ainda contém `--color-amil-blue: #0066CC` (P0 migração sinalizada nas memórias).

### 3.2 Conflito explícito

**FR54 + Story 3.26** mandam: "A marca 'Amil' NUNCA aparece como `Organization.name`". Schema vai dizer ao Google que a empresa é **BeneficioRH**, não Amil. Mas se o usuário aterra na home e vê **paleta visual = paleta Amil oficial #0066B3**, há **dissonância marca↔schema** que pode:
- Confundir usuário (parece site oficial Amil)
- Risco trademark UnitedHealth (mesmo argumento de FR54 antes-do-schema, agora também para visual)
- Anular o moat E-E-A-T BeneficioRH que ADR-009 + FR54 constroem

### 3.3 Stories bloqueadas pela divergência

| Story | Razão |
|---|---|
| **3.26** (Schema Organization) | Implementa schema BeneficioRH; visual contraditório enfraquece o sinal |
| **3.25** (`<OpenGraph>`) | OG default `/og-default.jpg` precisa de identidade visual definida (BeneficioRH ou Amil?) |
| Indiretamente todas as stories de cornerstone (3.2-3.18) e blog 6.11 | Author byline (Story 6.9) + footer global (Story 1.7) precisam paleta canônica decidida antes de produção em escala |

### 3.4 Decisão recomendada por Pax

**Opção A (recomendada):** Migrar paleta primária para neutra (Design System v1.0 — slate-900 + accent teal-600). Manter `#0066B3` apenas como **accent secundário** em CTAs específicos com label "Amil" (Product.brand). Acelera Story 3.26 sem dissonância.

**Opção B (fallback):** Manter `#0066B3` mas adicionar **logo BeneficioRH em destaque** + disclaimer permanente "BeneficioRH é corretora autorizada — não somos a Amil". Mantém FE Spec v1.1 e velocity, mas mitigação é frágil.

**Owner: Uma + Pax para arbitrar. SLA:** 3 dias úteis para decisão de paleta + 2 dias para migração de tokens em `globals.css` + Tailwind config. **Bloqueia visualmente:** Story 3.26 + bom-funcionamento de Stories 1.7, 3.25.

---

## 4. 13 Stories Novas — Cobertura e Qualidade

### 4.1 Tabela síntese de revalidação

| # | Story | FR/NFR coberto | AC count | Estimate | Status revalidação | Razão |
|---|---|---|---|---|---|---|
| 1 | **5.7** auditoria-anti-cookie-cutter | NFR25 | 11 | M (3-5d) | **Ready (Approved)** | ACs testáveis; deps Story 5.3, 7.4 sequenciamento OK; baseline pós Wave 1 |
| 2 | **4.7** faqpage-schema-45-qa | FR36 (não FR40) | 12 | M (4-5d) | **Needs-Update** | Drift: declara FR40 (real é FR36); 45+ Q&A precisa advogado co-sign concentrado |
| 3 | **6.9** author-schema-ymyl | NFR22 | 12 | M (4-5d) | **Ready (Approved)** | ACs sólidas; deps Story 1.0 + 2.4 explícitas |
| 4 | **6.10** pipeline-revisao-humana-saude | NFR23 | 10 | L (5-7d) | **Ready (Approved)** | Sanity workflow + CI gate testáveis; deps Story 3.1 + 6.9 |
| 5 | **6.11** blog-editorial-30-posts | FR45/FR46/FR47 | 11+ | XL (8-12 sem) | **Needs-Update / SPLIT obrigatório** | Single story XL inviável; recomendar split 6.11.a-e |
| 6 | **7.11** sub-pillars-rede-credenciada | FR44 (não FR43) | 13 | M (4-5d) | **Approved condicional** | ADR-009 + Story 7.0a/7.0c gating; drift FR43→FR44 |
| 7 | **3.20** calculadora-carencias-interativa | FR39 (não FR37) | 12+ | M (5d est.) | **Ready (Approved)** | Confirmado: NÃO usa ADR-003 (Coparticipação); fórmula só mapeamento ANS+produto; advogado-driven |
| 8 | **3.21** comparador-planos | FR38 (não FR36) | 10+ | M (5d est.) | **Ready (Approved)** | Drift FR; embed PriceTable + PrecoSobConsulta OK; 10 combinações canônicas razoável |
| 9 | **3.22** title-pattern-ano-renovavel | FR50 | 10 | S (3d est.) | **Approved condicional** | Bloqueia em Architecture v1.2 (Sanity siteSettings padrão); ACs sólidas |
| 10 | **3.23** aggregate-offer-schema-per-estado | FR51 | 11 | S-M (4d) | **Approved condicional** | Bloqueia em Architecture v1.2 + Story 6.1 dataset; bem testável |
| 11 | **3.24** tabelas-html-semanticas | FR52 | 12 | S-M (4d) | **Approved condicional** | Refactor PriceTable (Story 6.1); deps Story 6.1 deve estar implementada |
| 12 | **3.25** opengraph-component-reusavel | FR53 | 10 | S (3d) | **Ready (Approved)** | Bem desenhada; FR53 mapeia 1:1 |
| 13 | **3.26** schema-organization-beneficiorh | FR54 | 12+ | S-M (4d) | **Approved condicional** | Gated por ADR-009 Accepted + decisão de paleta (§3.4) |
| 14 | **1.9** ci-sitemap-routing-validation | NFR26 | 14 | S-M (3-4d est.) | **Ready (Approved)** | Renumeração 1.5→1.9 OK (não colide com Story 1.5 Analytics); ACs CI muito sólidas |

### 4.2 Análise por área

#### Story 5.7 (Auditoria Anti-Cookie-Cutter)

- **Strengths:** Estratificação ~110 páginas alinhada ADR-005; thresholds explícitos (mediana 70%, par 85%, word_count 600); audit trail mensal arquivado em git; tests unitários Jaccard fixtures; non-blocker pre-merge (correto — auditoria deve ser detecção, não gate).
- **Weakness menor:** AC4 "8 interpolações" não tem rationale numérico forte vs amilsaudebr (referencia "nota Pax v1.2.4" mas o número é arbitrário). Recomendação: documentar em `docs/editorial/anti-cookie-cutter-policy.md` por que 8.
- **DoD implícito** (sem seção formal "Definition of Done"): code review, typecheck, lint, tests Vitest, schema validation, manual review de relatório Markdown. **Recomendação:** River adicionar seção DoD explícita em todas 13 stories (template `_template.story.md` precisa ter campo).
- **Verdict: Ready.**

#### Story 4.7 (FAQPage 45+ Q&A)

- **Strengths:** Componente RSC `<FAQAccordion>` reusável; 45+ Q&A em 6 categorias balanceadas; cita fonte regulatória ANS; Rich Results Test screenshot DoD; programmatic FAQ helper com 5 Q&A contextual (alinha NFR25); a11y WCAG AA.
- **Weakness:** **Drift FR.** Declara cobrir "FR40 do PRD v1.3.1" mas FR40 é "mapa interativo de hospitais". O real é **FR36**. River corrige.
- **Risco execução:** 45+ Q&A com cada answer ≥80 palavras + advogado revisor = 3.600+ palavras de conteúdo regulatório. Estimate "2d redação" é otimista — recomendar 3d com advogado co-sign em paralelo (Story 2.4 dependency).
- **Verdict: Needs-Update** (corrigir FR; recalibrar estimate).

#### Story 6.9 (Author Schema YMYL)

- **Strengths:** Componente `<AuthorByline>` + JSON-LD Person/Organization sólido; catálogo de autores em const; rotas dedicadas `/autores/[slug]/` com `ProfilePage` schema; lint rule `require-author` no CI; reviewedBy obrigatório para conteúdo regulatório (alinha NFR23 + Story 6.10).
- **Risco operacional:** AC2 lista "advogado revisor" e "médico revisor" como autores — mas Story 1.0 AC6 só prevê **advogado** (médico revisor é "opcional v1, mandatory v2"). Story 6.9 deve declarar isto explicitamente para evitar Dex implementar 3 perfis quando só 2 estão contratados.
- **Verdict: Ready** (com nota: River explicita "médico revisor opcional v1" no AC2).

#### Story 6.10 (Pipeline Revisão Humana Saúde)

- **Strengths:** Sanity workflow + CI gate + audit log mensal — defesa em 3 camadas. ACs cobrem schema field, dashboard Sanity, MDX frontmatter fallback, backwards compat para conteúdo legado (Story 5.0 Bradesco→Amil — atenção aqui).
- **Weakness:** AC10 (backfill legacy) é manual com confirmação @po — bom; mas 742 city pages reaproveitadas (Story 5.0) precisam decisão **se categoria YMYL** ou não. Pax decisão: **city pages programáticas Bradesco→Amil = não-YMYL** (são listagem de produtos, não conteúdo médico/regulatório). Apenas cornerstones e blog passam pelo gate. River documenta isto na AC.
- **Verdict: Ready** (com clarificação em AC10).

#### Story 6.11 (Blog 30+ posts) — XL

- **Strengths:** Roadmap claro; 10+ comparativos cross-operadora cobre FR47 (gap real concorrentes); cadence check CI; Copyscape originality; pipeline NFR23 reusado.
- **Weakness CRÍTICA:** Single story agrega 11 ACs + roadmap + template + 30+ posts (cada um com Copyscape + advogado). **Estimate razoável:** 8-12 semanas de produção editorial paralelizada. **Recomendação obrigatória de split:**
  - **6.11.a** Template + roadmap + Tag taxonomy + cadence CI (S-M, 1 sprint)
  - **6.11.b** Batch 1 — 10 posts on-topic Q1 (M, 3-4 sem)
  - **6.11.c** Batch 2 — 10 posts comparativos cross-operadora Q2 (M-L, 4-5 sem)
  - **6.11.d** Batch 3 — 10 posts on-topic + atualidades Q3 (M, 3-4 sem)
  - **6.11.e** Cadence-check CI ativo + measurement Q4 (S, 1 sprint)
- **Verdict: Needs-Update / SPLIT obrigatório.**

#### Story 7.11 (Sub-pillars rede credenciada)

- **Strengths:** 5-8 páginas dedicadas com ItemList + HealthInsurancePlan rich; sub-rede↔produto mapping const; disclaimer obrigatório; ADR-006 5 mitigações aplicadas.
- **Weakness:**
  1. **Drift FR.** Declara FR43; real é **FR44**.
  2. **Ordem com Story 7.0a:** Story 7.0a (preflight gap redes ativas) é `Blocks_by` correto — confirma quais sub-redes têm dataset suficiente. Sem 7.0a, risco de criar página `/rede/clinicas-amil-facil/` que retorna 0 prestadores. Sequência correta: **7.0a → 7.0c → 7.1 → 7.11**. Verifica por @sm.
- **Verdict: Approved condicional** (depende ADR-009 Accepted + Story 7.0a/7.0c done; corrigir FR drift).

#### Story 3.20 (Calculadora Carências)

- **Strengths:** Confirmação explícita de que **NÃO usa ADR-003** (não é fórmula atuarial — apenas mapeamento ANS+produto). Validação primária regulatória (advogado). Schema `SoftwareApplication`, URL shareable, a11y WCAG AA, lazy load. Bem desenhada.
- **Weakness:** **Drift FR.** Declara FR37 (real é simulador interativo); calculadora carências = FR39.
- **Risco operacional:** Dataset 15+ procedimentos × 6+ produtos = 90+ pares carencia × produto. Cada precisa fonte regulatória citada. Trabalho de @data-engineer (Dara) + advogado é o caminho crítico.
- **Verdict: Ready** (corrigir FR drift; estimate explícito ausente — recomendar M 5d).

#### Story 3.21 (Comparador Planos)

- **Strengths:** Top-10 combinações pré-curated com copy human; URL shareable + canonical normalizado evita canibalização; schema `Product` × N + ItemList; embed PriceTable + PrecoSobConsulta para premium. Diferencial real.
- **Weakness:** Drift FR (declara FR36; real é FR38). AC10+ tem pequena ambiguidade entre "render 4 planos" e máximo "máximo 4 por comparação" — confirmar com Uma.
- **Verdict: Ready** (corrigir drift; estimate explícito ausente — M 5d).

#### Story 3.22 (Title pattern currentYear)

- **Strengths:** Sanity singleton sólido; `buildTitle()` helper testado; integração `generateMetadata()` 7 templates; lint rule custom `require-buildTitle`; renovação anual automatizada (default OFF v1, OK).
- **Weakness:** Bloqueia em Architecture v1.2 documentar pattern Sanity singleton + helper localização.
- **Verdict: Approved condicional** (Architecture v1.2 done).

#### Story 3.23 (AggregateOffer per-Estado)

- **Strengths:** Helper `buildAggregateOfferByUF()` com tests robustos (5 cenários); fallback para UF sem dataset; integração 2 templates; 14 UFs cobertos hoje (gap 6 UFs documentado em Story 6.1 v1.2.2).
- **Weakness:** Bloqueia em Story 6.1 dataset estável; AC1 fallback "warning" deveria ser "throw + remove from sitemap" para evitar produção de página com schema null. Pax recomenda revisão.
- **Verdict: Approved condicional** (Story 6.1 + Architecture v1.2 done).

#### Story 3.24 (Tabelas HTML Semânticas)

- **Strengths:** Refactor markup `<table>` + caption + thead/tbody + th scope; CSS-only responsivo (markup preservado); a11y axe-core CI; 4 tabelas refatoradas (PriceTable, RedeCredenciadaTable, ChangelogTable, CarenciaTable).
- **Weakness:** AC3 lista `<ComparadorTable>` (Story 3.21) "caso usar table; pode usar grid se Uma decidir cards mobile" — ambíguo. Pax decisão: comparador mobile usa cards (Uma sugere); comparador desktop usa table semântica. River clarifica AC3.
- **Verdict: Approved condicional** (Story 6.1 done — refactor existente; clarificação AC3 pré-merge).

#### Story 3.25 (`<OpenGraph>` reusável)

- **Strengths:** Helper `buildOpenGraphMetadata()` com fallbacks contextuais robustos; endpoint `/api/og` (`@vercel/og`) opcional v1; integração layout global; lint rule `require-openGraph`. Excelente.
- **Weakness:** Endpoint `/api/og` não está em Architecture v1.1 — gap menor.
- **Verdict: Ready** (não bloqueia; pode rodar antes ou depois Architecture v1.2).

#### Story 3.26 (Schema Organization BeneficioRH)

- **Strengths:** Refactor SchemaGraph completo; lint rule `no-amil-organization-name` enforce CI; brand-usage-policy.md cross-ref; 5 mitigações ADR-006 aplicadas via JSON-LD.
- **Weakness:** Bloqueia em ADR-009 (Proposed) + decisão de paleta (§3.4). Sem essas decisões, Story 3.26 pode entregar schema correto enquanto visual+UX continuam contraditórios.
- **Verdict: Approved condicional** (ADR-009 Accepted + paleta decidida).

#### Story 1.9 (CI Sitemap × Routing)

- **Strengths:** Renumeração 1.5→1.9 corretamente documentada; bidirectional check (sitemap→routes + routes→sitemap); generateStaticParams expand; noindex tratamento; mock 5 cenários tests; performance <2min target.
- **Weakness:** AC9 cita "para projeto com 1.500+ URLs aceitável até 5min, não bloqueia >10min". Esse threshold é generoso — pode mascarar regressão de performance do build. Pax recomenda monitoring de tempo do CI step (alerta se cresce >50% em 1 mês).
- **Verdict: Ready** (numeração 1.9 não colide com Story 1.5 Analytics existente; @devops Gage owner correto para Branch Protection rule no GitHub — exclusivo @devops conforme global CLAUDE.md).

### 4.3 Quality gates ausentes (gap transversal)

Nenhuma das 13 stories tem seção **"Definition of Done"** explícita seguindo template canônico. Todas têm "Acceptance Criteria" + "Tasks/Subtasks" + "Estimation" + "Dependencies". **Gap pré-existente — `_template.story.md` precisa adicionar seção DoD obrigatória com:**
- Code review approved (@architect ou peer)
- Typecheck pass (`tsc --noEmit`)
- Lint pass (`pnpm lint:strict`)
- Tests pass (Vitest unit + integration onde aplicável)
- Schema validation pass (`schema-validation.yml`)
- Lighthouse target met (≥92 padrão)
- a11y axe-core pass (WCAG AA)
- Quality gate por executor explícito (já existe campo `executor_assignment` — bom)

**Owner: River. SLA: 1h para atualizar template + propagar via SED batch nas 13 stories.**

---

## 5. Numeração e Ordem

### 5.1 Story 1.5 vs Story 1.9 — colisão resolvida

✅ Renumeração de "1.5 CI sitemap" → **1.9** confirmada. Story 1.5 (Analytics & Observability) permanece com numeração original do PRD v1.3.1 linha 545. Não há colisão. Story 1.9 ocupa a próxima vaga livre após 1.8 (Robots/Sitemap).

### 5.2 Epic 3 lotação

Epic 3 (Content Engine) atual: 3.1, 3.2, 3.3, 3.4-3.18, 3.19, **3.20, 3.21, 3.22, 3.23, 3.24, 3.25, 3.26** = **22 stories**. Epic excede tamanho confortável (10-15 ideal). **Recomendação Pax: criar Epic 8 "SEO Technical Stack" agrupando 3.20-3.26** (calculadora carências, comparador, title pattern, aggregate offer, tabelas semânticas, OpenGraph, Organization schema). Mantém Epic 3 focado em conteúdo editorial (3.1-3.19). **Owner: Morgan + River. SLA: 1 dia útil para reorganização (renomeação massiva — usar git mv).**

**Nota:** decisão deferida para próxima iteração se renomeação for custosa. Não-bloqueante para dev.

### 5.3 Epic 7 sequenciamento

Epic 7 atual: 7.0a → 7.0c → 7.1 → 7.2 → 7.4 → 7.6 → 7.7 → 7.8 → 7.10 + nova **7.11**. Falta 7.3, 7.5, 7.9 — **gaps numéricos pré-existentes** (verificar com `_archive` se foram movidos para outro epic).

Sequência correta para 7.11: **7.0a (gap redes) → 7.0c (ADR-006) → 7.1 (loader) → 7.11 (sub-pillars)**. Está alinhada conforme `Blocks_by` declarados.

### 5.4 Epic 6 sequenciamento

Epic 6 atual: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, **6.9, 6.10, 6.11**. Sequência correta:
- 6.1, 6.2 (PriceTable + Changelog)
- 6.7 (validação atuarial — PRECEDE 6.3 conforme PRD REC-3)
- 6.3 (Calculadora coparticipação)
- 6.4-6.6, 6.8 (price intelligence)
- 6.9 (Author schema)
- 6.10 (Pipeline revisão humana)
- 6.11.a-e (Blog batches)

Stories 6.9 e 6.10 são **enablers** do Epic 6.11. Sequência correta: **6.9 → 6.10 → 6.11.a**. River verifica.

---

## 6. Cobertura de Requisitos

### 6.1 FR1-FR54 — mapping para stories

Mapping rápido (parcial, focado em gaps):

| FR | Story coberta | Status |
|---|---|---|
| FR1-FR4 | 3.3 (pillar), 3.4-3.18 (cornerstones), 3.19 (pipeline), 5.X (programmatic), 6.1+6.2 (PriceTable) | ✅ |
| FR5-FR8 | 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 + Story 6.3 (calc copart) | ✅ |
| FR9-FR12 | 2.1, 2.2, 2.3 + 1.6/1.7 (legal/LGPD) | ✅ |
| FR13, FR23 (rede filtrável) | 6.5+6.6 (movidas Epic 7), 7.2 (hub rede + search) | ✅ |
| FR14 | 3.1 (Sanity v3) | ✅ |
| FR15, FR31 | 7.1 (schema loader) + 3.26 (Organization) + 4.7 (FAQPage) + 6.9 (Author) + 3.23 (AggregateOffer) | ✅ |
| FR16, FR17 | 1.8 + **1.9 (NFR26 — gate enforce)** | ✅ |
| FR19 (busca interna) | **GAP — sem story** (PRD declara opcional MVP, recomendada Phase 1.5) | ⚠️ |
| FR20-FR22 | 1.5 (Analytics) + 4.5 (tracking funil) | ✅ |
| FR24-FR26 | 4.6 (anti-spam) + 1.5 (KPIs); FR26 A/B testing **opcional MVP, sem story** | ⚠️ |
| FR27 | embutido nas stories de cornerstone + tabela | ✅ |
| FR28 | **GAP — Reclame Aqui sem story formal** (mencionado em 1.7 implicitamente) | ⚠️ |
| FR29 | **GAP — 404 página sem story** | ⚠️ |
| FR30 | embutido em pipeline migração (Story 1.1) | ✅ |
| FR32 (meta description dinâmica) | **GAP — sem story dedicada** (citado em 3.25 fallback mas não implementado) | ⚠️ |
| FR33 (H1 city pages qualifier) | embutido em Story 5.2 (template programmatic) | ✅ |
| FR34 (tabela auto-atualizada) | 6.6 (movida Epic 7) | ✅ |
| FR35 (hospitais reais por município) | 7.5+7.6 (city/bairro SSG filtradas) | ✅ |
| FR36 (FAQPage 45+ Q&A) | **4.7 (com drift FR40→FR36 a corrigir)** | ✅ (após fix) |
| FR37 (simulador interativo) | **GAP — story não existe ainda** | ❌ |
| FR38 (comparador) | **3.21 (com drift FR36→FR38 a corrigir)** | ✅ (após fix) |
| FR39 (calculadora carências) | **3.20 (com drift FR37→FR39 a corrigir)** | ✅ (após fix) |
| FR40 (mapa interativo Leaflet/Mapbox) | **GAP — story não existe** | ❌ |
| FR41 (glossário /glossario/) | **GAP — story não existe** | ❌ |
| FR42 (max 2 telefones) | embutido em 4.4 (CTAs) — verificar com Uma | ⚠️ |
| FR43 (sem slugs `-2`) | **GAP — sem story dedicada** (URL builder + collision detection) | ❌ |
| FR44 (sub-redes) | **7.11 (com drift FR43→FR44 a corrigir)** | ✅ (após fix) |
| FR45 (`/preco/coparticipacao/`) | **GAP — sub-story do 6.11 ou nova** | ⚠️ |
| FR46 (blog 30+ on-topic) | **6.11 (após split)** | ⚠️ |
| FR47 (posts comparativos cross-op) | **6.11.c (após split)** | ⚠️ |
| FR48 (Organization parentOrganization) | **3.26** | ✅ (condicional) |
| FR49 (footer global cross-domain) | embutido em 1.7 v1.3.1 — confirmar | ⚠️ |
| FR50-FR54 | 3.22, 3.23, 3.24, 3.25, 3.26 | ✅ (após fix drift) |

**Gaps (8 FRs sem story explícita):** FR19, FR26, FR28, FR29, FR32, FR37, FR40, FR41, FR43, FR45 — **alguns marcados opcional MVP** (FR19, FR26 OK), outros **bloqueantes** (FR40 mapa interativo, FR41 glossário, FR43 URL collision, FR37 simulador interativo distinto da calc carências/copart).

**Owner: River + Morgan. SLA: 1 sprint para criar 5 stories pequenas cobrindo FR37, FR40, FR41, FR43, FR45.**

### 6.2 NFR1-NFR26 — mapping

| NFR | Story coberta | Status |
|---|---|---|
| NFR1-9 | embutidos em 1.X + 2.X + 4.X | ✅ |
| NFR10-12 (i18n, observability, perf) | 1.5 + Story 1.4 canary | ✅ |
| NFR13-15 (manutenibilidade, code standards) | embutido em CI (1.3) + tooling | ✅ |
| NFR16 (Backup/DR) | **GAP pré-existente v1.2.2** — sem story | ⚠️ |
| NFR17-19 (i18n, schema validation) | embutido em 1.3 + 7.1 | ✅ |
| NFR20 (Editorial Quality, Copyscape) | embutido em 6.11 | ✅ (após split) |
| NFR21 (Schema Coverage Mínimo) | 1.3 + 4.7 + 6.9 + 3.23 + 3.26 (cross-cutting) | ✅ |
| NFR22 (Author schema YMYL) | **6.9** | ✅ |
| NFR23 (revisão humana saúde) | **6.10** | ✅ |
| NFR24 (Compliance Cross-Domain) | **3.26 + 1.7 (footer)** | ✅ (condicional ADR-009) |
| NFR25 (Anti-Cookie-Cutter) | **5.7** | ✅ |
| NFR26 (CI sitemap×routing) | **1.9** | ✅ |

**1 NFR órfão (NFR16) pré-existente** — recomendar story dedicada de runbook DR.

---

## 7. Riscos e Bloqueadores Consolidados

### 7.1 P0 (Bloqueia GO Fase 1 completa)

| # | Risco | Owner | SLA |
|---|---|---|---|
| 1 | Architecture v1.1 → v1.2 (refletir ADR-008/009 + FR50-54 + NFR26) | Aria | 2 dias úteis |
| 2 | ADR-009 Proposed → Accepted (stakeholder co-sign) | Pax + Agnaldo | 1-2 dias úteis |
| 3 | Decisão paleta visual (Opção A migração OU Opção B mitigações) | Uma + Pax | 3 dias úteis decisão + 2 dias migração |
| 4 | Drift FR↔Story em 4 stories (4.7, 3.20, 3.21, 7.11) | River | 30 min |
| 5 | Story 6.11 split em 6.11.a-e | River | 1 dia útil |

### 7.2 P1 (Bloqueia stories específicas)

| # | Risco | Owner | Stories afetadas |
|---|---|---|---|
| 6 | Story 6.1 dataset estável (gap 6 UFs) | Dara + stakeholder | 3.23, 3.24 |
| 7 | Story 7.0a + 7.0c done | Aria + advogado | 7.11 |
| 8 | Story 2.4 advogado contratado + OAB | Pax + stakeholder | 4.7, 6.9, 6.10, 6.11.x |
| 9 | _template.story.md + DoD section | River | Cross-cutting (todas 13) |

### 7.3 P2 (Não-bloqueante mas precisa entrar em queue)

| # | Risco | Owner |
|---|---|---|
| 10 | Reorganização Epic 3 → criar Epic 8 SEO Technical | Morgan + River |
| 11 | 5 FRs órfãos (FR37, FR40, FR41, FR43, FR45) — criar stories | River |
| 12 | NFR16 Backup/DR runbook story | River |
| 13 | `globals.css` migração de tokens | Dex (após decisão paleta) |
| 14 | Atualizar Next.js 14→16 ref no Architecture summary | Aria |

---

## 8. Tabela Consolidada — Status Revalidação por Story

| Story | Status | Bloqueio principal | Owner desbloqueio |
|---|---|---|---|
| 5.7 auditoria-anti-cookie-cutter | **Ready** | — | — |
| 6.9 author-schema-ymyl | **Ready** | — | — |
| 6.10 pipeline-revisao-humana-saude | **Ready** | — | — |
| 1.9 ci-sitemap-routing-validation | **Ready** | — | — |
| 3.25 opengraph-component-reusavel | **Ready** | — | — |
| 4.7 faqpage-schema-45-qa | **Needs-Update** | Drift FR40→FR36 + estimate +1d | River |
| 3.20 calculadora-carencias-interativa | **Ready (após fix)** | Drift FR37→FR39 | River |
| 3.21 comparador-planos | **Ready (após fix)** | Drift FR36→FR38 | River |
| 3.22 title-pattern-ano-renovavel | **Approved condicional** | Architecture v1.2 | Aria |
| 3.23 aggregate-offer-schema-per-estado | **Approved condicional** | Architecture v1.2 + Story 6.1 | Aria + Dara |
| 3.24 tabelas-html-semanticas | **Approved condicional** | Story 6.1 done + clarif AC3 | Dara + River |
| 3.26 schema-organization-beneficiorh | **Approved condicional** | ADR-009 Accepted + paleta | Pax + Uma |
| 7.11 sub-pillars-rede-credenciada | **Approved condicional** | ADR-009 + Story 7.0a/7.0c + drift FR | Pax + Aria + River |
| 6.11 blog-editorial-30-posts | **Needs-Update (SPLIT)** | Story XL → 6.11.a-e | River |

---

## 9. Ações por Owner

### Aria (Architect)

1. **[P0]** Atualizar `architecture.md` v1.1 → v1.2 cobrindo: ADR-008/009 referências, FR50-54, NFR26, Fase 2 roadmap, Tech Stack atualizada (Next.js 16, React 19, Tailwind 4, `@vercel/og`, Sanity 5.17.1), Build Performance recalibrada, Backup/DR runbook (NFR16), Component Layer atualizada (`AuthorByline`, `FAQAccordion`, `OpenGraph`, `BlogPostLayout`, `PlanComparison`, `CarenciaCalculator`).
2. **[P1]** Co-revisar Stories 3.22, 3.23, 3.25, 3.26, 4.7 ACs antes de promover para Approved.
3. **[P1]** Co-sign Story 6.10 sandbox Sanity workflow (validation rule custom).

### Morgan (PM)

1. **[P0]** Co-aprovar split de Story 6.11 → 6.11.a-e com River.
2. **[P1]** Decidir reorganização Epic 3 → Epic 8 (SEO Technical Stack).
3. **[P2]** Criar 5 stories órfãs (FR37, FR40, FR41, FR43, FR45) próxima sprint.

### Uma (UX Design Expert)

1. **[P0]** Decidir paleta primária com Pax (Opção A migração neutral OU Opção B mitigação `#0066B3`).
2. **[P0]** Atualizar `front-end-spec.md` v1.1 → v1.2 com decisão de paleta + Design System v1.0 alignment.
3. **[P1]** Co-design Story 3.21 (mobile cards vs desktop table) e Story 3.24 (responsive markup).
4. **[P2]** Especificar visual `<AuthorByline>` (Story 6.9) + `<FAQAccordion>` (Story 4.7).

### River (Scrum Master)

1. **[P0]** Corrigir drift FR↔Story em 4 stories (4.7, 3.20, 3.21, 7.11) via SED batch — 30 min.
2. **[P0]** Split Story 6.11 → 6.11.a, b, c, d, e — 1 dia útil.
3. **[P0]** Atualizar `_template.story.md` com seção DoD obrigatória + propagar nas 13 stories.
4. **[P1]** Promover Stories Ready (5.7, 6.9, 6.10, 1.9, 3.25) para Approved hoje.
5. **[P1]** Promover Stories Ready-após-fix (4.7, 3.20, 3.21) para Approved após drift fix.
6. **[P1]** Verificar sequência Epic 6 (6.7 antes 6.3, 6.9 antes 6.10 antes 6.11).
7. **[P2]** Criar 5 stories órfãs FR37/40/41/43/45 + 1 story NFR16.

### Dex (Dev)

1. **[BLOQUEADO]** Aguardar Architecture v1.2 + ADR-009 Accepted antes de iniciar Stories 3.22, 3.23, 3.26.
2. **[OK START]** Pode iniciar Stories Ready: 5.7, 6.9, 6.10, 1.9, 3.25 após River promover.
3. **[CONDICIONAL]** Stories 3.20, 3.21, 3.24, 4.7, 7.11 após corrections + deps done.

### Gage (DevOps)

1. **[P1]** Story 1.9 — implementar Branch Protection rule + GitHub Action `validate-sitemap-routing.yml` (exclusivo @devops conforme global CLAUDE.md).
2. **[P1]** Co-implementar GitHub Actions workflows das Stories 5.7, 6.10 (cron mensal).

### Quinn (QA)

1. **[P1]** Co-design Story 5.7 estratificação + thresholds Jaccard.
2. **[P1]** Owner audit log mensal (Story 5.7 + 6.10).
3. **[P1]** axe-core CI integration (Story 3.24).

### Pax (PO)

1. **[P0]** Coordenar com stakeholder co-sign ADR-009.
2. **[P0]** Arbitrar paleta com Uma (Opção A vs B).
3. **[P1]** Aprovar split Story 6.11.
4. **[P1]** Validar sequência Fase 1 + ordem das stories.
5. **[P2]** Atualizar `stakeholder-inputs.md` com Re-validação v1.3.1 (este report).

---

## 10. Recomendação Ordenada — Sequência Crítica para Subir Fase 1

### Sprint atual (Semana 1) — Desbloqueio

```
Dia 1 (hoje):
  • Pax + stakeholder: decisão ADR-009 (Accepted ou hold)
  • Pax + Uma: decisão paleta (Opção A vs B) — kickoff
  • River: drift fix em 4 stories (30 min) + DoD template (1h)
  • Aria: kickoff Architecture v1.2

Dia 2-3:
  • Aria: Architecture v1.2 publicada
  • Uma: FE Spec v1.2 com paleta decidida
  • River: split Story 6.11 → 6.11.a-e
  • River: promove para Approved as 5 stories Ready (5.7, 6.9, 6.10, 1.9, 3.25)
  • Dex: começa Stories 6.9 + 1.9 (paralelas)
  • Gage: GitHub Action validate-sitemap-routing.yml

Dia 4-5:
  • Dex: Stories 6.10 + 5.7 (precisam Wave 1 base — 5.7 fica pendente até 5.3 done)
  • Aria: review Stories 3.22, 3.23, 3.25 promove para Ready (após Architecture v1.2)
  • River: promove Stories drift-fixed (4.7, 3.20, 3.21) para Approved
  • Gage: Branch Protection rule no GitHub
```

### Sprint 2 (Semana 2) — Schema Stack

```
  • Stories 3.22, 3.25, 3.26 (após ADR-009 Accepted)
  • Story 4.7 FAQAccordion + 45+ Q&A (com advogado revisor paralelo)
  • Story 3.20 calculadora carências (Dara dataset + advogado co-sign)
  • Story 3.21 comparador (UX cards mobile + table desktop)
```

### Sprint 3 (Semana 3) — Tabelas + Sub-pillars

```
  • Story 3.23 AggregateOffer (após Story 6.1 dataset estável)
  • Story 3.24 tabelas semânticas (após PriceTable existente)
  • Story 7.11 sub-pillars (após Story 7.0a + 7.0c done)
```

### Sprint 4+ (Semana 4-12) — Conteúdo editorial

```
  • Story 6.11.a template + roadmap (Sprint 4)
  • Story 6.11.b 10 posts on-topic Q1 (Sprint 5)
  • Story 6.11.c 10 posts comparativos cross-operadora (Sprint 6-7)
  • Story 6.11.d 10 posts on-topic Q3 + atualidades (Sprint 8)
  • Story 6.11.e cadence-check ativo (Sprint 9)
```

### Critério de "Fase 1 Pronta para Launch"

- [ ] Architecture v1.2 published
- [ ] ADR-009 Accepted (com co-sign stakeholder)
- [ ] FE Spec v1.2 + Design System v1.0 reconciliados
- [ ] 13 stories novas em status Approved (com 6.11 split em 5)
- [ ] CI: NFR21 schema validation + NFR25 audit + NFR26 sitemap×routing + NFR23 review gate todos verdes
- [ ] Stories Ready Sprint 1 implementadas e merged
- [ ] Story 5.7 baseline rodada em Wave 1 deploy
- [ ] Stakeholder approval da paleta visual + brand-usage-policy

---

## 11. Persistência das Decisões

**Este relatório:** `C:\Users\benef\planoamilempresas\docs\po-revalidation-report-v1.3.1.md`

**Predecessor preservado:** `docs/po-revalidation-report-v1.2.2.md` (não substitui — complementa).

**Atualização recomendada `stakeholder-inputs.md`:** seção "Re-validação Pax v1.3.1 (2026-04-28)" com:
- Veredito: APROVADO COM RESSALVAS — GO PARCIAL FASE 1 (pass rate 81%)
- 5 bloqueadores P0 priorizados
- Status revalidação por story
- Sequência Sprint 1-4 recomendada

---

## Apêndice A — Evidências Citadas

### A1. Drift FR↔Story (4 stories)

| Story | FR declarado | FR real PRD v1.3.1 |
|---|---|---|
| 4.7 | "FR40 do PRD v1.3.1" | FR36 (FAQPage 45+ Q&A) — FR40 é mapa interativo |
| 3.20 | "FR37 do PRD v1.3.1" | FR39 (calculadora carências) — FR37 é simulador |
| 3.21 | "FR36 do PRD v1.3.1" | FR38 (comparador) — FR36 é FAQPage |
| 7.11 | "FR43 do PRD v1.3.1" | FR44 (sub-redes) — FR43 é URL sem `-2` |

### A2. Architecture v1.1 — drift confirmado

```
docs/architecture.md linha 35-36:
| 2026-04-16 | 1.0 | Draft inicial | Aria (Architect) |
| 2026-04-26 | 1.1 | Pós architect-checklist (...) | Aria (Architect) |
```

Sem entry v1.2 — drift de 2 dias com PRD v1.3.1 (2026-04-28).

### A3. ADR-009 Gating explícito

```
docs/decisions/adr-009-estrategia-ecossistema-hub-spoke.md linha 137:
**Fase 2 (planosaudeamil.com.br)** não inicia build até este ADR ir para Status `Accepted` (stakeholder co-sign).
```

Stories 3.26, 7.11, 6.11.c declaram dependência ADR-009 — gated.

### A4. Stories Ready (5)

5.7, 6.9, 6.10, 1.9, 3.25 — sem bloqueadores P0/P1 internos. Drafts sólidas.

### A5. Story 6.11 XL evidence

Story 6.11 acumula:
- Roadmap editorial 30+ títulos
- Template `BlogPostLayout`
- 10+ posts comparativos (cada um Copyscape + advogado)
- 20 posts on-topic
- 5 posts atualidades regulatórias
- Schema Article + Author
- Tag taxonomy Sanity
- Cadence check CI
- Internal linking rules

Single story = ≥8 semanas de produção. Split em 5 sub-stories (.a-.e) é mandatório para fluxo Kanban funcional.

---

**Status do documento:** APROVADO COM RESSALVAS — GO PARCIAL FASE 1 (pass rate 81%)
**Owner:** Pax (Product Owner) ♍
**Data:** 2026-04-28
**Próximos:** ADR-009 decisão (Pax+stakeholder), Architecture v1.2 (Aria), Paleta decisão (Uma+Pax), drift fix (River), 6.11 split (River)

— Pax, validando para que dev implemente a Fase 1 sem retrabalho

---

## Adendo 2026-04-29 — Re-revalidação parcial pós-ADR-011 (Vercel → Cloudflare Workers)

### Contexto

Em 2026-04-29, **ADR-011 foi Accepted** (co-signed pelo stakeholder), migrando o deploy target de Vercel para **Cloudflare Workers** via `@opennextjs/cloudflare@1.19.4` (não Pages — ver ADR-011 §rationale). Implementação técnica completa pelo Dex: `wrangler.jsonc`, `open-next.config.ts`, `_headers`, `_redirects`, workflow `cloudflare-workers-deploy.yml`. `vercel.json` arquivado como `vercel.json.legacy`. Suite verde: 312 tests + ESLint + typecheck + audit-schema + sitemap drift.

Adicionalmente, **decisão D do stakeholder Approved**: Sanity Studio embedado é incompatível com Workers runtime; escolhida **Opção A — hosting gratuito Sanity** (`https://planoamilempresas.sanity.studio` via `npx sanity deploy`).

### Stories revisadas (Cloudflare v2)

- **Story 1.2 v0.2** — `1.2.configuracao-cloudflare-workers-dns.story.md` (renomeada): 11 ACs reescritos em termos Cloudflare Workers (wrangler-action, R2 cache, Cloudflare Web Analytics, secrets `CF_ENV`/`CLOUDFLARE_API_TOKEN`). ADR-004 (DNS TTL 300s) mantido em essência.
- **Story 1.2a v0.2** — `1.2a.dns-dominio-ponte.story.md` (mesmo nome): redirect 301 dormante migrado de `vercel.contingency.json` para `public/_redirects.contingency` (52 redirects já criados pelo Dex). Ativação: copiar para `_redirects` + `wrangler deploy`. SLA <1h mantido.
- **Story 1.3 v0.2** — `1.3.cicd-github-actions-cloudflare.story.md` (renomeada): ACs apontando para `cloudflare/wrangler-action@v3` no workflow `cloudflare-workers-deploy.yml`, Lighthouse/Accessibility contra preview Cloudflare URL, secrets `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` substituem `VERCEL_TOKEN`.

### Story nova criada

- **Story 3.27** — `3.27.sanity-studio-hosted-migration.story.md` (Status: **Approved**): migração Sanity Studio do route Next.js `/studio` para hosting gratuito Sanity (`*.sanity.studio`). 10 ACs cobrindo deploy, CORS, documentação, validações typecheck/lint/test, sitemap drift. Estimation XS (~2-3h). Executor: @devops ou @dev.

### Impacto na pass rate

Não recalculado nesta iteração (escopo é apenas re-revalidação parcial das 3 stories de infra + criação de 3.27). **Bloqueador P0 §2 (ADR-009 Proposed) permanece pendente** — ortogonal à migração Workers.

### TODOs remanescentes (stakeholder)

1. Confirmar conta Cloudflare Workers tem plano com `wrangler versions upload` (Workers Paid $5/mo se preview deploys forem usados intensivamente — ou Workers Free com limite 100K requests/dia/preview)
2. Confirmar emails de editores Sanity (Atlas + advogado revisor da Story 2.4) para Task 7 da Story 3.27
3. Ratificar decisão B vs A para subdomínio Studio futuro (`studio.planoamilempresas.com.br` — pós-MVP, requer Sanity Growth $99/mo)

— Pax, 2026-04-29 (re-revalidação parcial pós-ADR-011)
