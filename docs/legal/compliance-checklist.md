# Compliance Checklist — planoamilempresas.com.br

**Deliverable:** Story 2.4 (Validação Jurídica Inicial e Política de Uso da Marca Amil)
**Autor:** Aria (Architect) + Pax (PO) — Synkra AIOS
**Data:** 2026-06-08
**Status:** 🟡 Em preenchimento — itens jurídicos pendentes de co-sign do advogado revisor (Deliverable 4)

> Este checklist consolida as obrigações de compliance antes do go-live e, em
> especial, antes do desbloqueio da **Story 7.7** (Cluster E rede × UF), que
> está gated pelo **ADR-006**.

---

## 1. Uso da marca Amil

| Item | Estado | Referência |
|------|--------|-----------|
| Termo "Amil" em texto restrito ao permitido no contrato de corretagem | ✅ Decidido (NFR8, Story 1.0 opção 🅲️) | `docs/prd.md` NFR8 |
| Termo "amil" no domínio (`planoamilempresas.com.br`) | ✅ Decidido (NFR8 + precedentes) | `legal-precedents-corretoras-amil.md` |
| **Slug de produto Amil em URL** (`/rede/amil-s750-qp/sp`) | 🔴 **Pendente co-sign advogado** | **ADR-006 (Proposed)** |
| NUNCA logo/wordmark/ícone oficial Amil (trade dress) | ✅ Política definida | `brand-usage-policy.md` |
| Disclaimer canônico em topo + rodapé das páginas de rede | ✅ Implementado (primitive) | `src/content/disclaimers/amil-rede.ts` |
| Schema `Organization.sameAs: [amil.com.br]` (atribuição de origem) | ✅ Primitive disponível | `OrganizationJsonLd` (Story 7.2) |

## 2. Disclaimers ANS / SUSEP

| Item | Estado |
|------|--------|
| Disclaimer "corretor autorizado a intermediar planos da Amil (ANS nº 326305)" em rodapé | ✅ |
| Identificação do corretor (BeneficioRH, SUSEP 201054484) em "Sobre" e rodapé | ✅ |
| Sem promessa de cobertura/preço sem ressalva ("consulte cotação") | ✅ Padrão editorial |
| Sem afirmação de % de conversão/desconto sem fonte | ✅ Política `feedback_claims_metricas` |

## 3. LGPD (Lei 13.709/2018)

| Item | Estado | Ação |
|------|--------|------|
| Política de Privacidade publicada | ⬜ Verificar | `/politica-de-privacidade` |
| Base legal para captura de lead (consentimento) declarada no formulário | ⬜ Verificar | `<QuoteForm />` |
| Finalidade do tratamento de dados informada | ⬜ Verificar | Form + política |
| Canal para titular exercer direitos (acesso/exclusão) | ⬜ Verificar | E-mail/DPO contato |
| Retenção e compartilhamento com operadora declarados | ⬜ Verificar | Política |

> ⚠️ LGPD não bloqueia a 7.7, mas é **gate de go-live geral**. Marcar como tarefa
> de Epic 1/2 antes da publicação pública.

## 4. Termos de uso

| Item | Estado |
|------|--------|
| Termos de uso publicados | ⬜ Verificar |
| Limitação de responsabilidade (site informativo, não canal oficial) | ⬜ Verificar |
| Foro e legislação aplicável | ⬜ Verificar |

## 5. Gate específico da Story 7.7 (pre-flight)

| AC1 item | Estado | Resolve |
|----------|--------|---------|
| ADR-006 Status: `Accepted` + assinatura advogado | 🔴 Pendente | Advogado (D4) |
| Domínio-ponte `planosaudeempresas.com.br` ativo + DNS | ⚠️ Config Ready | Stakeholder (Story 1.2a) |
| `docs/legal/domain-contingency-plan.md` publicado | ✅ Criado | Este sprint |
| Disclaimer canônico em `src/content/disclaimers/amil-rede.ts` | ✅ Criado | Este sprint |

---

## Itens que dependem de terceiros (NÃO resolvíveis pela equipe técnica)

1. 🔴 **Co-sign do ADR-006 pelo advogado revisor** (Deliverable 4) — pacote pronto em `legal-review-packet-adr-006.md`.
2. ✍️ **Assinatura do risk acknowledgment pelo stakeholder** — template em `domain-risk-acknowledgment.md`.
3. 🌐 **Confirmação de registro + DNS do domínio-ponte** — ação no Registro.br + Cloudflare.

---

## Referências

- `docs/decisions/adr-006-url-as-trademark-policy.md`
- `docs/legal/legal-review-packet-adr-006.md`
- `docs/legal/domain-risk-acknowledgment.md`
- `docs/editorial/brand-usage-policy.md`
- `docs/legal/domain-contingency-plan.md`
- `docs/decisions/legal-precedents-corretoras-amil.md`
- `docs/prd.md` — Story 2.4, NFR8, NFR22
