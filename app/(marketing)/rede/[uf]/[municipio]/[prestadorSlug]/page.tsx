/**
 * Rota dinâmica `/rede/[uf]/[municipio]/[prestadorSlug]/` — Story 7.4 (FR45).
 *
 * Páginas-prestador SSG individuais. Volume potencial: 9.325 páginas (full).
 *
 * **Estratégia de chunking (resolve build budget Vercel Hobby):**
 * - default (sem env vars): MVP cap 30 prestadores/UF Sudeste (~120 páginas)
 * - `BUILD_FULL_PROVIDERS=true`: Phase 1 completa (7.166 páginas Sudeste)
 * - `PHASE_2_ENABLED=true`: adiciona Phase 2 (sobe para 9.325 páginas)
 *
 * Detalhes em `src/lib/operadoras/amil/chunked-static-params.ts` e
 * `docs/architecture/ssg-chunking-strategy.md`.
 *
 * **GAP de dataset:**
 * - Sem endereço completo, telefone, especialidades (Power BI não exporta)
 * - Schema MedicalOrganization usa `addressLocality` + `addressRegion` apenas
 * - Mapa por prestador omitido (sem coordenadas) — uso CTA "consultar app oficial Amil"
 *
 * **Compliance:**
 * - ADR-006: URL-as-Trademark (slug não contém "Amil" sozinho)
 * - FR54: Organization sempre BeneficioRH
 * - NFR21: schema MedicalBusiness/MedicalClinic/MedicalLaboratory por tipo inferido
 * - Anti-thin: noindex em município <5 prestadores
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import {
  getPrestadorBySlug,
  getPrestadoresPorMunicipio,
  type PrestadorAmil,
  type TipoAtendimentoInferido,
} from '@/lib/operadoras/amil/rede-credenciada-loader'
import {
  getPrestadorStaticParams,
  MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL,
  type PrestadorParams,
} from '@/lib/operadoras/amil/chunked-static-params'
import { ORGANIZATION_NAME } from '@/lib/schema/organization'
import { getCurrentYear } from '@/lib/seo/title'
import { tituloLocal } from '@/lib/uf'
import { DISCLAIMER_AMIL_REDE } from '@/content/disclaimers/amil-rede'
import { getSkuMinimo } from '@/lib/operadoras/amil/sku-minimo'

export const revalidate = 2592000 // 30 dias (ISR — pipeline mensal Story 7.10)
export const dynamic = 'force-static'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br'

const UF_NOMES: Record<string, string> = {
  AC: 'Acre',
  AL: 'Alagoas',
  AM: 'Amazonas',
  AP: 'Amapá',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MG: 'Minas Gerais',
  MS: 'Mato Grosso do Sul',
  MT: 'Mato Grosso',
  PA: 'Pará',
  PB: 'Paraíba',
  PE: 'Pernambuco',
  PI: 'Piauí',
  PR: 'Paraná',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RO: 'Rondônia',
  RR: 'Roraima',
  RS: 'Rio Grande do Sul',
  SC: 'Santa Catarina',
  SE: 'Sergipe',
  SP: 'São Paulo',
  TO: 'Tocantins',
}

// ──────────────────────────────────────────────────────────────────
// generateStaticParams — chunked
// ──────────────────────────────────────────────────────────────────

export function generateStaticParams(): PrestadorParams[] {
  return getPrestadorStaticParams()
}

// ──────────────────────────────────────────────────────────────────
// Schema mapping: tipoInferido → @type Schema.org
// ──────────────────────────────────────────────────────────────────

function schemaTypeForTipo(tipo: TipoAtendimentoInferido): string {
  switch (tipo) {
    case 'Hospital':
      return 'Hospital'
    case 'Maternidade':
      return 'Hospital' // + medicalSpecialty Obstetrics (handled below)
    case 'Pronto-Socorro':
      return 'EmergencyService'
    case 'Clínica':
      return 'MedicalClinic'
    case 'Laboratório':
      return 'MedicalLaboratory'
    case 'Diagnóstico por Imagem':
      return 'MedicalImagingService'
    case 'Odontologia':
    case 'Centro/Instituto':
    case 'Outro':
    default:
      return 'MedicalOrganization'
  }
}

interface PrestadorSchema {
  '@context': string
  '@type': string
  '@id': string
  name: string
  address: {
    '@type': 'PostalAddress'
    addressLocality: string
    addressRegion: string
    addressCountry: 'BR'
    streetAddress?: string
  }
  areaServed: string
  medicalSpecialty?: { '@type': string; name: string }
  url: string
}

function buildPrestadorSchema(p: PrestadorAmil): PrestadorSchema {
  const schemaType = schemaTypeForTipo(p.tipoInferido)
  const url = `${BASE_URL}/rede/${p.uf.toLowerCase()}/${p.municipio
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')}/${p.slug}`

  const schema: PrestadorSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${url}#provider`,
    name: p.nome,
    address: {
      '@type': 'PostalAddress',
      addressLocality: p.municipio,
      addressRegion: p.uf,
      addressCountry: 'BR',
      ...(p.bairro ? { streetAddress: p.bairro } : {}),
    },
    areaServed: `${p.municipio}, ${p.uf}, Brasil`,
    url,
  }

  // Maternidade requer specialty Obstetrics (Schema.org canonical)
  if (p.tipoInferido === 'Maternidade') {
    schema.medicalSpecialty = {
      '@type': 'MedicalSpecialty',
      name: 'Obstetrics',
    }
  }

  return schema
}

// ──────────────────────────────────────────────────────────────────
// Metadata
// ──────────────────────────────────────────────────────────────────

type Params = { uf: string; municipio: string; prestadorSlug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { uf, municipio, prestadorSlug } = await params
  const prestador = getPrestadorBySlug(uf, municipio, prestadorSlug)

  if (!prestador) {
    return { title: 'Prestador não encontrado' }
  }

  const ufNome = UF_NOMES[prestador.uf] ?? prestador.uf
  const ano = getCurrentYear()
  const totalNoMunicipio = getPrestadoresPorMunicipio(uf, municipio).length
  const isThin =
    totalNoMunicipio < MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL

  const isHospital =
    prestador.tipoInferido === 'Hospital' ||
    prestador.tipoInferido === 'Maternidade'
  const nomeExib = tituloLocal(prestador.nome)
  const cidadeExib = tituloLocal(prestador.municipio)
  const redesTop3 = prestador.redes.slice(0, 3).join(', ')
  const title = isHospital
    ? `${nomeExib} aceita Amil? — Planos e Rede Credenciada (${cidadeExib}/${prestador.uf}) ${ano}`
    : `${nomeExib} em ${cidadeExib}/${prestador.uf} ${ano} — Rede Credenciada Amil`
  const description = isHospital
    ? `O ${nomeExib} (${cidadeExib}/${ufNome}) é credenciado Amil${
        redesTop3 ? ` pelas redes ${redesTop3}` : ''
      }. Veja quais planos Amil cobrem o hospital e solicite cotação empresarial.`
    : `${prestador.tipoInferido} credenciado Amil em ${cidadeExib} (${ufNome})${
        prestador.bairro ? `, bairro ${tituloLocal(prestador.bairro)}` : ''
      }${redesTop3 ? `. Aceita: ${redesTop3}` : ''}.`

  return {
    title,
    description,
    alternates: {
      canonical: isThin
        ? `/rede/${uf.toLowerCase()}/${municipio.toLowerCase()}`
        : `/rede/${uf.toLowerCase()}/${municipio.toLowerCase()}/${prestadorSlug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
    },
    twitter: { card: 'summary', title, description },
    robots: isThin
      ? { index: false, follow: true }
      : { index: true, follow: true },
  }
}

// ──────────────────────────────────────────────────────────────────
// Page component
// ──────────────────────────────────────────────────────────────────

export default async function PrestadorPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { uf, municipio, prestadorSlug } = await params
  const prestador = getPrestadorBySlug(uf, municipio, prestadorSlug)
  if (!prestador) notFound()

  const ufNome = UF_NOMES[prestador.uf] ?? prestador.uf
  const totalNoMunicipio = getPrestadoresPorMunicipio(uf, municipio).length
  const isThin =
    totalNoMunicipio < MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL

  const prestadorSchema = buildPrestadorSchema(prestador)

  const isHospital =
    prestador.tipoInferido === 'Hospital' ||
    prestador.tipoInferido === 'Maternidade'
  const nomeExib = tituloLocal(prestador.nome)
  const cidadeExib = tituloLocal(prestador.municipio)
  const bairroExib = prestador.bairro ? tituloLocal(prestador.bairro) : ''
  const redesLista = prestador.redes.join(', ')
  const skuMinimo = getSkuMinimo(prestador)
  const cotacaoHref = `/cotacao-online?uf=${uf.toLowerCase()}&cidade=${municipio.toLowerCase()}`

  const faqs = isHospital
    ? [
        {
          pergunta: `O ${nomeExib} aceita plano Amil?`,
          resposta:
            prestador.redes.length > 0
              ? `Sim. O ${nomeExib}, em ${cidadeExib}/${prestador.uf}, é credenciado Amil pelas redes ${redesLista}. Confirme se o seu plano está entre essas redes antes do atendimento — a rede pode mudar; verifique no app oficial Amil.`
              : `O ${nomeExib} consta na rede Amil de ${cidadeExib}/${prestador.uf}. Confirme a cobertura do seu plano no app oficial Amil ou solicite a verificação na cotação.`,
        },
        {
          pergunta: `Quais planos Amil são aceitos no ${nomeExib}?`,
          resposta:
            prestador.redes.length > 0
              ? `As redes Amil credenciadas no ${nomeExib} são: ${redesLista}. Planos de linha superior costumam ampliar o acesso a hospitais de referência.`
              : `Consulte na cotação quais linhas Amil dão acesso ao ${nomeExib}.`,
        },
        {
          pergunta: `Como contratar um plano Amil com atendimento no ${nomeExib}?`,
          resposta: `A contratação empresarial é feita via corretor autorizado (SUSEP). Informe CNPJ, número de vidas e perfil etário para receber uma cotação com a linha que cobre o ${nomeExib}.`,
        },
      ]
    : []

  const faqSchema = isHospital
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.pergunta,
          acceptedAnswer: { '@type': 'Answer', text: f.resposta },
        })),
      }
    : null

  return (
    <>
      {/* Organization (FR54 BeneficioRH) + WebSite + Breadcrumb */}
      <SchemaGraph
        pageType="page"
        breadcrumb={[
          { name: 'Rede Credenciada', href: '/rede-credenciada' },
          { name: ufNome, href: `/rede/${uf.toLowerCase()}` },
          {
            name: prestador.municipio,
            href: `/rede/${uf.toLowerCase()}/${municipio.toLowerCase()}`,
          },
          {
            name: prestador.nome,
            href: `/rede/${uf.toLowerCase()}/${municipio.toLowerCase()}/${prestadorSlug}`,
          },
        ]}
      />

      {/* Provider schema (MedicalBusiness/Hospital/etc.) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(prestadorSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb visual */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">Início</Link>
            <span className="mx-2">›</span>
            <Link href="/rede-credenciada" className="hover:text-blue-600">Rede Credenciada</Link>
            <span className="mx-2">›</span>
            <Link href={`/rede/${uf.toLowerCase()}`} className="hover:text-blue-600">{ufNome}</Link>
            <span className="mx-2">›</span>
            <Link
              href={`/rede/${uf.toLowerCase()}/${municipio.toLowerCase()}`}
              className="hover:text-blue-600"
            >
              {cidadeExib}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-slate-900">{nomeExib}</span>
          </nav>

          {/* Header */}
          <header>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              {prestador.tipoInferido} · Rede Credenciada Amil
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {isHospital ? `${nomeExib} aceita Amil?` : nomeExib}
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              {bairroExib && (
                <>
                  <strong className="text-slate-900">{bairroExib}</strong> ·{' '}
                </>
              )}
              {cidadeExib}/{prestador.uf}
            </p>
          </header>

          {/* Resposta direta (hospital) — otimizada para featured snippet */}
          {isHospital && (
            <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <p className="text-lg font-semibold text-blue-900">
                {prestador.redes.length > 0
                  ? `✓ Sim — o ${nomeExib} é credenciado Amil em ${cidadeExib}/${prestador.uf}.`
                  : `O ${nomeExib} consta na rede Amil de ${cidadeExib}/${prestador.uf}.`}
              </p>
              {prestador.redes.length > 0 && (
                <p className="mt-2 text-sm text-blue-900">
                  Redes Amil que dão acesso: <strong>{redesLista}</strong>. Confirme se o seu plano
                  está entre elas.
                </p>
              )}
              <Link
                href={cotacaoHref}
                className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Cotar plano com acesso ao {nomeExib} →
              </Link>
            </section>
          )}

          {/* SKU-mínimo de acesso — plano de entrada que credencia o prestador */}
          {skuMinimo && (
            <section className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Plano de entrada para atender aqui
              </p>
              <p className="mt-1 text-lg font-bold text-emerald-900">
                {skuMinimo.nivel === 'adesao'
                  ? `Acesso a partir de planos de adesão (${skuMinimo.produto})`
                  : `A partir do ${skuMinimo.produto}`}
                {skuMinimo.desde !== 'sob consulta' && (
                  <span className="font-semibold"> — {skuMinimo.desde}/vida*</span>
                )}
              </p>
              <p className="mt-2 text-sm text-emerald-900">
                {skuMinimo.nivel === 'premium'
                  ? `${nomeExib} é um prestador de rede premium — o acesso começa nas linhas top da Amil.`
                  : `Este é o plano Amil mais acessível que credencia o ${nomeExib}. Linhas superiores ampliam a rede em outros hospitais.`}
              </p>
              {skuMinimo.planoSlug && (
                <Link
                  href={`/planos/${skuMinimo.planoSlug}`}
                  className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline-offset-2 hover:underline"
                >
                  Ver detalhes do {skuMinimo.produto} →
                </Link>
              )}
            </section>
          )}

          {/* Redes aceitas */}
          {prestador.redes.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-slate-900">
                Planos Amil aceitos
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {prestador.redes.map((rede) => (
                  <li
                    key={rede}
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-800 ring-1 ring-blue-200"
                  >
                    {rede}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Disclaimer thin content */}
          {isThin && (
            <section className="mt-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <strong>Cidade com cobertura limitada.</strong> Existem apenas{' '}
              {totalNoMunicipio} prestadores credenciados Amil em {cidadeExib}. Recomendamos consultar a{' '}
              <Link
                href={`/rede/${uf.toLowerCase()}/${municipio.toLowerCase()}`}
                className="underline"
              >
                rede completa em {cidadeExib}
              </Link>{' '}
              para alternativas.
            </section>
          )}

          {/* Conteúdo editorial */}
          <section className="mt-10">
            <h2 className="text-lg font-bold text-slate-900">Sobre o {nomeExib}</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              O {nomeExib} é um(a) {prestador.tipoInferido.toLowerCase()}{' '}
              credenciado(a) na rede Amil em {cidadeExib} ({ufNome})
              {bairroExib ? `, bairro ${bairroExib}` : ''}. Atende beneficiários dos planos{' '}
              {prestador.redes.slice(0, 3).join(', ')}
              {prestador.redes.length > 3
                ? ` e mais ${prestador.redes.length - 3} produtos Amil`
                : ''}
              .
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Para confirmar agendamento, especialidades atendidas e horários, consulte o app oficial
              Amil ou ligue diretamente para o estabelecimento. A rede é sujeita a alterações pela
              operadora.
            </p>
          </section>

          {/* FAQ (hospital) */}
          {isHospital && faqs.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-bold text-slate-900">
                Perguntas frequentes — {nomeExib}
              </h2>
              <dl className="mt-4 space-y-5">
                {faqs.map((f) => (
                  <div key={f.pergunta}>
                    <dt className="font-semibold text-slate-900">{f.pergunta}</dt>
                    <dd className="mt-1 text-sm text-slate-700">{f.resposta}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* CTA */}
          <section className="mt-10 rounded-xl bg-blue-600 p-6 text-white">
            <h2 className="text-lg font-bold">
              Ver toda rede credenciada em {cidadeExib}
            </h2>
            <p className="mt-2 text-sm text-blue-50">
              {totalNoMunicipio} prestadores credenciados Amil em {cidadeExib}. Hospitais,
              laboratórios e clínicas listados.
            </p>
            <Link
              href={`/rede/${uf.toLowerCase()}/${municipio.toLowerCase()}`}
              className="mt-4 inline-block rounded bg-white px-5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Ver rede em {cidadeExib} →
            </Link>
          </section>

          {/* Disclaimer */}
          <footer className="mt-10 rounded border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <strong>Aviso:</strong> {DISCLAIMER_AMIL_REDE} Rede sujeita a alterações — confirme no app
            oficial Amil antes do uso. Schema do prestador baseado em {ORGANIZATION_NAME} (BeneficioRH).
          </footer>
        </div>
      </article>
    </>
  )
}
