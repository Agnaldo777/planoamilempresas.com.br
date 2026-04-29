/**
 * `/blog/[slug]/` — post detail page (Story 6.11.a)
 *
 * SSG com `generateStaticParams()` listando slugs (mock ou Sanity).
 * Schema `BlogPosting` (NFR22 YMYL: author + reviewedBy + publisher
 * BeneficioRH). Breadcrumb: Home > Blog > Categoria > Post.
 *
 * Fallback 404 via `notFound()` quando slug inexistente.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { AuthorByline } from '@/components/seo/AuthorByline';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { PostBody } from '@/components/blog/PostBody';
import { fetchPostBySlug, fetchAllPostSlugs } from '@/lib/sanity/blog';
import { getBlogCategory } from '@/data/blog/categories';
import { buildBlogPostingNode } from '@/lib/schema/blog-posting';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await fetchAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) {
    return generatePageMetadata({
      type: 'blog',
      blogTitle: 'Post não encontrado',
      canonical: `/blog/${slug}`,
      noIndex: true,
    });
  }
  return generatePageMetadata({
    type: 'blog',
    blogTitle: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    canonical: `/blog/${post.slug}`,
    image: post.ogImage,
  });
}

export const revalidate = 3600;

export default async function PostPage({
  params,
}: PostPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const category = getBlogCategory(post.category);
  const breadcrumb = [
    { name: 'Blog', href: '/blog' },
    ...(category
      ? [{ name: category.title, href: `/blog/categoria/${category.slug}` }]
      : []),
    { name: post.title, href: `/blog/${post.slug}` },
  ];
  const breadcrumbNav = breadcrumb.map((b) => ({
    label: b.name,
    href: b.href,
  }));

  const blogPostingNode = buildBlogPostingNode({
    headline: post.title,
    description: post.excerpt,
    url: `/blog/${post.slug}`,
    image: post.ogImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    authorId: post.authorId,
    reviewedById: post.reviewedById,
    articleSection: category?.title ?? post.category,
    categorySlug: post.category,
    keywords: post.tags,
    articleBody: post.excerpt,
  });

  return (
    <>
      <SchemaGraph pageType="blog" breadcrumb={breadcrumb} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            ...blogPostingNode,
          }),
        }}
      />
      <BreadcrumbNav items={breadcrumbNav} />

      <article className="px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8">
            <CategoryBadge slug={post.category} size="md" />
            <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-lg text-slate-600">{post.excerpt}</p>
          </header>

          <AuthorByline
            authorId={post.authorId}
            reviewedById={post.reviewedById}
            publishedAt={post.publishedAt}
            updatedAt={post.updatedAt}
          />

          <div className="mt-8">
            <PostBody blocks={post.body} />
          </div>

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <nav className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
            <Link
              href="/blog"
              className="text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              ← Todos os artigos
            </Link>
            {category && (
              <Link
                href={`/blog/categoria/${category.slug}`}
                className="text-sm font-medium text-teal-700 hover:text-teal-800"
              >
                Mais em {category.title} →
              </Link>
            )}
          </nav>
        </div>
      </article>
    </>
  );
}
