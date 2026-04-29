# Sanity Studio Hosted — Setup & Operação

**Status:** Hosted gratuito Sanity (Opção A)
**Data:** 2026-04-29
**ADR:** ADR-011 (Cloudflare Workers) + Story 3.27

---

## Contexto

Sanity Studio (CMS visual) era servido via rota Next.js `app/(studio)/studio/[[...tool]]`. Após migração para Cloudflare Workers (ADR-011), essa rota se tornou incompatível — pacote `sanity` v3 tem dependências Node-heavy que não rodam em Workers runtime.

**Decisão:** migrar Studio para hosting gratuito oficial Sanity em URL separada:
- **URL Studio:** `https://planoamilempresas.sanity.studio`
- **URL site público:** `https://planoamilempresas.com.br` (Cloudflare Workers)

---

## Como acessar

| Recurso | URL |
|---------|-----|
| Studio (CMS editorial) | `https://planoamilempresas.sanity.studio` |
| Login | Cloudflare email/Google ou Sanity native auth |
| Site público | `https://planoamilempresas.com.br` |

---

## Como deployar updates do Studio

Após mudanças em `sanity/schemas/*.ts` ou `sanity.config.ts`:

```bash
# 1. Login (uma vez)
npx sanity login

# 2. Deploy
npx sanity deploy

# Quando perguntar pelo studio hostname:
#   planoamilempresas
# Resultado: https://planoamilempresas.sanity.studio
```

Deploys são instantâneos (~30s), sem afetar o site público.

---

## Permissions / Editores

Adicionar editores via Sanity Manage:

```bash
npx sanity manage
# OU acesse: https://www.sanity.io/manage/personal/project/<PROJECT_ID>/team
```

**Roles recomendadas:**

| Editor | Email | Role |
|--------|-------|------|
| Agnaldo Silva (stakeholder) | beneficiorh@gmail.com | **Administrator** |
| Atlas (analyst content) | (a definir) | **Editor** |
| Advogado revisor (Story 2.4) | (a definir) | **Editor** com aprovação obrigatória workflow |
| Médico revisor YMYL (Story 6.10) | (a definir) | **Editor** |

---

## CORS

Sanity Studio precisa autorizar o site público a fazer queries via CDN:

1. Acesse `https://www.sanity.io/manage/personal/project/<PROJECT_ID>/api`
2. Adicione CORS origins:
   - `https://planoamilempresas.com.br`
   - `https://planosaudeamil.com.br` (Fase 2 futura)
   - `http://localhost:3000` (dev)

---

## Backup / Restore

```bash
# Export dataset completo
npx sanity dataset export production backup-YYYY-MM-DD.tar.gz

# Restore
npx sanity dataset import backup-YYYY-MM-DD.tar.gz production
```

**Cadência recomendada:** mensal, armazenado em R2 bucket privado.

---

## Workflow editorial

Conforme NFR23 (Story 6.10):

```
[draft] → [review_tecnico] → [review_juridico] → [approved] → [published]
```

Editores controlam status via campo `workflowStatus` em cada `blogPost`. Audit CI (`scripts/audit-workflow-status.mjs`) bloqueia publicação YMYL sem `reviewTrack` completo.

---

## Free tier limits

Sanity Free Tier:
- 3 user seats
- 5GB storage
- 100 GB CDN bandwidth/mês
- 500k API requests/mês
- 1 dataset (production)

**Suficiente para MVP Fase 1.** Upgrade Growth ($99/mês) só se >5GB ou >3 editores.

---

## Reconsideração (Opção B futura)

Se quiser subdomínio próprio `studio.planoamilempresas.com.br` (vanity) em vez de `*.sanity.studio`:
- Requer plano Sanity Growth ($99/mês)
- Configuração CNAME `studio.planoamilempresas.com.br` → `<projeto>.sanity.studio`
- Fora do escopo Fase 1 — reavaliar quando ROI justificar

---

## Referências

- ADR-001: CMS Choice (Sanity)
- ADR-011: Cloudflare Workers deployment
- Story 3.27: Sanity Studio hosted migration
- NFR23: Pipeline revisão humana (Story 6.10)
- `docs/editorial/cms-guide.md`: workflow editorial canonical
