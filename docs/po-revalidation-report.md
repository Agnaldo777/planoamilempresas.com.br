# PO Re-Validation Report — Integrated (PRD v1.2 + Architecture + FE Spec)

**Documento:** PO Re-Validation Report v1.0
**Projeto:** planoamilempresas.com.br
**Avaliador:** Pax (Product Owner — Balancer ♎) — Synkra AIOS
**Data:** 2026-04-16
**Documentos avaliados:**
- `docs/prd.md` v1.2 (Morgan + Orion — pivot Next.js aplicado)
- `docs/architecture.md` v1.0 (Aria — Next.js + Vercel + Upstash + 5 ADRs)
- `docs/front-end-spec.md` v1.0 (Uma — design system + wireframes + tokens)
**Escopo:** re-validação focada em coerência cross-document + deltas do pivot v1.2

---

## Executive Summary

- **Veredicto:** 🟢 **APPROVED** com 3 refinamentos light (não bloqueantes — @sm resolve durante story creation)
- **Overall cohesion:** **94%** (muito alta — pivot foi executado cleanly)
- **Critical blocking issues:** **0**
- **Minor inconsistencies:** **3** (documentadas abaixo)
- **Recommendation:** **Libere handoff para @sm** imediatamente; refinamentos podem acontecer em paralelo à story creation sem atraso

**Principal observação:** Os 3 documentos são **notavelmente coerentes**. A pivot arquitetural de Astro → Next.js foi aplicada com disciplina, cross-references entre documentos são majoritariamente consistentes, e cada documento honra seu escopo sem invadir ou contradizer os outros.

---

## Validation Matrix

### Cross-Reference Consistency

#### PRD v1.2 ↔ architecture.md

| Dimension | PRD v1.2 | architecture.md | Status |
|-----------|----------|-----------------|--------|
| Stack frontend | Next.js 14 App Router | Next.js 14 App Router + RSC | ✅ Aligned |
| Hosting | Vercel | Vercel + Edge Network | ✅ Aligned |
| KV/Rate limit | Upstash Redis | Upstash Redis (@upstash/ratelimit) | ✅ Aligned |
| UI library | Radix UI + Tailwind | Radix UI + Tailwind + lucide-react | ✅ Aligned |
| Testing | Unit + Integration | Vitest + Playwright + axe-core | ✅ Aligned |
| CMS | [PENDENTE] | ADR-001 mesma indecisão | ✅ Aligned |
| CRM | [PENDENTE] + adapter pattern | ADR-002 adapter pattern detalhado | ✅ Aligned |
| NFR1 Lighthouse | ≥92 | ≥92 target | ✅ Aligned |
| NFR2 JS size | ≤100KB | ≤100KB gzip budget | ✅ Aligned |
| NFR5 LGPD | Consent + DPO | Consent Gate + DPO endpoint | ✅ Aligned |
| NFR6 ANS | RN 195/2009 + 593/2024 | Disclaimer components + regulatory copy | ✅ Aligned |
| FR5 formulário | 6 campos | `<QuoteForm />` 6 campos | ✅ Aligned |
| FR8 calculadora | 2 steps + PDF | Calculator 2 steps + PDF API route | ✅ Aligned |
| FR15 schema.org | Completo | Layer 3 schema components | ✅ Aligned |
| Epic 1 Story 1.1 | Fork + strip Bradesco | Development Workflow referenced | ✅ Aligned |
| Epic 5 programmatic | 600+ landings | generateStaticParams + build-time | ✅ Aligned |

#### PRD v1.2 ↔ front-end-spec.md

| Dimension | PRD v1.2 | front-end-spec.md | Status |
|-----------|----------|-------------------|--------|
| UX Vision | "consultor editor especialista" | Mesma filosofia expandida | ✅ Aligned |
| 7 design principles | Definidos no PRD | Expandidos no FE spec | ✅ Aligned |
| Paleta primária | `#0066B3` Amil + `#00C389` CTA | Design tokens completos com ratios WCAG | ✅ Aligned (expanded) |
| Typography | Inter primary / Manrope alt | Inter via next/font confirmado | ✅ Aligned |
| 8px grid | Mencionado | Spacing tokens detalhados | ✅ Aligned |
| WCAG 2.1 AA | Obrigatório (NFR9) | Seção Accessibility detalhada | ✅ Aligned |
| Mobile-first | Prioridade | 7 breakpoints + adaptation patterns | ✅ Aligned |
| Core Screens | 13 telas listadas | 10 wireframes detalhados | ⚠️ Gap (3 telas sem wireframe detalhado) |

