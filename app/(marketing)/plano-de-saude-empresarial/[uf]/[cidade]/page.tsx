/**
 * Rota `/plano-de-saude-empresarial/[uf]/[cidade]` — Nível 2 da estratégia
 * geo-corretor (plano Atlas 2026-06-14).
 *
 * Páginas de CIDADE DENSAS (não thin): top 30 municípios por nº de prestadores
 * reais. Cada página usa dado proprietário — hospitais nominais do dataset,
 * contagens reais por tipo, tabela de preço da UF, corretor local. Intent
 * TRANSACIONAL ("plano de saúde empresarial em [cidade]"), distinto da página
 * de rede (`/rede/[uf]/[municipio]`, intent "rede credenciada"), para a qual
 * faz cross-link em vez de competir.
 *
 * Anti-thin: só top-30 (densidade garantida); conteúdo único por cidade vem do
 * dataset. ADR-006: slug sem "amil"; Organization=BeneficioRH; disclaimer ANS.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildOpenGraphMetadata } from '@/components/seo/OpenGraph';
import {
  getTopMunicipios,
  getMunicipioBySlug,
  getPrestadoresPorMunicipio,
  type PrestadorAmil,
} from '@/lib/operadoras/amil/rede-credenciada-loader';
import { ufNome } from '@/lib/uf';
import { getPlanosDoEstado, type PlanoAmil } from '@/data/tabelas-amil';
import { CorretorLocalCard } from '@/components/ui/CorretorLocalCard';
import {
  DISCLAIMER_AMIL_REDE,
  ORGANIZATION_JSONLD_DEFAULTS,
} from '@/content/disclaimers/amil-rede';

export const revalidate = 2592000; // 30 dias

/** Quantas cidades densas gerar (top N por nº de prestadores). */
const TOP_CIDADES = 30;

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function generateStaticParams() {
  return getTopMunicipios(TOP_CIDADES).map((m) => ({
    uf: m.ufSlug,
    cidade: m.cidadeSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uf: string; cidade: string }>;
}): Promise<Metadata> {
  const { uf, cidade } = await params;
  const municipio = getMunicipioBySlug(uf, cidade);
  if (!municipio) return {};

  const title = `Plano de Saúde Empresarial em ${municipio.municipio} (${municipio.uf}) 2026 | Amil PJ`;
  const description =
    `Plano de saúde Amil empresarial em ${municipio.municipio}/${municipio.uf}: ${municipio.totalPrestadores} ` +
    `prestadores credenciados, cotação por CNPJ a partir de 2 vidas (MEI/PME) e corretor autorizado SUSEP. ` +
    `Veja hospitais da rede e valores de referência.`;

  return {
    title,
    description,
    ...buildOpenGraphMetadata({ title, description, type: 'website' }),
    alternates: { canonical: `/plano-de-saude-empresarial/${uf}/${cidade}` },
    robots: { index: true, follow: true },
  };
}

export default async function PlanoCidadePage({
  params,
}: {
  params: Promise<{ uf: string; cidade: string }>;
}) {
  const { uf, cidade } = await params;
  const municipio = getMunicipioBySlug(uf, cidade);
  if (!municipio) notFound();

  const nomeCidade = municipio.municipio;
  const ufUpper = municipio.uf;
  const nomeUf = ufNome(ufUpper);
  const prestadores = getPrestadoresPorMunicipio(uf, cidade);

  // Hospitais-âncora reais (nominais) — destaque editorial.
  const hospitais = prestadores
    .filter((p) => p.tipoInferido === 'Hospital' || p.tipoInferido === 'Maternidade')
    .slice(0, 12);
  // Se a cidade tem poucos hospitais, complementa com clínicas/diagnóstico de destaque.
  const ancoras: PrestadorAmil[] =
    hospitais.length >= 4
      ? hospitais
      : [...hospitais, ...prestadores.filter((p) => !hospitais.includes(p)).slice(0, 8 - hospitais.length)];

  // Contagem por tipo (dado único da cidade).
  const porTipo = prestadores.reduce<Record<string, number>>((acc, p) => {
    acc[p.tipoInferido] = (acc[p.tipoInferido] ?? 0) + 1;
    return acc;
  }, {});

  // Preços reais da UF (plano de entrada), se houver tabela para o estado.
  const planosUf = getPlanosDoEstado(ufUpper);
  const planoEntrada: PlanoAmil | null =
    planosUf.length > 0
      ? planosUf.reduce((min, p) => (p.precos['29 a 33'] < min.precos['29 a 33'] ? p : min))
      : null;
  const faixasMostrar: { faixa: '00 a 18' | '29 a 33' | '44 a 48' | '59 ou +'; label: string }[] = [
    { faixa: '00 a 18', label: 'Até 18 anos' },
    { faixa: '29 a 33', label: '29 a 33 anos' },
    { faixa: '44 a 48', label: '44 a 48 anos' },
    { faixa: '59 ou +', label: '59 anos ou +' },
  ];

  const cotacaoHref = `/cotacao-online?uf=${uf}&cidade=${cidade}`;
  const redeHref = `/rede/${uf}/${cidade}`;

  const faqs = [
    {
      pergunta: `Qual o melhor plano de saúde empresarial em ${nomeCidade}?`,
      resposta:
        `Depende dos hospitais que sua equipe quer usar em ${nomeCidade}. A Amil tem ${municipio.totalPrestadores} ` +
        `prestadores credenciados na cidade, das linhas de entrada (S380) às premium (One). O ideal é comparar a rede ` +
        `por hospital e cotar por CNPJ — a partir de 2 vidas, inclusive MEI.`,
    },
    {
      pergunta: `Quanto custa o plano Amil empresarial em ${nomeCidade}?`,
      resposta: planoEntrada
        ? `Os valores de referência em ${nomeUf} partem de cerca de ${brl(planoEntrada.precos['29 a 33'])}/vida (faixa 29-33) ` +
          `no plano de entrada. O preço final depende do número de vidas, das idades e do porte — a cotação por CNPJ fecha o valor.`
        : `O valor depende da linha, do número de vidas e das idades. A contratação empresarial parte de 2 vidas (inclusive MEI) ` +
          `e a cotação por CNPJ define o preço exato para ${nomeCidade}.`,
    },
    {
      pergunta: `MEI pode contratar plano Amil em ${nomeCidade}?`,
      resposta:
        `Sim. MEI com CNPJ ativo há pelo menos 180 dias contrata o Amil na modalidade empresarial em ${nomeCidade}, ` +
        `geralmente a partir de 2 vidas — em média 30% a 40% mais barato que o plano individual com a mesma rede.`,
    },
  ];

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
      { '@type': 'ListItem', position: 2, name: 'Plano de Saúde Empresarial', item: '/empresarial' },
      { '@type': 'ListItem', position: 3, name: `${nomeCidade}/${ufUpper}`, item: `/plano-de-saude-empresarial/${uf}/${cidade}` },
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
            <Link href="/empresarial" className="hover:text-white">Empresarial</Link>
            <span className="mx-2">›</span>
            <span className="text-white">{nomeCidade}/{ufUpper}</span>
          </nav>
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Plano de Saúde Empresarial Amil em {nomeCidade}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            {municipio.totalPrestadores} prestadores Amil credenciados em {nomeCidade}/{ufUpper}.
            Cotação por CNPJ a partir de 2 vidas (MEI e PME), com atendimento de corretor autorizado.
          </p>
          <Link href={cotacaoHref} className="mt-7 inline-block rounded-lg bg-cta-green px-7 py-3.5 text-lg font-semibold text-white hover:bg-cta-green-hover">
            Cotar plano em {nomeCidade} →
          </Link>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Resposta direta (AIO) */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-gray-800">
            <p>
              <strong>Plano de saúde empresarial Amil em {nomeCidade}:</strong> a rede tem{' '}
              <strong>{municipio.totalPrestadores} prestadores credenciados</strong> na cidade
              {ancoras.length > 0 && (
                <>, incluindo {ancoras.slice(0, 3).map((h) => h.nome).join(', ')}</>
              )}
              . A contratação é empresarial (CNPJ), a partir de 2 vidas — inclusive MEI — e em média
              30% a 40% mais barata que o plano individual com a mesma rede.
            </p>
          </div>

          {/* Hospitais-âncora reais */}
          {ancoras.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Hospitais e prestadores Amil em {nomeCidade}
              </h2>
              <p className="mt-2 text-gray-600">
                Alguns dos estabelecimentos credenciados na cidade (rede sujeita à linha contratada):
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {ancoras.map((h) => (
                  <Link
                    key={h.slug}
                    href={`/rede/${uf}/${cidade}/${h.slug}`}
                    className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-400 hover:shadow-sm"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{h.tipoInferido}</span>
                    <p className="mt-1 font-semibold text-slate-900">{h.nome}</p>
                    {h.bairro && <p className="text-sm text-gray-500">{h.bairro}</p>}
                  </Link>
                ))}
              </div>
              <Link href={redeHref} className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
                Ver a rede credenciada completa em {nomeCidade} →
              </Link>
            </section>
          )}

          {/* Stats por tipo (dado único da cidade) */}
          <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(porTipo)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([tipo, n]) => (
                <div key={tipo} className="rounded-lg bg-slate-50 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">{n}</div>
                  <div className="mt-1 text-xs text-slate-600">{tipo}</div>
                </div>
              ))}
          </section>

          {/* Tabela de preço da UF (real), se houver */}
          {planoEntrada && (
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Valores de referência em {nomeUf} ({planoEntrada.nome})
              </h2>
              <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-700">Faixa etária</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Valor de referência/vida*</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faixasMostrar.map((f) => (
                      <tr key={f.faixa} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-gray-700">{f.label}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{brl(planoEntrada.precos[f.faixa])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                * Valores de referência do plano de entrada em {nomeUf}, sujeitos a cotação por CNPJ, número de vidas e porte.{' '}
                <Link href="/calculadora-economia" className="text-blue-600 hover:underline">Calcule sua economia PJ vs PF</Link>.
              </p>
            </section>
          )}

          {/* Corretor local (E-E-A-T) */}
          <CorretorLocalCard cidade={nomeCidade} uf={ufUpper} />

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Perguntas frequentes — Amil empresarial em {nomeCidade}</h2>
            <dl className="mt-6 space-y-6">
              {faqs.map((f) => (
                <div key={f.pergunta}>
                  <dt className="font-semibold text-gray-900">{f.pergunta}</dt>
                  <dd className="mt-2 text-gray-700">{f.resposta}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Cross-link */}
          <p className="mt-10 text-sm text-gray-600">
            Veja a <Link href={redeHref} className="text-blue-600 hover:underline">rede credenciada Amil em {nomeCidade}</Link>,
            os <Link href="/empresarial" className="text-blue-600 hover:underline">planos por porte</Link> ou
            a <Link href="/tabela-de-precos" className="text-blue-600 hover:underline">tabela de preços</Link>.
          </p>

          <footer className="mt-10 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Aviso:</strong> {DISCLAIMER_AMIL_REDE} Rede e valores sujeitos a alteração — confirme na cotação.
          </footer>
        </div>
      </section>
    </>
  );
}
