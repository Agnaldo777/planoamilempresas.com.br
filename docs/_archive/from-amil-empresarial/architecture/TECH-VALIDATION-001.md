# Validação Técnica — Stack do Projeto Amil Empresarial

> **Autor:** Aria (Architect) — Synkra AIOS
> **Data:** 2026-03-17
> **Referência:** MASTER-PLAN-SITE-AMIL.md + Story 1.1
> **Veredicto:** ✅ APROVADO COM AJUSTES

---

## 1. A STACK SUPORTA 1.200+ PÁGINAS?

### Veredicto: ✅ SIM, com a estratégia certa de renderização

**Next.js 15 App Router** é a escolha correta. Porém, o ponto crítico é o **build time** com 1.200+ páginas estáticas.

#### Problema: Build Time com SSG Puro

```
1.200 páginas × SSG = cada página renderizada no build
Se cada página leva 500ms = 600 segundos = 10 minutos de build
Se cada página faz query ao Sanity = 1.200 requests durante build
```

**10 minutos de build é aceitável para deploy, MAS inaceitável para preview e desenvolvimento.**

#### Solução: Estratégia Híbrida (SSG + ISR + Dynamic)

| Tipo de Página | Quantidade | Estratégia | Razão |
|---------------|:-:|:-:|--------|
| Home | 1 | **ISR (60s)** | Atualiza com frequência (blog preview, stats) |
| Planos (produto) | 9 | **SSG** | Conteúdo estável, build-time |
| Empresarial | 8 | **SSG** | Conteúdo estável |
| Amil Dental | 6 | **SSG** | Conteúdo estável |
| Comparativos | 20 | **SSG** | Conteúdo estável |
| Tabela de preços | 13 | **ISR (3600s)** | Preços mudam trimestralmente |
| Rede credenciada | 16 | **ISR (86400s)** | Rede muda com baixa frequência |
| Portal empresa | 5 | **SSG** | Conteúdo estável |
| Contato empresas | 3 | **SSG** | Conteúdo estável |
| **Páginas locais** | **550+** | **ISR (86400s)** | Volume alto, revalida 1x/dia |
| FAQ | 50+ | **SSG** | Conteúdo estável |
| Blog | 300+ | **ISR (3600s)** | Posts novos frequentes |
| Sitemap | 1 | **Dynamic (SSR)** | Sempre atualizado |

#### Implementação Técnica

```typescript
// Páginas SSG (build-time) — planos, empresarial, comparativos, FAQ
export async function generateStaticParams() {
  const planos = await getAllPlanos();
  return planos.map((p) => ({ slug: p.slug }));
}

// Página com ISR (revalida a cada X segundos)
export const revalidate = 3600; // 1 hora para blog
export const revalidate = 86400; // 24h para páginas locais

// On-demand revalidation (via webhook do Sanity)
// app/api/revalidate/route.ts
export async function POST(req: Request) {
  const { slug, type } = await req.json();
  revalidatePath(`/planos/${slug}`);
  return Response.json({ revalidated: true });
}
```

#### Build Time Estimado com Estratégia Híbrida

```
SSG no build:  ~80 páginas (planos + empresarial + dental + comparativos + FAQ estáticos)
ISR sob demanda: ~1.120 páginas (locais + blog + preços + rede)

Build time: ~80 × 500ms = 40 segundos ✅
Primeira visita ISR: ~500ms (gera e cacheia)
Visitas seguintes: ~50ms (cache)
```

**Build time: ~40 segundos em vez de ~10 minutos.**

---

## 2. SSG vs ISR vs SSR — Decisão por Tipo

### Regra Geral

```
                FREQUÊNCIA DE ATUALIZAÇÃO
                    ↓
  Nunca/Raro ────── SSG (build-time)
  Semanal ────────── ISR (revalidate: 3600-86400)
  Tempo real ──────── SSR (dynamic)
  Interativo ──────── Client Component
```

