/**
 * Blog data fetcher — Story 6.11.a
 *
 * Adapter pattern: fornece API estável (`fetchAllPosts`,
 * `fetchPostBySlug`, `fetchPostsByCategory`) que escolhe entre
 * Sanity GROQ e mock data automaticamente.
 *
 * Fallback automático para mock quando:
 *   - `NEXT_PUBLIC_SANITY_PROJECT_ID` está vazio
 *   - `NEXT_PUBLIC_SANITY_PROJECT_ID === 'devplaceholder'`
 *
 * Em produção, env real → fetch GROQ. Mock continua disponível em
 * dev/preview sem CMS configurado, e em testes (NODE_ENV='test').
 */

import { sanityClient } from '@/lib/sanity/client';
import { getMockPosts, getMockPostBySlug } from '@/data/blog/mock-posts';
import { isAuthorId, type AuthorId } from '@/data/authors';
import { isBlogCategorySlug } from '@/data/blog/categories';
import type { BlogPost, BlogPostSummary } from '@/data/blog/types';
import { toSummary } from '@/data/blog/types';

function isSanityConfigured(): boolean {
  const id = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  return Boolean(id) && id !== 'devplaceholder';
}

const POSTS_LIST_QUERY = `*[_type == "blogPost" && enabled == true] | order(publishedAt desc) {
  _id, title, "slug": slug.current, excerpt, author, reviewedBy,
  category, tags, publishedAt, updatedAt,
  "ogImage": ogImage.asset->url
}`;

const POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug && enabled == true][0] {
  _id, title, "slug": slug.current, excerpt, body, author, reviewedBy,
  category, tags, publishedAt, updatedAt,
  "ogImage": ogImage.asset->url,
  seoTitle, seoDescription
}`;

interface SanityPostRaw {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body?: BlogPost['body'];
  author?: string;
  reviewedBy?: string;
  category: string;
  tags?: string[];
  publishedAt: string;
  updatedAt?: string;
  ogImage?: string;
  seoTitle?: string;
  seoDescription?: string;
}

function normalizeAuthorId(value: string | undefined, fallback: AuthorId): AuthorId {
  return isAuthorId(value) ? value : fallback;
}

function normalizeCategoryOrThrow(value: string): BlogPost['category'] {
  if (!isBlogCategorySlug(value)) {
    throw new Error(`Invalid blog category slug: ${value}`);
  }
  return value;
}

function fromSanity(raw: SanityPostRaw): BlogPost {
  const post: BlogPost = {
    _id: raw._id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt,
    body: raw.body ?? [],
    authorId: normalizeAuthorId(raw.author, 'agnaldo-silva'),
    category: normalizeCategoryOrThrow(raw.category),
    tags: raw.tags ?? [],
    publishedAt: raw.publishedAt,
    enabled: true,
  };
  if (raw.reviewedBy && isAuthorId(raw.reviewedBy)) {
    post.reviewedById = raw.reviewedBy;
  }
  if (raw.updatedAt) post.updatedAt = raw.updatedAt;
  if (raw.ogImage) post.ogImage = raw.ogImage;
  if (raw.seoTitle) post.seoTitle = raw.seoTitle;
  if (raw.seoDescription) post.seoDescription = raw.seoDescription;
  return post;
}

export async function fetchAllPostSummaries(): Promise<BlogPostSummary[]> {
  if (!isSanityConfigured()) {
    return getMockPosts().map(toSummary);
  }
  try {
    const raw = await sanityClient.fetch<SanityPostRaw[]>(POSTS_LIST_QUERY);
    return raw.map(fromSanity).map(toSummary);
  } catch (error) {
    // Falha silenciosa em build sem CMS → fallback mock para manter
    // routing estático funcionando. Erro logado para observability.
    console.error('[blog] fetchAllPostSummaries failed, fallback mock', error);
    return getMockPosts().map(toSummary);
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured()) {
    return getMockPostBySlug(slug) ?? null;
  }
  try {
    const raw = await sanityClient.fetch<SanityPostRaw | null>(
      POST_BY_SLUG_QUERY,
      { slug },
    );
    return raw ? fromSanity(raw) : null;
  } catch (error) {
    console.error(`[blog] fetchPostBySlug(${slug}) failed, fallback mock`, error);
    return getMockPostBySlug(slug) ?? null;
  }
}

export async function fetchPostsByCategory(
  category: string,
): Promise<BlogPostSummary[]> {
  const all = await fetchAllPostSummaries();
  return all.filter((p) => p.category === category);
}

export async function fetchAllPostSlugs(): Promise<string[]> {
  const all = await fetchAllPostSummaries();
  return all.map((p) => p.slug);
}

export interface PaginatedPosts {
  posts: BlogPostSummary[];
  page: number;
  totalPages: number;
  totalPosts: number;
  pageSize: number;
}

export const POSTS_PER_PAGE = 12;

export async function fetchPaginatedPosts(
  page: number,
  pageSize: number = POSTS_PER_PAGE,
): Promise<PaginatedPosts> {
  const all = await fetchAllPostSummaries();
  const totalPosts = all.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const posts = all.slice(start, start + pageSize);
  return { posts, page: safePage, totalPages, totalPosts, pageSize };
}
