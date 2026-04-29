# Vercel Setup Runbook — planoamilempresas

> **@deprecated** — ADR-011 (2026-04-29) migrou plataforma de deploy para
> Cloudflare Workers. Runbook ativo: [`cloudflare-pages-setup.md`](./cloudflare-pages-setup.md).
>
> Mantido por histórico (Story 1.2 original) e referência da seção §4 (Upstash
> Redis), que permanece válida (provider externo, sem mudança).

> Story 1.2 — runbook step-by-step para o stakeholder executar após Gage produzir os artefatos.
>
> **Tempo estimado:** 4-6h (incluindo propagação DNS).
> **Pré-requisitos:** contas Vercel, Cloudflare e Upstash criadas (Story 1.0); domínio `planoamilempresas.com.br` registrado em Registro.br.

---

## Checklist de execução

- [ ] 1. Criar projeto Vercel + conectar GitHub
- [ ] 2. Configurar 14 env vars × 3 environments
- [ ] 3. Apontar DNS Cloudflare → Vercel (TTL 300s)
- [ ] 4. Provisionar Upstash Redis
- [ ] 5. Verificar HTTPS / HSTS
- [ ] 6. Configurar GitHub Branch Protection
- [ ] 7. Smoke test (commit dummy → preview → merge → production)

---

## 1. Criar projeto Vercel + conectar GitHub

### 1.1 Login

```
https://vercel.com/login
→ Continue with GitHub
→ Autorizar Vercel a acessar o repo planoamilempresas
```

### 1.2 Importar repositório

```
Dashboard Vercel → "Add New..." → "Project"
→ Selecionar repo "planoamilempresas" (após push inicial Story 1.1)
→ Framework Preset: Next.js (auto-detected)
→ Root Directory: ./
→ Build Command: next build (auto)
→ Output Directory: .next (auto)
→ Install Command: npm ci
→ Node.js Version: 20.x
```

> **NÃO** clicar em "Deploy" ainda — primeiro configurar env vars (próximo passo).

### 1.3 Confirmar GitHub Integration

```
Project Settings → Git → Connected Git Repository
→ Production Branch: main
→ Deploy Hooks: nenhum (ainda)
→ Comments → "Enable for pull requests" ✓
```

---

## 2. Configurar env vars × 3 environments

Vercel Dashboard → Project → Settings → Environment Variables.

Cada variável deve ser aplicada em **todos os 3 ambientes** (Production / Preview / Development) salvo indicado.

| Variável | Production | Preview | Development | Sensitive |
|----------|------------|---------|-------------|-----------|
| `NEXT_PUBLIC_SITE_URL` | `https://planoamilempresas.com.br` | `https://staging.planoamilempresas.com.br` (ou preview URL) | `http://localhost:3000` | N |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `5511926510515` | mesmo | mesmo | N |
| `NEXT_PUBLIC_GA4_ID` | (real, Story 1.5) | placeholder | placeholder | N |
| `GSC_VERIFICATION` | (real, Story 1.5) | vazio | vazio | N |
| `SENTRY_DSN` | (real, Story 1.5) | (real ou placeholder) | vazio | Y |
| `NEXT_PUBLIC_CLARITY_ID` | (real, Story 1.5) | placeholder | placeholder | N |
| `UPSTASH_REDIS_REST_URL` | (real Upstash prod) | (mesmo ou DB separado) | (DB dev separado) | Y |
| `UPSTASH_REDIS_REST_TOKEN` | (real) | (real) | (real) | Y |
| `CRM_PROVIDER` | `clint` | `clint` | `clint` | N |
| `CRM_API_KEY` | (real, Story 4.3) | (sandbox) | (sandbox) | Y |
| `RECEITA_API_KEY` | (vazio = BrasilAPI fallback) | (vazio) | (vazio) | Y |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | (real Turnstile) | (real) | (test key) | N |
| `TURNSTILE_SECRET_KEY` | (real) | (real) | (test key) | Y |
| `SANITY_PROJECT_ID` | (real Sanity) | (mesmo) | (mesmo) | N |
| `SANITY_DATASET` | `production` | `production` | `development` | N |
| `SANITY_API_VERSION` | `2024-01-01` | `2024-01-01` | `2024-01-01` | N |
| `SANITY_API_READ_TOKEN` | (real) | (real) | (dev token) | Y |
| `SANITY_REVALIDATE_SECRET` | (real, gerar via `openssl rand -hex 32`) | (real) | (vazio) | Y |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | mesmo `SANITY_PROJECT_ID` | mesmo | mesmo | N |
| `NEXT_PUBLIC_SANITY_DATASET` | mesmo `SANITY_DATASET` | mesmo | mesmo | N |

> **Bulk import:** alternativamente, usar Vercel CLI:
>
> ```bash
> npx vercel link
> npx vercel env pull .env.local       # baixa
> npx vercel env add NEXT_PUBLIC_GA4_ID production
> ```

> Detalhes completos em [`docs/devops/env-vars.md`](./env-vars.md).

---

## 3. DNS Cloudflare → Vercel (ADR-004)

### 3.1 Adicionar domínio no projeto Vercel

```
Vercel Project → Settings → Domains
→ Add Domain: planoamilempresas.com.br
→ Add Domain: www.planoamilempresas.com.br
→ Vercel mostrará records DNS necessários (A + CNAME)
```

### 3.2 Configurar zone Cloudflare

> Pré-requisito: domínio já adicionado no Cloudflare (Account → Add Site) e
> nameservers Registro.br apontados para os NS Cloudflare.