### Decisões Específicas

| Decisão | Estratégia | Config |
|---------|-----------|--------|
| **Páginas locais (550+)** | ISR 24h | `revalidate = 86400` + `generateStaticParams` parcial |
| **Blog (300+)** | ISR 1h | `revalidate = 3600` |
| **Tabela de preços** | ISR 1h | `revalidate = 3600` + on-demand via webhook |
| **Formulário multi-step** | Client Component | `'use client'` — React Hook Form |
| **Busca de rede credenciada** | Client + API | API route `/api/rede?cidade=X` |
| **Sitemap XML** | Dynamic | `export const dynamic = 'force-dynamic'` |
| **Schema JSON-LD** | Server Component | Gerado no servidor, zero JS no client |

### Otimização Crítica: `generateStaticParams` Parcial

Para 550+ páginas locais, **não gere todas no build**. Use partial prerendering:

```typescript
// app/(marketing)/plano-amil-[estado]/[cidade]/page.tsx

// Gera apenas as 50 cidades mais importantes no build
export async function generateStaticParams() {
  const topCidades = await getTopCidades(50);
  return topCidades.map((c) => ({
    estado: c.estado_slug,
    cidade: c.slug,
  }));
}

// As 500 restantes são geradas sob demanda (ISR)
export const dynamicParams = true; // permite slugs não listados
export const revalidate = 86400;   // cacheia por 24h após primeira visita
```

---

## 3. SANITY FREE TIER — SUPORTA O VOLUME?

### Análise do Free Tier (Sanity)

| Recurso | Free Tier | Nosso Uso Estimado | Status |
|---------|:-:|:-:|:-:|
| API requests/mês | 100.000 | ~50.000-80.000 | ⚠️ APERTADO |
| Datasets | 2 | 2 (production + staging) | ✅ OK |
| Usuários | 3 | 1-2 | ✅ OK |
| Assets (imagens) | 5GB | ~2-3GB | ✅ OK |
| Bandwidth | 5GB | ~3-4GB | ✅ OK |

### Problema: API Requests

Com ISR, cada revalidação de página = 1-3 queries ao Sanity. Com 1.200 páginas revalidando:
- Revalidação 1x/dia: 1.200 × 3 = 3.600 requests/dia = **108.000/mês** (acima do Free!)
- Com cache inteligente: reduz para ~50.000-60.000/mês

### Solução: Cache Layer

```typescript
// lib/sanity/cached-client.ts
import { unstable_cache } from 'next/cache';

export const getCidadeData = unstable_cache(
  async (slug: string) => {
    return sanityClient.fetch(CIDADE_QUERY, { slug });
  },
  ['cidade-data'],
  { revalidate: 86400 } // cache Next.js 24h
);
```

**Com `unstable_cache` do Next.js, as queries ao Sanity são cacheadas no servidor.** Uma página ISR que revalida a cada 24h só faz query ao Sanity 1x, não a cada visita.

### Recomendação

| Fase | Plano Sanity | Custo |
|------|:-:|:-:|
| MVP (meses 1-3) | **Free** | R$ 0 |
| Escala (meses 4-6) | **Growth** ($15/mês) | ~R$ 80/mês |
| Produção (meses 7+) | **Growth** ou **Business** | R$ 80-400/mês |

**Veredicto: Free tier suporta o MVP. Upgrade para Growth quando passar de 500 páginas.**

---

## 4. RISCOS TÉCNICOS IDENTIFICADOS

### Risco 1: Conteúdo Duplicado entre Páginas Locais

| Risco | Severidade | Mitigação |
|-------|:-:|-----------|
| 550 páginas de cidade com texto similar | ALTO | Template dinâmico com dados REAIS únicos por cidade (hospitais, Espaço Saúde, endereços). Mínimo 30% de conteúdo único por página. Canonical URLs. |

