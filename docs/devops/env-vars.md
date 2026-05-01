# Mapping de Environment Variables — planoamilempresas

> Story 1.2 (AC5) — fonte canônica do mapping de env vars × purpose × scope ×
> source × sensitivity. Sincronizado com `.env.example` na raiz.
>
> **Total: 20 variáveis** (14 funcionais + 4 Sanity duplicadas para legado +
> 2 alias `NEXT_PUBLIC_*`).

---

## Convenções

- **Scope** indica em quais ambientes Vercel a variável deve estar definida:
  `dev` (Development) / `preview` (Preview) / `prod` (Production).
- **Sensitive Y** = nunca logar, nunca commitar, rotacionar a cada 90d.
- **`NEXT_PUBLIC_*`** = exposto ao browser bundle. NUNCA usar para secrets.
- **Sem prefixo `NEXT_PUBLIC_`** = server-only, isolado em runtime Node.

---

## Tabela canônica

| # | Variável | Purpose | Scope | Source | Sensitive | Story |
|---|----------|---------|-------|--------|-----------|-------|
| 1 | `NEXT_PUBLIC_SITE_URL` | URL canônica do site (metadataBase, sitemap, OG, canonicals) | dev / preview / prod | Hardcoded literal | N | 1.2 |
| 2 | `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número WhatsApp do corretor (deep links wa.me) | dev / preview / prod | Stakeholder (5511926510515) | N | 1.2 / 4.x |
| 3 | `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 Measurement ID | preview / prod (placeholder em dev) | https://analytics.google.com → Admin → Data Streams | N | 1.5 |
| 4 | `GSC_VERIFICATION` | Google Search Console — meta verification token | prod | https://search.google.com/search-console → propriedade → HTML tag | N | 1.5 |
| 5 | `SENTRY_DSN` | Sentry — endpoint para envio de errors | preview / prod | https://sentry.io → Project → Settings → Client Keys (DSN) | Y | 1.5 |
| 6 | `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity — Project ID | preview / prod | https://clarity.microsoft.com/ → Project | N | 1.5 |
| 7 | `UPSTASH_REDIS_REST_URL` | Upstash Redis REST API endpoint | dev / preview / prod | https://console.upstash.com/ → DB → REST API | Y | 1.2 |
| 8 | `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST auth token | dev / preview / prod | mesmo painel acima | Y | 1.2 |
| 9 | `CRM_PROVIDER` | Adapter pattern selector (`clint` \| `rdstation` \| `hubspot` \| `pipedrive`) | dev / preview / prod | Literal (default `clint`) | N | 4.3 |
| 10 | `CRM_API_KEY` | API Key do provider escolhido | preview / prod (sandbox em dev) | Painel do provider | Y | 4.3 |
| 11 | `RECEITA_API_KEY` | Provider externo de enrichment CNPJ (opcional) | dev / preview / prod (vazio = fallback BrasilAPI) | Provider escolhido (ex: ReceitaWS Plus) | Y | 4.x |
| 12 | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile — site key (público) | dev / preview / prod | https://dash.cloudflare.com/?to=/:account/turnstile | N | 4.x |
| 13 | `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile — secret server-side | dev / preview / prod | mesmo painel acima | Y | 4.x |
| 14 | `SANITY_PROJECT_ID` | Sanity CMS — Project ID | dev / preview / prod | https://www.sanity.io/manage → Project → API | N | 1.1 |
| 15 | `SANITY_DATASET` | Sanity dataset (`production` ou `development`) | dev=`development`, preview/prod=`production` | Literal | N | 1.1 |
| 16 | `SANITY_API_VERSION` | Sanity API version pin | dev / preview / prod (`2024-01-01`) | Literal (atualizar em manutenção semestral) | N | 1.1 |
| 17 | `SANITY_API_READ_TOKEN` | Sanity read token (preview drafts, server-only) | dev / preview / prod | Sanity Manage → API → Tokens → Read | Y | 1.1 |
| 18 | `SANITY_REVALIDATE_SECRET` | Webhook secret para revalidação on-demand `/api/revalidate` | preview / prod | Gerar `openssl rand -hex 32` | Y | 3.x |
| 19 | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Alias public para Sanity client browser-side (legado) | dev / preview / prod | mesmo valor do #14 | N | 1.1 |
| 20 | `NEXT_PUBLIC_SANITY_DATASET` | Alias public para Sanity client browser-side (legado) | dev / preview / prod | mesmo valor do #15 | N | 1.1 |

---

## Inconsistências detectadas vs PRD/Stories

> Reportar a Aria/Morgan para reconciliação. Gage NÃO corrige sozinho.

1. **Sanity dual-naming**: o `.env.example` herdado da Story 1.1 usa
   `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
   `SANITY_API_TOKEN`. A Story 1.2 AC5 prescreve `SANITY_PROJECT_ID`,
   `SANITY_DATASET`, `SANITY_API_READ_TOKEN`. Solução temporária: declarar
   ambos os names com mesmo valor até o refactor de `lib/sanity/client.ts`
   (Story 3.x). Escolher um padrão definitivo em SCP futuro.

2. **`NEXT_PUBLIC_GA_MEASUREMENT_ID` vs `NEXT_PUBLIC_GA4_ID`**: o
   `app/layout.tsx` referencia `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID` (linha 14).
   Story 1.2 AC5 prescreve `NEXT_PUBLIC_GA4_ID`. Story 1.5 (Analytics) deve
   resolver — sugestão: refatorar layout.tsx para `NEXT_PUBLIC_GA4_ID` no
   início da Story 1.5.

3. **`SANITY_REVALIDATE_SECRET`** está em uso no `.env.example` herdado mas
   não está listado nos 14 ACs da Story 1.2. Manter (necessário para
   webhooks Sanity Story 3.x) e adicionar como #18 acima.

---

## Política de rotação

| Tipo | Rotação | Trigger |
|------|---------|---------|
| `*_API_KEY`, `*_TOKEN`, `*_SECRET` | 90d | calendar reminder + após qualquer leak/exposure |
| `SENTRY_DSN` | nunca (público de fato — DSN não é secret) | apenas em re-projeto Sentry |
| `NEXT_PUBLIC_*` | nunca (já public) | rebranding apenas |

---

## Comandos úteis

```bash
# Listar env vars Vercel
npx vercel env ls

# Pull para local (cria .env.local)
npx vercel env pull .env.local

# Adicionar secret
npx vercel env add UPSTASH_REDIS_REST_TOKEN production
# (cola valor quando solicitado)

# Remover env var
npx vercel env rm UPSTASH_REDIS_REST_TOKEN production
```

Ver também: [`vercel-setup.md`](./vercel-setup.md), [`sync-secrets.md`](./sync-secrets.md).