```
Cloudflare Dashboard → Zone planoamilempresas.com.br → DNS → Records

Record 1 (apex):
  Type: A
  Name: @
  IPv4: 76.76.21.21          (IP atual Vercel — verificar Vercel UI antes)
  TTL: Auto OFF — definir 300 (5 minutos)
  Proxy status: DNS only (gray cloud)   [ADR-004 — Option A]

Record 2 (www):
  Type: CNAME
  Name: www
  Target: cname.vercel-dns.com
  TTL: 300
  Proxy status: DNS only (gray cloud)
```

> **CRÍTICO (ADR-004):** TTL = **300s** (5 min). Isso permite rollback rápido
> da mitigação 4 (notificação Amil) em <1h. Não usar Auto/3600s.

> **CRÍTICO (ADR-004):** Proxy = **DNS only** (gray cloud). Cloudflare Proxy
> (orange cloud) interfere com Vercel Edge Network e quebra Vercel Analytics.

### 3.3 Verificar propagação

```bash
# Resolver para IP Vercel
dig +short planoamilempresas.com.br
dig +short www.planoamilempresas.com.br

# Verificar TTL
dig planoamilempresas.com.br | grep -E "^planoamilempresas"

# Esperado: TTL = 300
```

---

## 4. Upstash Redis

### 4.1 Criar database

```
https://console.upstash.com/ → Redis → Create Database
→ Name: planoamilempresas-prod
→ Type: Regional (não Global — economia)
→ Region: sa-east-1 (São Paulo)  [se indisponível: us-east-1]
→ TLS: Enabled
→ Eviction: noeviction
```

### 4.2 Copiar credentials REST

```
Database → REST API → copy URL + Token
→ Vercel env vars:
   UPSTASH_REDIS_REST_URL=<copy>
   UPSTASH_REDIS_REST_TOKEN=<copy>
```

### 4.3 Smoke test

Após deploy preview da Story 1.4 (canary com `/api/healthz`):

```bash
curl https://<preview-url>.vercel.app/api/healthz
# Esperado: {"ok":true,"redis":"PONG","ts":"..."}
```

---

## 5. Verificar HTTPS + HSTS

Após DNS propagar (~5 min com TTL 300s):

```bash
curl -I https://planoamilempresas.com.br

# Esperado:
# HTTP/2 200
# strict-transport-security: max-age=63072000; includeSubDomains; preload
# x-frame-options: DENY
# x-content-type-options: nosniff
# content-security-policy: default-src 'self'; ...
```

Validar SSL Labs:
```
https://www.ssllabs.com/ssltest/analyze.html?d=planoamilempresas.com.br
→ Expected grade: A or A+
```

---

## 6. GitHub Branch Protection

```
GitHub repo → Settings → Branches → Add branch ruleset

Target branches: main

Rules:
  ✓ Restrict deletions
  ✓ Require a pull request before merging
      ✓ Require approvals: 1
      ✓ Dismiss stale pull request approvals when new commits are pushed
      ✓ Require review from Code Owners (se CODEOWNERS configurado)
  ✓ Require status checks to pass
      Required checks:
        - ci / lint
        - ci / typecheck
        - ci / test
        - ci / build
        - lighthouse / lhci
        - accessibility / axe
        - schema-validation / validate
        - Vercel — Preview Deploy
      ✓ Require branches to be up to date before merging
  ✓ Block force pushes
  ✓ Require linear history (opcional)
```

---

## 7. Smoke test end-to-end

```bash
# 1. Criar branch dummy
git checkout -b chore/smoke-test-vercel
echo "// smoke" >> README.md
git commit -am "chore: smoke test deploy preview"
git push origin chore/smoke-test-vercel

# 2. Abrir PR no GitHub → main
#    → Vercel comenta automaticamente com URL preview
#    → CI workflows rodam (Story 1.3)

# 3. Validar preview
curl -I https://<preview-url>.vercel.app
# Esperado: 200 + HSTS

# 4. Merge no main
#    → Vercel deploya em production

# 5. Validar production
curl -I https://planoamilempresas.com.br
# Esperado: 200 + HSTS

# 6. Cleanup
git branch -d chore/smoke-test-vercel
git push origin --delete chore/smoke-test-vercel
```

---

## Vercel Analytics + Preview Protection

### Analytics (free tier)

```
Project → Analytics → Enable
→ Speed Insights → Enable (auto-injeta script)
```

### Preview Protection

> **Decisão pendente do stakeholder:** abrir ou proteger por password?

- **Hobby tier (free):** apenas privado/público uniforme
- **Pro tier ($20/mês):** Password Protection ou Vercel Auth

Recomendação Gage: **abrir** previews durante MVP (canary até Epic 6) para
facilitar review por @architect, @ux, stakeholder. Migrar para password se
expor URLs sensíveis.

---

## Troubleshooting

| Sintoma | Causa | Fix |
|---------|-------|-----|
| `dig` retorna IP não-Vercel | Proxy laranja Cloudflare ativo | Mudar para DNS only (gray cloud) |
| Preview Vercel não comenta no PR | GitHub App desconectado | Project Settings → Git → Reconnect |
| HSTS não aparece em curl | DNS ainda propagando | Aguardar 5 min (TTL 300s); verificar `dig` |
| Build falha "Module not found" | env var faltando | Conferir `.env.example` × Vercel env list |
| Upstash retorna 401 | Token errado / não-aplicado em env | Reaplicar `UPSTASH_REDIS_REST_TOKEN` em todos os 3 envs |

---

## Referências

- ADR-004: `docs/decisions/adr-004-dns-strategy.md`
- Story 1.2: `docs/stories/1.2.configuracao-vercel-dns.story.md`
- Env vars completas: [`env-vars.md`](./env-vars.md)
- Sync secrets GitHub ↔ Vercel: [`sync-secrets.md`](./sync-secrets.md)