**Implementação:**
```typescript
// Cada página local DEVE ter:
// 1. Lista real de hospitais Amil na cidade (do CMS)
// 2. Endereço do Espaço Saúde mais próximo (se houver)
// 3. Número de telefone regional
// 4. FAQ local (3-5 perguntas específicas da cidade)
// 5. Mapa embed do Google Maps

// Se uma cidade NÃO tem dados reais suficientes → NÃO criar a página
```

### Risco 2: Google Penalizar por Conteúdo Gerado em Massa

| Risco | Severidade | Mitigação |
|-------|:-:|-----------|
| Google helpful content update | MÉDIO | Cada página deve ter valor real para o usuário. Dados verificados. Revisão editorial amostral. |

### Risco 3: Sanity API Rate Limits em Picos

| Risco | Severidade | Mitigação |
|-------|:-:|-----------|
| Muitas revalidações simultâneas | MÉDIO | Stagger revalidation (não revalidar tudo de uma vez). `unstable_cache` como buffer. |

### Risco 4: Vercel Build Limits

| Risco | Severidade | Mitigação |
|-------|:-:|-----------|
| Vercel Pro: 45 min build limit | BAIXO | Com ISR parcial, build é ~40s. Sem risco. |
| Vercel Pro: 100GB bandwidth/mês | BAIXO | 125K visitas × ~200KB/visita = ~25GB. Dentro do limite. |

### Risco 5: Manutenção de Dados de 550+ Cidades

| Risco | Severidade | Mitigação |
|-------|:-:|-----------|
| Dados de hospitais ficarem desatualizados | ALTO | Processo trimestral de verificação. Flag no CMS para "dados verificados em". Alert para dados com >6 meses sem verificação. |

---

## 5. ALTERNATIVAS CONSIDERADAS

### 5.1 Astro em vez de Next.js

| Critério | Next.js 15 | Astro |
|----------|:-:|:-:|
| SSG performance | Excelente | Superior (zero JS default) |
| ISR/Revalidation | Nativo | Não nativo (precisa adapter) |
| API Routes | Nativo | Limitado |
| React Hook Form | Nativo | Precisa island |
| Sanity integration | Excelente | Boa |
| Comunidade/docs | Enorme | Crescente |
| Deploy Vercel | Perfeito | Bom |

**Veredicto: Next.js vence pela combinação ISR + API Routes + ecossistema React. Astro seria superior para um site 100% estático, mas precisamos de interatividade (formulário, filtros, busca).**

### 5.2 WordPress Headless em vez de Sanity

| Critério | Sanity | WordPress Headless |
|----------|:-:|:-:|
| Performance API | Excelente (CDN nativo) | Média (precisa cache) |
| Developer experience | Excelente (GROQ, TypeScript) | Média (REST/GraphQL) |
| Content editing | Excelente (Studio) | Superior (editor familiarizado) |
| Free tier | 100K req/mês | Self-hosted (custo de server) |
| Escalabilidade | Cloud managed | Precisa gerenciar |

**Veredicto: Sanity é superior tecnicamente. WordPress Headless seria opção se o redator de conteúdo não se adaptar ao Sanity Studio.**

### 5.3 Contentlayer/MDX em vez de CMS

| Critério | Sanity CMS | MDX/Contentlayer |
|----------|:-:|:-:|
| 1.200+ documentos | Gerenciável via UI | Caótico (1.200 arquivos .mdx) |
| Non-dev editing | Sim (Studio) | Não (precisa Git) |
| Preview | Nativo | Complexo |
| Queries | GROQ (poderoso) | Frontmatter (limitado) |

**Veredicto: Para 1.200+ páginas com redator não-técnico, CMS é obrigatório. MDX é viável apenas para blog, não para o site inteiro.**

---

## 6. AJUSTES NA STORY 1.1

Com base na validação, recomendo os seguintes ajustes na Story 1.1:

### Ajuste 1: next.config.ts (não .js)

