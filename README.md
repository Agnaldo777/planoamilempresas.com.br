# planoamilempresas.com.br

> Site SEO de **Plano de Saúde Amil Empresarial** operado por corretor autorizado SUSEP 201054484 (BeneficioRH).

[![CI](https://github.com/BeneficioRH/planoamilempresas/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/BeneficioRH/planoamilempresas/actions/workflows/ci.yml)
[![Lighthouse CI](https://img.shields.io/badge/Lighthouse_CI-Perf_%E2%89%A590-brightgreen)](https://github.com/BeneficioRH/planoamilempresas/actions/workflows/lighthouse.yml)
[![Accessibility](https://img.shields.io/badge/a11y-axe_WCAG_AA-blue)](https://github.com/BeneficioRH/planoamilempresas/actions/workflows/accessibility.yml)
[![Status](https://img.shields.io/badge/status-MVP_em_desenvolvimento-blue)](docs/prd.md)
[![Stack](https://img.shields.io/badge/stack-Next_16_+_React_19_+_Tailwind_4-black)]()
[![Hosting](https://img.shields.io/badge/hosting-Vercel-black)]()
[![License](https://img.shields.io/badge/license-private-lightgrey)]()

---

## Sobre

Site de captação de leads PJ (planos de saúde empresariais) construído como **moat SEO** dominando long-tail de keywords CNAE × cidade × porte (~600 URLs programmatic) + rede credenciada Amil completa (~10.500 URLs SSG/ISR de 9.325 prestadores em 26 UFs).

### Operador

- **Corretor:** Agnaldo Silva (BeneficioRH) — SUSEP 201054484
- **CRM:** Clint (vertical brasileiro corretoras seguros) — adapter pattern com fallback RD Station / HubSpot / Pipedrive (ADR-002)
- **Operadora-alvo:** Amil Assistência Médica Internacional S.A. (registro ANS 326305)

### Status

Greenfield em desenvolvimento. Story 1.1 (consolidação) **concluída em 2026-04-26**. Próximas: Stories 1.2 (Vercel+DNS) → 1.3 (CI/CD) → 1.4 (canary) → Stories Epic 7 (Programmatic SEO Rede Credenciada — bloqueada por loader rewrite Story 7.1).

---

## Stack tecnológico

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 App Router + RSC |
| UI | React 19 + Tailwind CSS 4 + Radix UI primitives |
| Forms | react-hook-form + zod |
| CMS | Sanity v3 (ADR-001) |
| Storage | Upstash Redis (rate limit, KV leads) |
| Hosting | Vercel (preview deploys + Pro tier se necessário) |
| DNS | Cloudflare DNS → Vercel (gray cloud / DNS-only — ADR-004) |
| Analytics | Google Analytics 4 + Microsoft Clarity + Vercel Speed Insights |
| Observability | Sentry + Vercel Logs |
| Type checking | TypeScript strict mode (NFR14) |
| Tests | Vitest + RTL + MSW + Playwright + axe-core |
| Compliance | LGPD + ANS RN 195/2009 + 593/2024 + SUSEP |

### Versionamento Node

Use `nvm`:

```bash
nvm use   # lê .nvmrc — Node 20.x LTS
```

---

## Comandos principais

```bash
npm install         # Instalar dependências
npm run dev         # Servidor de desenvolvimento (localhost:3000)
npm run build       # Build de produção Next.js
npm run start       # Servidor produção local (após build)
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit (TypeScript strict)
npm run format      # Prettier (write)
npm run audit:rede  # Story 7.0a — audit de cobertura rede credenciada Amil
```

---

## Estrutura

```
planoamilempresas/
├── app/                       # Next.js 16 App Router
│   ├── (marketing)/           # Rotas públicas
│   │   ├── amil-dental/
│   │   ├── amil-espaco-saude-[unidade]/
│   │   ├── blog/
│   │   ├── comparativos/
│   │   ├── contato/
│   │   ├── contato-empresas/
│   │   ├── cotacao-online/
│   │   ├── empresarial/
│   │   ├── perguntas-frequentes/
│   │   ├── plano-amil-[estado]/
│   │   ├── planos/
│   │   ├── portal-empresa/
│   │   ├── rede-credenciada/  # Hub rede credenciada (Story 7.2)
│   │   ├── sobre-nos/
│   │   └── tabela-de-precos/
│   ├── (studio)/              # Sanity Studio (rota protegida)
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   └── page.tsx
├── components/                # Atomic Design
│   ├── forms/
│   ├── layout/
│   ├── sections/
│   ├── seo/
│   └── ui/
├── lib/                       # Utilitários
│   ├── sanity/
│   ├── schema/
│   ├── utils/
│   └── validators/
├── sanity/                    # Schemas + queries
├── public/                    # Assets estáticos
├── data/                      # Datasets versionados (NÃO em src/)
│   ├── tabelas-amil.ts        # Tabelas preço Bronze→Platinum Mais
│   └── rede-credenciada/
│       ├── rede-credenciada.json  # 9.325 prestadores (mirror — ADR-007)
│       ├── rede-amil.ts           # Loader v2 (deprecated em Story 7.2)
│       └── README.md
├── scripts/                   # Automações
│   └── audit-network-coverage.mjs  # Story 7.0a
├── docs/                      # Documentação canônica
│   ├── prd.md                          # PRD v1.2.4
│   ├── architecture.md                 # Arch v1.1
│   ├── front-end-spec.md               # FE Spec v1.1
│   ├── decisions/                      # ADR-000 a ADR-007
│   ├── stories/                        # Stories canônicas (1.0-1.4 + 7.x)
│   ├── _archive/from-amil-empresarial/ # Audit trail pré-consolidação
│   └── _internal/                      # Working notes (NÃO citar publicamente)
└── ...configs (next.config.ts, tsconfig.json, eslint.config.mjs, etc.)
```

---

## Documentação canônica

| Documento | Versão | Owner |
|---|---|---|
| [PRD](docs/prd.md) | v1.2.4 | Morgan (PM) |
| [Architecture](docs/architecture.md) | v1.2 | Aria (Architect) |
| [Front-end Spec](docs/front-end-spec.md) | v1.1 | Uma (UX) |
| [ADR-000 Next.js](docs/decisions/adr-000-nextjs-over-astro.md) | Accepted | Aria |
| [ADR-001 Sanity](docs/decisions/adr-001-cms-choice.md) | Accepted | Aria |
| [ADR-002 Clint CRM](docs/decisions/adr-002-crm-adapter.md) | Updated | Aria |
| [ADR-003 Calculator](docs/decisions/adr-003-calculator-formula.md) | Proposed | Aria |
| [ADR-004 DNS](docs/decisions/adr-004-dns-strategy.md) | Proposed | Aria |
| [ADR-005 Programmatic SEO Depth](docs/decisions/adr-005-programmatic-seo-depth-strategy.md) | Updated v2 | Aria + Pax |
| [ADR-006 URL-as-Trademark](docs/decisions/adr-006-url-as-trademark-policy.md) | Proposed | Aria + advogado |
| [ADR-007 Dataset SSOT](docs/decisions/adr-007-dataset-ssot.md) | Accepted | Aria + Pax |
| [SCP v1.2.3](docs/sprint-change-proposal-v1.2.3.md) | Accepted | Orion + 4 agentes |

---

## Origem do projeto

Codebase consolidado em 2026-04-26 (Story 1.1) a partir de duas fontes:

1. **Código:** `C:\Users\benef\amil-empresarial\site\` (autoria stakeholder Agnaldo Silva — Next 16 + Sanity já strippado de Bradesco)
2. **Documentação AIOS:** `C:\Users\benef\planoamilempresas\` (squad Synkra AIOS — PRD, ADRs, stories rigorosos)

Documentação anterior do projeto paralelo arquivada em `docs/_archive/from-amil-empresarial/` para audit trail.

---

## Compliance e disclaimers

Este site é operado por **corretor autorizado** a intermediar planos da Amil Assistência Médica Internacional S.A. (registro ANS nº 326305). É **independente** e não substitui canais oficiais Amil.

- Disclaimer SUSEP em rodapé global (NFR7)
- Disclaimer ANS em todas páginas com produto Amil (NFR6)
- Política de privacidade LGPD + DPO contactável (NFR5)
- Sem uso de logo Amil oficial (NFR8 + ADR-006)

---

## Contato

- Stakeholder: Agnaldo Silva (BeneficioRH)
- Email: beneficiorh@gmail.com
- Repositório: (a configurar — Story 1.2)

---

— Synkra AIOS Squad — Orion, Pax, Morgan, Aria, Uma, Quinn, Dex, Gage 🎯
