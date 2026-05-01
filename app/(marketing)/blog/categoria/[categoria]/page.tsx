/**
 * `/blog/categoria/[categoria]/` — Story 6.11.a
 *
 * Listing por categoria. SSG via `generateStaticParams()` cobrindo
 * as 8 categorias canônicas. Schema `CollectionPage` com ItemList
 * dos posts.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { BlogListing } from '@/components/blog/BlogListing';
import {
  BLOG_CATEGORIES,
  getBlogCategory,
} from '@/data/blog/categories';
import { fetchPostsByCategory } from '@/lib/sanity/blog';
import { buildBlogCollectionPageNode } from '@/lib/schema/blog-posting';

interface CategoryPageProps {
  params: Promise<{ categoria: string }>;
}

export async function generateStaticParams(): Promise<{ categoria: string }[]> {
  return BLOG_CATEGORIES.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categoria } = await params;
  const category = getBlogCategory(categoria);
  if (!category) {
    return generatePageMetadata({
      type: 'blog',
      blogTitle: 'Categoria não encontrada',
      canonical: `/blog/categoria/${categoria}`,
      noIndex: true,
    });
  }
  return generatePageMetadata({
    type: 'blog',
    blogTitle: `${category.title} — Blog Amil Empresarial`,
    description: category.description,
    canonical: `/blog/categoria/${category.slug}`,
  });
}

export const revalidate = 3600;

export default async function CategoryPage({
  params,
}: CategoryPageProps): Promise<React.JSX.Element> {
  const { categoria } = await params;
  const category = getBlogCategory(categoria);
  if (!category) notFound();

  const posts = await fetchPostsByCategory(category.slug);
  const collectionNode = buildBlogCollectionPageNode({ category, posts });

  return (
    <>
      <SchemaGraph
        pageType="blog"
        breadcrumb={[
          { name: 'Blog', href: '/blog' },
          { name: category.title, href: `/blog/categoria/${category.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            ...collectionNode,
          }),
        }}
      />
      <BreadcrumbNav
        items={[
          { label: 'Blog', href: '/blog' },
          {
            label: category.title,
            href: `/blog/categoria/${category.slug}`,
          },
        ]}
      />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10">
            <p className="text-sm font-medium uppercase tracking-wider text-teal-700">
              Categoria
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              {category.title}
            </h1>
            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              {category.description}
            </p>
            {category.requiresLegalReview && (
              <p className="mt-4 inline-flex rounded-md bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
                Conteúdo regulatório — revisado por advogado parceiro (NFR22)
              </p>
            )}
          </header>

          <BlogListing
            posts={posts}
            totalPages={1}
            currentPage={1}
            basePath={`/blog/categoria/${category.slug}`}
          />
        </div>
      </section>
    </>
  );
}
