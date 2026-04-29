import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildOpenGraphMetadata } from '@/components/seo/OpenGraph';
import { buildTitle } from '@/lib/seo/title';

/**
 * Stub dynamic route para páginas de plano individuais.
 *
 * Stories Epic 3 futuras irão substituir este placeholder por conteúdo
 * editorial completo (hospitais, faixas etárias, cobertura, comparação,
 * tabela de preços, schema Product completo, FAQ schema).
 *
 * Por ora, mantém os slugs no sitemap (Story 1.9 NFR26) com `<meta robots>`
 * direcionando para `/comparar` ou `/cotacao-online` enquanto Epic 3 não
 * implementa as cornerstones individuais.
 */

const PLANO_SLUGS = [
  'amil-facil-s60',
  'amil-facil-s80',
  'amil-s380',
  'amil-s450',
  'amil-s580',
  'amil-s750',
  'amil-one-s2500',
  'amil-one-s6500-black',
] as const;

type PlanoSlug = (typeof PLANO_SLUGS)[number];

const PLANO_LABELS: Record<PlanoSlug, string> = {
  'amil-facil-s60': 'Amil Fácil S60',
  'amil-facil-s80': 'Amil Fácil S80',
  'amil-s380': 'Amil S380',
  'amil-s450': 'Amil S450',
  'amil-s580': 'Amil S580',
  'amil-s750': 'Amil S750',
  'amil-one-s2500': 'Amil One S2500',
  'amil-one-s6500-black': 'Amil One S6500 Black',
};

export function generateStaticParams() {
  return PLANO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const planoLabel = PLANO_LABELS[slug as PlanoSlug];
  if (!planoLabel) return {};

  const title = buildTitle({ tipo: planoLabel });
  const description = `${planoLabel} — Plano de saúde Amil 2026 para empresas. Cotação online com a BeneficioRH (corretora autorizada SUSEP 201054484). Conteúdo completo em breve.`;

  return {
    title,
    description,
    ...buildOpenGraphMetadata({ title, description, type: 'website' }),
    alternates: { canonical: `/planos/${slug}` },
    robots: {
      index: false, // Stub não deve indexar até cornerstone Epic 3
      follow: true,
    },
  };
}

export default async function PlanoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const planoLabel = PLANO_LABELS[slug as PlanoSlug];
  if (!planoLabel) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <span className="inline-flex items-center rounded-full bg-amber-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        Em breve
      </span>
      <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
        {planoLabel}
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Conteúdo completo do plano <strong>{planoLabel}</strong> está em produção. Enquanto
        isso:
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href={`/comparar?planos=${slug}`}
          className="block rounded-lg border border-slate-200 p-6 transition-colors hover:border-teal-600"
        >
          <h2 className="font-semibold text-slate-900">Comparar planos</h2>
          <p className="mt-1 text-sm text-slate-600">
            Veja {planoLabel} lado a lado com outros planos Amil
          </p>
        </Link>
        <Link
          href={`/cotacao-online?plano=${slug}`}
          className="block rounded-lg bg-teal-600 p-6 text-white transition-colors hover:bg-teal-500"
        >
          <h2 className="font-semibold">Solicitar cotação</h2>
          <p className="mt-1 text-sm text-teal-50">
            Receba proposta personalizada para sua empresa
          </p>
        </Link>
      </div>

      <footer className="mt-16 text-center text-xs text-slate-500">
        BeneficioRH (CNPJ 14.764.085/0001-99 · SUSEP 201054484) — corretor autorizado a
        intermediar planos da Amil (ANS 326305).
      </footer>
    </main>
  );
}