```typescript
// next.config.ts (TypeScript nativo no Next.js 15)
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
      ],
    },
  ],
  experimental: {
    // Partial Prerendering (Next.js 15 experimental — ideal para ISR)
    ppr: true,
  },
};

export default nextConfig;
```

### Ajuste 2: Adicionar `next-sanity` ao package.json

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-sanity": "^9.0.0",
    "@sanity/image-url": "^1.0.0",
    "react-hook-form": "^7.0.0",
    "@hookform/resolvers": "^3.0.0",
    "zod": "^3.0.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "tailwindcss": "^4.0.0",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.6.0"
  }
}
```

### Ajuste 3: Estrutura de Pastas (refinada)

```
app/
├── (marketing)/
│   ├── layout.tsx              # Header + Footer + Schema Org
│   ├── page.tsx                # Home (ISR 60s)
│   ├── planos/
│   │   ├── page.tsx            # Hub planos (SSG)
│   │   └── [slug]/page.tsx     # Plano individual (SSG)
│   ├── empresarial/
│   │   ├── page.tsx            # Pilar empresarial (SSG)
│   │   └── [segmento]/page.tsx # MEI, PME, etc. (SSG)
│   ├── amil-dental/
│   │   ├── page.tsx            # Pilar dental (SSG)
│   │   └── [...slug]/page.tsx  # Catch-all para sub-rotas
│   ├── comparativos/
│   │   ├── page.tsx            # Hub (SSG)
│   │   └── [slug]/page.tsx     # Comparativo (SSG)
│   ├── tabela-de-precos/
│   │   ├── page.tsx            # Hub (ISR 3600)
│   │   └── [slug]/page.tsx     # Por plano (ISR 3600)
│   ├── rede-credenciada/
│   │   ├── page.tsx            # Hub (ISR 86400)
│   │   └── [especialidade]/page.tsx  # Gineco, dermato (SSG)
│   ├── portal-empresa/
│   │   ├── page.tsx            # Pilar (SSG)
│   │   └── [slug]/page.tsx     # Sub-páginas (SSG)
│   ├── contato-empresas/
│   │   └── page.tsx            # Telefones (SSG)
│   ├── plano-amil-[estado]/
│   │   ├── page.tsx            # Hub estado (ISR 86400)
│   │   └── [cidade]/page.tsx   # Cidade (ISR 86400, parcial)
│   ├── amil-espaco-saude-[unidade]/
│   │   └── page.tsx            # Espaço Saúde (ISR 86400)
│   ├── perguntas-frequentes/
│   │   ├── page.tsx            # Hub FAQ (SSG)
│   │   └── [slug]/page.tsx     # FAQ individual (SSG)
│   ├── blog/
│   │   ├── page.tsx            # Hub blog (ISR 3600)
│   │   └── [slug]/page.tsx     # Post (ISR 3600)
│   ├── cotacao-online/
│   │   └── page.tsx            # Formulário (SSG + Client)
│   ├── sobre-nos/page.tsx      # SSG
│   └── contato/page.tsx        # SSG
├── api/
│   ├── leads/route.ts          # POST lead → Sanity
│   ├── revalidate/route.ts     # Webhook Sanity → ISR
│   └── rede/route.ts           # GET rede credenciada por cidade
├── sitemap.ts                  # Dynamic sitemap
├── robots.ts                   # robots.txt
├── layout.tsx                  # Root layout (fonts, analytics)
├── not-found.tsx               # 404 customizada
└── error.tsx                   # Error boundary

