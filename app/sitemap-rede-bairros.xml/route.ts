/**
 * Sitemap shard — páginas-bairro viáveis (Story 7.6 AC8).
 * Apenas bairros com ≥3 prestadores (indexáveis). Priority 0.6, weekly.
 */

import {
  getMunicipios,
  getBairrosViaveisPorCidade,
  getDatasetMetadata,
} from '@/lib/operadoras/amil/rede-credenciada-loader';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

export const revalidate = 2592000;

export function GET(): Response {
  const { geradoEm } = getDatasetMetadata();
  const lastmod = new Date(geradoEm).toISOString();

  const urls: string[] = [];
  for (const m of getMunicipios()) {
    for (const b of getBairrosViaveisPorCidade(m.ufSlug, m.cidadeSlug)) {
      const loc = `${BASE_URL}/rede/${m.ufSlug}/${m.cidadeSlug}/bairro/${b.slug}`;
      urls.push(
        `  <url>\n` +
          `    <loc>${loc}</loc>\n` +
          `    <lastmod>${lastmod}</lastmod>\n` +
          `    <changefreq>weekly</changefreq>\n` +
          `    <priority>0.6</priority>\n` +
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
