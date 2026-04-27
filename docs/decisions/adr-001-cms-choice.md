# ADR-001: Escolha do CMS Headless

**Status:** ✅ **Accepted** (fechado em 2026-04-24 — Story 1.0 Bloco 3)
**Decisão:** **Sanity v3**
**Owners:** Morgan (PM) · Aria (Architect) · Agnaldo (stakeholder)
**Última atualização:** 2026-04-26 (PRD v1.2.2)

---

## Contexto

O projeto `planoamilempresas.com.br` precisa de um CMS headless para permitir publicação editorial por equipe não-técnica (corretor + redator freelance + advogado revisor) com:

- Suporte nativo a Next.js 14 App Router (RSC + ISR)
- Workflow editorial multi-etapa (rascunho → revisão corretor → revisão advogado → publicação)
- Real-time preview em URL protegida
- Schemas estruturados para tipos de conteúdo: cornerstone, pillar page, blog post, disclaimer, price table, programmatic landing, network provider
- Free tier suficiente para MVP (3+ usuários, ~10GB)
- Webhook para Vercel Revalidate API (ISR sob demanda)

## Opções Consideradas

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| **Sanity v3** | Real-time preview nativo, schemas TypeScript-first, free tier 3 users + 10GB, integração madura com Next.js (`next-sanity`), Portable Text rico, GROQ queries flexíveis | Curva de aprendizado GROQ, vendor lock-in moderado | ✅ **Escolhido** |
| Decap CMS (git-based) | Zero infra adicional, conteúdo em markdown versionado | Sem real-time preview robusto, UX editorial menos polida, sem multi-user workflow nativo | Rejeitado |
| Payload CMS | Self-hosted, MongoDB-based, code-first | Requer hospedagem extra (custos), menos battle-tested no ecossistema Next.js | Rejeitado |
| Strapi | Maduro, comunidade grande | Self-hosted (overhead), licenciamento mudou para SSPL | Rejeitado |
| MDX + Git puro | Simplicidade máxima | Sem UX editorial para não-devs (Agnaldo + redator freelance) | Rejeitado |

## Decisão

**Sanity v3** como CMS headless oficial do projeto.

### Justificativa

1. **Equipe editorial 3+ pessoas** (Agnaldo + redator freelance + advogado revisor) — Sanity studio entrega UX dedicada para não-devs
2. **Real-time preview** — corretor pode revisar conteúdo em rascunho antes de publicar, alinhando com workflow editorial Story 3.1 AC4
3. **Free tier suficiente para MVP** — 3 usuários + 10GB bandwidth + 5GB assets cobrem fase MVP completa (upgrade para Growth $99/mês ou Team $499/mês apenas em Phase 2 se necessário)
4. **Integração Next.js 14 madura** — `next-sanity` + `@sanity/client` + `@sanity/image-url` são production-ready e oficiais
5. **GROQ queries** — flexibilidade para filtros complexos (cornerstones por cluster, prestadores por UF, etc.)
6. **Webhook Sanity → Vercel Revalidate API** — ISR sob demanda em tabelas de preço (Story 6.6) e cornerstones com correções pontuais

### Consequências

**Positivas:**
- Acelera Story 3.1 (Setup CMS) — patterns documentados, sem reinventar
- Equipe editorial não-técnica produz autonomamente
- Webhook ISR mantém freshness sem rebuilds pesados

**Negativas / Mitigações:**
- Vendor lock-in moderado → mitigado por export semanal automático (`sanity dataset export`) para Vercel Blob ou S3
- Schemas em código (TypeScript) → vantagem de type safety, mas requer redeploy em mudanças de schema (mitigado por workflow CI)
- GROQ tem curva de aprendizado → @architect documenta queries comuns em `src/lib/sanity/queries.ts`

### Implementação

- Sanity studio em `/studio` (rota Next.js protegida)
- Schemas em `sanity/schemas/`: `cornerstone`, `pillarPage`, `blogPost`, `disclaimer`, `priceTable`, `programmaticLanding`, `networkProvider`
- Client em `src/lib/sanity/client.ts` (server-side fetch via RSC)
- Preview em `/api/preview` Next.js Route Handler com auth
- Webhook Sanity → `/api/revalidate` para ISR

### Dependências a adicionar em `package.json`

```json
{
  "dependencies": {
    "@sanity/client": "^6.x",
    "@sanity/image-url": "^1.x",
    "next-sanity": "^9.x"
  },
  "devDependencies": {
    "@sanity/vision": "^3.x",
    "sanity": "^3.x"
  }
}
```

## Referências

- `docs/stakeholder-inputs.md` Bloco 3.2 — decisão do stakeholder
- `docs/prd.md` v1.2.2 Story 3.1 — implementação
- Sanity docs: https://www.sanity.io/docs
- next-sanity: https://github.com/sanity-io/next-sanity
