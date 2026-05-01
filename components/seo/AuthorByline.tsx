/**
 * <AuthorByline /> — Story 6.9 (NFR22 YMYL E-E-A-T)
 *
 * Renderiza visualmente autoria + revisão + datas em conteúdo YMYL
 * (cornerstones, blog, programmatic landings de saúde).
 *
 * Schema JSON-LD do Article é gerado por buildArticleNode() e
 * deve ser injetado no @graph da página via SchemaGraph.
 *
 * Paleta: slate-900 (texto), teal-600 (links), amber-700 (selo
 * Atualizado), sky-600 (links secundários) — alinhada à decisão
 * "Opção A migração total" (2026-04-28).
 */

import Image from 'next/image';
import Link from 'next/link';
import { authors, type AuthorId } from '@/data/authors';

interface AuthorBylineProps {
  authorId: AuthorId;
  reviewedById?: AuthorId;
  publishedAt: string;
  updatedAt?: string;
  /** Quando true, oculta thumbnail (uso em listagens). */
  compact?: boolean;
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

function CredentialBadge({
  type,
  value,
}: {
  type: string;
  value: string;
}): React.JSX.Element {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-700">
      {type} {value}
    </span>
  );
}

export function AuthorByline({
  authorId,
  reviewedById,
  publishedAt,
  updatedAt,
  compact = false,
}: AuthorBylineProps): React.JSX.Element {
  const author = authors[authorId];
  const reviewer = reviewedById ? authors[reviewedById] : undefined;

  const showUpdated = updatedAt && updatedAt !== publishedAt;

  return (
    <div
      className="flex flex-col gap-3 border-b border-slate-200 pb-4 text-sm text-slate-700 md:flex-row md:items-center md:gap-4"
      data-testid="author-byline"
    >
      {!compact && author.image && (
        <Image
          src={author.image}
          alt={`Foto de ${author.name}`}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
      )}

      <div className="flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-slate-900">Por</span>
          <Link
            href={author.url}
            className="font-semibold text-sky-600 hover:underline"
          >
            {author.name}
          </Link>
          {author.credentials.map((cred) => (
            <CredentialBadge
              key={`${cred.type}-${cred.value}`}
              type={cred.type}
              value={cred.value}
            />
          ))}
        </div>

        {reviewer && (
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs">
            <span className="text-slate-600">Revisado por</span>
            <Link
              href={reviewer.url}
              className="font-medium text-sky-600 hover:underline"
            >
              {reviewer.name}
            </Link>
            <span className="text-slate-500">— {reviewer.jobTitle}</span>
          </div>
        )}

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs text-slate-600">
          <time dateTime={publishedAt}>
            Publicado em {formatDate(publishedAt)}
          </time>
          {showUpdated && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 font-medium text-amber-700">
                Atualizado em <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
