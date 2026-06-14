import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildOpenGraphMetadata } from '@/components/seo/OpenGraph';
import { COMPARATIVOS_INFO, COMPARATIVO_SLUGS } from '@/content/comparativos-concorrentes';
import {
  DISCLAIMER_AMIL_REDE,
  ORGANIZATION_JSONLD_DEFAULTS,
} from '@/content/disclaimers/amil-rede';

export const revalidate = 2592000; // 30 dias

export function generateStaticParams() {
  return COMPARATIVO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = COMPARATIVOS_INFO[slug];
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...buildOpenGraphMetadata({ title: c.metaTitle, description: c.metaDescription, type: 'website' }),
    alternates: { canonical: `/comparativos/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function ComparativoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = COMPARATIVOS_INFO[slug];
  if (!c) notFound();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faqs.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Comparativos', item: '/comparativos' },
      { '@type': 'ListItem', position: 3, name: `Amil vs ${c.concorrente}`, item: `/comparativos/${slug}` },
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
      {[faqSchema, breadcrumbSchema, organizationSchema].map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Hero */}
      <section className="bg-slate-900 px-4 py-14 text-white">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-5 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">Início</Link>
            <span className="mx-2">›</span>
            <Link href="/comparativos" className="hover:text-white">Comparativos</Link>
            <span className="mx-2">›</span>
            <span className="text-white">Amil vs {c.concorrente}</span>
          </nav>
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Amil ou {c.concorrente}? Comparativo empresarial 2026
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">{c.tagline}</p>
          <Link href="/cotacao-online?origem=comparativo" className="mt-7 inline-block rounded-lg bg-cta-green px-7 py-3.5 text-lg font-semibold text-white hover:bg-cta-green-hover">
            Cotar e comparar por CNPJ →
          </Link>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Editorial intro */}
          <section className="space-y-4 text-gray-700">
            {c.intro.map((p, i) => (<p key={i}>{p}</p>))}
          </section>

          {/* Tabela comparativa */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Amil vs {c.concorrente}: lado a lado</h2>
            <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Critério</th>
                    <th className="px-4 py-3 font-semibold text-blue-700">Amil</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">{c.concorrente}</th>
                  </tr>
                </thead>
                <tbody>
                  {c.linhas.map((l) => (
                    <tr key={l.criterio} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-700">{l.criterio}</td>
                      <td className="px-4 py-3 text-gray-900">{l.amil}</td>
                      <td className="px-4 py-3 text-gray-700">{l.concorrente}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quando escolher cada um */}
          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <h2 className="text-lg font-bold text-blue-900">Quando escolher a Amil</h2>
              <ul className="mt-3 space-y-2 text-sm text-blue-900">
                {c.escolhaAmil.map((e) => (<li key={e}>✓ {e}</li>))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-bold text-slate-900">Quando escolher a {c.concorrente}</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {c.escolhaConcorrente.map((e) => (<li key={e}>✓ {e}</li>))}
              </ul>
            </div>
          </section>

          {/* Veredicto */}
          <section className="mt-10 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
            <h2 className="text-xl font-bold text-emerald-900">Veredicto do corretor</h2>
            <p className="mt-2 text-emerald-900">{c.veredicto}</p>
          </section>

          {/* CTA */}
          <div className="mt-10 rounded-lg bg-blue-600 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">A melhor escolha sai da cotação real</h2>
            <p className="mt-2 text-blue-100">Comparamos rede e valor das duas operadoras para o seu CNPJ, sem custo.</p>
            <Link href="/cotacao-online?origem=comparativo" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
              Solicitar cotação comparada →
            </Link>
          </div>

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Perguntas frequentes</h2>
            <dl className="mt-6 space-y-6">
              {c.faqs.map((f) => (
                <div key={f.pergunta}>
                  <dt className="font-semibold text-gray-900">{f.pergunta}</dt>
                  <dd className="mt-2 text-gray-700">{f.resposta}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="mt-10 text-sm text-gray-600">
            Veja outros <Link href="/comparativos" className="text-blue-600 hover:underline">comparativos de planos</Link> ou
            os <Link href="/planos" className="text-blue-600 hover:underline">planos Amil</Link>.
          </p>

          <footer className="mt-10 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Aviso:</strong> {DISCLAIMER_AMIL_REDE} Dados comparativos (vidas, reputação, reajuste) são de
            referência pública (ANS/Reclame Aqui/divulgações), variam por ano e contrato. Comparação imparcial de corretor.
          </footer>
        </div>
      </section>
    </>
  );
}
