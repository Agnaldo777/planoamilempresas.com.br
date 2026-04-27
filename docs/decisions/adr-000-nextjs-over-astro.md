# ADR-000: Next.js over Astro (retroativo)

**Status:** ✅ **Accepted**
**Data:** 2026-04-16 (Sprint Change Proposal)
**Autor:** Aria (Architect) — Synkra AIOS
**Última atualização:** 2026-04-26 (Pax re-validação — extração inline → arquivo formal)

---

## Context

PRD v1.1 originalmente especificava **Astro 4** como framework principal para o site `planoamilempresas.com.br`, motivado por foco em SEO, bundles JS minimalistas e geração estática.

Durante a Story 1.0 (kickoff com stakeholder Agnaldo Silva), foi descoberto um **codebase Next.js pré-existente** do próprio stakeholder, contendo **1.005 páginas programáticas funcionais** (clone Bradesco já em produção, com patterns maduros de SSG/ISR, schemas Sanity-ready, integração CRM e estrutura de rede credenciada).

Essa descoberta motivou reavaliação imediata do tech stack via Sprint Change Proposal (`docs/sprint-change-proposal.md`).

## Decision

**Pivot para Next.js (App Router) via fork do clone pré-existente.**

> **Atualização v1.1 (2026-04-26):** Após Story 1.1 (consolidação), versão real do codebase é **Next.js 16 + React 19 + Tailwind CSS 4** (não Next 14 como originalmente especificado). Decisão: alinhar PRD/arch com realidade do código (state of art) em vez de downgradear. Consequências em performance / bundle size / Lighthouse permanecem direccionalmente as mesmas — Next 16 RSC + React 19 streaming melhoram ainda mais os baselines.

- Repositório base: `amil-saude/` (autor: stakeholder)
- Strip completo do branding Bradesco (Story 1.1)
- Hosting: Vercel (substitui Cloudflare Pages que era target Astro)
- Tooling complementar: Upstash Redis (KV layer), Sanity v3 (CMS), Vercel Cron (jobs)

## Consequences

- ✅ Economia estimada de **4–8 semanas de desenvolvimento** (não rebuild greenfield)
- ✅ Patterns maduros reutilizáveis (SSG em escala, ISR, programmatic SEO)
- ✅ 1.005 páginas programáticas funcionais como baseline auditável
- ✅ Stakeholder familiarizado com Next.js (autor original), reduz risco operacional pós-MVP
- ✅ Lighthouse ainda muito acima dos concorrentes Tier B (40–70)
- ⚠️ Target Lighthouse **revisto para ≥92** (vs. ≥95 que era target Astro original)
- ⚠️ Bundle JS **≤100KB** (vs. ≤40KB que era target Astro)
- ⚠️ Dependências Next.js + ecossistema React (footprint maior que Astro puro)

## Alternatives Considered

| Opção | Veredito | Por quê |
|---|---|---|
| **Next.js 14 App Router (fork)** | ✅ Escolhido | Reaproveita 1.005 páginas + patterns maduros + autor stakeholder |
| Astro 4 greenfield | ❌ Rejeitado | Perde ativos pré-existentes; 4–8 semanas extras de dev; sem ganho real frente ao moat já construído |
| Hybrid (porting scripts only) | ❌ Rejeitado | Combina pior dos dois: complexidade de port + perda de patterns Next.js maduros |

## References

- `docs/architecture.md` (seção ADRs inline — fonte original)
- `docs/sprint-change-proposal.md` — proposta formal de pivot 2026-04-16
- `docs/prd.md` v1.2 Change Log — registro do pivot
- `docs/prd.md` Story 1.1 — Fork do Codebase Existente + Strip Bradesco
