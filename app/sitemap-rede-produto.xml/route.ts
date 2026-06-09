/**
 * Sitemap shard — Cluster E rede × UF (Story 7.7 AC11).
 *
 * URLs `/rede/produto/[redeSlug]/[uf]` viáveis (≥ MIN prestadores).
 * `lastmod` = data de geração do dataset (ADR-007 SSOT). Priority alta (0.8)
 * por intenção pre-purchase qualificada. changefreq weekly.
 */

import {
  getRedeUfCombosViaveis,
  getDatasetMetadata,
} from '@/lib/operadoras/amil/rede-credenciada-loader';
import { MIN_PRESTADORES_REDE_UF } from '@/config/seo';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

export const revalidate = 2592000; // 30 dias

export function GET(): Response {
  const combos = getRedeUfCombosViaveis(MIN_PRESTADORES_REDE_UF);
  const { geradoEm } = getDatasetMetadata();
  const lastmod = new Date(geradoEm).toISOString();

  const urls = combos
    .map(({ redeSlug, uf }) => {
      const loc = `${BASE_URL}/rede/produto/${redeSlug}/${uf}`;
      return (
        `  <url>\n` +
        `    <loc>${loc}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>weekly</changefreq>\n` +
        `    <priority>0.8</priority>\n` +
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
