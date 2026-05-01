# CI: Sitemap × Routing Validation Strategy

> **Status:** Active (implementado em Story 1.9)
> **NFR:** [NFR26 — PRD v1.3.1](../prd.md)
> **Workflow:** `.github/workflows/validate-sitemap-routing.yml`
> **Script:** `scripts/validate-sitemap-routing.mjs`

## Por que existe

O concorrente `amilsaudebr.com.br` lista URLs no sitemap (`/sao-paulo`,
`/rio-de-janeiro`...) que **não correspondem** aos links internos
implementados (`/tabela-amil-sao-paulo-2026.html`). Google trata como
dois conjuntos paralelos de URLs e penaliza com confusão de indexação.

Este satélite ultrapassará 1.500 URLs programmatic ao final da Wave 1
(Epic 5 + Epic 7). Sem CI gate, drift silencioso é certeza estatística:
um refactor renomeia rota mas esquece sitemap, ou nova landing entra
sem sitemap entry. NFR26 torna esta validação **obrigatória em todo PR**.

## Como funciona

O script `validate-sitemap-routing.mjs`:

1. **Lista A** — URLs declaradas em `app/sitemap.ts` via parse heurístico
   do source (regex sobre templates `${BASE_URL}/...`). Expande arrays
   literais (ex.: `planoSlugs.map(...)`) e detecta padrões conhecidos
   (autores via `Object.keys(authors)`).

2. **Lista B** — Routes descobertas via glob `app/**/page.{tsx,ts,jsx,js}`.
   Conversão file → route:
   - Remove `app/` prefix
   - Remove route groups `(marketing)/`, `(studio)/`
   - Remove `/page.tsx` suffix
   - Mantém dynamic segments `[slug]` (expandidos quando possível)
   - Exclui `/api/*` (route handlers, não páginas)
   - Exclui `noindex` pages via parse de `metadata.robots.index = false`

3. **Diff bidirectional** —
   - URL no sitemap sem route → fail (sugere remover sitemap ou criar 301)
   - Route indexável sem URL no sitemap → fail (sugere adicionar ao
     sitemap ou marcar como noindex)
   - Exit 1 em qualquer divergência; 0 em pass

## Como adicionar exclusão (raro, justificado)

Edite `scripts/sitemap-routing.config.json`:

```json
{
  "excludeFromSitemap": ["/api", "/studio"],
  "excludeFromRoutingCheck": ["/preview-secret"],
  "noindexRoutes": ["/internal/test-page"]
}
```

- `excludeFromSitemap` — paths não esperados no sitemap (API,
  Sanity Studio, etc.). Inclui sub-paths automaticamente.
- `excludeFromRoutingCheck` — routes que existem mas não devem ser
  validadas (use com extrema cautela).
- `noindexRoutes` — routes que devem ser tratadas como noindex
  mesmo sem flag explícita no metadata (override).

**Mudanças requerem aprovação `@qa` em PR review.**

## Como remediar fail comum

### "URL no sitemap sem rota correspondente"

Causa: rota foi renomeada/removida em refactor mas sitemap não foi
atualizado.

Ações:
- Se rota foi renomeada → atualize `app/sitemap.ts` E crie redirect
  301 em `next.config.ts` para preservar SEO.
- Se rota foi intencionalmente removida → remova do sitemap E crie
  redirect 301 ou 410 conforme apropriado.

### "Rota indexável sem entry no sitemap"

Causa: nova rota foi criada sem atualizar o sitemap.

Ações:
- Adicionar entry em `app/sitemap.ts` com `lastModified`,
  `changeFrequency`, `priority` adequados.
- Se rota não deve ser indexada (ex.: página interna, preview), adicione
  `metadata.robots.index = false` na page.tsx OU adicione path em
  `noindexRoutes` da config.

## Coordenação com Story 7.10 (pipeline mensal de rede credenciada)

A pipeline mensal commita automaticamente novos prestadores de saúde,
o que pode gerar novas rotas dinâmicas (`/rede/[cidade]/[especialidade]`).
A Story 7.10 deve, no mesmo commit:

1. Atualizar `data/rede-credenciada.json` (ou Sanity dataset)
2. Atualizar `app/sitemap.ts` para incluir novas URLs (via
   `generateStaticParams` resolvido)
3. Rodar `node scripts/validate-sitemap-routing.mjs` localmente

A CI bloqueará merge se houver drift.

## Adapter pattern para migração futura

A função `loadSitemapUrls()` é o ponto de extensão. Caso o projeto
migre de `app/sitemap.ts` nativo para `next-sitemap` plugin (ADR-pendente),
basta substituir a implementação:

```javascript
export async function loadSitemapUrls() {
  // v2: lê dist do next-sitemap (sitemap.xml + sitemap-0.xml gerados)
  return parseGeneratedSitemapXml('public/sitemap.xml');
}
```

## Performance

- Run completo em CI free tier: ~30s para o repo atual (sem build).
- Para projetos com 1.500+ rotas: estimativa <2min (parse-only).
- Cache `.next/` aplicado para acelerar etapas que dependem de build.

## Anti-padrão coberto

Este script detecta o padrão duplo de `amilsaudebr.com.br`:

```
Sitemap: /sao-paulo
Routes:  /tabela-amil-sao-paulo-2026
```

Resultado: ambas listas têm itens não correspondentes em B/A → CI falha
e PR é bloqueado.

## Referências

- PRD: NFR26
- ADR: ADR-008 (Next.js App Router)
- Story: 1.9
- Research: `docs/research/09-amilsaudebr-kitcorretor-deep-scrape.md`
