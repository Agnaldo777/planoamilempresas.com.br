/**
 * `/blog/` — listing paginado (Story 6.11.a)
 *
 * SSR com `searchParams.page` (1-based). 12 posts/página default.
 * Schema `Blog` no @graph + breadcrumb. Fallback automático para mock
 * data quando Sanity não configurado.
 */

import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { BlogListing } from '@/components/blog/BlogListing';
import {
  fetchPaginatedPosts,
  POSTS_PER_PAGE,
} from '@/lib/sanity/blog';
import { buildBlogNode } from '@/lib/schema/blog-posting';

export const metadata: Metadata = generatePageMetadata({
  type: 'blog',
  blogTitle: 'Blog Amil Empresarial — Guias, Comparativos e Notícias',
  description:
    'Artigos sobre planos de saúde empresariais: guias de contratação, comparativos de planos, legislação ANS, dicas de RH e benefícios corporativos.',
  canonical: '/blog',
});

export const revalidate = 3600;

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

function parsePage(raw: string | undefined): number {
  if (!raw) return 1;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default async function BlogPage({
  searchParams,
}: BlogPageProps): Promise<React.JSX.Element> {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const { posts, totalPages, currentPage, totalPosts } = await fetchPaginatedPosts(
    page,
    POSTS_PER_PAGE,
  ).then((r) => ({
    posts: r.posts,
    totalPages: r.totalPages,
    currentPage: r.page,
    totalPosts: r.totalPosts,
  }));

  const blogNode = buildBlogNode();

  return (
    <>
      <SchemaGraph
        pageType="blog"
        breadcrumb={[{ name: 'Blog', href: '/blog' }]}
      />
      {/* Schema.org Blog node — separado do graph principal por simplicidade. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            ...blogNode,
          }),
        }}
      />
      <BreadcrumbNav items={[{ label: 'Blog', href: '/blog' }]} />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Blog Amil Empresarial
            </h1>
            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              Guias, comparativos, notícias regulatórias ANS e dicas para RH
              sobre planos de saúde empresariais. Conteúdo revisado por corretor
              autorizado SUSEP e advogado parceiro.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {totalPosts} {totalPosts === 1 ? 'artigo' : 'artigos'} publicados
            </p>
          </header>

          <BlogListing
            posts={posts}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
    </>
  );
}
