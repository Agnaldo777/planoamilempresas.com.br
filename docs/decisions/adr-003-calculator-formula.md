# ADR-003: Fórmula da Calculadora (PLACEHOLDER — requer validação atuarial)

> ⚠️ Nomenclatura produtos ainda usa antiga (400/500/600/Blue/Black). Será atualizada para Bronze/Prata/Ouro/Platinum/Platinum Mais em Story 6.7 (validação atuarial) — decisão @po em re-validação 2026-04-26.

**Status:** 📝 **Proposed** — bloqueio Story 6.7 antes de Story 6.3
**Data:** 2026-04-16 (PRD v1.1 inicial)
**Autor:** Aria (Architect) — Synkra AIOS
**Última atualização:** 2026-04-26 (Pax re-validação — extração inline → arquivo formal)

---

## Context

A calculadora interativa (Story 6.3) precisa simular o **custo total de um plano de saúde empresarial** considerando coparticipação em horizontes de 12, 24 e 36 meses, dando ao corretor/cliente uma estimativa rápida de TCO antes do orçamento formal.

A fórmula precisa equilibrar:
- Precisão suficiente para ser útil em conversa comercial (tolerância ≤ ±10% do real)
- Simplicidade para rodar client-side sem backend pesado
- Disclaimer legal claro de que é estimativa, não cotação

A fórmula proposta é um **placeholder técnico** que **requer validação atuarial formal antes de ir para produção** — Story 6.7 bloqueia Story 6.3.

### Variáveis

- `V` = número de vidas
- `F` = faixa etária média
- `P` = produto (400/500/600/Blue/Black — tabela base — nomenclatura antiga, ver nota acima)
- `C` = coparticipation boolean
- `S` = sinistralidade estimada ∈ {baixa=0.3, media=0.5, alta=0.75}

## Decision

Adotar a seguinte **fórmula draft** sujeita a validação atuarial em Story 6.7:

```
MensalidadeBase(V, F, P) = Σ (PriceTable[P][F_bracket] × V_bracket[F_bracket])
Coparticipacao(V, S) se C = true: V × S × avg_proc_cost × 12
                                  avg_proc_cost = R$ 120 (consultas) + ajuste

CustoMensal = MensalidadeBase + (Coparticipacao / 12 se C)
ReajusteAnual = CPI × 1.4 (VCMH histórico Amil 2020-2025 ≈ 12%)
Custo_y = CustoMensal × 12 × (1 + ReajusteAnual)^(y-1)
CustoTotal36m = Σ (Custo_y) para y ∈ {1, 2, 3}
```

**Tolerância declared:** ±10% do valor real (sinistralidade é a maior variável).

**Disclaimer mandatory (UI + meta):** "Estimativa baseada em reajuste histórico Amil 2020-2025 (~12% a.a.). Valores reais dependem de sinistralidade efetiva da empresa e cláusulas contratuais negociadas."

## Consequences

- ✅ Calculadora client-side leve, sem chamada de backend para cálculo
- ✅ Resultado em ≤200ms p95 (aceitável para UX interativa)
- ✅ Disclaimer reduz risco regulatório/legal (estimativa ≠ cotação)
- ⚠️ **Fórmula é placeholder** — requer assinatura de consultor atuarial em Story 6.7 antes de Story 6.3 ir para produção
- ⚠️ Sinistralidade é a maior fonte de erro — escolha do usuário (baixa/media/alta) precisa ter UI explicativa
- ⚠️ Reajuste anual fixo (CPI × 1.4) é simplificação — Amil pode anunciar reajustes que invalidem a fórmula → re-validação anual obrigatória
- ⚠️ Nomenclatura de produtos defasada — atualização para Bronze/Prata/Ouro/Platinum/Platinum Mais em Story 6.7

## Alternatives Considered

| Opção | Veredito | Por quê |
|---|---|---|
| **Fórmula client-side com placeholders + validação atuarial Story 6.7** | ✅ Escolhido | Permite Story 6.3 começar dev em paralelo; risco mitigado por gate atuarial |
| Backend de cálculo com tabela atuarial real | ❌ Rejeitado MVP | Latência maior; complexidade desproporcional ao MVP; Phase 2 candidate |
| Calculadora desabilitada até Story 6.7 fechar | ❌ Rejeitado | Bloqueia roadmap Epic 6 desnecessariamente; placeholder controlado é seguro com disclaimer |
| Embed de calculadora externa (corretora parceira) | ❌ Rejeitado | Vazamento de tráfego; sem controle de UX; sem moat |

## Próximos Passos

- [ ] Story 6.7: consultor atuarial valida fórmula + assina ADR-003 final (move status `Proposed` → `Accepted`)
- [ ] Story 6.7: atualizar nomenclatura de produtos para Bronze/Prata/Ouro/Platinum/Platinum Mais
- [ ] Story 6.3: unit tests com 5 cenários canônicos (baixa/media/alta sinistralidade × com/sem coparticipação)
- [ ] Re-validação anual após reajustes anunciados pela Amil (cron alert no calendar do PM)

## References

- `docs/architecture.md` (seção ADRs inline — fonte original)
- `docs/prd.md` v1.2.2 Story 6.3 — implementação calculadora
- `docs/prd.md` v1.2.2 Story 6.7 — validação atuarial (BLOCKS 6.3)
- `data/tabelas-amil.ts` — tabela base de preços (input da fórmula)
