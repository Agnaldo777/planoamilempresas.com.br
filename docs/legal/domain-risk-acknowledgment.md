# Risk Acknowledgment — Uso da Marca Amil

**Deliverable:** Story 2.4, Deliverable 1
**Preparado por:** Pax (PO) — Synkra AIOS
**Data de emissão:** 2026-06-08
**Status:** ✍️ **Aguardando assinatura do stakeholder (Agnaldo Silva)**

> Documento de ciência e assunção de risco. Registra que o stakeholder foi
> informado dos riscos do uso do termo "Amil" no domínio, em conteúdo e em URLs,
> e decidiu prosseguir conforme a estratégia documentada (opção 🅲️ "assumir
> risco com mitigações" — Story 1.0 Bloco 2 / NFR8).

---

## 1. Objeto

Uso da marca registrada **Amil** pelo projeto `planoamilempresas.com.br`,
operado por **BeneficioRH** (corretor de seguros, SUSEP nº 201054484),
autorizado a intermediar planos da **Amil Assistência Médica Internacional S.A.**
(ANS nº 326305), nas seguintes formas:

1. Termo "amil" no **domínio**.
2. Termo "Amil" e nomes de produto em **conteúdo textual**.
3. **Slugs de produto Amil em URL** (`/rede/amil-s750-qp/sp`) — *escopo da Story 7.7,
   adicionalmente gated pelo co-sign do advogado no ADR-006*.

## 2. Riscos informados ao stakeholder

| Risco | Severidade | Probabilidade (estimada) |
|-------|-----------|--------------------------|
| Notificação extrajudicial / cease & desist da Amil | Alta | Baixa-Média |
| Perda/necessidade de troca do domínio | Alta | Baixa |
| Necessidade de rollback de URLs (impacto SEO parcial) | Média | Baixa |

> Estimativas qualitativas do ADR-006; **não** são garantias. Não há precedente
> público de cease & desist Amil → corretora autorizada identificado
> (`legal-precedents-corretoras-amil.md`), mas o uso de **slug de produto** é
> pioneiro e sem precedente direto.

## 3. Mitigações em vigor

1. Disclaimer canônico de corretor independente (topo + rodapé) — implementado.
2. Schema `Organization.sameAs: [amil.com.br]` — atribuição de origem.
3. Nenhum logo/trade dress Amil — `brand-usage-policy.md`.
4. Plano de contingência de domínio (rollback 301 ≤1h) — `domain-contingency-plan.md`.
5. Outreach pré-emptivo (opcional) — decisão diferida ao stakeholder + advogado.

## 4. Declaração do stakeholder

Declaro que:

- ( ) Fui informado dos riscos descritos na §2 e das mitigações da §3.
- ( ) Compreendo que a equipe técnica **não presta aconselhamento jurídico** e
  que o co-sign do **ADR-006** depende de **advogado revisor** (Deliverable 4).
- ( ) **Para o domínio e conteúdo textual:** opto por **prosseguir** assumindo o
  risco, conforme NFR8 (opção 🅲️), **sem** parecer jurídico prévio.
- ( ) **Para os slugs de produto em URL (Story 7.7):** entendo que **NÃO** serão
  implementados até o ADR-006 ter status `Accepted` com co-sign do advogado.

## 5. Assinatura

**Stakeholder:** Agnaldo Silva — BeneficioRH (SUSEP 201054484)

Data: ____ / ____ / ________

Assinatura: ___________________________________________

---

## Referências

- `docs/prd.md` — Story 2.4, NFR8
- `docs/decisions/adr-006-url-as-trademark-policy.md`
- `docs/legal/domain-contingency-plan.md`
- `docs/editorial/brand-usage-policy.md`
- `docs/decisions/legal-precedents-corretoras-amil.md`
