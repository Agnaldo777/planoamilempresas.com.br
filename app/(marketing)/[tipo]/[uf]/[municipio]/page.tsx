import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getTipoUfMunicipios,
  getPrestadoresPorMunicipio,
  getMunicipioBySlug,
  getDatasetMetadata,
  type TipoAtendimentoInferido,
} from '@/lib/operadoras/amil/rede-credenciada-loader';
import { isUfValida, ufNome, tituloLocal } from '@/lib/uf';
import {
  MIN_PRESTADORES_TIPO,
  ITEMLIST_MAX_PRESTADORES,
  TIPO_SLUG_TO_INFERIDO,
  type TipoSlug,
} from '@/config/seo';
import {
  DISCLAIMER_AMIL_REDE,
  ORGANIZATION_JSONLD_DEFAULTS,
} from '@/content/disclaimers/amil-rede';

// Story 7.8 — Páginas tipo × UF × município (namespace top-level, fora de /rede/).
export const revalidate = 2592000; // 30 dias
// dynamicParams=true: tipo fora da allowlist / combo < MIN cai no notFound()
// interno (resolve()). dynamicParams=false quebra o roteamento SSG no OpenNext/CF.
export const dynamicParams = true;

type Params = { tipo: string; uf: string; municipio: string };

const TIPO_PLURAL: Record<TipoAtendimentoInferido, string> = {
  Hospital: 'Hospitais',
  Laboratório: 'Laboratórios',
  Clínica: 'Clínicas',
  'Diagnóstico por Imagem': 'Centros de Diagnóstico por Imagem',
  Maternidade: 'Maternidades',
  'Pronto-Socorro': 'Pronto-Socorros',
  Odontologia: 'Clínicas Odontológicas',
  'Centro/Instituto': 'Centros e Institutos',
  Outro: 'Prestadores',
};

function inferidoFromSlug(tipo: string): TipoAtendimentoInferido | null {
  return (TIPO_SLUG_TO_INFERIDO as Record<string, TipoAtendimentoInferido>)[tipo] ?? null;
}

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];
  for (const tipoSlug of Object.keys(TIPO_SLUG_TO_INFERIDO) as TipoSlug[]) {
    const inferido = TIPO_SLUG_TO_INFERIDO[tipoSlug] as TipoAtendimentoInferido;
    for (const c of getTipoUfMunicipios(inferido, MIN_PRESTADORES_TIPO)) {
      params.push({ tipo: tipoSlug, uf: c.ufSlug, municipio: c.cidadeSlug });
    }
  }
  return params;
}

function resolve(tipo: string, uf: string, municipio: string) {
  const inferido = inferidoFromSlug(tipo);
  if (!inferido || !isUfValida(uf)) return null;
  const prestadores = getPrestadoresPorMunicipio(uf, municipio).filter(
    (p) => p.tipoInferido === inferido
  );
  if (prestadores.length < MIN_PRESTADORES_TIPO) return null;
  return { inferido, prestadores };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tipo, uf, municipio } = await params;
  const r = resolve(tipo, uf, municipio);
  if (!r) return { title: 'Página não encontrada' };

  const mun = getMunicipioBySlug(uf, municipio);
  const munNome = tituloLocal(mun?.municipio ?? municipio);
  const plural = TIPO_PLURAL[r.inferido];
  const total = r.prestadores.length;

  return {
    title: `${plural} Amil em ${munNome}/${uf.toUpperCase()} — ${total} Credenciados`,
    description:
      `${total} ${plural.toLowerCase()} credenciados Amil em ${munNome}/${uf.toUpperCase()}. ` +
      `Veja a lista e solicite cotação empresarial.`,
    alternates: { canonical: `/${tipo}/${uf.toLowerCase()}/${municipio}` },
  };
}

export default async function TipoUfMunicipioPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tipo, uf, municipio } = await params;
  const r = resolve(tipo, uf, municipio);
  if (!r) notFound();

  const { inferido, prestadores } = r;
  const ufLower = uf.toLowerCase();
  const mun = getMunicipioBySlug(uf, municipio);
  const munNome = tituloLocal(mun?.municipio ?? municipio);
  const nome = ufNome(uf);
  const plural = TIPO_PLURAL[inferido];
  const total = prestadores.length;
  const topPrestadores = prestadores.slice(0, ITEMLIST_MAX_PRESTADORES);
  const { geradoEm } = getDatasetMetadata();
  const dataFormatada = new Date(geradoEm).toLocaleDateString('pt-BR');

  const faqs = [
    {
      pergunta: `Quantos ${plural.toLowerCase()} Amil há em ${munNome}?`,
      resposta:
        `Há ${total.toLocaleString('pt-BR')} ${plural.toLowerCase()} credenciados Amil em ` +
        `${munNome}/${uf.toUpperCase()}. Rede sujeita a alterações — confirme no app oficial Amil.`,
    },
    {
      pergunta: `Como contratar um plano Amil com ${plural.toLowerCase()} em ${munNome}?`,
      resposta:
        `A contratação empresarial é feita via corretor autorizado (SUSEP). Informe CNPJ, número ` +
        `de vidas e perfil etário para receber uma cotação com a rede de ${munNome}.`,
    },
  ];

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${plural} Amil em ${munNome}`,
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: '/' },
      { '@type': 'ListItem', position: 2, name: plural, item: `/${tipo}/${ufLower}/${municipio}` },
      { '@type': 'ListItem', position: 3, name: `${munNome}/${uf.toUpperCase()}`, item: `/${tipo}/${ufLower}/${municipio}` },
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
      {[itemListSchema, faqSchema, breadcrumbSchema, organizationSchema].map((schema, i) => (
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
            <Link href={`/rede/${ufLower}/${municipio}`} className="hover:text-blue-600">
              {munNome}/{uf.toUpperCase()}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{plural}</span>
          </nav>

          <header>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              {plural} Amil em {munNome}/{uf.toUpperCase()}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              <strong className="text-gray-900">{total.toLocaleString('pt-BR')} {plural.toLowerCase()}</strong>{' '}
              credenciados Amil em {munNome}, {nome}.
            </p>
          </header>

          <div className="mt-6">
            <Link
              href={`/cotacao-online?uf=${ufLower}&cidade=${municipio}`}
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Solicitar cotação em {munNome} →
            </Link>
          </div>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">
              {plural} credenciados em {munNome}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {topPrestadores.map((p) => (
                <li key={p.codigo} className="rounded-lg border border-gray-200 bg-white px-4 py-3">
                  <Link
                    href={`/rede/${ufLower}/${municipio}/${p.slug}`}
                    className="font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {p.nome}
                  </Link>
                  {p.bairro.length > 0 && (
                    <div className="mt-1 text-sm text-gray-500">{tituloLocal(p.bairro)}</div>
                  )}
                </li>
              ))}
            </ul>
            <Link
              href={`/rede/${ufLower}/${municipio}`}
              className="mt-6 inline-block text-blue-600 hover:underline"
            >
              Ver toda a rede em {munNome} →
            </Link>
          </section>

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
