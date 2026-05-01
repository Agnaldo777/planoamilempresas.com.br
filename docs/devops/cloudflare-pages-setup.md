# Cloudflare Workers Setup Runbook — planoamilempresas

> ADR-011 — runbook step-by-step para o stakeholder após Gage produzir os
> artefatos de deploy. Substitui `vercel-setup.md` (deprecated).
>
> **Tempo estimado:** 3-5h (incluindo propagação DNS).
> **Pré-requisitos:** conta Cloudflare criada (free tier), domínio já em zone
> Cloudflare (DNS only), Sanity Studio decidido (Opção C: hosted em
> https://www.sanity.io/manage).

---

## Por que Cloudflare Workers (não Pages)?

`@cloudflare/next-on-pages` (Pages adapter) tem peer dep
`next >=14.3.0 && <=15.5.2`. Este projeto usa Next.js 16.2.4. Cloudflare
oficializou o caminho de migração: **Cloudflare Workers via
`@opennextjs/cloudflare`**. Pages permanece para projetos Next 14/15.

Workers em 2026 oferecem:
- Static Assets bindings (substitui Pages assets)
- Free tier idêntico (100k req/dia, ilimitado bandwidth)
- Comercial OK (sem cláusula Hobby)
- R2 incremental cache para ISR (10GB free)
- Suporte `_headers` / `_redirects` files

---

## Checklist de execução

- [ ] 1. Criar conta Cloudflare + login no Dashboard
- [ ] 2. Conectar repositório GitHub (via Workers Builds OU GitHub Actions)
- [ ] 3. Provisionar bucket R2 para incremental cache
- [ ] 4. Configurar 14+ env vars (Workers Dashboard ou `wrangler secret put`)
- [ ] 5. Apontar DNS: ZoneA/AAAA → Workers Custom Domain
- [ ] 6. Provisionar Upstash Redis (mantido — ADR-002)
- [ ] 7. Verificar HTTPS / HSTS / CSP
- [ ] 8. Configurar GitHub Branch Protection (atualizar checks)
- [ ] 9. Smoke test (PR dummy → preview → merge → production)
- [ ] 10. Migrar Sanity Studio para hosted (Opção C — sanity.io/studio)

---

## 1. Criar conta Cloudflare

```
https://dash.cloudflare.com/sign-up
→ Login com email beneficiorh@gmail.com
→ Plano: Free (100k req/dia + bandwidth ilimitado)
→ Adicionar domínio: planoamilempresas.com.br
→ Cloudflare gera 2 nameservers — apontar Registro.br para esses NS
→ Aguardar propagação (~5 min)
```

> **Já existe zone Cloudflare** (configurada para Bradesco e outros sites
> beneficio rh)? Reutilizar account, criar zone separada para o domínio.

---

## 2. Conectar GitHub

### Opção A — Workers Builds (recomendado, mais simples)

```
Cloudflare Dashboard → Workers & Pages → Create → Workers
→ Connect to Git → Authorize GitHub App
→ Selecionar repo: planoamilempresas
→ Branch: main
→ Build command: npx opennextjs-cloudflare build
→ Deploy command: npx wrangler deploy
→ Environment vars: definidas via Dashboard (próximo passo)
```

### Opção B — GitHub Actions (preferido para CI determinístico)

Workflow em `.github/workflows/cloudflare-pages-deploy.yml` já configurado.
Necessário criar 2 secrets no GitHub:

```
GitHub repo → Settings → Secrets and variables → Actions → New repo secret

CLOUDFLARE_API_TOKEN  = (criar em Cloudflare Dashboard → My Profile → API Tokens
                         → "Edit Cloudflare Workers" template; scope account)
CLOUDFLARE_ACCOUNT_ID = (Cloudflare Dashboard → Workers & Pages → barra direita)
```

**Recomendado:** Opção B (Actions) — workflow já versionado, melhor controle
de cache, secrets centralizados.

---

## 3. Provisionar R2 buckets (incremental cache)

```bash
npx wrangler r2 bucket create planoamilempresas-opennext-cache
npx wrangler r2 bucket create planoamilempresas-preview-opennext-cache
```

Já referenciado em `wrangler.jsonc`. R2 Free: 10GB storage + 10M ops/mês.

---

## 4. Env vars × 3 environments

Workers Dashboard → Worker `planoamilempresas` → Settings → Variables and
Secrets. Para cada env (production, preview), aplicar:

| Variável | Production | Preview | Development | Sensitive |
|----------|------------|---------|-------------|-----------|
| `NEXT_PUBLIC_SITE_URL` | `https://planoamilempresas.com.br` | `https://preview.planoamilempresas.com.br` | `http://localhost:3000` | N |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `5511926510515` | mesmo | mesmo | N |
| `NEXT_PUBLIC_GA4_ID` | (real, Story 1.5) | placeholder | placeholder | N |
| `GSC_VERIFICATION` | (real, Story 1.5) | vazio | vazio | N |
| `SENTRY_DSN` | (real, Story 1.5) | (real ou placeholder) | vazio | Y |
| `NEXT_PUBLIC_CLARITY_ID` | (real, Story 1.5) | placeholder | placeholder | N |
| `UPSTASH_REDIS_REST_URL` | (real Upstash prod) | (mesmo ou DB separado) | (DB dev) | Y |
| `UPSTASH_REDIS_REST_TOKEN` | (real) | (real) | (real) | Y |
| `CRM_PROVIDER` | `clint` | `clint` | `clint` | N |
| `CRM_API_KEY` | (real, Story 4.3) | (sandbox) | (sandbox) | Y |
| `RECEITA_API_KEY` | (vazio = BrasilAPI) | vazio | vazio | Y |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | (real Turnstile) | (real) | (test key) | N |
| `TURNSTILE_SECRET_KEY` | (real) | (real) | (test key) | Y |
| `SANITY_PROJECT_ID` | (real) | (mesmo) | (mesmo) | N |
| `SANITY_DATASET` | `production` | `production` | `development` | N |
| `SANITY_API_VERSION` | `2024-01-01` | mesmo | mesmo | N |
| `SANITY_API_READ_TOKEN` | (real) | (real) | (dev token) | Y |
| `SANITY_REVALIDATE_SECRET` | `openssl rand -hex 32` | mesmo | vazio | Y |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | mesmo `SANITY_PROJECT_ID` | mesmo | mesmo | N |
| `NEXT_PUBLIC_SANITY_DATASET` | mesmo `SANITY_DATASET` | mesmo | mesmo | N |
| `CF_ENV` | `production` | `preview` | `development` | N |

**Bulk import via wrangler:**

```bash
# Vars públicas (commit OK)
npx wrangler secret bulk .env.production --env production

# Secrets individualmente
echo "valor-real" | npx wrangler secret put CRM_API_KEY --env production
```

> Detalhes em [`env-vars.md`](./env-vars.md).

---

## 5. DNS — Cloudflare Workers Custom Domain

### 5.1 Adicionar custom domain ao Worker

```
Workers Dashboard → planoamilempresas → Settings → Domains & Routes
→ Add Custom Domain
→ planoamilempresas.com.br
→ Cloudflare auto-cria DNS record (proxied/orange cloud)

→ Add Custom Domain
→ www.planoamilempresas.com.br
```

### 5.2 Verificar DNS

```
DNS → Records (mesma zone)
→ Tipo CNAME ou A automático apontando para Worker
→ Proxy: Proxied (orange cloud) — OK aqui (Workers integra nativamente)
→ TTL: Auto

# Importante: ADR-004 (TTL 300 + DNS only) NÃO se aplica a Workers Custom
# Domain. Workers ignora TTL em records proxied. Para rollback rápido,
# remover Custom Domain do Worker (Dashboard) — propagação <2min.
```

### 5.3 Propagação

```bash
dig +short planoamilempresas.com.br
dig +short www.planoamilempresas.com.br
# Deve retornar IPs Cloudflare (104.21.x ou 172.67.x)
```

---

## 6. Upstash Redis (mantém ADR-002)

Sem mudanças vs. setup Vercel anterior — Upstash é provider externo. Ver
[`vercel-setup.md` § 4](./vercel-setup.md) (deprecated mas válido para
referência Upstash).

---

## 7. HTTPS + HSTS + CSP

```bash
curl -I https://planoamilempresas.com.br
# HTTP/2 200
# strict-transport-security: max-age=63072000; includeSubDomains; preload
# x-frame-options: DENY
# x-content-type-options: nosniff
# content-security-policy: default-src 'self'; ...
# referrer-policy: strict-origin-when-cross-origin
# permissions-policy: camera=(), microphone=(), geolocation=(self), interest-cohort=()
```

Headers vêm de `public/_headers` + `next.config.ts` (defesa em profundidade).

SSL Labs:
```
https://www.ssllabs.com/ssltest/analyze.html?d=planoamilempresas.com.br
→ Expected grade: A or A+
```

---

## 8. GitHub Branch Protection (atualizar)

Mesmo bloco do `vercel-setup.md` § 6 — apenas trocar checks:

```
Required checks:
  - ci / lint
  - ci / typecheck
  - ci / test
  - ci / build
  - cloudflare-deploy / Build & deploy (Cloudflare Workers)   ← NOVO
  - lighthouse / lhci
  - accessibility / axe
  - schema-validation / validate
  - validate-sitemap-routing / validate
```

Remover:
```
  - Vercel — Preview Deploy   ← obsoleto
```

---

## 9. Smoke test end-to-end

```bash
# 1. Branch dummy
git checkout -b chore/smoke-test-cloudflare
echo "// smoke" >> README.md
git commit -am "chore: smoke test Cloudflare Workers deploy"
git push origin chore/smoke-test-cloudflare

# 2. Abrir PR no GitHub → main
#    → GitHub Actions roda cloudflare-deploy workflow
#    → wrangler-action faz `versions upload --env preview`
#    → Comentário automático no PR com URL preview

# 3. Validar preview
curl -I https://<preview-url>.workers.dev
# 200 + HSTS

# 4. Merge → main
#    → workflow deploya production via `wrangler deploy --env production`

# 5. Validar production
curl https://planoamilempresas.com.br/api/healthz
# {"status":"ok","version":"<sha7>","timestamp":"...","environment":"production"}

# 6. Cleanup
git branch -d chore/smoke-test-cloudflare
git push origin --delete chore/smoke-test-cloudflare
```

---

## 10. Sanity Studio — Opção C (hosted, gratuito)

`app/(studio)/studio/[[...tool]]/page.tsx` é uma rota client-side que carrega
o pacote `sanity` (Studio v3) — package Node-heavy incompatível com runtime
Workers. Decisão: **migrar para Sanity hosted**.

```bash
# 1. Login sanity CLI
npx sanity login

# 2. Deploy studio para sanity.studio
cd sanity/
npx sanity deploy
# → Hostname: planoamilempresas
# → URL: https://planoamilempresas.sanity.studio (free)

# 3. Remover rota Next.js
rm -rf app/\(studio\)/

# 4. Atualizar URL CMS no admin/onboarding (Story 3.x):
#    https://planoamilempresas.sanity.studio
```

> **TODO Pax:** abrir Story 3.x.b "Migrar Sanity Studio para hosted" como
> blocker de Story 3.0 (Studio config foundation).

---

## Debug em produção

```bash
# Logs em real-time
npx wrangler tail --env production

# Ou Dashboard → Worker → Logs (real-time + persistido 24h com
# observability.enabled=true em wrangler.jsonc)
```

---

## Rollback (1-click)

```
Cloudflare Dashboard → Worker → Deployments → [versão anterior]
→ "Rollback to this version"
→ <30s, sem rebuild
```

Ou via CLI:
```bash
npx wrangler rollback --env production --message "Reverting deploy <id>"
```

---

## Troubleshooting

| Sintoma | Causa | Fix |
|---------|-------|-----|
| Build falha "workerd Unsupported platform" | Windows arm64 (apenas dev local) | OK em CI Linux x64. Para dev local, usar WSL2 ou skip build:cf no Windows. |
| `/api/healthz` retorna `environment: development` | `CF_ENV` não setado | Definir em Workers Dashboard → Vars |
| `_headers` não aplicados | sintaxe inválida | Validar com `npx wrangler dev` local; cada bloco `/path` separado por linha em branco |
| Sanity Studio 500 | rota `app/(studio)` não removida | Executar passo 10 deste runbook |
| ISR não revalida | R2 bucket não criado | `npx wrangler r2 bucket create planoamilempresas-opennext-cache` |
| `revalidatePath` 401 | secret não setado | `npx wrangler secret put SANITY_REVALIDATE_SECRET --env production` |

---

## Referências

- ADR-011: `docs/decisions/adr-011-deployment-platform-cloudflare.md` (Aria, em escrita)
- OpenNext Cloudflare docs: https://opennext.js.org/cloudflare
- Workers Static Assets: https://developers.cloudflare.com/workers/static-assets/
- Story 1.2 v2 (em escrita por Pax)
- Env vars completas: [`env-vars.md`](./env-vars.md)
