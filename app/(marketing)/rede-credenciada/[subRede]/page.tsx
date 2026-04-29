/**
 * Rota dinâmica `/rede-credenciada/[subRede]/` — Story 7.11 (FR44).
 *
 * Páginas dedicadas a sub-redes Amil:
 *   - /rede-credenciada/hospitais-dor/
 *   - /rede-credenciada/amil-one-rede-selecionada/
 *   - /rede-credenciada/amil-facil-rede-selecionada/
 *   - /rede-credenciada/classica/
 *   - /rede-credenciada/amil-medial/
 *
 * Cada página inclui:
 *   - Hero + tagline (anti-cookie-cutter NFR25)
 *   - Origem editorial (200 palavras únicas por sub-rede)
 *   - Lista de hospitais flagship (D'Or, One) ou top-30 prestadores (Clássica)
 *   - Tabela cobertura por estado
 *   - FAQ (4 perguntas)
 *   - Schema rich: Organization + HealthInsurancePlan + ItemList + FAQPage + Breadcrumb
 *
 * Compliance:
 *   - ADR-006: URL-as-Trademark (slugs qualificados; mitigações 5)
 *   - FR54: Organization sempre BeneficioRH (via SchemaGraph)
 *   - NFR21: schema 100% (HealthInsurancePlan, ItemList, FAQPage, Breadcrumb)
 *   - NFR25: anti-cookie-cutter (copy editorial única)
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { FAQAccordion, type FAQItem } from '@/components/seo/FAQAccordion'
import {
  SUB_REDE_SLUGS,
  getSubRedeBySlug,
  type SubRedeAmil,
  type SubRedeSlug,
} from '@/data/operadoras/amil/sub-redes-rede-credenciada'
import {
  getEstatisticasSubRede,
  getHospitaisFlagshipPorSubRede,
  getPrestadoresPorSubRede,
  isSubRedeViavel,
  MIN_PRESTADORES_SUB_REDE,
} from '@/lib/operadoras/amil/sub-redes-helpers'
import { getCurrentYear } from '@/lib/seo/title'
import { ORGANIZATION_NAME } from '@/lib/schema/organization'

// ISR 30 dias (alinhado com /rede/[uf]/page.tsx — pipeline mensal Story 7.10)
export const revalidate = 2592000
export const dynamic = 'force-static'

type Params = { subRede: string }

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br'

// ──────────────────────────────────────────────────────────────────
// generateStaticParams — 5 sub-redes ATIVAS
// ──────────────────────────────────────────────────────────────────

export function generateStaticParams(): Params[] {
  return SUB_REDE_SLUGS.map((slug) => ({ subRede: slug }))
}

// ──────────────────────────────────────────────────────────────────
// generateMetadata
// ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { subRede } = await params
  const sub = getSubRedeBySlug(subRede)
  if (!sub) {
    return { title: 'Sub-rede não encontrada' }
  }

  const stats = getEstatisticasSubRede(sub.slug)
  const ano = getCurrentYear()
  const viavel = isSubRedeViavel(sub.slug)

  const title = `Rede Credenciada Amil ${sub.nome} ${ano} | Hospitais e Cobertura`
  const description = viavel
    ? `${stats.totalPrestadores.toLocaleString('pt-BR')} prestadores credenciados na ${sub.nome} Amil em ${stats.totalUFs} UFs. ${sub.tagline}`
    : `Rede ${sub.nome} Amil — informações editoriais. Confirme cobertura via app oficial Amil.`

  return {
    title,
    description,
    alternates: { canonical: `/rede-credenciada/${sub.slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/rede-credenciada/${sub.slug}`,
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: viavel
      ? { index: true, follow: true }
      : { index: false, follow: true },
  }
}

// ──────────────────────────────────────────────────────────────────
// FAQs por sub-rede (anti-cookie-cutter — TODO @po Pax co-sign copy)
// ──────────────────────────────────────────────────────────────────

type FAQDraft = Pick<FAQItem, 'id' | 'question' | 'answer'>

function buildFaqsParaSubRede(sub: SubRedeAmil): FAQItem[] {
  const ano = getCurrentYear()
  const faqsBase: Record<SubRedeSlug, FAQDraft[]> = {
    'hospitais-dor': [
      {
        id: 'dor-1',
        question: `Quais hospitais D'Or estão na rede Amil em ${ano}?`,
        answer: `Os planos Amil Black, Amil One e Platinum Mais incluem acesso à Rede D'Or — Copa D'Or, Barra D'Or, Quinta D'Or, Norte D'Or, Hospital São Luiz (SP), Hospital Bangu, Hospital Niterói D'Or e demais unidades em RJ, SP, PR, BA, DF e SE. A lista completa está sujeita a alterações pela operadora; confirme pela rede credenciada Amil oficial antes de utilizar.`,
      },
      {
        id: 'dor-2',
        question: 'Por que a Rede D\'Or é considerada premium hospitalar?',
        answer:
          'A Rede D\'Or São Luiz é o maior grupo hospitalar privado do Brasil — adquirido pela UnitedHealth (controladora da Amil) em 2024. Reúne hospitais com infraestrutura Tier 1, centros oncológicos certificados e maternidades de alta complexidade. Para o decisor PJ, a inclusão da rede D\'Or é o principal moat dos produtos Amil Black e Amil One.',
      },
      {
        id: 'dor-3',
        question: 'Como contratar plano Amil com acesso à Rede D\'Or?',
        answer:
          'O acesso à rede D\'Or é restrito aos planos Amil Black (S6500), Amil One e Platinum Mais. Contrate via corretor autorizado SUSEP — solicite cotação personalizada informando perfil etário, número de vidas e UF de cobertura. Mensalidade média a partir de R$ 1.800/vida adulta nos planos com acesso D\'Or.',
      },
      {
        id: 'dor-4',
        question: 'A rede D\'Or cobre internação eletiva e emergência?',
        answer:
          'Sim — os hospitais D\'Or atendem tanto emergência 24h (pronto-socorro adulto e pediátrico) quanto internação eletiva, cirurgias programadas, exames de alta complexidade e tratamento oncológico. Cobertura conforme rol ANS + diretrizes do plano contratado, sujeita a carências contratuais.',
      },
    ],
    'amil-one-rede-selecionada': [
      {
        id: 'one-1',
        question: `O que é a Rede Selecionada Amil One em ${ano}?`,
        answer:
          'A Rede Selecionada Amil One é a curadoria premium da operadora — lista hospitais Tier 1 (Albert Einstein, Sírio-Libanês, Oswaldo Cruz) e principais unidades Rede D\'Or, com mensalidade-alvo a partir de R$ 2.500/vida. Diferente da Linha Clássica (rede ampla nacional), o Amil One trabalha com rede menor mas com qualidade hospitalar garantida.',
      },
      {
        id: 'one-2',
        question: 'Quais benefícios diferenciados o Amil One oferece?',
        answer:
          'Acompanhante 24h em internação, quarto privativo padrão, concierge médico telefônico, agendamento priorizado em hospitais selecionados e cobertura internacional opcional (produtos S6500). Indicação principal: diretoria executiva e empresas que oferecem benefício saúde como ferramenta de retenção sênior.',
      },
      {
        id: 'one-3',
        question: 'Empresa pequena (PME) pode contratar Amil One?',
        answer:
          'Sim — Amil One é disponível em contrato PME a partir de 2 vidas, mas o ticket médio (≥R$ 2.500/vida) torna o produto inviável para empresas com headcount majoritariamente operacional. Indicado para PMEs profissionais (escritórios advocacia, consultoria, tech).',
      },
      {
        id: 'one-4',
        question: 'Amil One inclui Rede D\'Or?',
        answer:
          'Sim. O Amil One S6500 Black incorpora a Rede D\'Or completa + hospitais Tier 1 da iniciativa privada. É o produto com a rede credenciada mais ampla em qualidade do portfólio Amil.',
      },
    ],
    'amil-facil-rede-selecionada': [
      {
        id: 'facil-1',
        question: `O que é a Rede Selecionada Amil Fácil em ${ano}?`,
        answer:
          'A Rede Selecionada Amil Fácil é a rede regional dos planos S380 e Amil Fácil (S60/S80) — focada em PME (2-29 vidas) com mensalidade controlada. Cobertura geográfica concentrada em SP, RJ, MG, PR e DF; exclui as redes premium (D\'Or, Einstein, Sírio).',
      },
      {
        id: 'facil-2',
        question: 'Por que mensalidade Amil Fácil é mais barata que Clássica?',
        answer:
          'Amil Fácil restringe rede a hospitais e clínicas regionais — em troca, mensalidade média 35-45% inferior à Linha Clássica. Para empresas que precisam cumprir convenção coletiva ou oferecer benefício corporativo sem custo proibitivo, é o ponto de equilíbrio.',
      },
      {
        id: 'facil-3',
        question: 'Empresa com filial fora de SP/RJ pode contratar Amil Fácil?',
        answer:
          'Atendimento Amil Fácil é restrito ao estado contratado + capitais limítrofes. Empresa multi-UF deve avaliar Linha Clássica (cobertura nacional) ou contratar pacote Amil Fácil estadual por filial. Consulte corretor autorizado.',
      },
      {
        id: 'facil-4',
        question: 'Amil Fácil cobre exames de alta complexidade?',
        answer:
          'Sim — cobertura conforme rol ANS é integral. A diferença é a rede de prestadores credenciados (regional vs nacional). Procedimentos de alta complexidade são realizados nos hospitais conveniados Amil Fácil dentro do estado.',
      },
    ],
    classica: [
      {
        id: 'classica-1',
        question: `O que é a Linha Clássica Amil em ${ano}?`,
        answer:
          'A Linha Clássica reúne os produtos Amil S450 (QP/QC), S580 e S750 — coluna vertebral da operadora em cobertura nacional. Para empresas com colaboradores em múltiplos estados, a Clássica é a opção que entrega rede credenciada presente em 26 UFs, com 9.325+ prestadores cadastrados.',
      },
      {
        id: 'classica-2',
        question: 'Linha Clássica inclui Rede D\'Or?',
        answer:
          'Não — a Rede D\'Or é restrita aos produtos Amil Black, Amil One e Platinum Mais. A Linha Clássica trabalha com hospitais regionais reconhecidos sem premium dos planos One. Para acesso D\'Or, considere Amil Black ou One.',
      },
      {
        id: 'classica-3',
        question: 'Qual produto Clássica indicar para empresa com 30 vidas?',
        answer:
          'Para 30 vidas com colaboradores CLT mid-level, o Amil S450 QP é o ponto de equilíbrio entre cobertura e ticket. Para perfil técnico/especialista, S580 ou S750 entregam rede ampliada. Consulte cotação com corretor autorizado SUSEP.',
      },
      {
        id: 'classica-4',
        question: 'Linha Clássica atende cidades do interior?',
        answer:
          'Sim — a Linha Clássica é a única do portfólio Amil com rede capilarizada no interior de SP, MG, PR e RS. Para empresas com filial em cidade-pequena, é frequentemente a única opção viável que garante prestador credenciado próximo aos colaboradores.',
      },
    ],
    'amil-medial': [
      {
        id: 'medial-1',
        question: `O que é a marca Amil Medial em ${ano}?`,
        answer:
          'A Medial Saúde foi adquirida pela Amil em 2009 e a marca foi integrada ao portfólio sob a forma de planos Adesão Bronze (RJ, SP) e Adesão Ouro Mais. A rede herdada da Medial é regional — concentrada em RJ e SP — e atende público de adesão (associações, sindicatos, conselhos profissionais).',
      },
      {
        id: 'medial-2',
        question: 'Quem pode contratar Adesão Bronze Amil/Medial?',
        answer:
          'Adesão Bronze é restrita a profissionais elegíveis a planos por adesão — vinculados a sindicatos, associações ou conselhos profissionais (CRM, OAB, CRC, CRO). MEI e autônomos com vínculo a entidades apoiadoras também são elegíveis. Cobertura geográfica restrita a RJ ou SP.',
      },
      {
        id: 'medial-3',
        question: 'Adesão Bronze é mais barato que Empresarial PME?',
        answer:
          'Sim — mensalidade ~25-30% inferior à Linha Clássica empresarial PME. O trade-off é a cobertura geográfica restrita e o público elegível restrito. Para empresa formalmente constituída (MEI, ME), Amil Fácil PME é geralmente alternativa preferível.',
      },
      {
        id: 'medial-4',
        question: 'Posso usar Adesão Bronze fora do RJ ou SP?',
        answer:
          'Atendimento da Adesão Bronze RJ/SP é restrito ao estado contratado. Em emergências fora do estado, há cobertura mínima conforme rol ANS, mas eletivos só dentro da UF. Empresa multi-UF não deve contratar — usar Linha Clássica.',
      },
    ],
  }
  return faqsBase[sub.slug].map((draft) => ({
    ...draft,
    category: 'rede-credenciada',
  }))
}

// ──────────────────────────────────────────────────────────────────
// Page component
// ──────────────────────────────────────────────────────────────────

export default async function SubRedePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { subRede } = await params
  const sub = getSubRedeBySlug(subRede)
  if (!sub) notFound()

  const stats = getEstatisticasSubRede(sub.slug)
  const flagships = getHospitaisFlagshipPorSubRede(sub.slug).slice(0, 12)
  const todosPrestadores = getPrestadoresPorSubRede(sub.slug)
  const top20 = todosPrestadores.slice(0, 20)
  const viavel = isSubRedeViavel(sub.slug)
  const ano = getCurrentYear()
  const faqs = buildFaqsParaSubRede(sub)

  // ─── Schema HealthInsurancePlan ─────────────────────────────────
  const healthInsurancePlanSchema = {
    '@context': 'https://schema.org',
    '@type': 'HealthInsurancePlan',
    '@id': `${BASE_URL}/rede-credenciada/${sub.slug}#plan`,
    name: `Amil ${sub.nome}`,
    description: sub.tagline,
    provider: {
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
      url: BASE_URL,
    },
    healthPlanNetworkTier: sub.posicionamento,
    network: {
      '@type': 'ItemList',
      numberOfItems: stats.totalPrestadores,
      itemListElement: top20.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'MedicalOrganization',
          name: p.nome,
          address: {
            '@type': 'PostalAddress',
            addressLocality: p.municipio,
            addressRegion: p.uf,
            addressCountry: 'BR',
            ...(p.bairro ? { streetAddress: p.bairro } : {}),
          },
        },
      })),
    },
  }

  return (
    <>
      <SchemaGraph
        pageType="page"
        breadcrumb={[
          { name: 'Rede Credenciada', href: '/rede-credenciada' },
          {
            name: sub.nome,
            href: `/rede-credenciada/${sub.slug}`,
          },
        ]}
        faq={faqs.map((f) => ({ question: f.question, answer: f.answer }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(healthInsurancePlanSchema),
        }}
      />

      <article className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumb visual */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-sm text-slate-500"
          >
            <Link href="/" className="hover:text-teal-600">
              Início
            </Link>
            <span className="mx-2">›</span>
            <Link
              href="/rede-credenciada"
              className="hover:text-teal-600"
            >
              Rede Credenciada
            </Link>
            <span className="mx-2">›</span>
            <span className="text-slate-900">{sub.nomeCurto}</span>
          </nav>

          {/* Hero */}
          <header>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
              Sub-rede Amil
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              Plano Amil {sub.nome} {ano} — Rede Credenciada e Cobertura
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-600">
              {sub.tagline}
            </p>
            {viavel ? (
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-700">
                <span className="rounded bg-sky-50 px-3 py-1 ring-1 ring-sky-200">
                  <strong className="text-slate-900">
                    {stats.totalPrestadores.toLocaleString('pt-BR')}
                  </strong>{' '}
                  prestadores
                </span>
                <span className="rounded bg-sky-50 px-3 py-1 ring-1 ring-sky-200">
                  <strong className="text-slate-900">{stats.totalUFs}</strong>{' '}
                  UFs com cobertura
                </span>
                <span className="rounded bg-sky-50 px-3 py-1 ring-1 ring-sky-200">
                  <strong className="text-slate-900">
                    {stats.totalMunicipios}
                  </strong>{' '}
                  municípios
                </span>
              </div>
            ) : (
              <div className="mt-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <strong>Cobertura em expansão.</strong> Esta sub-rede tem
                menos de {MIN_PRESTADORES_SUB_REDE} prestadores classificados
                no dataset atual. Para confirmar disponibilidade local,
                consulte o app oficial Amil.
              </div>
            )}
          </header>

          {/* Seção 1: Origem */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">
              Sobre a {sub.nome} Amil
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              {sub.origem}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              <strong>Público-alvo:</strong> {sub.publicoAlvo}
            </p>
          </section>

          {/* Seção 2: Hospitais flagship (apenas D'Or e One) */}
          {flagships.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900">
                Hospitais e clínicas em destaque na {sub.nomeCurto}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Lista parcial — confirme cobertura completa via app oficial
                Amil.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {flagships.map((p) => (
                  <li
                    key={p.codigo}
                    className="rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <div className="font-semibold text-slate-900">
                      {p.nome}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {p.bairro ? `${p.bairro} · ` : ''}
                      {p.municipio}/{p.uf}
                    </div>
                    <div className="mt-2 inline-flex rounded bg-teal-50 px-2 py-0.5 text-xs text-teal-800">
                      {p.tipoInferido}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Seção 3: Cobertura por UF */}
          {viavel && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900">
                Cobertura {sub.nomeCurto} por estado
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Top {stats.topUFs.length} estados com maior densidade de
                prestadores.
              </p>
              <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left font-semibold text-slate-700"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-semibold text-slate-700"
                      >
                        Prestadores
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-semibold text-slate-700"
                      >
                        Página detalhada
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {stats.topUFs.map((row) => (
                      <tr key={row.uf}>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {row.uf}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700">
                          {row.total.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/rede/${row.uf.toLowerCase()}`}
                            className="text-teal-600 hover:underline"
                          >
                            ver rede {row.uf.toUpperCase()} →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Seção 4: Produtos Amil que dão acesso */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">
              Produtos Amil que incluem a {sub.nomeCurto}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {sub.produtosAmilRelacionados.map((produto) => (
                <li
                  key={produto}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800"
                >
                  {produto}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Lista canônica derivada do dataset Power BI Amil
              (2026-04-26). Mensalidade e disponibilidade variam por UF e
              perfil etário — consulte cotação personalizada.
            </p>
          </section>

          {/* Seção 5: FAQ */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">
              Perguntas frequentes — {sub.nomeCurto}
            </h2>
            <div className="mt-6">
              <FAQAccordion items={faqs} />
            </div>
          </section>

          {/* CTA + Disclaimer */}
          <section className="mt-12 rounded-xl bg-teal-600 p-8 text-white">
            <h2 className="text-2xl font-bold">
              Cotação personalizada {sub.nomeCurto}
            </h2>
            <p className="mt-2 text-teal-50">
              Solicite proposta detalhada via corretor autorizado SUSEP
              (BeneficioRH).
            </p>
            <Link
              href="/cotacao-online"
              className="mt-4 inline-block rounded-lg bg-amber-700 px-6 py-3 font-semibold text-white shadow hover:bg-amber-800"
            >
              Solicitar cotação
            </Link>
          </section>

          <footer className="mt-12 rounded border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <strong>Aviso:</strong> Sub-rede sujeita a alterações pela Amil.
            Confirme disponibilidade no app oficial Amil antes de uso.
            Última atualização do dataset:{' '}
            <time dateTime="2026-04-26">26/04/2026</time>. Operado por
            corretor autorizado a intermediar planos Amil Assistência
            Médica Internacional S.A. (registro ANS nº 326305 — corretor
            SUSEP nº 201054484).{' '}
            <Link
              href="https://www.amil.com.br"
              rel="nofollow noopener external"
              className="underline hover:text-amber-700"
            >
              Ver lista oficial Amil →
            </Link>
          </footer>
        </div>
      </article>
    </>
  )
}
