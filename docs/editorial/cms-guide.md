# Guia Editorial CMS — Pipeline de Revisão Humana (NFR23)

> Story 6.10 deliverable. Documenta o pipeline obrigatório de revisão
> humana em conteúdo de saúde/regulatório (YMYL) — em cumprimento ao
> NFR23 do PRD v1.3.1: conteúdo médico/regulatório NUNCA pode ser
> IA-only.

Última atualização: 2026-04-27 (Story 6.10).

---

## 1. Pipeline visual

```
   Atlas (redator)              Corretor / Médico
   ┌───────────┐                ┌──────────────────┐
   │  Draft    │ ──────────────▶│  Review Técnico  │
   └───────────┘                └─────────┬────────┘
                                          │ approved
                                          ▼
                                ┌──────────────────┐
                                │ Review Jurídico  │
                                │   (Advogado)     │
                                └─────────┬────────┘
                                          │ approved
                                          ▼
                                ┌──────────────────┐
                                │  Approved (Pax)  │
                                └─────────┬────────┘
                                          │ publish
                                          ▼
                                ┌──────────────────┐
                                │    Published     │
                                └─────────┬────────┘
                                          │ rollback
                                          ▼
                                ┌──────────────────┐
                                │     Archived     │
                                └──────────────────┘
```

Estados representados pelo campo `workflowStatus` em
`sanity/schemas/blogPost.ts`:

| Status              | Quem move | Próximo  |
| ------------------- | --------- | -------- |
| `draft`             | @analyst (Atlas) — escreve | `review_tecnico` quando texto pronto |
| `review_tecnico`    | Corretor (Agnaldo) ou médico parceiro | `review_juridico` se `decision=approved` |
| `review_juridico`   | Advogado (OAB) | `approved` se `decision=approved` |
| `approved`          | @po (Pax)             | `published` (publica) |
| `published`         | sistema (após approved) | `archived` (rollback) |
| `archived`          | @po (Pax) | irreversível em v1 |

---

## 2. RACI matrix

| Atividade                     | Atlas | Corretor | Médico | Advogado | Pax (PO) | Devops |
| ----------------------------- | :---: | :------: | :----: | :------: | :------: | :----: |
| Draft inicial (texto + body)  |   R   |    C     |        |          |    I     |        |
| Review técnico (clínico/SUSEP)|   I   |    R     |   R    |          |    I     |        |
| Review jurídico (regulatório) |   I   |    C     |        |    R     |    I     |        |
| Aprovação final + publish     |   I   |    I     |        |          |    R/A   |        |
| Rollback (archived)           |   I   |    I     |        |    C     |    R/A   |        |
| Operar CMS Sanity Studio      |       |    I     |        |          |    R     |   C    |
| CI gate (`audit-workflow`)    |       |          |        |          |    I     |   R/A  |

R = Responsible, A = Accountable, C = Consulted, I = Informed.

---

## 3. SLA por etapa

Alinhado a Story 1.0 AC6 (advogado) + Story 2.5 (médico):

| Etapa                  | SLA p/ resposta | Escalation                              |
| ---------------------- | --------------- | --------------------------------------- |
| Review técnico         | ≤3 dias úteis   | Pax aciona alternativa (corretor sócio) |
| Review jurídico        | ≤5 dias úteis (≤24h em emergência regulatória) | Pax aciona advogado parceiro reserva |
| Aprovação Pax          | ≤2 dias úteis   | escalada para @pm (Morgan)              |
| Cadência editorial     | 1 post/15 dias  | warning workflow `editorial-cadence.yml` (Story 6.11.e) |

---

## 4. Como arquivar track-changes no Sanity

O campo `reviewTrack` (array de `reviewEntry`) registra a trilha de
revisões. Cada entry contém:

- `reviewer` — referência ao Author (`data/authors.ts`)
- `role` — `redator` | `corretor` | `medico` | `advogado` | `po`
- `reviewedAt` — datetime ISO 8601
- `comments` — observações qualitativas
- `changes` — sumário das mudanças propostas/aprovadas
- `decision` — `approved` | `rejected` | `request_changes`

### Workflow no Sanity Studio

1. Reviewer abre o documento, clica em `+ Add review entry`
2. Seleciona seu Author (autocomplete pela credencial pública)
3. Escolhe o `role` correspondente ao seu papel no fluxo
4. Preenche `comments` e `changes` (track-changes summary)
5. Marca `decision` = `approved` / `rejected` / `request_changes`
6. Salva (Sanity revision history nativo arquiva snapshot completo)

> Nota: Sanity já mantém revision history nativo do documento.
> O `reviewTrack` é complemento estruturado para auditoria forense
> e CI gate — não substitui o histórico nativo.

---

## 5. Critérios de "approved" (checklist Pax)

Antes de mover `workflowStatus = approved`, Pax confirma:

- [ ] `author` preenchido com Person credenciado (não Organization
      em conteúdo YMYL)
- [ ] `reviewedBy` preenchido (em categorias YMYL: carências,
      coparticipação, ANS, cobertura, cancelamento)
- [ ] `reviewTrack` tem ≥2 entries em YMYL (≥1 médico approved + ≥1
      advogado approved)
