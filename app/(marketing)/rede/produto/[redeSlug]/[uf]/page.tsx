import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getRedeUfCombosViaveis,
  getEstatisticasRedeUF,
  getPrestadoresPorRedeUF,
  getDatasetMetadata,
} from '@/lib/operadoras/amil/rede-credenciada-loader';
import { redeFromSlug } from '@/lib/operadoras/amil/slugs';
import { isUfValida, ufNome } from '@/lib/uf';
import { MIN_PRESTADORES_REDE_UF, ITEMLIST_MAX_PRESTADORES } from '@/config/seo';
import { buildClusterEFaqs } from '@/content/cluster-e-faq';
import {
  DISCLAIMER_AMIL_REDE,
  AMIL_RAZAO_SOCIAL,
  AMIL_ANS_REGISTRO,
  AMIL_SITE_OFICIAL,
  ORGANIZATION_JSONLD_DEFAULTS,
} from '@/content/disclaimers/amil-rede';

// Story 7.7 (Cluster E rede × UF) — ADR-006 Accepted (stakeholder, 2026-06-08).
export const revalidate = 2592000; // 30 dias (ISR — ADR-005 v2)
// dynamicParams=true: combos inválidos caem no notFound() interno (redeFromSlug
// null / total < MIN). dynamicParams=false quebra o roteamento SSG no OpenNext/CF.
export const dynamicParams = true;

type Params = { redeSlug: string; uf: string };

