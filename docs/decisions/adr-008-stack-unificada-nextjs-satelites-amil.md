# ADR-008: Stack unificada Next.js para satélites Amil (Astro descartado)

**Status:** ✅ **Accepted**
**Data:** 2026-04-28
**Autor:** Aria (Architect) — Synkra AIOS
**Decisores:** Aria (Architect) · Agnaldo Silva (stakeholder, endorsement)
**Estende:** ADR-000 (Next.js sobre Astro — Fase 1)

---

## Context

Em 2026-04-27 surgiu proposta de criar um novo satélite SEO 100% Amil — `planosaudeamil.com.br` (escopo amplo: PJ + PF + adesão + dental) — como projeto independente do `planoamilempresas/`, usando stack Astro 4 + Bun. A proposta original (descartada por este ADR) ficou registrada na evolução das memórias até consolidar em `project_satelites_amil_caminho_c.md`.

A motivação declarada era performance bruta (LCP ~0,8s típico Astro vs ~1,2-1,8s Next.js otimizado) e diferenciação técnica frente aos concorrentes diretos (`amilplanos.com.br`, `planodesaudeamil.com.br`).

Análise comparativa conduzida em 2026-04-28 (registrada em `docs/research/competitors/`) levantou três pontos críticos contra Astro+Bun para Fase 2:

1. **Custo de cronograma:** +6-8 semanas. Reescrita estimada de ~14 componentes React maduros já existentes em `planoamilempresas/` (calculadora, formulários CRM, blocks Sanity, prestador map, comparadores) para ilhas Astro + Solid/Preact ou vanilla.
2. **Perda de Visual Editing nativo do Sanity v3:** integração first-class só existe no Next.js (App Router + presentation tool); em Astro exige stub manual e perde live preview.
3. **Velocidade marginal invisível ao público-alvo:**
   - **Fase 1** (`planoamilempresas`): PJ desktop banda larga — gap de 400-700ms LCP é imperceptível.
   - **Fase 2** (`planosaudeamil`): PF mobile 4G urbano — gap segue dentro do bom (<2,5s LCP "Good" no CWV).
   - Concorrentes ranqueiam decentemente com LCP 5-7s; o gap competitivo deles é schema/E-E-A-T/conteúdo único, não velocidade.

Em vertical YMYL (saúde), schema.org rico, sinais E-E-A-T e conteúdo único pesam materialmente mais no ranking que CWV marginal. Otimizar LCP de 1,5s para 0,8s não move a agulha quando o moat real está em outro lugar.

## Decision

**Os DOIS satélites Amil adotam stack unificada Next.js 16 + React 19 + Tailwind 4 + Sanity v3 + Vercel + Cloudflare DNS.**

| Fase | Domínio | Escopo | Status | Localização |
|---|---|---|---|---|
| **Fase 1** | `planoamilempresas.com.br` | PJ exclusivo | ~80% pronto | `/c/Users/benef/planoamilempresas/` |
| **Fase 2** | `planosaudeamil.com.br` | PJ + PF + adesão + dental | Planejado | Fork da Fase 1 |

**Astro+Bun fica descartado para os 2 satélites Amil.**

### Estrutura prevista para Fase 2

Fork inicial da Fase 1, com migração opcional para monorepo conforme tração:

```
satelites-amil/
  apps/
    planoamilempresas/   # Fase 1 (PJ)
    planosaudeamil/      # Fase 2 (amplo)
  packages/
    ui/                  # componentes compartilhados
    data/                # loaders dataset rede credenciada (mirror ADR-007)
    sanity-schemas/      # schemas Sanity v3 reutilizáveis
```

Decisão de monorepo deferida ao kickoff da Fase 2 — fork direto é aceitável até divergência de UI/conteúdo justificar consolidação.

### Mitigações de performance (compensar gap vs Astro)

1. **SSG agressivo:** `generateStaticParams` em todas city pages, prestador pages e rede pages.
2. **Cloudflare em frente ao Vercel:** cache edge agressivo + DNS já no portfólio (ADR-004).
3. **Critical CSS inline** + `next/font` self-hosted.
4. **Dynamic imports** para componentes interativos abaixo do fold (calculadora, formulários).
5. **React Server Components** por default; client components só onde há interatividade real.

## Consequences

### Positivas