- [ ] Última entry não é `rejected`
- [ ] `seoTitle` ≤70 caracteres + `seoDescription` ≤160
- [ ] `ogImage` definido (1200×630)
- [ ] Schema válido — JSON-LD passa em `scripts/validate-jsonld.mjs`
- [ ] `audit-author-ymyl.mjs` PASS
- [ ] `audit-workflow-status.mjs` PASS
- [ ] `audit-cookie-cutter.mjs` PASS (não similar a sub-redes)

---

## 6. Como reverter publicação

Se conteúdo publicado precisar ser retirado (correção, regulatório,
ofensa a terceiro):

1. Pax abre o documento no Sanity Studio
2. Move `workflowStatus` de `published` → `archived`
3. (Opcional) Marca `enabled = false` para esconder do listing
   imediatamente
4. Adiciona uma entry final em `reviewTrack`:
   - `role: po`, `decision: rejected`, `comments: "rollback motivo X"`
5. Comunica @pm (Morgan) e Devops (Gage) — Devops re-roda audits
   em CI para snapshot do estado pós-rollback

> Importante: rollback NÃO deleta documento. Sanity revision history
> permite restauração futura se a correção for editorial-only.

---

## 7. Categorias YMYL vs operacionais

### YMYL — exigem médico + advogado

Espelho de `data/blog/categories.ts` `requiresLegalReview === true`:

- `carencias` — Carências e CPT
- `coparticipacao` — Coparticipação e Reajuste
- `ans-regulamentacao` — ANS e Regulamentação
- `cobertura` — Cobertura
- `cancelamento` — Cancelamento

### Operacional — só corretor (review técnico)

- `reembolso` — Reembolso
- `rede-credenciada` — Rede Credenciada
- `adesao-mei-pme` — Adesão MEI / PME

> Quem decide categoria: Pax (PO), com input de Atlas. Em dúvida,
> defaultar para YMYL (mais conservador). Audit script
> `audit-author-ymyl.mjs` valida coerência categoria↔reviewer.

---

## 8. Como rodar audits localmente

Antes de mover `workflowStatus` para `published`, rode em local:

```bash
# Auditoria Author YMYL — verifica autoria + reviewer obrigatórios
node scripts/audit-author-ymyl.mjs

# Auditoria Pipeline NFR23 — verifica reviewTrack médico+advogado
node scripts/audit-workflow-status.mjs

# Auditoria anti-cookie-cutter — Story 5.7 NFR25
node scripts/audit-cookie-cutter.mjs

# Output JSON para integração CI
node scripts/audit-workflow-status.mjs --json
```

Falhar qualquer audit = não publicar. CI bloqueia merge automaticamente
em workflows GitHub Actions:

- `.github/workflows/schema-validation.yml` — JSON-LD + audit-workflow
- `.github/workflows/editorial-cadence.yml` — cadência mensal (6.11.e)

---

## 9. Excepcionalidades

### Conteúdo emergencial regulatório (ANS atualiza norma hoje)

- SLA jurídico cai para ≤24h
- Pax pode aprovar com 1 advogado approved (skip médico se conteúdo
  for puro regulatório, sem componente clínico)
- Documentar exceção em `comments` da entry final

### Conteúdo legado (Stories 5.0 — pré-pipeline)

- Backfill via script manual (não automatizado em v1)
- Pax preenche `reviewTrack` retroativamente com entries datadas da
  revisão original (advogado/médico) ou marca como `archived` se
  não houver trilha auditável

### Conteúdo "carência zero" / promessa de cobertura agressiva

- Revisão tripla: corretor + advogado + DPO (LGPD)
- Adicionar 3a entry com `role: po` + comments documentando o
  motivo da escalação

---

## 10. Referências cruzadas

- PRD v1.3.1 — NFR23 (revisão humana saúde)
- Story 1.0 AC6 — advogado contratado SLA 48h conteúdo
- Story 2.4 — advogado parceiro com OAB documentado
- Story 2.5 — médico parceiro com CRM documentado
- Story 3.1 — Sanity v3 setup base
- Story 6.9 — Author schema YMYL (`data/authors.ts`)
- Story 6.10 — esta story (workflowStatus + reviewTrack + CI gate)
- Story 6.11.a — blogPost schema base
- Story 6.11.e — cadência editorial workflow
- Story 5.7 — auditoria anti-cookie-cutter
- ANS RN 195/2009, RN 593/2024 — publicidade regulamentada
- LGPD — consent management em conteúdo personalizado

---

## 11. TODOs pendentes

- [ ] **Atlas:** preencher OAB real do advogado em `data/authors.ts`
      após Story 2.4 fechar
- [ ] **Atlas:** preencher CRM real do médico em `data/authors.ts`
      após Story 2.5 fechar
- [ ] **Aria:** implementar fetcher GROQ real em
      `audit-workflow-status.mjs` (`--from-sanity` mode)
- [ ] **Pax:** definir editor responsável de cada categoria YMYL
      (alguém precisa ser o "owner" de carências, ANS, etc.)
- [ ] **Devops:** integrar `audit-workflow-status.mjs` no
      `.github/workflows/schema-validation.yml` (esta story APPENDA)