components/
├── ui/                         # Design system
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── PlanCard.tsx
│   ├── PriceTable.tsx
│   ├── FAQAccordion.tsx
│   ├── ComparisonTable.tsx
│   ├── LocalHero.tsx
│   ├── BlogCard.tsx
│   ├── StatsCounter.tsx
│   └── TestimonialCard.tsx
├── seo/                        # SEO components (Server)
│   ├── SchemaGraph.tsx
│   └── BreadcrumbNav.tsx
├── forms/                      # Client components
│   ├── QuoteForm.tsx           # 'use client'
│   └── ContactForm.tsx         # 'use client'
├── sections/                   # Page sections (Server)
│   ├── Hero.tsx
│   ├── PlansGrid.tsx
│   ├── Diferenciais.tsx
│   ├── StatsSection.tsx
│   ├── Testimonials.tsx
│   └── BlogPreview.tsx
└── layout/                     # Layout components
    ├── Header.tsx
    ├── Footer.tsx
    ├── MobileMenu.tsx          # 'use client'
    └── StickyQuoteCTA.tsx      # 'use client'

lib/
├── sanity/
│   ├── client.ts               # Sanity client config
│   ├── queries.ts              # GROQ queries
│   ├── types.ts                # TypeScript types from schemas
│   └── image.ts                # Image URL builder
├── schema/                     # JSON-LD builders
│   ├── organization.ts
│   ├── product.ts
│   ├── faq.ts
│   ├── local-business.ts
│   ├── breadcrumb.ts
│   └── build-graph.ts
├── validators/                 # Zod schemas
│   └── quote-form.ts
└── utils/
    ├── format.ts               # Currency, phone formatters
    └── seo.ts                  # Meta tag helpers
```

### Ajuste 4: Tailwind CSS v4 (não v3)

Next.js 15 suporta Tailwind CSS v4 nativamente. Usar v4 elimina o `tailwind.config.ts` — a configuração vai direto no CSS:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-amil-blue: #0066CC;
  --color-amil-blue-dark: #1A237E;
  --color-amil-blue-light: #E3F2FD;
  --color-cta-green: #00C853;
  --color-cta-green-hover: #00B248;
  --color-whatsapp: #25D366;
  --color-urgency: #D32F2F;

  --font-sans: 'Inter', sans-serif;
}
```

---

## 7. DECISÃO FINAL — STACK APROVADA

| Componente | Decisão | Status |
|------------|---------|:-:|
| **Next.js 15 App Router** | APROVADO | ✅ |
| **TypeScript strict** | APROVADO | ✅ |
| **Tailwind CSS v4** | AJUSTADO (v4 em vez de v3) | ✅ |
| **Sanity CMS** | APROVADO (Free → Growth) | ✅ |
| **Vercel** | APROVADO | ✅ |
| **React Hook Form + Zod** | APROVADO | ✅ |
| **Lucide React** | APROVADO | ✅ |
| **Inter font** | APROVADO | ✅ |
| **Estratégia SSG + ISR** | AJUSTADO (híbrido por tipo) | ✅ |
| **Partial Prerendering** | ADICIONADO (Next.js 15 experimental) | ✅ |
| **next-sanity** | ADICIONADO (SDK oficial) | ✅ |
| **unstable_cache** | ADICIONADO (cache layer Sanity) | ✅ |
| **next.config.ts** | AJUSTADO (.ts em vez de .js) | ✅ |

### Resumo das Mudanças vs Story 1.1 Original

1. **Tailwind v4** (config via CSS, não arquivo .ts)
2. **next.config.ts** (TypeScript nativo)
3. **Estratégia ISR por tipo** (não SSG puro para tudo)
4. **`generateStaticParams` parcial** (top 50 cidades no build, resto ISR)
5. **`unstable_cache`** para queries Sanity (reduz API requests)
6. **`next-sanity`** como dependência obrigatória
7. **PPR (Partial Prerendering)** habilitado experimentalmente
8. **Rota catch-all** para Amil Dental (`[...slug]`)
9. **API route `/api/rede`** para busca de rede credenciada
10. **`not-found.tsx` + `error.tsx`** para error handling

---

**Stack validada e aprovada. O @dev pode executar a Story 1.1 com os ajustes acima.**

— Aria, arquitetando o futuro 🏗️
