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

  const title = `${prestador.nome} em ${prestador.municipio}/${prestador.uf} ${ano} — Rede Credenciada Amil`
  const redesTop3 = prestador.redes.slice(0, 3).join(', ')
  const description = `${prestador.tipoInferido} credenciado Amil em ${prestador.municipio} (${ufNome})${
    prestador.bairro ? `, bairro ${prestador.bairro}` : ''
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

      <article className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
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
            <Link
              href={`/rede/${uf.toLowerCase()}`}
              className="hover:text-teal-600"
            >
              {ufNome}
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/rede/${uf.toLowerCase()}/${municipio.toLowerCase()}`}
              className="hover:text-teal-600"
            >
              {prestador.municipio}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-slate-900">{prestador.nome}</span>
          </nav>

          {/* Header */}
          <header>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
              {prestador.tipoInferido} · Rede Credenciada Amil
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {prestador.nome}
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              {prestador.bairro && (
                <>
                  <strong className="text-slate-900">{prestador.bairro}</strong>{' '}
                  ·{' '}
                </>
              )}
              {prestador.municipio}/{prestador.uf}
            </p>
          </header>

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
                    className="rounded-full bg-sky-50 px-3 py-1 text-sm text-sky-800 ring-1 ring-sky-200"
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
              <strong>Cidade com cobertura limitada.</strong> Existem
              apenas {totalNoMunicipio} prestadores credenciados Amil em{' '}
              {prestador.municipio}. Recomendamos consultar a{' '}
              <Link
                href={`/rede/${uf.toLowerCase()}/${municipio.toLowerCase()}`}
                className="underline"
              >
                rede completa em {prestador.municipio}
              </Link>{' '}
              para alternativas.
            </section>
          )}

          {/* Conteúdo editorial básico (TODO Story 7.3 — templates ricos) */}
          <section className="mt-10">
            <h2 className="text-lg font-bold text-slate-900">
              Sobre {prestador.nome}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              {prestador.nome} é um(a) {prestador.tipoInferido.toLowerCase()}{' '}
              credenciado(a) na rede Amil em {prestador.municipio} ({ufNome})
              {prestador.bairro ? `, bairro ${prestador.bairro}` : ''}.
              Atende beneficiários dos planos {prestador.redes.slice(0, 3).join(', ')}
              {prestador.redes.length > 3
                ? ` e mais ${prestador.redes.length - 3} produtos Amil`
                : ''}
              .
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Para confirmar agendamento, especialidades atendidas e horários,
              consulte o app oficial Amil ou ligue diretamente para o
              estabelecimento. Os dados desta página são derivados do dataset
              público Amil (snapshot 2026-04-26).
            </p>
          </section>

          {/* CTA */}
          <section className="mt-10 rounded-xl bg-teal-600 p-6 text-white">
            <h2 className="text-lg font-bold">
              Ver toda rede credenciada em {prestador.municipio}
            </h2>
            <p className="mt-2 text-sm text-teal-50">
              {totalNoMunicipio} prestadores credenciados Amil em{' '}
              {prestador.municipio}. Hospitais, laboratórios e clínicas
              listados.
            </p>
            <Link
              href={`/rede/${uf.toLowerCase()}/${municipio.toLowerCase()}`}
              className="mt-4 inline-block rounded bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800"
            >
              Ver rede em {prestador.municipio} →
            </Link>
          </section>

          {/* Disclaimer */}
          <footer className="mt-10 rounded border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <strong>Aviso:</strong> Rede sujeita a alterações pela operadora.
            Confirmar via app oficial Amil antes de uso. Dados derivados do
            Power BI público Amil (snapshot{' '}
            <time dateTime="2026-04-26">26/04/2026</time>). Operado por
            corretor autorizado a intermediar planos da Amil Assistência
            Médica Internacional S.A. (registro ANS nº 326305 — corretor
            SUSEP nº 201054484).{' '}
            <span className="text-amber-800">
              Provider schema baseado em {ORGANIZATION_NAME} (BeneficioRH).
            </span>
          </footer>
        </div>
      </article>
    </>
  )
}
