import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getMunicipios,
  getMunicipioBySlug,
  getTodosBairrosPorCidade,
  getBairrosViaveisPorCidade,
  getPrestadoresPorBairro,
  getDatasetMetadata,
} from '@/lib/operadoras/amil/rede-credenciada-loader';
import { isUfValida, ufNome } from '@/lib/uf';
import { MIN_PRESTADORES_BAIRRO, ITEMLIST_MAX_PRESTADORES } from '@/config/seo';
import {
  DISCLAIMER_AMIL_REDE,
  ORGANIZATION_JSONLD_DEFAULTS,
} from '@/content/disclaimers/amil-rede';

// Story 7.6 — Páginas-bairro SSG filtradas (bipartite ≥3 indexável / 1-2 noindex).
export const revalidate = 2592000; // 30 dias
export const dynamicParams = false;

type Params = { uf: string; municipio: string; bairro: string };

const TIPO_LABELS: Record<string, string> = {
  Hospital: '🏥 Hospital',
  Laboratório: '🧪 Laboratório',
  Clínica: '🏛 Clínica',
  'Diagnóstico por Imagem': '📷 Imagem',
  Maternidade: '👶 Maternidade',
  'Pronto-Socorro': '🚑 Pronto-Socorro',
  'Centro/Instituto': '🏢 Centro',
  Odontologia: '🦷 Odontologia',
  Outro: '📍 Outro',
};

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];
  for (const m of getMunicipios()) {
    for (const b of getTodosBairrosPorCidade(m.ufSlug, m.cidadeSlug)) {
      params.push({ uf: m.ufSlug, municipio: m.cidadeSlug, bairro: b.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uf, municipio, bairro } = await params;
  if (!isUfValida(uf)) return { title: 'Bairro não encontrado' };

  const prestadores = getPrestadoresPorBairro(uf, municipio, bairro);
  if (prestadores.length === 0) return { title: 'Bairro não encontrado' };

  const mun = getMunicipioBySlug(uf, municipio);
  const munNome = mun?.municipio ?? municipio;
  const bairroNome = prestadores[0].bairro;
  const total = prestadores.length;
  const indexavel = total >= MIN_PRESTADORES_BAIRRO;

  return {
    title: `Rede Credenciada Amil ${bairroNome} — ${munNome}/${uf.toUpperCase()} | ${total} Prestadores`,
    description:
      `${total} prestadores credenciados Amil no bairro ${bairroNome}, ${munNome}/${uf.toUpperCase()}. ` +
      `Hospitais, laboratórios e clínicas. Cotação empresarial.`,
    // AC3: bairros 1-2 prestadores → noindex,follow + canonical p/ cidade-pai
    robots: indexavel ? undefined : { index: false, follow: true },
    alternates: {
      canonical: indexavel
        ? `/rede/${uf.toLowerCase()}/${municipio}/bairro/${bairro}`
        : `/rede/${uf.toLowerCase()}/${municipio}`,
    },
  };
}

export default async function BairroPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uf, municipio, bairro } = await params;
  if (!isUfValida(uf)) notFound();

  const prestadores = getPrestadoresPorBairro(uf, municipio, bairro);
  if (prestadores.length === 0) notFound();

  const ufLower = uf.toLowerCase();
  const mun = getMunicipioBySlug(uf, municipio);
  const munNome = mun?.municipio ?? municipio;
  const bairroNome = prestadores[0].bairro;
  const nome = ufNome(uf);
  const total = prestadores.length;
  const topPrestadores = prestadores.slice(0, ITEMLIST_MAX_PRESTADORES);
  const outrosBairros = getBairrosViaveisPorCidade(uf, municipio)
    .filter((b) => b.slug !== bairro)
    .slice(0, 10);
  const { geradoEm } = getDatasetMetadata();
  const dataFormatada = new Date(geradoEm).toLocaleDateString('pt-BR');

  const faqs = [
    {
      pergunta: `Quantos prestadores Amil há no bairro ${bairroNome}?`,
      resposta:
        `Há ${total.toLocaleString('pt-BR')} prestadores credenciados Amil no bairro ${bairroNome}, ` +
        `em ${munNome}/${uf.toUpperCase()}, entre hospitais, laboratórios e clínicas. ` +
        `Rede sujeita a alterações — confirme no app oficial Amil.`,
    },
    {
      pergunta: `Como contratar um plano Amil com cobertura em ${bairroNome}?`,
      resposta:
        `A contratação empresarial é feita via corretor autorizado (SUSEP). Informe CNPJ, ` +
        `número de vidas e perfil etário para receber uma cotação com a rede de ${bairroNome} e região.`,
    },
    {
      pergunta: `Os prestadores de ${bairroNome} atendem todas as redes Amil?`,
      resposta:
        `Cada prestador atende a um conjunto específico de redes Amil (Black, One, S750, Clássica, etc.). ` +
        `Verifique a rede do seu plano antes do atendimento; a cotação informa quais prestadores cobrem cada linha.`,
    },
  ];

  // ── JSON-LD ────────────────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Rede Credenciada', item: '/rede-credenciada' },
      { '@type': 'ListItem', position: 3, name: nome, item: `/rede/${ufLower}` },
      { '@type': 'ListItem', position: 4, name: munNome, item: `/rede/${ufLower}/${municipio}` },
      { '@type': 'ListItem', position: 5, name: bairroNome, item: `/rede/${ufLower}/${municipio}/bairro/${bairro}` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Prestadores Amil em ${bairroNome}, ${munNome}`,
    numberOfItems: total,
    itemListElement: topPrestadores.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'MedicalOrganization',
        name: p.nome,
        address: {
          '@type': 'PostalAddress',
          addressLocality: munNome,
          addressRegion: uf.toUpperCase(),
          addressCountry: 'BR',
        },
        areaServed: bairroNome,
      },
    })),
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

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_JSONLD_DEFAULTS.name,
    sameAs: ORGANIZATION_JSONLD_DEFAULTS.sameAs,
  };

  return (
    <>
      {[breadcrumbSchema, itemListSchema, faqSchema, organizationSchema].map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 rounded border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
            {DISCLAIMER_AMIL_REDE}
          </p>

          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Início</Link>
            <span className="mx-2">›</span>
            <Link href={`/rede/${ufLower}`} className="hover:text-blue-600">{nome}</Link>
            <span className="mx-2">›</span>
            <Link href={`/rede/${ufLower}/${municipio}`} className="hover:text-blue-600">{munNome}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{bairroNome}</span>
          </nav>

          <header>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Rede Credenciada Amil em {bairroNome} — {munNome}/{uf.toUpperCase()} ({total} Prestadores)
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              <strong className="text-gray-900">{total.toLocaleString('pt-BR')} prestadores</strong>{' '}
              credenciados Amil no bairro {bairroNome}.
            </p>
          </header>

          <div className="mt-6">
            <Link
              href={`/cotacao-online?uf=${ufLower}&cidade=${municipio}`}
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Solicitar cotação para {munNome} →
            </Link>
          </div>

          {/* Prestadores */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Prestadores em {bairroNome}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {topPrestadores.map((p) => (
                <li
                  key={p.codigo}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-3"
                >
                  <Link
                    href={`/rede/${ufLower}/${municipio}/${p.slug}`}
                    className="font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {p.nome}
                  </Link>
                  <div className="mt-1 text-sm text-gray-500">
                    {TIPO_LABELS[p.tipoInferido] ?? p.tipoInferido}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Internal linking */}
          <section className="mt-10">
            <Link
              href={`/rede/${ufLower}/${municipio}`}
              className="text-blue-600 hover:underline"
            >
              Ver toda a rede em {munNome} →
            </Link>
            {outrosBairros.length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Outros bairros de {munNome}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {outrosBairros.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/rede/${ufLower}/${municipio}/bairro/${b.slug}`}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm transition hover:border-blue-500"
                    >
                      {b.bairro} <span className="text-gray-500">({b.total})</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* FAQs */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Perguntas frequentes</h2>
            <dl className="mt-6 space-y-6">
              {faqs.map((f) => (
                <div key={f.pergunta}>
                  <dt className="font-semibold text-gray-900">{f.pergunta}</dt>
                  <dd className="mt-2 text-gray-700">{f.resposta}</dd>
                </div>
              ))}
            </dl>
          </section>

          <footer className="mt-12 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Aviso:</strong> {DISCLAIMER_AMIL_REDE} Rede atualizada em{' '}
            <time dateTime={geradoEm}>{dataFormatada}</time> — confirme no app oficial Amil.
          </footer>
        </div>
      </section>
    </>
  );
}
