import type { MetadataRoute } from 'next';

import { getDatasetMetadata } from '@/lib/operadoras/amil/rede-credenciada-loader';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seusite.com.br';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Story 7.2 AC10: lastmod do hub usa dataset.geradoEm, não now
  const datasetGeradoEm = new Date(getDatasetMetadata().geradoEm);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/planos`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/empresarial`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/amil-dental`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/tabela-de-precos`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/rede-credenciada`, lastModified: datasetGeradoEm, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/portal-empresa`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contato-empresas`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/cotacao-online`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/perguntas-frequentes`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/sobre-nos`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contato`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
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

  // TODO: Add dynamic pages from Sanity (cidades, blog posts, FAQs, comparativos)

  return [...staticPages, ...planoPages];
}