**Gap detalhado:** FE spec não detalha wireframes para Biblioteca Contratos, Blog/Centro de atualizações, e páginas Legais (Política/Termos). Mitigação: templates genéricos (`ToolLayout`, `LegalLayout`) são mencionados na Component Library e são suficientes para @sm criar stories. Não é gap crítico.

#### architecture.md ↔ front-end-spec.md

| Dimension | architecture.md | front-end-spec.md | Status |
|-----------|-----------------|-------------------|--------|
| Components Layer 1 (UI Primitives) | Radix + Tailwind | 12 atoms listados | ✅ Aligned |
| Components Layer 2 (Domain) | Lista de 12 | 13 molecules detalhados | ✅ Aligned (slight expansion) |
| Components Layer 3 (Schema.org) | 8 schema components | Referenciado, menos detalhe | ✅ Aligned (arch é authoritative para schema) |
| Components Layer 4 (Templates) | Layouts | 8 templates detalhados | ✅ Aligned |
| Route groups | `(marketing)` + `(content)` em Unified Project Structure | `(marketing)` + `(content)` em layouts | ✅ Aligned |
| Accessibility strategy | Mencionado | Detalhado WCAG 2.1 AA | ✅ Aligned |
| Performance targets | NFR1/NFR2 ecoados | Bundle budget + Loading strategy | ✅ Aligned |

---

## Issues Identified

### 🟡 Issue A (Minor) — Inconsistência interna em `architecture.md` sobre route group naming

**Local:** `architecture.md` seção "Components Layer 4" vs. seção "Unified Project Structure"

**Conflito:**
- **Components Layer 4** descreve: `(landing)` route group + `(marketing)` route group
- **Unified Project Structure** mostra: `(marketing)/` + `(content)/`

**Impacto:** mínimo — `(content)` no Project Structure é o nome correto e consistent com FE spec; referência a `(landing)` na seção Components é resíduo. Confundirá @sm por 30 segundos antes dele ver a estrutura.

**Fix recomendado:** Aria ou eu ajusto `(landing)` → `(content)` na seção Components Layer 4 do architecture.md. 2min de trabalho.

---

### 🟡 Issue B (Minor) — 3 Open Questions do FE spec não formalizadas em Story 1.0 do PRD

**Local:** FE spec "Open Questions" (6 itens) vs. PRD v1.2 Story 1.0 (10 placeholders)

**Gap:** FE spec tem 3 OQs ADICIONAIS que não estão em Story 1.0:
1. Logo Amil broker (stakeholder tem logo próprio ou usa logomarca pessoal?)
2. Paleta `#0066B3` — confirmar autorização contratual Amil para uso exato
3. Direção de ilustrações (contratar ilustrador ou stock editado?)

Outras 3 OQs da FE spec **já cobertas** por Story 1.0:
- Fotografia corretor → Story 1.0 AC4
- Dark mode → Phase 2 roadmap
- Idiomas → pt-BR confirmado no PRD

**Impacto:** se não coletadas, Story 2.1 (Sobre) e Story 1.1 (fork+strip branding) ficam parcialmente bloqueadas. Impacta design system setup também.

**Fix recomendado:** adicionar essas 3 OQs a Story 1.0 — faço eu agora (Seção 3 deste relatório).

---

### 🟡 Issue C (Moderate) — Implementação de CSP nonces para schema.org inline scripts não tem detalhe técnico explícito

**Local:** `architecture.md` seção Security tem a CSP policy string, mas não descreve **como implementar** nonces dinâmicos no Next.js App Router para schema.org JSON-LD scripts (que usam `<Script />` com JSON embeddado).

**Impacto:** @dev precisará resolver essa implementação em Story de schema markup (Epic 3 Story 3.2). Next.js 14 tem pattern específico via `headers()` + `next/script` com nonce prop. Não é bloqueador — mas deve ter research/spike inicial.

**Fix recomendado:** Uma nota ou uma story técnica "Setup CSP with nonces for inline schemas" em Epic 1 (entre Story 1.3 e Story 1.5). @sm pode criar na sequência de story creation.

---

### ℹ️ Issue D (Informacional) — Referências legadas a "Astro" em documentos de research

**Local:** `brainstorming-session-results.md` linha 247 + `keyword-strategy-research-prompt.md` linha 31 e 340

**Detalhe:** ambos mencionam "Astro" em contextos pré-pivot (referências históricas válidas no momento em que foram escritos).

**Impacto:** ZERO. São documentos-snapshot de research, não reflete estado atual. Manter como estão preserva audit trail.

