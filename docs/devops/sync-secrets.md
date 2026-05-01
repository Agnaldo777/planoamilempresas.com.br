# Sync Secrets — GitHub Actions ↔ Vercel

> Story 1.3 (AC9) — procedimento para manter os secrets do GitHub Actions
> sincronizados com as env vars do Vercel.
>
> **Owner:** @devops (Gage). Acesso restrito.

---

## Filosofia

| Storage | Uso |
|---------|-----|
| **Vercel env vars** | runtime do site (dev / preview / prod) |
| **GitHub Actions secrets** | apenas para workflows CI que precisam acessar serviços externos durante PR validation (ex: Sanity preview, Lighthouse CI token, Vercel API se push manual) |

> A maioria dos workflows roda contra o **preview Vercel já deployado**, não
> precisa replicar todos os secrets. Replicar só o mínimo necessário.

---

## Secrets necessários no GitHub Actions

| Secret | Workflow consumidor | Origem | Sensitive |
|--------|---------------------|--------|-----------|
| `GITHUB_TOKEN` | todos | auto-provisionado pelo GH | Y |
| `VERCEL_TOKEN` | (futuro — deploy manual) | https://vercel.com/account/tokens | Y |
| `VERCEL_ORG_ID` | (futuro) | `npx vercel link` → `.vercel/project.json` | N |
| `VERCEL_PROJECT_ID` | (futuro) | mesmo | N |
| `LHCI_GITHUB_APP_TOKEN` | lighthouse.yml (opcional) | https://github.com/apps/lighthouse-ci | Y |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ci.yml (build) | mesmo do Vercel | N |
| `NEXT_PUBLIC_SANITY_DATASET` | ci.yml (build) | mesmo do Vercel | N |

> **Nunca** commitar valores. Usar GitHub UI ou `gh` CLI.

---

## Set via GitHub UI

```
Repo → Settings → Secrets and variables → Actions → New repository secret
→ Name: <UPPER_SNAKE_CASE>
→ Secret: <valor>
```

---

## Set via `gh` CLI

```bash
# Autenticar uma vez
gh auth login

# Setar secret
gh secret set VERCEL_TOKEN --body "<valor>" --repo BeneficioRH/planoamilempresas

# Listar
gh secret list --repo BeneficioRH/planoamilempresas

# Remover
gh secret delete VERCEL_TOKEN --repo BeneficioRH/planoamilempresas
```

---

## Bulk sync helper script (opcional)

> Use este script após gerar `.env.local` via `vercel env pull`.
> Filtra apenas as keys necessárias para CI (não replica secrets de runtime
> que o site consome — esses já estão no Vercel).

```bash
#!/usr/bin/env bash
# scripts/sync-secrets-to-github.sh
# Sincroniza as keys públicas (NEXT_PUBLIC_*) e tokens necessários para CI.

set -euo pipefail

REPO="${1:-BeneficioRH/planoamilempresas}"
ENV_FILE="${2:-.env.local}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Run: npx vercel env pull $ENV_FILE first"
  exit 1
fi

# Apenas as keys que CI precisa (whitelist)
KEYS=(
  NEXT_PUBLIC_SANITY_PROJECT_ID
  NEXT_PUBLIC_SANITY_DATASET
  # Não-incluir: secrets de runtime (CRM_API_KEY, UPSTASH_*, etc) — só Vercel.
)

for key in "${KEYS[@]}"; do
  value=$(grep -E "^${key}=" "$ENV_FILE" | cut -d= -f2- | tr -d '"' || true)
  if [ -z "$value" ]; then
    echo "skip: $key (not in $ENV_FILE)"
    continue
  fi
  echo "set: $key"
  echo "$value" | gh secret set "$key" --repo "$REPO"
done
```

> **Não** commitar valores reais nem em scripts. O script acima lê de
> `.env.local` (já no `.gitignore`).

---

## Quando rotacionar

| Trigger | Ação |
|---------|------|
| 90 dias desde última rotação | rodar `gh secret set` em todos os tokens marcados Sensitive Y |
| Suspeita de exposure | rotacionar imediatamente + investigar logs Sentry/Vercel |
| Membro saiu do time | rotacionar todos compartilhados + revogar GH access |
| Vendor force rotation | seguir vendor + atualizar Vercel + GH |

---

## Quem tem acesso

- Stakeholder principal: Agnaldo Silva (`beneficiorh@gmail.com`)
- @devops (Gage): apenas via repo write + Vercel team membership
- Outros agentes (@dev, @qa, @architect): NUNCA têm acesso a secrets

> Nenhum agente AIOS armazena secrets em memória persistente. Pull on-demand
> via `vercel env pull` em ambiente local descartável.

---

## Verificação

```bash
# Listar secrets GitHub (mostra apenas nomes, não valores)
gh secret list --repo BeneficioRH/planoamilempresas

# Listar env vars Vercel
npx vercel env ls

# Diff manual: nomes em GH ⊆ nomes Vercel? (CI não precisa de tudo)
```

---

## Referências

- Story 1.3: `docs/stories/1.3.cicd-github-actions-vercel.story.md`
- Env vars completas: [`env-vars.md`](./env-vars.md)
- Vercel setup: [`vercel-setup.md`](./vercel-setup.md)
