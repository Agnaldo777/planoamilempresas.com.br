import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seusite.com.br';

type PageSEOType = 'home' | 'plano' | 'local' | 'comparativo' | 'blog' | 'faq' | 'preco' | 'page';

interface SEOParams {
  type: PageSEOType;
  title?: string;
  description?: string;
  canonical: string;
  // Dynamic values
  planoNome?: string;
  cidade?: string;
  estado?: string;
  planoA?: string;
  planoB?: string;
  blogTitle?: string;
  pergunta?: string;
  image?: string;
  noIndex?: boolean;
}

const titleTemplates: Record<PageSEOType, (p: SEOParams) => string> = {
  home: () => 'Plano de Saúde Amil 2026 | Cotação Online Empresarial e Individual',
  plano: (p) => `${p.planoNome} Empresarial 2026 | Preços e Cobertura`,
  local: (p) => `Plano Amil Empresarial em ${p.cidade} | Cotação 2026`,
  comparativo: (p) => `${p.planoA} vs ${p.planoB}: Qual Melhor em 2026?`,
  blog: (p) => p.blogTitle || 'Blog Amil Empresarial',
  faq: (p) => `${p.pergunta} | FAQ Amil Saúde 2026`,
  preco: (p) => `Tabela de Preços ${p.planoNome || 'Amil'} 2026 | Valores Atualizados`,
  page: (p) => p.title || 'Amil Saúde',
};

const descTemplates: Record<PageSEOType, (p: SEOParams) => string> = {
  home: () =>
    'Compare planos Amil Empresarial: S380, S450, S750 e Amil One. Cobertura nacional, coparticipação opcional. Simule grátis em 30 segundos.',
  plano: (p) =>
    `${p.planoNome}: cobertura nacional, hospitais renomados, telemedicina 24h. Tabela de preços 2026 atualizada. Simule grátis em 30s.`,
  local: (p) =>
    `Plano Amil Empresarial em ${p.cidade}, ${p.estado}. Hospitais credenciados, Espaço Saúde, tabela de preços regional. Cotação grátis.`,
  comparativo: (p) =>
    `Comparativo ${p.planoA} vs ${p.planoB}: cobertura, rede credenciada, preços e diferenciais. Descubra qual é melhor para sua empresa.`,
  blog: (p) =>
    p.description || 'Artigos sobre planos de saúde empresariais, dicas de RH, legislação ANS e comparativos Amil.',
  faq: (p) =>
    `${p.pergunta} Confira a resposta completa sobre planos Amil, cobertura e condições. Atualizado 2026.`,
  preco: (p) =>
    `Tabela de preços ${p.planoNome || 'Amil'} 2026 por faixa etária. Valores atualizados para empresarial, MEI e individual. Compare agora.`,
  page: (p) => p.description || 'Amil Saúde — Corretora Autorizada.',
};

export function generatePageMetadata(params: SEOParams): Metadata {
  const title = params.title || titleTemplates[params.type](params);
  const description = params.description || descTemplates[params.type](params);

  return {
    title,
    description,
    alternates: { canonical: params.canonical },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${params.canonical}`,
      type: params.type === 'blog' ? 'article' : 'website',
      locale: 'pt_BR',
      siteName: 'Amil Saúde — Corretora Autorizada',
      ...(params.image && {
        images: [{ url: params.image, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    ...(params.noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}