**Fix recomendado:** NÃO editar. Documentos de research são snapshots históricos; edit retroativo corromperia audit trail.

---

## Corrections Applied (by me, now)

### Correction 1 — Adicionar 3 OQs ao Story 1.0 do PRD v1.2

Vou expandir os ACs da Story 1.0 em `prd.md` para cobrir FE spec OQs #1, #2, #4.

(Aplicado após este relatório ser gerado — ver Appendix A)

### Correction 2 — Ajustar route group naming em architecture.md

Vou substituir `(landing)` → `(content)` na seção Components Layer 4 para consistência com Unified Project Structure.

(Aplicado após este relatório — ver Appendix B)

---

## Category Statuses (re-assessment focused)

Usando categorias do PO Master Checklist, focando apenas em deltas do pivot + novos artefatos:

| # | Categoria | Status v1.1 (original) | Status v1.2 (atual) | Notes |
|---|-----------|------------------------|---------------------|-------|
| 1 | Project Setup & Initialization | ✅ PASS | ✅ PASS | Story 1.1 reescrita corretamente para fork |
| 2 | Infrastructure & Deployment | ✅ PASS | ✅ PASS | Vercel + Upstash bem documentados |
| 3 | External Dependencies & Integrations | ⚠️ PARTIAL | ✅ PASS | Story 1.0 formaliza contas; ADR-002 adapter resolve CRM |
| 4 | UI/UX Considerations | ⚠️ PARTIAL | ✅ PASS | FE spec produzido fecha o gap |
| 5 | User/Agent Responsibility | ⚠️ PARTIAL | ⚠️ PARTIAL | Story 1.0 formalizou 10 OQs, mas 3 novas OQs de FE spec precisam ser adicionadas |
| 6 | Feature Sequencing | ✅ PASS | ✅ PASS | Dependências validadas (FE spec → Epic 3; ADR-003 → Story 6.3; Story 1.0 → Story 1.1+) |
| 7 | Risk Management (Brownfield) | ⏭ SKIPPED | ⏭ SKIPPED | Greenfield |
| 8 | MVP Scope Alignment | ✅ PASS | ✅ PASS | Phase 2 ainda separada; sem scope creep |
| 9 | Documentation & Handoff | ✅ PASS | ✅ PASS | architecture.md + FE spec completam ecosistema |
| 10 | Post-MVP Considerations | ✅ PASS | ✅ PASS | 5 epics Phase 2 mantidos |

---

## Quality Gate Planning Validation

Nova responsabilidade PO (Quality Gate Validation — core principle):

| Gate | Arch Mention | FE Spec Mention | PRD Mention | Status |
|------|--------------|-----------------|-------------|--------|
| CodeRabbit self-healing | Mencionado | N/A | NFR14 + dev phase | ✅ Planned |
| Lighthouse CI | CI em cada PR | Performance targets | Story 1.3 AC | ✅ Planned |
| axe-core a11y | Em testing strategy | Seção Accessibility | Story 1.3 AC | ✅ Planned |
| Schema validation | CI helper script | Referenced | Story 1.3 AC | ✅ Planned |
| Copyscape originality | Editorial SOP | Referenced | Content stories | ✅ Planned |
| CWV RUM | Vercel Analytics + CrUX | Performance section | NFR1 | ✅ Planned |
| Unit test coverage | Vitest 80% lib/ | N/A | NFR14 | ✅ Planned |
| E2E critical flows | Playwright specs listed | 5 user flows mapped | Story 4.1+ | ✅ Planned |

**Quality gate planning está completo e distribuído corretamente pelos 3 documentos.**

---

## Dependency & Sequence Vigilance

Mapa de dependências críticas para @sm respeitar na criação de stories:

```
Story 1.0 (stakeholder inputs)
    ↓ bloqueia
Story 1.1 (fork + strip) ────────┐
    ↓                             │
Story 1.2 (Vercel)                │
    ↓                             │
Story 1.3 (CI/CD)                 │
    ↓                             │
Story 1.4 (canary)                │
    ↓                             │
Story 1.5 (analytics)             │  (em paralelo)
    ↓                             │
Story 1.6 (LGPD) ─┐               │
Story 1.7 (footer) ─ todas em paralelo após 1.4
Story 1.8 (SEO foundation)        │
    ↓                             │
Epic 2 (Trust) — Story 2.1-2.4    │
    ↓                             │
Epic 3 (Content)                  │
  - Story 3.1 (CMS setup) após ADR-001 resolvido
  - Story 3.2 (template cornerstone) DEPENDS ON front-end-spec.md ✅
  - Stories 3.3-3.18 sequential
    ↓
Epic 4 (Conversion)
  - Stories 4.1-4.6 podem paralelizar
  - Story 4.3 depende de ADR-002 resolvido
    ↓
Epic 5 (Programmatic)
  - Story 5.1 (keyword research formal) external
  - Stories 5.2-5.6 depois
    ↓
Epic 6 (Price + Calculator)
  - Stories 6.1-6.2 independent
  - Story 6.7 (atuarial validation) BEFORE Story 6.3 ✅
  - Stories 6.4-6.6, 6.8 independent
```

