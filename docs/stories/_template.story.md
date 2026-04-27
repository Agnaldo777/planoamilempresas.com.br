# Story {{epic_num}}.{{story_num}}: {{story_title_short}}

<!--
TEMPLATE REFINADO — planoamilempresas.com.br
Base: AIOS story-tmpl.yaml v2.0 (AIOS-Method)
Refinamentos v1.0 (2026-04-16):
  + Campo "Strategic Context / Why" (após Story)
  + Campo "Out of Scope" (após Acceptance Criteria)
  + Campo "Dependencies" (blocks_by + blocks_to explícitos)
  + Campo "Estimation" (T-shirt size XS/S/M/L/XL)
  + Seção "Testing" promovida a top-level (era sub de Dev Notes)
  + CodeRabbit Integration com skip explícito `N/A — no code` para stories pre-dev

Instruções:
  1. Copiar este arquivo como `{epic}.{story}.{kebab-case-title}.story.md`
  2. Preencher todas as seções marcadas com {{...}}
  3. Remover seções marcadas [OPCIONAL] se não se aplicarem
  4. Remover este comentário antes de submeter para validação @po
-->

---

## Status

<!-- choices: Draft | Approved | InProgress | Review | Done -->
**Draft**

---

## Executor Assignment

<!--
Work Type → Executor Mapping:
| Work Type                        | Executor          | Quality Gate   |
|----------------------------------|-------------------|----------------|
| Code/Features/Logic              | @dev              | @architect     |
| Schema/DB/RLS/Migrations         | @data-engineer    | @dev           |
| Infra/CI/CD/Deploy               | @devops           | @architect     |
| Design/UI Components             | @ux-design-expert | @dev           |
| Research/Investigation           | @analyst          | @pm            |
| Architecture Decisions           | @architect        | @pm            |
| Operational/Kickoff (non-code)   | stakeholder + @devops | @po        |

VALIDATION: executor != quality_gate (ALWAYS)
-->

- **executor:** `{{executor}}`
- **quality_gate:** `{{quality_gate}}`
- **quality_gate_tools:** `{{tools_list}}`

---

## Story

**As a** {{role}},
**I want** {{action}},
**so that** {{benefit}}.

---

## Strategic Context / Why

<!--
Por que esta story existe AGORA? (não apenas o "so that" de benefício ao usuário)
- Qual constraint/dependência motivou ela existir neste momento?
- Qual risco/oportunidade ela endereça?
- Como ela se conecta com o PRD/architecture/FE spec?
- 2-4 linhas de contexto estratégico.
-->

{{strategic_context}}

---

## Acceptance Criteria

<!-- Numbered list copied from PRD epic file. Testável, unambíguo. -->

1. {{ac_1}}
2. {{ac_2}}
3. {{ac_n}}

---

## Out of Scope

<!--
Explicitamente NÃO incluído nesta story. Evita scope creep.
Lista ≥3 items que alguém poderia razoavelmente assumir que está incluído mas não está.
Se realmente não há ambiguidade, marcar [N/A] com justificativa.
-->

- {{out_of_scope_1}}
- {{out_of_scope_2}}
- {{out_of_scope_3}}

---

## Dependencies

### Blocks_by (esta story depende destas concluírem)

- {{blocker_1}} — {{reason}}
- {{blocker_2}} — {{reason}}

### Blocks_to (estas stories estão bloqueadas até esta concluir)

- {{blocked_1}} — {{reason}}
- {{blocked_2}} — {{reason}}

---

## Estimation

<!--
T-shirt size:
  XS = <4h (config change, small bug fix)
  S  = 4-8h (single component, simple story)
  M  = 1-3 days (standard story)
  L  = 3-7 days (complex story, multiple components)
  XL = >7 days (deve ser split em stories menores)
-->

**Size:** `{{XS|S|M|L|XL}}`
**Estimated duration:** `{{X hours OR X days}}`
**Rationale:** {{por_que_esta_estimativa}}

---

## 🤖 CodeRabbit Integration

<!--
CONDITIONAL:
  Se story não tem código (kickoff, legal, operational) → usar "N/A — no code in this story"
  Se story tem código mas CodeRabbit disabled em core-config.yaml → manter "Skip notice"
  Caso contrário → preencher todas as subsections
-->

<!-- CHOOSE ONE: -->

### Option A — N/A (no code)

