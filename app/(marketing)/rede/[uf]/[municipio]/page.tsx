import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getMunicipios,
  getMunicipioBySlug,
  getPrestadoresPorMunicipio,
  getBairrosDoMunicipio,
} from '@/lib/operadoras/amil/rede-credenciada-loader';

export const revalidate = 2592000; // 30 dias

const UF_NOMES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AM: 'Amazonas', AP: 'Amapá',
  BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo',
  GO: 'Goiás', MA: 'Maranhão', MG: 'Minas Gerais', MS: 'Mato Grosso do Sul',
  MT: 'Mato Grosso', PA: 'Pará', PB: 'Paraíba', PE: 'Pernambuco',
  PI: 'Piauí', PR: 'Paraná', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RO: 'Rondônia', RR: 'Roraima', RS: 'Rio Grande do Sul', SC: 'Santa Catarina',
  SE: 'Sergipe', SP: 'São Paulo', TO: 'Tocantins',
};

type Params = { uf: string; municipio: string };

export async function generateStaticParams() {
  // Top-50 municípios SSG full (ADR-005 v2 + Build Performance recalibrado)
  const top50 = getMunicipios().slice(0, 50);
  return top50.map((m) => ({ uf: m.ufSlug, municipio: m.cidadeSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uf, municipio } = await params;
  const m = getMunicipioBySlug(uf, municipio);
  if (!m) return { title: 'Município não encontrado' };
  const ufNome = UF_NOMES[m.uf] ?? m.uf;

  return {
    title: `Rede Credenciada Amil em ${m.municipio}, ${m.uf} | ${m.totalPrestadores} prestadores`,
    description: `${m.totalPrestadores} prestadores credenciados Amil em ${m.municipio} (${ufNome}). Hospitais, laboratórios, clínicas. Atualizado em abril/2026.`,
    alternates: { canonical: `/rede/${uf.toLowerCase()}/${municipio.toLowerCase()}` },
  };
}

export default async function RedeMunicipioPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uf, municipio } = await params;
  const m = getMunicipioBySlug(uf, municipio);
  if (!m) notFound();

  const prestadores = getPrestadoresPorMunicipio(uf, municipio);
  const bairros = getBairrosDoMunicipio(prestadores);
  const ufNome = UF_NOMES[m.uf] ?? m.uf;

  // Distribuição por tipo no município
  const porTipo: Record<string, number> = {};
  for (const p of prestadores) {
    porTipo[p.tipoInferido] = (porTipo[p.tipoInferido] ?? 0) + 1;
  }

  // Schema markup
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Prestadores credenciados Amil em ${m.municipio}, ${m.uf}`,
    numberOfItems: prestadores.length,
    itemListElement: prestadores.slice(0, 100).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'MedicalOrganization',
        name: p.nome,
        address: {
          '@type': 'PostalAddress',
          addressLocality: p.municipio,
          addressRegion: p.uf,
          ...(p.bairro && { streetAddress: p.bairro }),
          addressCountry: 'BR',
        },
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
      { '@type': 'ListItem', position: 4, name: m.municipio, item: `/rede/${uf.toLowerCase()}/${municipio.toLowerCase()}` },
    ],
  };

  const tipoLabels: Record<string, string> = {
    Hospital: '🏥', Laboratório: '🧪', Clínica: '🏛',
    'Diagnóstico por Imagem': '📷', Maternidade: '👶',
    'Pronto-Socorro': '🚑', 'Centro/Instituto': '🏢',
    Odontologia: '🦷', Outro: '📍',
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
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Início</Link>
            <span className="mx-2">›</span>
            <Link href="/rede-credenciada" className="hover:text-blue-600">Rede Credenciada</Link>
            <span className="mx-2">›</span>
            <Link href={`/rede/${uf.toLowerCase()}`} className="hover:text-blue-600">{ufNome}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{m.municipio}</span>
          </nav>

          <header>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Rede Credenciada Amil em {m.municipio}, {m.uf}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              <strong className="text-gray-900">
                {prestadores.length.toLocaleString('pt-BR')} prestadores
              </strong>{' '}
              credenciados em <strong className="text-gray-900">{bairros.length} bairros</strong> de{' '}
              {m.municipio}.
            </p>
          </header>

          {/* Stats por tipo */}
          <section className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {Object.entries(porTipo)
              .filter(([, c]) => c > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([tipo, count]) => (
                <div
                  key={tipo}
                  className="rounded-lg border border-gray-200 bg-white p-3 text-center"
                >
                  <div className="text-2xl">{tipoLabels[tipo] ?? '📍'}</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">
                    {count.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-xs text-gray-500">{tipo}</div>
                </div>
              ))}
          </section>

          {/* Top bairros */}
          {bairros.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Bairros mais cobertos
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {bairros.slice(0, 12).map((b) => (
                  <span
                    key={b.bairro}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-900"
                  >
                    {b.bairro} <strong>({b.total})</strong>
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Lista de prestadores */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Lista de prestadores ({prestadores.length})
            </h2>
            <ul className="mt-6 grid gap-3">
              {prestadores.slice(0, 100).map((p) => (
                <li
                  key={p.codigo}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4"
                >
                  <span className="text-2xl">{tipoLabels[p.tipoInferido] ?? '📍'}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{p.nome}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {p.bairro && (
                        <>
                          <span>{p.bairro}</span>
                          <span className="mx-2">·</span>
                        </>
                      )}
                      <span>{p.municipio}, {p.uf}</span>
                      <span className="mx-2">·</span>
                      <span className="text-gray-400">{p.tipoInferido}</span>
                    </p>
                    {p.redes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.redes.slice(0, 5).map((r) => (
                          <span
                            key={r}
                            className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                          >
                            {r}
                          </span>
                        ))}
                        {p.redes.length > 5 && (
                          <span className="text-xs text-gray-400">+{p.redes.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {prestadores.length > 100 && (
              <p className="mt-4 text-sm text-gray-500">
                Exibindo 100 de {prestadores.length.toLocaleString('pt-BR')} prestadores. Paginação completa
                em desenvolvimento (Story 7.5).
              </p>
            )}
          </section>

          {/* Disclaimer */}
          <footer className="mt-12 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Aviso:</strong> Rede sujeita a alterações pela operadora. Confirme via app oficial Amil
            antes de uso. Última atualização: <time>26/04/2026</time>. Tipos de prestador inferidos via
            análise do nome — precisão estimada 85-90%. Operado por corretor autorizado a intermediar planos
            da Amil Assistência Médica Internacional S.A. (registro ANS nº 326305).
          </footer>
        </div>
      </section>
    </>
  );
}
