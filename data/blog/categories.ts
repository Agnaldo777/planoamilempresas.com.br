/**
 * Blog Categories — SSOT (Story 6.11.a)
 *
 * Single source of truth para as 8 categorias canônicas do blog.
 * Espelho de `sanity/schemas/blogPost.ts` BLOG_CATEGORIES.
 *
 * Slug é estável e usado em:
 *   - URL `/blog/categoria/[slug]/`
 *   - JSON-LD `Article.articleSection`
 *   - Filtro Sanity / mock data
 *   - Sitemap (geração estática de 8 URLs)
 *
 * NFR22: categorias YMYL marcadas com `requiresLegalReview` exigem
 * `reviewedBy: 'revisor-juridico'` no `Article` antes de publicar.
 */

export type BlogCategorySlug =
  | 'carencias'
  | 'coparticipacao'
  | 'reembolso'
  | 'rede-credenciada'
  | 'adesao-mei-pme'
  | 'ans-regulamentacao'
  | 'cobertura'
  | 'cancelamento';

export interface BlogCategory {
  slug: BlogCategorySlug;
  title: string;
  /** Description usada em meta description + listing header. */
  description: string;
  /** Categoria YMYL exige revisor jurídico (NFR22). */
  requiresLegalReview: boolean;
  /** Posição preferencial em hubs/menus. */
  order: number;
}

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  {
    slug: 'carencias',
    title: 'Carências e CPT',
    description:
      'Prazos de carência ANS, Cobertura Parcial Temporária (CPT) e como funciona a contagem em planos empresariais.',
    requiresLegalReview: true,
    order: 1,
  },
  {
    slug: 'coparticipacao',
    title: 'Coparticipação e Reajuste',
    description:
      'Como funciona a coparticipação, percentuais, reajuste anual e por sinistralidade em planos coletivos.',
    requiresLegalReview: true,
    order: 2,
  },
  {
    slug: 'reembolso',
    title: 'Reembolso',
    description:
      'Tabela de reembolso, prazos, documentação e como solicitar reembolso em consultas e procedimentos.',
    requiresLegalReview: false,
    order: 3,
  },
  {
    slug: 'rede-credenciada',
    title: 'Rede Credenciada',
    description:
      'Hospitais, clínicas e laboratórios da rede Amil — Hospitais Dor, Amil One, Amil Fácil e Clássica.',
    requiresLegalReview: false,
    order: 4,
  },
  {
    slug: 'adesao-mei-pme',
    title: 'Adesão MEI / PME',
    description:
      'Como contratar plano empresarial sendo MEI ou PME, requisitos, documentação e prazos de ativação.',
    requiresLegalReview: false,
    order: 5,
  },
  {
    slug: 'ans-regulamentacao',
    title: 'ANS e Regulamentação',
    description:
      'Resoluções normativas ANS, Lei 9.656/98, RN 195, Rol de Procedimentos e direitos do beneficiário.',
    requiresLegalReview: true,
    order: 6,
  },
  {
    slug: 'cobertura',
    title: 'Cobertura',
    description:
      'Coberturas obrigatórias, telemedicina, urgência/emergência e exclusões previstas em contrato.',
    requiresLegalReview: true,
    order: 7,
  },
  {
    slug: 'cancelamento',
    title: 'Cancelamento',
    description:
      'Cancelamento por inadimplência, portabilidade de carências, distrato e direitos do consumidor.',
    requiresLegalReview: true,
    order: 8,
  },
] as const;

export const BLOG_CATEGORY_SLUGS: readonly BlogCategorySlug[] =
  BLOG_CATEGORIES.map((c) => c.slug);

export function getBlogCategory(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

export function isBlogCategorySlug(value: unknown): value is BlogCategorySlug {
  return (
    typeof value === 'string' &&
    BLOG_CATEGORIES.some((c) => c.slug === value)
  );
}
