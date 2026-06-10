import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildOpenGraphMetadata } from '@/components/seo/OpenGraph';
import { PLANOS_INFO, PLANO_SLUGS } from '@/content/planos-amil';
import {
  DISCLAIMER_AMIL_REDE,
  AMIL_ANS_REGISTRO,
  ORGANIZATION_JSONLD_DEFAULTS,
} from '@/content/disclaimers/amil-rede';

export const revalidate = 2592000; // 30 dias

export function generateStaticParams() {
  return PLANO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = PLANOS_INFO[slug];
  if (!p) return {};

  const title = `${p.nome}: Cobertura, Rede Credenciada e Preço 2026`;
  const description =
    `${p.nome} (${p.linha}, ${p.abrangencia}): cobertura, rede credenciada, acomodação ` +
    `${p.acomodacao} e valores de referência. Plano empresarial e MEI — cotação online.`;

  return {
    title,
    description,
    ...buildOpenGraphMetadata({ title, description, type: 'website' }),
    alternates: { canonical: `/planos/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function PlanoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = PLANOS_INFO[slug];
  if (!p) notFound();

  const cotacaoHref = `/cotacao-online?plano=${slug}`;
  const ativo = p.status === 'ativo';

  const faqs = [
    {
      pergunta: `O que cobre o ${p.nome}?`,
      resposta:
        `O ${p.nome} é um plano da linha ${p.linha} com abrangência ${p.abrangencia.toLowerCase()} ` +
        `e acomodação em ${p.acomodacao.toLowerCase()}. Cobre consultas, exames, internações, ` +
        `terapias e obstetrícia conforme o rol da ANS, na rede credenciada do produto.`,
    },
    {
      pergunta: `Quanto custa o ${p.nome}?`,
      resposta: ativo
        ? `O ${p.nome} parte de ${p.desdeRef}/vida como referência, mas o valor final depende da ` +
          `faixa etária, do número de vidas e do porte da empresa. Solicite uma cotação por CNPJ para o preço exato.`
        : `O ${p.nome} não é mais comercializado para novas contratações. Consulte as alternativas vigentes na cotação.`,
    },
    {
      pergunta: `O ${p.nome} tem cobertura ${p.abrangencia.includes('Nacional') ? 'nacional' : 'em todo o estado'}?`,
      resposta:
        `A abrangência do ${p.nome} é ${p.abrangencia}. A cobertura efetiva depende da rede ` +
        `credenciada de cada cidade — verifique a rede por cidade antes de contratar.`,
    },
    {
      pergunta: `O ${p.nome} pode ser contratado por MEI?`,
      resposta:
        `Sim. MEI com CNPJ ativo há pelo menos 180 dias contrata o ${p.nome} na modalidade ` +
        `empresarial (coletiva), geralmente a partir de 2 vidas — condição mais vantajosa que a pessoa física.`,
    },
  ];

  const planSchema = {
    '@context': 'https://schema.org',
    '@type': 'HealthInsurancePlan',
    name: p.nome,
    provider: { '@type': 'Organization', name: 'Amil Assistência Médica' },
    usesHealthPlanIdStandard: `ANS ${AMIL_ANS_REGISTRO}`,
    description: p.sobre[0],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Planos', item: '/planos' },
      { '@type': 'ListItem', position: 3, name: p.nome, item: `/planos/${slug}` },
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
      {[planSchema, faqSchema, breadcrumbSchema, organizationSchema].map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 rounded border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
            {DISCLAIMER_AMIL_REDE}
          </p>

          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Início</Link>
            <span className="mx-2">›</span>
            <Link href="/planos" className="hover:text-blue-600">Planos</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{p.nome}</span>
          </nav>

          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800">
            Linha {p.linha}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {p.nome}: Cobertura, Rede e Preço 2026
          </h1>
          <p className="mt-4 text-lg text-gray-600">{p.sobre[0]}</p>

          {!ativo && (
            <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <strong>Atenção:</strong> o {p.nome} está em transição e não é comercializado para novas
              contratações. Veja as alternativas vigentes (S450 e S750) ou solicite orientação na cotação.
            </div>
          )}

          {/* Características */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <tbody>
                {[
                  ['Linha', p.linha],
                  ['Abrangência', p.abrangencia],
                  ['Acomodação', p.acomodacao],
                  ['Valor de referência*', ativo ? `a partir de ${p.desdeRef}/vida` : 'não comercializado'],
                  ['Indicado para', p.publico],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-100">
                    <td className="w-44 py-3 pr-4 font-semibold text-gray-700">{k}</td>
                    <td className="py-3 text-gray-700">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {ativo && (
            <div className="mt-6">
              <Link href={cotacaoHref} className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
                Cotar o {p.nome} →
              </Link>
            </div>
          )}

          {/* Editorial */}
          <section className="mt-10 space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">Sobre o {p.nome}</h2>
            {p.sobre.map((par, i) => (<p key={i}>{par}</p>))}
          </section>

          {/* Sinônimos / nomenclatura legada (captura busca antiga) */}
          {p.sinonimos.length > 0 && (
            <p className="mt-6 text-sm text-gray-500">
              Também procurado como: {p.sinonimos.map((s) => `“${s}”`).join(', ')}.
            </p>
          )}

          {/* Rede */}
          <section className="mt-10 rounded-lg bg-blue-50 p-6">
            <h2 className="text-xl font-bold text-gray-900">Rede credenciada do {p.nome}</h2>
            <p className="mt-2 text-gray-700">
              Consulte hospitais, laboratórios e clínicas que atendem o {p.nome} por cidade e bairro.
            </p>
            <Link href="/rede-credenciada" className="mt-3 inline-block font-semibold text-blue-700 hover:underline">
              Ver rede credenciada Amil →
            </Link>
          </section>

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Perguntas frequentes — {p.nome}</h2>
            <dl className="mt-6 space-y-6">
              {faqs.map((f) => (
                <div key={f.pergunta}>
                  <dt className="font-semibold text-gray-900">{f.pergunta}</dt>
                  <dd className="mt-2 text-gray-700">{f.resposta}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* CTA final */}
          <div className="mt-12 rounded-lg bg-blue-600 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Cotação do {p.nome} para sua empresa</h2>
            <p className="mt-2 text-blue-100">Preço personalizado por CNPJ — inclusive MEI.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href={cotacaoHref} className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
                Solicitar cotação →
              </Link>
              <Link href={`/comparar?planos=${slug}`} className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                Comparar planos
              </Link>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Veja todos os <Link href="/planos" className="text-blue-600 hover:underline">planos Amil</Link>{' '}
            ou a <Link href="/tabela-de-precos" className="text-blue-600 hover:underline">tabela de preços</Link>.
          </p>

          <footer className="mt-10 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Aviso:</strong> {DISCLAIMER_AMIL_REDE} *Valor de referência sujeito a cotação.
          </footer>
        </div>
      </section>
    </>
  );
}
