/**
 * Página dedicada do autor — Story 6.9 AC3
 *
 * Rota SSG /autores/[slug]/ com schema ProfilePage + Person.
 * /sobre-corretor/ é a versão "vanity" do Agnaldo (Story 2.1).
 */

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { authors, type AuthorId, isAuthorId } from '@/data/authors';
import { buildAuthorNode } from '@/lib/schema/author';

interface PageParams {
  slug: string;
}

export function generateStaticParams(): PageParams[] {
  return Object.keys(authors).map((id) => ({ slug: id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isAuthorId(slug)) return { title: 'Autor não encontrado' };
  const author = authors[slug];
  return {
    title: `${author.name} — ${author.jobTitle}`,
    description: author.bioShort,
    alternates: { canonical: author.url },
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seusite.com.br';

export default async function AutorPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  if (!isAuthorId(slug)) {
    notFound();
  }
  const id = slug as AuthorId;
  const author = authors[id];

  const profileSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${BASE_URL}${author.url}#profile`,
        url: `${BASE_URL}${author.url}`,
        mainEntity: buildAuthorNode(author),
      },
      buildAuthorNode(author),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:gap-6">
          {author.image && (
            <Image
              src={author.image}
              alt={`Foto de ${author.name}`}
              width={120}
              height={120}
              className="h-30 w-30 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{author.name}</h1>
            <p className="mt-1 text-slate-700">{author.jobTitle}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {author.credentials.map((cred) => (
                <span
                  key={`${cred.type}-${cred.value}`}
                  className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                >
                  {cred.type} {cred.value}
                  {cred.url && (
                    <a
                      href={cred.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:underline"
                      aria-label={`Verificar ${cred.type}`}
                    >
                      ↗
                    </a>
                  )}
                </span>
              ))}
            </div>
          </div>
        </header>

        <section className="prose prose-slate mt-6 max-w-none">
          <p className="text-base leading-relaxed text-slate-700">
            {author.bioLong}
          </p>
        </section>

        {author.knowsAbout.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Áreas de expertise
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {author.knowsAbout.map((topic) => (
                <li
                  key={topic}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </section>
        )}

        {author.affiliation && (
          <section className="mt-8 text-sm text-slate-700">
            <strong className="text-slate-900">Afiliação:</strong>{' '}
            {author.affiliation.url ? (
              <Link
                href={author.affiliation.url}
                className="text-sky-600 hover:underline"
              >
                {author.affiliation.name}
              </Link>
            ) : (
              author.affiliation.name
            )}
          </section>
        )}

        {/* TODO Story 6.11: listar artigos publicados/revisados por este autor (Sanity query). */}
      </article>
    </>
  );
}
