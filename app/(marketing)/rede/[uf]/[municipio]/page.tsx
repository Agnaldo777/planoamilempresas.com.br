import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getMunicipios,
  getMunicipioBySlug,
  getPrestadoresPorMunicipio,
  getBairrosDoMunicipio,
  getBairrosViaveisPorCidade,
  getDatasetMetadata,
} from '@/lib/operadoras/amil/rede-credenciada-loader';
import { ufNome, tituloLocal } from '@/lib/uf';
import { TIPO_SLUG_TO_INFERIDO } from '@/config/seo';
import {
  DISCLAIMER_AMIL_REDE,
  ORGANIZATION_JSONLD_DEFAULTS,
} from '@/content/disclaimers/amil-rede';
import { CorretorLocalCard } from '@/components/ui/CorretorLocalCard';

export const revalidate = 2592000; // 30 dias

type Params = { uf: string; municipio: string };

// Mapa inverso tipoInferido → slug de URL (Story 7.8) para internal linking.
const INFERIDO_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(TIPO_SLUG_TO_INFERIDO).map(([slug, inf]) => [inf, slug])
);

const TIPO_LABELS: Record<string, string> = {
  Hospital: '🏥', Laboratório: '🧪', Clínica: '🏛',
  'Diagnóstico por Imagem': '📷', Maternidade: '👶',
  'Pronto-Socorro': '🚑', 'Centro/Instituto': '🏢',
  Odontologia: '🦷', Outro: '📍',
};

