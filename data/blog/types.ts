/**
 * BlogPost types — Story 6.11.a
 *
 * Tipo unificado para mock + Sanity GROQ. Ambos retornam o mesmo
 * shape (`BlogPost`) para que `PostCard`, `BlogListing` e
 * `PostBody` sejam agnósticos da origem.
 */

import type { AuthorId } from '@/data/authors';
import type { BlogCategorySlug } from '@/data/blog/categories';
import type {
  ReviewTrackEntry,
  WorkflowStatus,
} from '@/lib/sanity/workflow';

/**
 * Bloco Portable Text simplificado — subset do que Sanity emite.
 * Para mock posts geramos versão minimal (paragraph + h2).
 */
export interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style?: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote';
  listItem?: 'bullet' | 'number';
  children: Array<{
    _type: 'span';
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _type: 'link';
    _key: string;
    href: string;
  }>;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: PortableTextBlock[];
  authorId: AuthorId;
  reviewedById?: AuthorId;
  category: BlogCategorySlug;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  ogImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  enabled: boolean;
  /** Story 6.10 — Pipeline NFR23. Default 'published' em mock legado. */
  workflowStatus?: WorkflowStatus;
  /** Story 6.10 — track-changes editorial (NFR23). */
  reviewTrack?: ReviewTrackEntry[];
}

/**
 * Subset usado em listagens (sem body completo, sem FAQs).
 * Performance: cards no /blog/ não precisam carregar Portable Text.
 */
export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  authorId: AuthorId;
  reviewedById?: AuthorId;
  category: BlogCategorySlug;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  ogImage?: string;
}

export function toSummary(post: BlogPost): BlogPostSummary {
  const summary: BlogPostSummary = {
    _id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    authorId: post.authorId,
    reviewedById: post.reviewedById,
    category: post.category,
    tags: post.tags,
    publishedAt: post.publishedAt,
  };
  if (post.updatedAt) summary.updatedAt = post.updatedAt;
  if (post.ogImage) summary.ogImage = post.ogImage;
  return summary;
}
