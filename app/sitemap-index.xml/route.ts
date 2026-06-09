/**
 * Sitemap index — referencia o sitemap principal + todos os shards do moat.
 * Submeter ESTA URL no Google Search Console para descoberta das ~10.000 URLs.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

const SITEMAPS = [
  'sitemap.xml',
  'sitemap-prestadores.xml',
  'sitemap-rede-bairros.xml',
  'sitemap-tipos.xml',
  'sitemap-rede-produto.xml',
];

export const revalidate = 2592000;

export function GET(): Response {
  const body = SITEMAPS.map(
    (s) => `  <sitemap><loc>${BASE_URL}/${s}</loc></sitemap>`
  ).join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${body}\n` +
    `</sitemapindex>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=2592000',
    },
  });
}
