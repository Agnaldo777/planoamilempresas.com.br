import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getEstatisticasByUF,
  getMunicipiosByUf,
  getEstatisticasRede,
} from '@/lib/operadoras/amil/rede-credenciada-loader';

export const revalidate = 2592000; // 30 dias (ISR — ADR-005 v2)

const UFS_VALIDAS = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
  'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
] as const;

const UF_NOMES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AM: 'Amazonas', AP: 'Amapá',
  BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo',
  GO: 'Goiás', MA: 'Maranhão', MG: 'Minas Gerais', MS: 'Mato Grosso do Sul',
  MT: 'Mato Grosso', PA: 'Pará', PB: 'Paraíba', PE: 'Pernambuco',
  PI: 'Piauí', PR: 'Paraná', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RO: 'Rondônia', RR: 'Roraima', RS: 'Rio Grande do Sul', SC: 'Santa Catarina',
  SE: 'Sergipe', SP: 'São Paulo', TO: 'Tocantins',
};

type Params = { uf: string };

export async function generateStaticParams() {
  const stats = getEstatisticasRede();
  return Object.keys(stats.porUF).map((uf) => ({ uf: uf.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uf } = await params;
  const ufUpper = uf.toUpperCase();
  if (!UFS_VALIDAS.includes(ufUpper as (typeof UFS_VALIDAS)[number])) {
    return { title: 'Rede não encontrada' };
  }
  const ufNome = UF_NOMES[ufUpper] ?? ufUpper;
  const stats = getEstatisticasByUF(ufUpper);

  return {
    title: `Rede Credenciada Amil em ${ufNome} | ${stats.totalPrestadores} prestadores`,
    description: `${stats.totalPrestadores} prestadores credenciados Amil em ${stats.totalMunicipios} municípios de ${ufNome}. Hospitais, laboratórios, clínicas e mais.`,
    alternates: { canonical: `/rede/${uf.toLowerCase()}` },
  };
}

export default async function RedeUfPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uf } = await params;
  const ufUpper = uf.toUpperCase();
  if (!UFS_VALIDAS.includes(ufUpper as (typeof UFS_VALIDAS)[number])) notFound();

  const stats = getEstatisticasByUF(ufUpper);
  if (stats.totalPrestadores === 0) notFound();

  const municipios = getMunicipiosByUf(ufUpper);
  const ufNome = UF_NOMES[ufUpper] ?? ufUpper;

  // JSON-LD schema markup
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Rede Credenciada Amil em ${ufNome}`,
    numberOfItems: municipios.length,
    itemListElement: municipios.slice(0, 50).map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Place',
        name: m.municipio,
        address: { '@type': 'PostalAddress', addressRegion: ufUpper, addressCountry: 'BR' },
        url: `/rede/${m.ufSlug}/${m.cidadeSlug}`,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Rede Credenciada', item: '/rede-credenciada' },
      { '@type': 'ListItem', position: 3, name: ufNome, item: `/rede/${uf.toLowerCase()}` },
    ],
  };

  const tipoLabels: Record<string, string> = {
    Hospital: '🏥 Hospitais',
    Laboratório: '🧪 Laboratórios',
    Clínica: '🏛 Clínicas',
    'Diagnóstico por Imagem': '📷 Imagem',
    Maternidade: '👶 Maternidades',
    'Pronto-Socorro': '🚑 Pronto-Socorro',
    'Centro/Instituto': '🏢 Centros',
    Odontologia: '🦷 Odontologia',
    Outro: '📍 Outros',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb visual */}
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Início</Link>
            <span className="mx-2">›</span>
            <Link href="/rede-credenciada" className="hover:text-blue-600">Rede Credenciada</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{ufNome}</span>
          </nav>

          <header>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Rede Credenciada Amil em {ufNome}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              <strong className="text-gray-900">
                {stats.totalPrestadores.toLocaleString('pt-BR')} prestadores
              </strong>{' '}
              credenciados em{' '}
              <strong className="text-gray-900">{stats.totalMunicipios} municípios</strong> de {ufNome}.
            </p>
          </header>

          {/* Distribuição por tipo */}
          <section className="mt-8 rounded-lg bg-blue-50 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Distribuição por tipo de prestador
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {Object.entries(stats.porTipo)
                .filter(([, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([tipo, count]) => (
                  <div key={tipo} className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm">
                    <span className="text-gray-700">{tipoLabels[tipo] ?? tipo}</span>
                    <strong className="text-gray-900">{count.toLocaleString('pt-BR')}</strong>
                  </div>
                ))}
            </div>
          </section>

          {/* Municípios */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Municípios em {ufNome} ({municipios.length})
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Ordenados por número de prestadores credenciados.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {municipios.map((m) => (
                <li key={m.cidadeSlug}>
                  <Link
                    href={`/rede/${m.ufSlug}/${m.cidadeSlug}`}
                    className="block rounded-lg border border-gray-200 bg-white px-4 py-3 transition hover:border-blue-500 hover:shadow-sm"
                  >
                    <div className="font-semibold text-gray-900">{m.municipio}</div>
                    <div className="mt-1 text-sm text-gray-500">
                      {m.totalPrestadores.toLocaleString('pt-BR')} prestadores
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Disclaimer */}
          <footer className="mt-12 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Aviso:</strong> Rede sujeita a alterações pela operadora. Confirme via app oficial Amil
            antes de uso. Última atualização do dataset: <time>26/04/2026</time>. Operado por corretor
            autorizado a intermediar planos da Amil Assistência Médica Internacional S.A. (registro ANS nº
            326305).
          </footer>
        </div>
      </section>
    </>
  );
}
