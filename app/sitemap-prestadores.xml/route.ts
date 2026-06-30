/**
 * Sitemap shard — páginas-prestador (Story 7.4b AC).
 *
 * Uma URL por prestador (`/rede/[uf]/[municipio]/[prestadorSlug]`).
 * `<lastmod>` = data de geração do dataset. Priority 0.5 (long-tail by-name).
 *
 * Nota: o build full dos 9.325 prestadores (flags BUILD_FULL_PROVIDERS /
 * PHASE_2_ENABLED) e o Lighthouse CI permanecem como etapa de deploy (7.4b);
 * este shard expoe apenas URLs indexaveis para evitar sitemap/noindex mismatch.
 */

import {
  getAllPrestadores,
  getDatasetMetadata,
  getPrestadoresPorMunicipio,
  slugify,
} from '@/lib/operadoras/amil/rede-credenciada-loader';
import { MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL } from '@/lib/operadoras/amil/chunked-static-params';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

export const revalidate = 2592000;

export function GET(): Response {
  const { geradoEm } = getDatasetMetadata();
  const lastmod = new Date(geradoEm).toISOString();

  const urls = getAllPrestadores()
    .filter((p) =>
      getPrestadoresPorMunicipio(p.uf.toLowerCase(), slugify(p.municipio)).length >=
      MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL
    )
    .map((p) => {
      const loc = `${BASE_URL}/rede/${p.uf.toLowerCase()}/${slugify(p.municipio)}/${p.slug}`;
      return (
        `  <url>\n` +
        `    <loc>${loc}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>monthly</changefreq>\n` +
        `    <priority>0.5</priority>\n` +
        `  </url>`
      );
    })
    .join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=2592000',
    },
  });
}
