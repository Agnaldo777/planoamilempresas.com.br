/**
 * Author / Article Schema Builders — Story 6.9 (NFR22 YMYL E-E-A-T)
 *
 * Constrói nós Schema.org Person/Organization e Article com author +
 * reviewedBy, prontos para inclusão no @graph principal.
 */

import { authors, type Author, type AuthorId } from '@/data/authors';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seusite.com.br';

function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Constrói nó Schema.org Person ou Organization para um autor.
 *
 * Identifiers (SUSEP/OAB/CRM) usam PropertyValue conforme
 * https://schema.org/identifier (formato propertyID + value).
 */
export function buildAuthorNode(author: Author): Record<string, unknown> {
  const node: Record<string, unknown> = {
    '@type': author.type,
    '@id': absoluteUrl(`${author.url}#author`),
    name: author.name,
    url: absoluteUrl(author.url),
    jobTitle: author.jobTitle,
    description: author.bioShort,
    knowsAbout: author.knowsAbout,
  };

  if (author.image) {
    node.image = absoluteUrl(author.image);
  }

  if (author.credentials.length > 0) {
    node.identifier = author.credentials.map((cred) => ({
      '@type': 'PropertyValue',
      propertyID: cred.type,
      value: cred.value,
      ...(cred.url ? { url: cred.url } : {}),
    }));
  }

  if (author.sameAs && author.sameAs.length > 0) {
    node.sameAs = author.sameAs;
  }

  if (author.affiliation) {
    node.affiliation = {
      '@type': author.affiliation.type,
      name: author.affiliation.name,
      ...(author.affiliation.url ? { url: author.affiliation.url } : {}),
    };
  }

  return node;
}

export interface ArticleSchemaInput {
  headline: string;
  description?: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorId: AuthorId;
  reviewedById?: AuthorId;
  /** Categoria editorial — usada por CI para enforce reviewedBy em YMYL. */
  articleSection?: string;
}

/**
 * Constrói nó Schema.org Article com author + reviewedBy + publisher.
 * Usado em blog posts, cornerstones e landings com conteúdo médico.
 */
export function buildArticleNode(input: ArticleSchemaInput): Record<string, unknown> {
  const author = authors[input.authorId];
  const reviewer = input.reviewedById ? authors[input.reviewedById] : undefined;
  const publisher = authors.beneficiorh;

  const node: Record<string, unknown> = {
    '@type': 'Article',
    '@id': `${absoluteUrl(input.url)}#article`,
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
  };

  if (input.description) {
    node.description = input.description;
  }

  if (input.image) {
    node.image = absoluteUrl(input.image);
  }

  if (reviewer) {
    node.reviewedBy = buildAuthorNode(reviewer);
  }

  if (input.articleSection) {
    node.articleSection = input.articleSection;
  }

  return node;
}