> **N/A — no code in this story.** Story puramente operacional/legal/research. CodeRabbit não se aplica. Quality gate via @po validation (AC-based).

### Option B — Disabled

> **CodeRabbit Integration: Disabled.** CodeRabbit CLI not enabled in `core-config.yaml`. Quality via manual review.

### Option C — Enabled (preencher subsections)

#### Story Type Analysis

- **Primary Type:** `{{Database|API|Frontend|Deployment|Security|Architecture|Integration|Content|Legal|Operational}}`
- **Secondary Type(s):** `{{types_list_or_none}}`
- **Complexity:** `{{LOW|MEDIUM|HIGH}}`

#### Specialized Agent Assignment

**Primary Agents:**
- {{primary_agent_1}}

**Supporting Agents:**
- {{supporting_agent_1}}

#### Quality Gate Tasks

- [ ] Pre-Commit (@dev): run before marking story complete
- [ ] Pre-PR (@github-devops): run before creating pull request
- [ ] Pre-Deployment (@github-devops): run before production deploy (if applicable)

#### Self-Healing Configuration

- **Primary Agent:** @{{primary_agent}} ({{light|full|check}} mode)
- **Max Iterations:** {{number}}
- **Timeout:** {{X}} minutes
- **Severity Filter:** {{CRITICAL,HIGH,...}}

**Predicted Behavior:**
- CRITICAL issues: `{{auto_fix|report_only|...}}`
- HIGH issues: `{{auto_fix|document_only|...}}`

#### CodeRabbit Focus Areas

- {{focus_1}}
- {{focus_2}}

---

## Tasks / Subtasks

<!-- Quebrar em tarefas executáveis. Referenciar ACs em cada task. -->

- [ ] **Task 1:** {{description}} (AC: {{n}})
  - [ ] Subtask 1.1: {{...}}
  - [ ] Subtask 1.2: {{...}}
- [ ] **Task 2:** {{description}} (AC: {{n}})
  - [ ] Subtask 2.1: {{...}}
- [ ] **Task N:** ...

---

## Dev Notes

<!--
FILOSOFIA: Dev Agent NÃO deve precisar ler architecture.md / PRD / FE spec para implementar.
Copiar AQUI todas as informações relevantes desses documentos, ressintetizadas para esta story.
NÃO inventar — apenas consolidar de artefatos existentes.
-->

### Relevant Source Tree

```
{{relevant_paths_for_this_story}}
```

### Key Technical Context

{{tech_context_from_arch_or_prd}}

### Reference Artifacts

- PRD: {{section_reference}}
- Architecture: {{section_reference}}
- FE Spec: {{section_reference}} [se aplicável]
- ADRs: {{adr_ids_referenced}}

### Notes from Previous Stories

{{notes_if_applicable_or_N/A}}

---

## Testing

<!-- PROMOVIDA a top-level (não sub de Dev Notes). Strategy + standards + locations. -->

### Test Strategy

- **Unit tests:** {{what_to_cover}} (Vitest, `src/test/` ou inline `*.test.ts`)
- **Integration tests:** {{what_to_cover}} (Playwright ou RTL)
- **E2E tests:** {{what_to_cover_or_N/A}}
- **Accessibility tests:** {{axe-core_coverage_or_N/A}}
- **Schema validation:** {{if_applicable}}
- **Performance tests:** {{lighthouse_threshold_if_applicable}}

### Test Locations

- Unit: `src/test/` ou `src/**/*.test.ts`
- E2E: `tests/e2e/*.spec.ts`
- Fixtures: `src/test/fixtures/`
- Mocks: `src/test/mocks/`

### Coverage Targets

- Unit: {{percentage}}% em código crítico desta story
- Integration: fluxos definidos no FE spec

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| {{YYYY-MM-DD}} | 0.1 | Draft inicial | @sm (River) |

---

## Dev Agent Record

<!-- Populated by @dev during implementation. Não editar antes. -->

### Agent Model Used

`{{model_name_version}}`

### Debug Log References

{{debug_logs_or_N/A}}

### Completion Notes

{{notes_on_completion}}

### File List

<!-- Todos os arquivos criados/modificados/afetados -->

- `{{file_1}}`
- `{{file_2}}`

---

## QA Results

<!-- Populated by @qa during review. Não editar antes. -->

{{qa_review_outcome}}
