/**
 * BlogPosting / Blog / CollectionPage schema builders — Story 6.11.a
 *
 * Estende `lib/schema/author.ts` (Story 6.9) com:
 *   - `buildBlogPostingNode()` — `BlogPosting` (subtipo de Article)
 *     para post detail. Inclui author + reviewedBy + publisher
 *     BeneficioRH (FR54) + articleSection + keywords.
 *   - `buildBlogNode()` — schema `Blog` para `/blog/` listing.
 *   - `buildBlogCollectionPageNode()` — `CollectionPage` para
 *     `/blog/categoria/[slug]/`.
 *
 * Invariantes (auditados):
 *   - publisher SEMPRE BeneficioRH (Organization root).
 *   - author é Person/Organization válido em `data/authors.ts`.
 *   - articleSection bate com slug de categoria SSOT.
 */

import { authors, type AuthorId } from '@/data/authors';
import {
  buildAuthorNode,
  type ArticleSchemaInput,
} from '@/lib/schema/author';
import {
  type BlogCategory,
  type BlogCategorySlug,
} from '@/data/blog/categories';
import type { BlogPostSummary } from '@/data/blog/types';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export interface BlogPostingInput extends ArticleSchemaInput {
  /** Categoria slug (espelho de `articleSection`). */
  categorySlug: BlogCategorySlug;
  /** Tags do post → keywords. */
  keywords?: string[];
  /** Excerpt → articleBody resumido (Google permite). */
  articleBody?: string;
  /** Reading word count, opcional para Article schema. */
  wordCount?: number;
}

/**
 * Constrói nó `BlogPosting` (subtipo de Article com semântica blog).
 * publisher = BeneficioRH Organization (FR54).
 */
export function buildBlogPostingNode(
  input: BlogPostingInput,
): Record<string, unknown> {
  const author = authors[input.authorId];
  const reviewer = input.reviewedById ? authors[input.reviewedById] : undefined;
  const publisher = authors.beneficiorh;

  const node: Record<string, unknown> = {
    '@type': 'BlogPosting',
    '@id': `${absoluteUrl(input.url)}#blogposting`,
    headline: input.headline,
    url: absoluteUrl(input.url),
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: buildAuthorNode(author),
    publisher: buildAuthorNode(publisher),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(input.url),
    },
    articleSection: input.articleSection ?? input.categorySlug,
    inLanguage: 'pt-BR',
  };

  if (input.description) node.description = input.description;
  if (input.image) node.image = absoluteUrl(input.image);
  if (reviewer) node.reviewedBy = buildAuthorNode(reviewer);
  if (input.keywords && input.keywords.length > 0) {
    node.keywords = input.keywords.join(', ');
  }
  if (input.articleBody) node.articleBody = input.articleBody;
  if (input.wordCount && input.wordCount > 0) node.wordCount = input.wordCount;

  return node;
}

/**
 * Constrói nó `Blog` para `/blog/` listing.
 * Não inclui blogPost array — Google detecta posts via schema BlogPosting
 * inline em cada page de detail. Aqui apenas declara o "container".
 */
export function buildBlogNode(): Record<string, unknown> {
  const publisher = authors.beneficiorh;
  return {
    '@type': 'Blog',
    '@id': `${BASE_URL}/blog/#blog`,
    name: 'Blog Plano Amil Empresarial',
    description:
      'Guias, comparativos, notícias regulatórias ANS e análises sobre planos de saúde empresariais Amil.',
    url: `${BASE_URL}/blog/`,
    inLanguage: 'pt-BR',
    publisher: buildAuthorNode(publisher),
  };
}

export interface BlogCollectionPageInput {
  category: BlogCategory;
  posts: readonly BlogPostSummary[];
}

/**
 * Constrói nó `CollectionPage` para `/blog/categoria/[slug]/`.
 * `mainEntity` é `ItemList` referenciando posts da categoria — habilita
 * sitelink/rich snippet em Google.
 */
export function buildBlogCollectionPageNode(
  input: BlogCollectionPageInput,
): Record<string, unknown> {
  const url = `${BASE_URL}/blog/categoria/${input.category.slug}/`;
  const itemListElement = input.posts.map((post, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    url: `${BASE_URL}/blog/${post.slug}/`,
    name: post.title,
  }));

  return {
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: input.category.title,
    description: input.category.description,
    url,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': `${BASE_URL}/blog/#blog` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement,
      numberOfItems: itemListElement.length,
    },
  };
}

/** Re-export para conveniência. */
export type { ArticleSchemaInput, AuthorId };
