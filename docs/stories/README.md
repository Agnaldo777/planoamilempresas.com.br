# Stories — planoamilempresas.com.br

Diretório de stories individuais criadas por **@sm (River)** a partir do PRD v1.2.1 + architecture.md + front-end-spec.md.

---

## Template

Use `_template.story.md` como base para criar novas stories. Este template é uma **variante refinada do template AIOS oficial** (`code1/.aios-core/product/templates/story-tmpl.yaml`), adicionando:

| Refinamento | Justificativa |
|-------------|---------------|
| **Strategic Context / Why** | Capturar contexto além do "so that"; por que ESTA story, AGORA |
| **Out of Scope** | Anti-scope-creep explícito |
| **Dependencies (Blocks_by / Blocks_to)** | Dependency graph claro no próprio doc |
| **Estimation (T-shirt)** | XS/S/M/L/XL + duration + rationale |
| **CodeRabbit Integration com skip explícito** | "N/A — no code" para stories pre-dev sem culpa |
| **Testing promovida a top-level** | Era subseção de Dev Notes; agora visível diretamente |

**Compatibilidade AIOS:** 100% — template mantém todas as seções originais (Status, Story, ACs, Tasks, Dev Notes, QA Results). Apenas **adiciona** e **reorganiza**. `@po *validate-story-draft` continua funcional.

---

## Naming Convention

Arquivos seguem padrão: `{epic}.{story}.{kebab-case-title}.story.md`

Exemplos:
- `1.0.project-kickoff.story.md`
- `1.1.fork-strip-bradesco.story.md`
- `3.2.cornerstone-template.story.md`
- `6.3.calculator-base.story.md`

---

## Status Lifecycle

```
Draft → Approved → InProgress → Review → Done
  ↑        ↑           ↑          ↑        ↑
 @sm     @po         @dev       @qa    @devops
```

| Status | Trigger | Owner atualiza |
|--------|---------|----------------|
| **Draft** | @sm cria story | @sm |
| **Approved** | @po valida via `*validate-story-draft` com GO | @po |
| **InProgress** | @dev inicia implementação | @dev |
| **Review** | @dev marca complete, @qa revisa | @qa |
| **Done** | @qa PASS + @devops push | @devops |

---

## Epic Progress

| Epic | Stories Totais | Draft | Approved | InProgress | Review | Done |
|------|----------------|-------|----------|------------|--------|------|
| 1 — Foundation, Compliance & Observability (inclui Kickoff Story 1.0) | 9 (1.0 + 1.1–1.8) | 0 | **2** (1.0 + 1.1) | 0 | 0 | 0 |
| 2 — Trust & Authority (E-E-A-T) | 4 | 0 | 0 | 0 | 0 | 0 |
| 3 — Content Engine | 19 | 0 | 0 | 0 | 0 | 0 |
| 4 — Conversion Engine | 6 | 0 | 0 | 0 | 0 | 0 |
| 5 — Programmatic SEO | 6 | 0 | 0 | 0 | 0 | 0 |
| 6 — Price Intelligence & Calculator | 8 | 0 | 0 | 0 | 0 | 0 |
| **TOTAL MVP** | **~52** | **0** | **2** | **0** | **0** | **0** |

(Atualizar manualmente ou via `@po *stories-index` se automatizado.)

---

## Dependency Chain (Critical Path)

```
Story 1.0 (Kickoff, stakeholder+@devops)
    ↓ bloqueia TUDO
Story 1.1 (Fork + Strip Bradesco, @dev+@devops)
    ↓
Story 1.2 (Vercel setup, @devops)
    ↓
Story 1.3 (CI/CD, @devops)
    ↓
Story 1.4 (Canary page, @dev)
    ↓ (a partir daqui, stories 1.5-1.8 podem paralelizar)
Stories 1.5/1.6/1.7/1.8 (paralelo)
    ↓
Epic 2 Stories 2.1-2.4 (Trust & Authority)
    ↓
Epic 3 Story 3.1 (CMS setup — depende ADR-001)
Epic 3 Story 3.2 (Cornerstone template — depende front-end-spec)
    ↓
Epic 3 Stories 3.3-3.18 (15 cornerstones — paralelo em batches)
Epic 4 Stories (conversion — paralelo após Epic 2 completar)
Epic 5 Stories (programmatic — após Epic 4 validado)
Epic 6 Stories:
  - 6.1 / 6.2 (PriceTable — independentes)
  - 6.7 (Validação atuarial — ANTES de 6.3)
  - 6.3 (Calculator — DEPOIS de 6.7)
  - 6.4 / 6.5 / 6.6 / 6.8 (independentes)
```

---

## Workflow por Story

1. **@sm cria** story em `docs/stories/{epic}.{story}.{slug}.story.md` com status `Draft`
2. **@po valida** via `*validate-story-draft {story-path}` → GO / NO-GO
3. Se GO: **@po atualiza status → `Approved`**
4. **@dev implementa** via `*develop-story {story-path}` → status `InProgress`
5. **@qa revisa** via `*qa-gate {story-path}` → PASS / CONCERNS / FAIL
6. **@devops push** + @po atualiza status → `Done`

---

## Referencing This Work

- **PRD:** `docs/prd.md` v1.2.1 (fonte primária de ACs por story)
- **Architecture:** `docs/architecture.md` v1.0 (decisões técnicas, ADRs)
- **FE Spec:** `docs/front-end-spec.md` v1.0 (design tokens, wireframes, components)
- **Research docs:** `docs/brief.md`, `docs/market-research.md`, etc. (contexto estratégico)
- **Change management:** `docs/sprint-change-proposal.md`, `docs/po-revalidation-report.md`

---

*Template refinado em 2026-04-16 por River (@sm) + Pax (@po) aprovação pending quando validar Story 1.0.*