export async function generateStaticParams() {
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
  const cidade = tituloLocal(m.municipio);
  const nomeUf = ufNome(m.uf);

  return {
    title: `Rede Credenciada Amil em ${cidade}, ${m.uf} — ${m.totalPrestadores} Prestadores 2026`,
    description:
      `Veja os ${m.totalPrestadores} prestadores credenciados Amil em ${cidade} (${nomeUf}): ` +
      `hospitais, laboratórios e clínicas por bairro. Planos empresariais e MEI — cotação online.`,
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

  const ufLower = uf.toLowerCase();
  const prestadores = getPrestadoresPorMunicipio(uf, municipio);
  const bairros = getBairrosDoMunicipio(prestadores);
  const bairrosViaveis = getBairrosViaveisPorCidade(uf, municipio);
  const cidade = tituloLocal(m.municipio);
  const nomeUf = ufNome(m.uf);
  const { geradoEm } = getDatasetMetadata();
  const dataFormatada = new Date(geradoEm).toLocaleDateString('pt-BR');

  const porTipo: Record<string, number> = {};
  for (const p of prestadores) {
    porTipo[p.tipoInferido] = (porTipo[p.tipoInferido] ?? 0) + 1;
  }
  const tiposOrdenados = Object.entries(porTipo)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1]);

  const totalHospitais = porTipo['Hospital'] ?? 0;
  const cotacaoHref = `/cotacao-online?uf=${ufLower}&cidade=${municipio}`;

  const faqs = [
    {
      pergunta: `Quantos prestadores Amil há em ${cidade}?`,
      resposta:
        `A rede credenciada Amil em ${cidade} (${nomeUf}) reúne ` +
        `${prestadores.length.toLocaleString('pt-BR')} prestadores` +
        (totalHospitais > 0 ? `, sendo ${totalHospitais} hospitais` : '') +
        `, distribuídos em ${bairros.length} bairros. A rede está sujeita a alterações — ` +
        `confirme no app oficial Amil antes do atendimento.`,
    },
    {
      pergunta: `A Amil aceita MEI e empresas em ${cidade}?`,
      resposta:
        `Sim. O plano Amil empresarial pode ser contratado por MEI (CNPJ ativo há pelo menos ` +
        `180 dias), ME, EPP e empresas de qualquer porte em ${cidade}. A partir de 2 vidas já é ` +
        `possível contratar nas linhas Selecionada (S380, S450, S750) ou Clássica.`,
    },
    {
      pergunta: `Como contratar um plano Amil com cobertura em ${cidade}?`,
      resposta:
        `A contratação é feita por meio de corretor autorizado (SUSEP). Informe CNPJ, número de ` +
        `vidas e perfil etário para receber uma cotação personalizada com a rede de ${cidade}. ` +
        `O preço varia por faixa etária e porte — não há tabela pública fixa.`,
    },
    {
      pergunta: `Quais planos Amil têm rede em ${cidade}?`,
      resposta:
        `As linhas nacionais (S380, S450, S750 e One) têm cobertura em ${cidade} conforme a rede ` +
        `de cada produto. Planos de linha superior costumam ampliar o acesso a hospitais de ` +
        `referência. Veja a rede por produto e solicite a comparação na cotação.`,
    },
  ];

  // ── Schema markup ──────────────────────────────────────────────────────
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Prestadores credenciados Amil em ${cidade}, ${m.uf}`,
    numberOfItems: prestadores.length,
    itemListElement: prestadores.slice(0, 100).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'MedicalOrganization',
        name: p.nome,
        address: {
          '@type': 'PostalAddress',
          addressLocality: cidade,
          addressRegion: p.uf,
          ...(p.bairro && { streetAddress: tituloLocal(p.bairro) }),
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
      { '@type': 'ListItem', position: 3, name: nomeUf, item: `/rede/${ufLower}` },
      { '@type': 'ListItem', position: 4, name: cidade, item: `/rede/${ufLower}/${municipio.toLowerCase()}` },
    ],
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
      {[itemListSchema, breadcrumbSchema, faqSchema, organizationSchema].map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 rounded border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
            {DISCLAIMER_AMIL_REDE}
          </p>

          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Início</Link>
            <span className="mx-2">›</span>
            <Link href="/rede-credenciada" className="hover:text-blue-600">Rede Credenciada</Link>
            <span className="mx-2">›</span>
            <Link href={`/rede/${ufLower}`} className="hover:text-blue-600">{nomeUf}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{cidade}</span>
          </nav>

          <header>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Rede Credenciada Amil em {cidade}, {m.uf}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              <strong className="text-gray-900">
                {prestadores.length.toLocaleString('pt-BR')} prestadores
              </strong>{' '}
              credenciados em <strong className="text-gray-900">{bairros.length} bairros</strong> de {cidade}.
            </p>
          </header>

          {/* CTA */}
          <div className="mt-6">
            <Link href={cotacaoHref} className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Cotar plano Amil em {cidade} →
            </Link>
          </div>

          {/* Stats por tipo — com link para a página tipo×cidade (7.8) */}
          <section className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {tiposOrdenados.map(([tipo, count]) => {
              const slug = INFERIDO_TO_SLUG[tipo];
              const inner = (
                <>
                  <div className="text-2xl">{TIPO_LABELS[tipo] ?? '📍'}</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">{count.toLocaleString('pt-BR')}</div>
                  <div className="text-xs text-gray-500">{tipo}</div>
                </>
              );
              return slug && count >= 3 ? (
                <Link key={tipo} href={`/${slug}/${ufLower}/${municipio}`} className="rounded-lg border border-gray-200 bg-white p-3 text-center transition hover:border-blue-500">
                  {inner}
                </Link>
              ) : (
                <div key={tipo} className="rounded-lg border border-gray-200 bg-white p-3 text-center">{inner}</div>
              );
            })}
          </section>

          {/* Conteúdo editorial único */}
          <section className="mt-10 max-w-3xl space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">Sobre a rede Amil em {cidade}</h2>
            <p>
              A <strong>rede credenciada Amil em {cidade}</strong> ({nomeUf}) conta com{' '}
              {prestadores.length.toLocaleString('pt-BR')} prestadores
              {totalHospitais > 0 ? `, incluindo ${totalHospitais} hospitais,` : ''} entre
              laboratórios, clínicas e centros de diagnóstico. A amplitude e a localização da rede são
              decisivas na hora de escolher a linha de plano ideal para a sua empresa.
            </p>
            <p>
              A contratação empresarial do Amil em {cidade} é feita por corretor autorizado e está
              disponível para <strong>MEI, ME e empresas de todos os portes</strong> com CNPJ ativo.
              As linhas nacionais — <strong>Amil S380, S450 e S750</strong> — oferecem cobertura em
              {' '}{cidade} com redes progressivamente mais amplas; a linha <strong>One</strong> agrega
              rede premium. Solicite a comparação na cotação para ver qual produto cobre os hospitais
              que a sua equipe precisa.
            </p>
            <p className="text-sm text-gray-500">
              Dados da rede atualizados em <time dateTime={geradoEm}>{dataFormatada}</time>. Tipos de
              prestador inferidos por análise do nome (precisão estimada 85-90%).
            </p>
          </section>

          {/* Top bairros — com link para a página de bairro (7.6) */}
          {bairrosViaveis.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900">Rede Amil por bairro em {cidade}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {bairrosViaveis.slice(0, 16).map((b) => (
                  <Link
                    key={b.slug}
                    href={`/rede/${ufLower}/${municipio}/bairro/${b.slug}`}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-900 transition hover:bg-blue-200"
                  >
                    {tituloLocal(b.bairro)} <strong>({b.total})</strong>
                  </Link>
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
                <li key={p.codigo} className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4">
                  <span className="text-2xl">{TIPO_LABELS[p.tipoInferido] ?? '📍'}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{p.nome}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {p.bairro && (<><span>{tituloLocal(p.bairro)}</span><span className="mx-2">·</span></>)}
                      <span>{cidade}, {p.uf}</span>
                      <span className="mx-2">·</span>
                      <span className="text-gray-400">{p.tipoInferido}</span>
                    </p>
                    {p.redes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.redes.slice(0, 5).map((r) => (
                          <span key={r} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{r}</span>
                        ))}
                        {p.redes.length > 5 && (<span className="text-xs text-gray-400">+{p.redes.length - 5}</span>)}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {prestadores.length > 100 && (
              <p className="mt-4 text-sm text-gray-500">
                Exibindo 100 de {prestadores.length.toLocaleString('pt-BR')} prestadores. Solicite a lista
                completa na cotação.
              </p>
            )}
          </section>

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Perguntas frequentes — Amil em {cidade}</h2>
            <dl className="mt-6 space-y-6">
              {faqs.map((f) => (
                <div key={f.pergunta}>
                  <dt className="font-semibold text-gray-900">{f.pergunta}</dt>
                  <dd className="mt-2 text-gray-700">{f.resposta}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Corretor local — E-E-A-T + NAP (Nível 1 da estratégia geo-corretor) */}
          <CorretorLocalCard cidade={cidade} uf={ufLower.toUpperCase()} />

          {/* CTA final + internal linking */}
          <div className="mt-12 rounded-lg bg-blue-600 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Plano Amil para empresas em {cidade}</h2>
            <p className="mt-2 text-blue-100">Cotação personalizada por CNPJ — inclusive MEI.</p>
            <Link href={cotacaoHref} className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
              Solicitar cotação →
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Veja também a{' '}
            <Link href={`/rede/${ufLower}`} className="text-blue-600 hover:underline">rede Amil em todo o {nomeUf}</Link>{' '}
            ou a <Link href="/planos" className="text-blue-600 hover:underline">comparação de planos Amil</Link>.
          </p>

          {/* Disclaimer */}
          <footer className="mt-12 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Aviso:</strong> {DISCLAIMER_AMIL_REDE} Rede sujeita a alterações — confirme no app
            oficial Amil. Última atualização do dataset: <time dateTime={geradoEm}>{dataFormatada}</time>.
          </footer>
        </div>
      </section>
    </>
  );
}
