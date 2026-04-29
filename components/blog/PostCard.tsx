/**
 * <PostCard /> — Story 6.11.a
 *
 * RSC card para listing de blog posts. Mostra:
 *   - CategoryBadge (Opção A teal)
 *   - Title (h3, slate-900)
 *   - Excerpt (≤200 chars)
 *   - Autor + data publicação (compact)
 *   - Link envolvente para `/blog/[slug]/`
 *
 * Paleta Opção A: slate-900 título, teal-600 link, sky-600 hover.
 * NÃO usa client-side state — link nativo + CSS hover.
 */

import Link from 'next/link';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { authors } from '@/data/authors';
import type { BlogPostSummary } from '@/data/blog/types';

interface PostCardProps {
  post: BlogPostSummary;
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateFormatter.format(d);
}

export function PostCard({ post }: PostCardProps): React.JSX.Element {
  const author = authors[post.authorId];
  const href = `/blog/${post.slug}/`;

  return (
    <article
      className="group flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-md"
      data-testid="post-card"
    >
      <div className="flex items-center justify-between gap-2">
        <CategoryBadge slug={post.category} />
        <time
          dateTime={post.publishedAt}
          className="text-xs text-slate-500"
        >
          {formatDate(post.publishedAt)}
        </time>
      </div>

      <h3 className="text-lg font-semibold leading-snug text-slate-900 group-hover:text-teal-700">
        <Link
          href={href}
          className="after:absolute after:inset-0"
          data-testid="post-card-link"
        >
          {post.title}
        </Link>
      </h3>

      <p className="line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>

      <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-slate-500">
        <span>Por</span>
        <span className="font-medium text-slate-700">{author.name}</span>
      </div>
    </article>
  );
}
