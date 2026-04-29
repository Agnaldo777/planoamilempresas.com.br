# Year Rollover Runbook — Plano Amil Empresas

**Story 3.22 (FR50)** — single source of truth para o ano corrente em title pattern.

---

## TL;DR — Transição anual em 1 step

1. No painel **Vercel → Project Settings → Environment Variables**:
   - Atualizar `NEXT_PUBLIC_CURRENT_YEAR` de `2026` → `2027`
2. **Redeploy** (`vercel --prod` ou trigger via Git push qualquer)
3. Verificar 3 URLs:
   - `https://planoamilempresas.com.br/` — `<title>` deve conter `2027`
   - `https://planoamilempresas.com.br/perguntas-frequentes` — idem
   - `https://planoamilempresas.com.br/tabela-de-precos` — idem

Total: ~5 minutos.

---

## Fonte de verdade

`process.env.NEXT_PUBLIC_CURRENT_YEAR` é consumido por `lib/seo/title.ts:getCurrentYear()`.
Fallback: `2026` (hard-coded em código). Nunca remover o fallback — ele protege
contra deploy com env var ausente em ambiente novo.

Locais que consomem:

- `app/layout.tsx` — title default + template
- (Futuro) cada `app/(marketing)/.../page.tsx` que use `buildTitle()` em
  `generateMetadata()` (Stories 3.23+ irão migrar páginas individuais)

---

## Quando renovar?

**Quando:** primeira semana de janeiro do ano novo.

**Por quê só em janeiro:** "2026" em SERP/share durante dezembro/2025 ainda
é semanticamente correto (estamos a poucos dias do 2026). Bumpar antes da
virada gera dissonância de pesquisa em SERP atual.

**Cuidado:** se for fazer no fim de dezembro, prefira agendar deploy noturno
1/jan ou usar GitHub Action `yearly-bump.yml` (gated OFF em v1, future story).

---

## Validação pós-rollover

```bash
# Smoke test SERP-side
curl -s https://planoamilempresas.com.br/ | grep -oE '<title[^>]*>[^<]+' | head -1
# Esperado: <title>...2027...</title>

# Sanity check schema BeneficioRH preserved
curl -s https://planoamilempresas.com.br/ \
  | grep -oE '"name":"BeneficioRH[^"]*"' | head -1
# Esperado: "name":"BeneficioRH Corretora de Seguros"
```

---

## Failure modes & rollback

| Sintoma | Causa | Fix |
|---------|-------|-----|
| Title ainda mostra "2026" | Cache CDN | Vercel → Deployments → Redeploy with cache cleared |
| Title mostra "undefined" | Env var nome errado | Verificar `NEXT_PUBLIC_CURRENT_YEAR` exato (case-sensitive) |
| Build falha em "2027" | Validation futura (não no v1) | Reverter env var; debug |

---

## Roadmap futuro

- **v2:** GROQ `siteSettings.currentYear` em Sanity Studio (UI-friendly para non-dev)
- **v3:** GitHub Action `yearly-bump.yml` cron 1/jan 00:01 BRT, abre PR auto-mergeable
- **v4:** Lint rule custom bloqueando hard-coded years em `metadata.title`

---

## Owner

@devops (Gage) — env vars Vercel
@dev (Dex)   — código `lib/seo/title.ts`
@architect (Aria) — quality gate transição
