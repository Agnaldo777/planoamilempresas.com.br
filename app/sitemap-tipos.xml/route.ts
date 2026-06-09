/**
 * Sitemap shard — páginas tipo × UF × município (Story 7.8 AC9).
 * Apenas combinações com ≥3 prestadores do tipo. Priority 0.7, weekly.
 */

import {
  getTipoUfMunicipios,
  getDatasetMetadata,
  type TipoAtendimentoInferido,
} from '@/lib/operadoras/amil/rede-credenciada-loader';
import { MIN_PRESTADORES_TIPO, TIPO_SLUG_TO_INFERIDO, type TipoSlug } from '@/config/seo';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

export const revalidate = 2592000;

export function GET(): Response {
  const { geradoEm } = getDatasetMetadata();
  const lastmod = new Date(geradoEm).toISOString();

  const urls: string[] = [];
  for (const tipoSlug of Object.keys(TIPO_SLUG_TO_INFERIDO) as TipoSlug[]) {
    const inferido = TIPO_SLUG_TO_INFERIDO[tipoSlug] as TipoAtendimentoInferido;
    for (const c of getTipoUfMunicipios(inferido, MIN_PRESTADORES_TIPO)) {
      const loc = `${BASE_URL}/${tipoSlug}/${c.ufSlug}/${c.cidadeSlug}`;
      urls.push(
        `  <url>\n` +
          `    <loc>${loc}</loc>\n` +
          `    <lastmod>${lastmod}</lastmod>\n` +
          `    <changefreq>weekly</changefreq>\n` +
          `    <priority>0.7</priority>\n` +
          `  </url>`
      );
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls.join('\n')}\n` +
    `</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=2592000',
    },
  });
}
