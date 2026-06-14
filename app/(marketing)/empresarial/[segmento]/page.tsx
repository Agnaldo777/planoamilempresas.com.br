import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildOpenGraphMetadata } from '@/components/seo/OpenGraph';
import { SEGMENTOS_INFO, SEGMENTO_SLUGS } from '@/content/segmentos-empresarial';
import { PLANOS_INFO } from '@/content/planos-amil';
import {
  DISCLAIMER_AMIL_REDE,
  ORGANIZATION_JSONLD_DEFAULTS,
} from '@/content/disclaimers/amil-rede';

export const revalidate = 2592000; // 30 dias

export function generateStaticParams() {
  return SEGMENTO_SLUGS.map((segmento) => ({ segmento }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segmento: string }>;
}): Promise<Metadata> {
  const { segmento } = await params;
  const s = SEGMENTOS_INFO[segmento];
  if (!s) return {};

  return {
    title: s.metaTitle,
    description: s.metaDescription,
    ...buildOpenGraphMetadata({ title: s.metaTitle, description: s.metaDescription, type: 'website' }),
    alternates: { canonical: `/empresarial/${segmento}` },
    robots: { index: true, follow: true },
  };
}

export default async function SegmentoPage({
  params,
}: {
  params: Promise<{ segmento: string }>;
}) {
  const { segmento } = await params;
  const s = SEGMENTOS_INFO[segmento];
  if (!s) notFound();

  const cotacaoHref = `/cotacao-online?segmento=${segmento}`;
  const planos = s.planosRecomendados
    .map((slug) => PLANOS_INFO[slug])
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: s.faqs.map((f) => ({
      '@type': 'Question',
      name: f.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: f.resposta },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Empresarial', item: '/empresarial' },
      { '@type': 'ListItem', position: 3, name: s.nome, item: `/empresarial/${segmento}` },
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_JSONLD_DEFAULTS.name,
    sameAs: ORGANIZATION_JSONLD_DEFAULTS.sameAs,
  };

  return (
    <>
      {[faqSchema, breadcrumbSchema, organizationSchema].map((sch, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sch) }} />
      ))}

      {/* Hero */}
      <section className="bg-slate-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-6 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">Início</Link>
            <span className="mx-2">›</span>
            <Link href="/empresarial" className="hover:text-white">Empresarial</Link>
            <span className="mx-2">›</span>
            <span className="text-white">{s.nome}</span>
          </nav>
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{s.titulo}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">{s.tagline}</p>
          <Link
            href={cotacaoHref}
            className="mt-8 inline-block rounded-lg bg-cta-green px-8 py-4 text-lg font-semibold text-white hover:bg-cta-green-hover"
          >
            Cotar plano {s.nome} →
          </Link>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Ficha factual */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-sm">
              <tbody>
                {s.ficha.map((f) => (
                  <tr key={f.rotulo} className="border-b border-gray-100 last:border-0">
                    <td className="w-56 bg-gray-50 px-4 py-3 font-semibold text-gray-700">{f.rotulo}</td>
                    <td className="px-4 py-3 text-gray-700">{f.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Editorial intro */}
          <section className="mt-10 space-y-4 text-gray-700">
            {s.intro.map((par, i) => (<p key={i}>{par}</p>))}
          </section>

          {/* Blocos */}
          <section className="mt-10 grid gap-6 md:grid-cols-1">
            {s.blocos.map((b) => (
              <div key={b.titulo} className="rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900">{b.titulo}</h2>
                <p className="mt-2 text-gray-700">{b.texto}</p>
              </div>
            ))}
          </section>

          {/* Planos recomendados */}
          {planos.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900">Planos Amil indicados para {s.nome}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {planos.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/planos/${p.slug}`}
                    className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-400 hover:shadow-sm"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Linha {p.linha}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">{p.nome}</h3>
                    <p className="mt-1 text-sm text-gray-600">{p.abrangencia} · {p.acomodacao}</p>
                    {p.status === 'ativo' && (
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        a partir de {p.desdeRef}/vida*
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-lg bg-blue-600 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Cotação para {s.nome}</h2>
            <p className="mt-2 text-blue-100">Preço personalizado por CNPJ, sem custo de corretagem.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href={cotacaoHref} className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
                Solicitar cotação →
              </Link>
              <Link href="/rede-credenciada" className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                Ver rede credenciada
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Perguntas frequentes — {s.nome}</h2>
            <dl className="mt-6 space-y-6">
              {s.faqs.map((f) => (
                <div key={f.pergunta}>
                  <dt className="font-semibold text-gray-900">{f.pergunta}</dt>
                  <dd className="mt-2 text-gray-700">{f.resposta}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="mt-10 text-sm text-gray-500">
            Veja todos os <Link href="/empresarial" className="text-blue-600 hover:underline">segmentos empresariais</Link>,{' '}
            os <Link href="/planos" className="text-blue-600 hover:underline">planos Amil</Link> ou a{' '}
            <Link href="/tabela-de-precos" className="text-blue-600 hover:underline">tabela de preços</Link>.
          </p>

          <footer className="mt-10 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Aviso:</strong> {DISCLAIMER_AMIL_REDE} *Valores de referência por vida, sujeitos a cotação por CNPJ, faixa etária e porte.
          </footer>
        </div>
      </section>
    </>
  );
}
