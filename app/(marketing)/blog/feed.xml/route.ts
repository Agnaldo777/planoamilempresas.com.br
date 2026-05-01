/**
 * `/blog/feed.xml` — RSS 2.0 feed (Story 6.11.a)
 *
 * Route Handler emite RSS 2.0 puro (sem dependência externa). Inclui
 * 20 posts mais recentes com title, link, description, pubDate e
 * dc:creator (autor).
 *
 * Cache: revalidate 1h (alinhado com listing).
 *
 * Spec: https://www.rssboard.org/rss-specification
 */

import { fetchAllPostSummaries } from '@/lib/sanity/blog';
import { authors } from '@/data/authors';
import { getBlogCategory } from '@/data/blog/categories';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

const FEED_LIMIT = 20;

export const revalidate = 3600;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

export async function GET(): Promise<Response> {
  const all = await fetchAllPostSummaries();
  const posts = all.slice(0, FEED_LIMIT);

  const lastBuildDate = posts.length > 0
    ? toRfc822(posts[0]!.publishedAt)
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const author = authors[post.authorId];
      const category = getBlogCategory(post.category);
      const link = `${BASE_URL}/blog/${post.slug}/`;
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        `      <pubDate>${toRfc822(post.publishedAt)}</pubDate>`,
        `      <dc:creator>${escapeXml(author.name)}</dc:creator>`,
        category ? `      <category>${escapeXml(category.title)}</category>` : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog Plano Amil Empresarial — BeneficioRH</title>
    <link>${BASE_URL}/blog/</link>
    <atom:link href="${BASE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <description>Guias, comparativos e notícias sobre planos de saúde empresariais Amil. Conteúdo revisado por corretor SUSEP e advogado parceiro.</description>
    <language>pt-BR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
