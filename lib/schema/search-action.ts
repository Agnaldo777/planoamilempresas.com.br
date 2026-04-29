/**
 * Schema SearchAction — Story 7.2 (FR23 Sitelinks Search Box)
 *
 * Permite que o Google renderize a Sitelinks Search Box nos resultados
 * orgânicos da home, redirecionando o usuário direto para o hub
 * `/rede-credenciada?q={query}` (busca livre primária via `<NetworkSearch />`).
 *
 * Spec oficial: https://developers.google.com/search/docs/appearance/sitelinks-search-box
 *
 * O `target` precisa ser um URL Template (RFC 6570) com `{search_term_string}`
 * substituído pela query do usuário no SERP do Google.
 *
 * **Por que `/rede-credenciada` e não `/busca`?**
 *   - Hub de rede é a porta de entrada head-term ("rede credenciada amil",
 *     "hospitais amil em SP") — busca textual concentrada nesta página.
 *   - Story 7.2 AC2: `<NetworkSearch />` honra `?q=` via URL state e
 *     pré-popula a query no Command (`useSearchParams`).
 *   - O `WebSite` schema já existente em `lib/schema/website.ts` apontava
 *     `/busca?q=` (rota inexistente) — esta é a correção definitiva.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

interface SearchActionSchema {
  '@type': 'SearchAction';
  target: {
    '@type': 'EntryPoint';
    urlTemplate: string;
  };
  'query-input': string;
}

/**
 * Constrói o nó `SearchAction` para inclusão em
 * `WebSite.potentialAction` (Sitelinks Search Box).
 *
 * **Invariantes** (testados em `__tests__/search-action.test.mjs`):
 *   - `target.urlTemplate` aponta para `/rede-credenciada?q={search_term_string}`
 *   - `query-input` segue o formato literal `required name=search_term_string`
 *   - `target.@type` é `EntryPoint` (form full do Schema.org, recomendado vs string shorthand)
 */
export function buildSearchAction(): SearchActionSchema {
  return {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/rede-credenciada?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  };
}

export type { SearchActionSchema };