- ✅ **Reuso de ~80% dos componentes UI** da Fase 1 na Fase 2 (calculadora PJ, blocks Sanity, schemas, layout, footer global, formulários CRM).
- ✅ **Sanity Studio com Visual Editing nativo preservado** — produção de conteúdo escala sem fricção em ambas as fases.
- ✅ **Cronograma Fase 2 ~6-8 semanas mais curto** que rebuild Astro greenfield.
- ✅ **Manutenção unificada:** 1 stack, 1 time, 1 PRD master com sub-PRD por fase. Reduz custo cognitivo e bus factor.
- ✅ **Pattern do ADR-000 estendido coerentemente:** mesma lógica de "reuso > performance marginal" que ditou Fase 1.
- ✅ **Compatível com ADR-007 (dataset SSOT):** Fase 2 consome o mesmo mirror automatizado do hub `planodesaudepj`.

### Negativas / Mitigações

- ⚠️ **LCP 400-700ms pior que Astro puro** (estimativa direccional).
  - **Mitigação:** 5 itens da seção "Mitigações de performance" acima.
- ⚠️ **Footprint JS maior** que ilhas Astro (Next.js 16 + React 19 baseline).
  - **Mitigação:** RSC por default + dynamic imports + Tailwind 4 tree-shaking; manter target Lighthouse ≥92 (mesmo do ADR-000).
- ⚠️ **Custo Vercel pode crescer não-linear** se tráfego Fase 2 ultrapassar ~500k pageviews/mês (PF tem volume potencial muito maior que PJ).
  - **Mitigação:** revisar plano Vercel em ≥300k pv/mês; em ≥500k pv/mês avaliar migração para Cloudflare Pages + Next.js export estático ou OpenNext.
- ⚠️ **Diferenciação técnica frente a concorrentes não vem da stack** — depende de schema/conteúdo/frescura.
  - **Mitigação:** moat declarado é E-E-A-T + dataset rede credenciada (ADR-007) + Cluster E (ADR-006), não framework.

## Alternatives Considered

| Opção | Veredito | Por quê |
|---|---|---|
| **A) Next.js unificado nas 2 fases** | ✅ **Escolhido** | Reuso ~80% UI; preserva Sanity Visual Editing; cronograma -6-8 semanas; estende ADR-000 coerentemente |
| B) Astro+Bun para Fase 2 (fork zero) | ❌ Rejeitado | +6-8 semanas; reescrita de 14 componentes React; perde Visual Editing; ganho LCP invisível ao público-alvo; YMYL premia schema/E-E-A-T, não CWV marginal |
| C) Híbrido (Fase 2 Astro frontend + Sanity headless via API) | ❌ Rejeitado | Pior dos dois — perde Visual Editing E mantém complexidade de duas stacks; custo de manutenção 2× sem ganho de performance proporcional |
| D) Adiar Fase 2 até validar Fase 1 em produção | 🟡 Parcialmente considerado | Razoável como sequenciamento, mas não decide stack; este ADR fixa stack independente do timing de kickoff |

## Reconsideração

Reabrir avaliação Astro **apenas** se uma das três condições ocorrer:

1. **Tráfego Fase 2 ultrapassar ~500k pv/mês** sustentado por 3 meses, e custo Vercel se tornar bloqueante.
2. **Concorrentes diretos migrarem para Next.js** e o diferencial técnico declarado virar necessário (improvável a curto prazo dado state of art deles).
3. **Surgir terceiro satélite com escopo distinto de conteúdo** (ex: blog estático puro, sem CMS dinâmico, sem formulários) — caso em que Astro pode fazer sentido isolado.

Sem nenhuma dessas, a decisão fica fixa.

## Não substitui — estende

Este ADR **estende** o escopo do ADR-000 (que decidiu Next.js sobre Astro para Fase 1) explicitamente para o segundo satélite Amil. Não revoga ADR-000; apenas aplica a mesma lógica decisória ao novo escopo.

## References

- `docs/decisions/adr-000-nextjs-over-astro.md` — decisão original Fase 1
- `docs/decisions/adr-004-dns-strategy.md` — Cloudflare DNS (compatível com mitigação de performance #2)
- `docs/decisions/adr-007-dataset-ssot.md` — dataset SSOT (compatível com Fase 2 via mirror)
- `docs/research/competitors/` — análise comparativa 2026-04-28 que motivou a decisão
- Memória global `project_satelites_amil_caminho_c.md` — decisão consolidada Caminho C (substitui memória anterior `project_satelite_amil_astro.md`)
- Memória global `project_plano_saude_pj_hub.md` — hub multi-operadora referência arquitetural