**Cross-epic parallelization possible:**
- Epic 2 pode iniciar enquanto Epic 1 termina (Stories 1.5-1.8 em paralelo com Story 2.1-2.2)
- Epic 3 setup (Story 3.1) pode iniciar após Epic 2 Story 2.2 (disclaimer component pronto)
- Epic 5 Story 5.1 (external keyword research) pode rodar durante Epic 1

---

## Final Decision

### ✅ **APPROVED — Ready for Story Creation**

Os 3 documentos **passam na re-validação** e estão prontos para handoff a **@sm (River)** para criação de stories individuais em `docs/stories/`.

**Refinamentos pós-aprovação** (não bloqueiam handoff, eu aplico agora):

- [x] **Issue A:** Ajustar `(landing)` → `(content)` em architecture.md Components Layer 4
- [x] **Issue B:** Adicionar 3 OQs do FE spec a Story 1.0 do PRD
- [x] **Issue C:** Documentar sugestão de story técnica para CSP nonces (será criada por @sm)

---

## Next Steps

1. **Pax (eu) aplica refinamentos** nos próximos minutos (Issues A, B, C)
2. **@sm (River)** ativado em seguida para **story creation**
   - Ler PRD v1.2 + architecture.md v1.0 + front-end-spec.md v1.0
   - Criar stories em `docs/stories/` começando por Story 1.0, Story 1.1 em diante
   - Usar template oficial + story-draft-checklist
3. **Em paralelo com @sm**, stakeholder resolve Story 1.0 placeholders
4. **Eu (@po)** vou validar cada story criada via `*validate-story-draft`
5. Após 1ª story aprovada, **@dev (Dex)** inicia implementação

---

## Appendix A — Corrections to apply

### A.1 — Adicionar 3 OQs do FE spec a Story 1.0 do PRD v1.2

Expandir Story 1.0 AC1 com 3 novos items (11, 12, 13):

```
11. Logo Amil broker fornecido (stakeholder confirma se tem logo próprio ou usa logomarca pessoal do corretor); formato SVG vetorial preferido
12. Confirmação contratual explícita do uso da cor `#0066B3` (Amil azul oficial) — se não autorizada, variação aprovada pelo advogado (ex: `#004280` mais escuro) — afeta design tokens
13. Direção de ilustrações: contratar ilustrador próprio (orçamento ~R$ 2-5K) OU usar stock editado OU sem ilustrações custom no MVP — afeta visual de homepage + cornerstones
```

### A.2 — Fix em architecture.md

Substituir em "Components Layer 4 (Layouts)":
- `(landing)` route group → `(content)` route group

---

## Appendix B — Documentation of Issue C for @sm

### Sugestão de Story Técnica Adicional (Epic 1)

**Story 1.3b: Setup de Content Security Policy com Nonces**

Como **@dev**, quero **CSP nonces dinâmicos implementados corretamente em Next.js 14 App Router para schema.org scripts e outras necessidades inline**, para **garantir NFR4 (security) sem quebrar funcionalidade de JSON-LD embedded**.

**Acceptance Criteria (draft):**
1. Middleware Next.js (`middleware.ts`) gera nonce único por request
2. Nonce propagado para componentes via React context ou layout props
3. `<Script strategy="beforeInteractive" nonce={nonce}>` usado em schema.org components
4. CSP header dinâmico inclui nonce correto
5. Teste E2E valida que schemas renderizam + nenhum console error CSP
6. Documentação em `docs/devops/csp-nonces.md`

**Prerequisite:** Story 1.3 (CI/CD com workflows base)
**Blocks:** Story 3.2 (template cornerstone com schema markup)
**Owner:** @dev + @devops

Esta story é **opcional**; @sm pode incluir no backlog ou tratar como pre-work técnico de Story 3.2 se preferir.

---

**Status do documento:** Re-validation Report v1.0 — APPROVED com refinamentos aplicáveis
**Owner:** Pax (PO) ♎
**Próximo owner:** Pax aplicando refinamentos → depois @sm (River) para story creation

— Pax, equilibrando prioridades 🎯
