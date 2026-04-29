/**
 * <BlogListing /> — Story 6.11.a
 *
 * RSC para grid de PostCards + paginação SSR via query string `?page=N`.
 *
 * SSR puro (zero JS client) — paginação via Link nativo. Próximo/anterior
 * desabilitados via aria-disabled quando boundary.
 */

import Link from 'next/link';
import { PostCard } from '@/components/blog/PostCard';
import type { BlogPostSummary } from '@/data/blog/types';

interface BlogListingProps {
  posts: readonly BlogPostSummary[];
  /** Total pages (1-based). */
  totalPages: number;
  currentPage: number;
  /** Path base para paginação. Default `/blog`. */
  basePath?: string;
}

export function BlogListing({
  posts,
  totalPages,
  currentPage,
  basePath = '/blog',
}: BlogListingProps): React.JSX.Element {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const prevHref =
    currentPage === 2 ? `${basePath}/` : `${basePath}/?page=${currentPage - 1}`;
  const nextHref = `${basePath}/?page=${currentPage + 1}`;

  if (posts.length === 0) {
    return (
      <div
        className="rounded-lg border border-dashed border-slate-300 p-12 text-center text-slate-500"
        data-testid="blog-listing-empty"
      >
        Nenhum post encontrado.
      </div>
    );
  }

  return (
    <div data-testid="blog-listing">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post._id} className="relative">
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label="Paginação"
          className="mt-10 flex items-center justify-between gap-4 border-t border-slate-200 pt-6"
        >
          {hasPrev ? (
            <Link
              href={prevHref}
              rel="prev"
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-400 hover:text-teal-700"
            >
              ← Anterior
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-400"
            >
              ← Anterior
            </span>
          )}

          <span className="text-sm text-slate-600">
            Página {currentPage} de {totalPages}
          </span>

          {hasNext ? (
            <Link
              href={nextHref}
              rel="next"
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-400 hover:text-teal-700"
            >
              Próxima →
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-400"
            >
              Próxima →
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
