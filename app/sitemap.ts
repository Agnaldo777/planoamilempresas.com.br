import type { MetadataRoute } from 'next';
import { authors } from '@/data/authors';
import { BLOG_CATEGORIES } from '@/data/blog/categories';
import { getMockPosts } from '@/data/blog/mock-posts';
import redeDataset from '@/data/rede-credenciada/rede-credenciada.json';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Story 7.2 — `lastmod` do hub aponta para a geração do dataset Power BI Amil
  // (ADR-007 SSOT). Atualizado mensalmente pelo pipeline da Story 7.10.
  const redeLastMod = (redeDataset as { geradoEm?: string }).geradoEm
    ? new Date((redeDataset as { geradoEm: string }).geradoEm)
    : now;

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/planos`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/empresarial`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/amil-dental`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/tabela-de-precos`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    // Story 7.2 — Hub rede credenciada (NetworkSearch + 9.325 prestadores)
    { url: `${BASE_URL}/rede-credenciada`, lastModified: redeLastMod, changeFrequency: 'weekly', priority: 0.9 },
    // Story 7.11 — Sub-pillars rede credenciada (FR44)
    { url: `${BASE_URL}/rede-credenciada/hospitais-dor`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/rede-credenciada/amil-one-rede-selecionada`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/rede-credenciada/amil-facil-rede-selecionada`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/rede-credenciada/classica`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/rede-credenciada/amil-medial`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/portal-empresa`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contato-empresas`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/cotacao-online`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/perguntas-frequentes`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    // Story 3.20 (FR39) — Calculadora de Carências
    { url: `${BASE_URL}/carencias`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // Story 3.21 (FR38) — Comparador de Planos (default canonical: bronze,prata,ouro)
    { url: `${BASE_URL}/comparar`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/sobre-nos`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // Removido `/contato` — duplicado com `/contato-empresas`. Reintroduzir só
    // se houver justificativa de UX/SEO distinta entre PJ e PF.
  ];

  // Planos estáticos (seed data)
  const planoSlugs = [
    'amil-facil-s60', 'amil-facil-s80', 'amil-s380', 'amil-s450',
    'amil-s580', 'amil-s750', 'amil-one-s2500', 'amil-one-s6500-black',
  ];
  const planoPages: MetadataRoute.Sitemap = planoSlugs.map((slug) => ({
    url: `${BASE_URL}/planos/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Author profile pages (Story 6.9 — YMYL E-E-A-T)
  const authorPages: MetadataRoute.Sitemap = Object.values(authors)
    // /sobre-corretor é página vanity coberta pelo route principal (Story 2.1),
    // não duplica em /autores/. Mas inclui se for distinta.
    .filter((a) => a.url.startsWith('/autores/'))
    .map((a) => ({
      url: `${BASE_URL}${a.url}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }));

  // Story 6.11.a — Blog category hubs (8 estaticamente listadas)
  const blogCategoryPages: MetadataRoute.Sitemap = BLOG_CATEGORIES.map(
    (category) => ({
      url: `${BASE_URL}/blog/categoria/${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }),
  );

  // Story 6.11.a — Blog posts (mock em dev; em prod fetch via Sanity client
  // movido para função async fora do sitemap default export — TODO 6.11.b).
  const blogPostPages: MetadataRoute.Sitemap = getMockPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // TODO: Add dynamic pages from Sanity (cidades, FAQs, comparativos)

  return [
    ...staticPages,
    ...planoPages,
    ...authorPages,
    ...blogCategoryPages,
    ...blogPostPages,
  ];
}