const TIPO_LABELS: Record<string, string> = {
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

/**
 * Nome de exibição da rede a partir do nome canônico (UPPER).
 * Mantém códigos (S750), siglas (QP/QC) e UFs em maiúsculas; Title Case no resto.
 */
function redeLabel(redeNome: string): string {
  return redeNome
    .split(' ')
    .map((token) => {
      if (/\d/.test(token) || token.length <= 2) return token;
      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join(' ');
}

export async function generateStaticParams(): Promise<Params[]> {
  return getRedeUfCombosViaveis(MIN_PRESTADORES_REDE_UF);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { redeSlug, uf } = await params;
  const rede = redeFromSlug(redeSlug);
  if (!rede || !isUfValida(uf)) return { title: 'Rede não encontrada' };

  const label = redeLabel(rede);
  const nome = ufNome(uf);
  const stats = getEstatisticasRedeUF(rede, uf);

  return {
    title: `Plano Amil ${label} em ${nome} — ${stats.totalPrestadores} Prestadores Credenciados`,
    description:
      `Rede credenciada do Amil ${label} em ${nome}: ${stats.totalPrestadores} prestadores ` +
      `em ${stats.topCidades.length} cidades. Hospitais, laboratórios e clínicas. Cotação PJ.`,
    alternates: { canonical: `/rede/produto/${redeSlug}/${uf.toLowerCase()}` },
  };
}

export default async function RedeUfClusterEPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { redeSlug, uf } = await params;
  const rede = redeFromSlug(redeSlug);
  if (!rede || !isUfValida(uf)) notFound();

  const stats = getEstatisticasRedeUF(rede, uf);
  if (stats.totalPrestadores < MIN_PRESTADORES_REDE_UF) notFound();

  const label = redeLabel(rede);
  const nome = ufNome(uf);
  const ufLower = uf.toLowerCase();
  const prestadores = getPrestadoresPorRedeUF(rede, uf);
  const topPrestadores = prestadores.slice(0, ITEMLIST_MAX_PRESTADORES);
  const topCidades = stats.topCidades.slice(0, 8);
  const { geradoEm } = getDatasetMetadata();
  const dataFormatada = new Date(geradoEm).toLocaleDateString('pt-BR');

  const faqs = buildClusterEFaqs(
    label,
    nome,
    stats.totalPrestadores,
    stats.topCidades.map((c) => c.municipio)
  );

  const cotacaoHref =
    `/cotacao-online?produto=${encodeURIComponent(rede)}` +
    `&uf=${ufLower}&cluster=cluster-e`;

  // ── JSON-LD (ADR-006 mit. 2: Organization.sameAs) ──────────────────────
  const healthPlanSchema = {
    '@context': 'https://schema.org',
    '@type': 'HealthInsurancePlan',
    name: `Amil ${label}`,
    provider: { '@type': 'Organization', name: 'Amil Assistência Médica' },
    areaServed: { '@type': 'State', name: nome },
    usesHealthPlanIdStandard: `ANS ${AMIL_ANS_REGISTRO}`,
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Prestadores Amil ${label} em ${nome}`,
    numberOfItems: prestadores.length,
    itemListElement: topPrestadores.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'MedicalOrganization',
        name: p.nome,
        address: {
          '@type': 'PostalAddress',
          addressLocality: p.municipio,
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
      { '@type': 'ListItem', position: 2, name: 'Rede Credenciada', item: '/rede-credenciada' },
      { '@type': 'ListItem', position: 3, name: nome, item: `/rede/${ufLower}` },
      { '@type': 'ListItem', position: 4, name: `Amil ${label}`, item: `/rede/produto/${redeSlug}/${ufLower}` },
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
      {[healthPlanSchema, itemListSchema, faqSchema, breadcrumbSchema, organizationSchema].map(
        (schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )
      )}

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Disclaimer canônico — topo (ADR-006 mit. 1) */}
          <p className="mb-6 rounded border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
            {DISCLAIMER_AMIL_REDE}
          </p>

          {/* Breadcrumb visual */}
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Início</Link>
            <span className="mx-2">›</span>
            <Link href="/rede-credenciada" className="hover:text-blue-600">Rede Credenciada</Link>
            <span className="mx-2">›</span>
            <Link href={`/rede/${ufLower}`} className="hover:text-blue-600">{nome}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Amil {label}</span>
          </nav>

          <header>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Plano Amil {label} em {nome}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              <strong className="text-gray-900">
                {stats.totalPrestadores.toLocaleString('pt-BR')} prestadores
              </strong>{' '}
              credenciados ao Amil {label} em{' '}
              <strong className="text-gray-900">{stats.topCidades.length} cidades</strong> de {nome}.
            </p>
          </header>

          {/* CTA principal */}
          <div className="mt-6">
            <Link
              href={cotacaoHref}
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Solicitar cotação do Amil {label} em {nome} →
            </Link>
          </div>

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
                  <div
                    key={tipo}
                    className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm"
                  >
                    <span className="text-gray-700">{TIPO_LABELS[tipo] ?? tipo}</span>
                    <strong className="text-gray-900">{count.toLocaleString('pt-BR')}</strong>
                  </div>
                ))}
            </div>
          </section>

          {/* Top cidades */}
          {topCidades.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Principais cidades com Amil {label} em {nome}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {topCidades.map((c) => (
                  <Link
                    key={c.cidadeSlug}
                    href={`/rede/${ufLower}/${c.cidadeSlug}`}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm transition hover:border-blue-500"
                  >
                    {c.municipio}{' '}
                    <span className="text-gray-500">({c.total.toLocaleString('pt-BR')})</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Conteúdo editorial */}
          <section className="mt-10 max-w-3xl space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              Sobre a rede do Amil {label} em {nome}
            </h2>
            <p>
              O <strong>Amil {label}</strong> conta com{' '}
              {stats.totalPrestadores.toLocaleString('pt-BR')} prestadores credenciados em {nome},
              distribuídos entre hospitais, laboratórios, clínicas e centros de diagnóstico. Para
              empresas que avaliam o plano para seus colaboradores, a amplitude e a localização da
              rede são determinantes na escolha da linha ideal.
            </p>
            <p>
              A contratação do Amil {label} para empresas (PME e empresarial) é feita por meio de
              corretor autorizado, com análise de número de vidas, perfil etário e carências. O preço
              é personalizado — não há tabela pública fixa —, por isso recomendamos solicitar uma
              cotação para o perfil específico da sua empresa.
            </p>
            <p className="text-sm text-gray-500">
              Dados da rede atualizados em <time dateTime={geradoEm}>{dataFormatada}</time>. Rede
              sujeita a alterações pela operadora — confirme no app oficial Amil antes de utilizar.
            </p>
          </section>

          {/* Lista de prestadores (amostra) */}
          {topPrestadores.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Prestadores credenciados (amostra)
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {topPrestadores.map((p) => (
                  <li
                    key={p.codigo}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-3"
                  >
                    <div className="font-semibold text-gray-900">{p.nome}</div>
                    <div className="mt-1 text-sm text-gray-500">
                      {TIPO_LABELS[p.tipoInferido] ?? p.tipoInferido} · {p.municipio}
                    </div>
                  </li>
                ))}
              </ul>
              {prestadores.length > topPrestadores.length && (
                <p className="mt-4 text-sm text-gray-500">
                  Exibindo {topPrestadores.length} de{' '}
                  {prestadores.length.toLocaleString('pt-BR')} prestadores. Solicite a lista completa
                  na cotação.
                </p>
              )}
            </section>
          )}

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

          {/* CTA secundário */}
          <div className="mt-12 rounded-lg bg-blue-600 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">
              Cotação do Amil {label} para sua empresa
            </h2>
            <p className="mt-2 text-blue-100">
              Receba uma proposta personalizada para o perfil da sua empresa em {nome}.
            </p>
            <Link
              href={cotacaoHref}
              className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Solicitar cotação →
            </Link>
          </div>

          {/* Disclaimer canônico — rodapé (ADR-006 mit. 1) */}
          <footer className="mt-12 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Aviso:</strong> {DISCLAIMER_AMIL_REDE} Site independente —{' '}
            {AMIL_RAZAO_SOCIAL} mantém seus canais oficiais em{' '}
            <a href={AMIL_SITE_OFICIAL} className="underline" rel="nofollow noopener" target="_blank">
              amil.com.br
            </a>
            .
          </footer>
        </div>
      </section>
    </>
  );
}
