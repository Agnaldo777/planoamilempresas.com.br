/**
 * Schema WebSite — Story 3.26 alinhamento (FR54) + Story 7.2 (FR23 SearchAction)
 *
 * O `WebSite.name` é o nome do *site* (URL trademark sob ADR-006), não
 * o da Organization. Mantemos branding "Plano Amil Empresas" como
 * site brand legítimo (URL = trademark; Story 7.0c).
 *
 * `publisher` aponta a Organization root (BeneficioRH) para fechar o
 * grafo Schema.org (FR54 + ADR-009).
 *
 * `potentialAction` declara `SearchAction` apontando para o hub
 * `/rede-credenciada?q=...` (Story 7.2 AC do SearchAction). Isso habilita
 * Sitelinks Search Box no Google quando o site ranquear pela home.
 */

import { buildSearchAction } from './search-action';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

export function buildWebSite() {
  return {
    '@type': 'WebSite',
    '@id': `${BASE_URL}#website`,
    name: 'Plano Amil Empresas',
    alternateName: 'planoamilempresas.com.br',
    url: BASE_URL,
    inLanguage: 'pt-BR',
    publisher: { '@id': `${BASE_URL}#organization` },
    potentialAction: buildSearchAction(),
  };
}
