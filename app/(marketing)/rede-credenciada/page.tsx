import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FAQAccordion } from '@/components/seo/FAQAccordion';
import { NetworkSearch } from '@/components/search/NetworkSearch';
import { FAQS_AMIL_EMPRESARIAL } from '@/data/faqs/faq-amil-empresarial';
import {
  getEstatisticasRede,
  getTopMunicipios,
} from '@/lib/operadoras/amil/rede-credenciada-loader';

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  title: 'Rede Credenciada Amil 2026 | Hospitais, Laboratórios e Especialistas',
  description:
    'Hub da rede credenciada Amil: 9.325 prestadores em 26 UFs e 438 municípios. Busque hospitais, laboratórios, clínicas e Amil Espaço Saúde.',
  canonical: '/rede-credenciada',
});

export const revalidate = 86400;

const subRedes = [
  {
    nome: 'Hospitais Rede D\'Or',
    slug: 'hospitais-dor',
    descricao: 'Hospitais Copa D\'Or, Quinta D\'Or, Caxias D\'Or e mais.',
  },
  {
    nome: 'Amil One — Rede Selecionada',
    slug: 'amil-one-rede-selecionada',
    descricao: 'Rede premium para Amil One e Amil One Black.',
  },
  {
    nome: 'Amil Fácil — Rede Selecionada',
    slug: 'amil-facil-rede-selecionada',
    descricao: 'Rede regional para Amil Fácil S60 e S80.',
  },
  {
    nome: 'Amil Clássica',
    slug: 'classica',
    descricao: 'Rede tradicional Amil S380, S450 e S580.',
  },
  {
    nome: 'Amil Medial',
    slug: 'amil-medial',
    descricao: 'Rede legado Medial, integrada à rede Amil S450.',
  },
] as const;

export default function RedeCredenciadaPage() {
  const stats = getEstatisticasRede();
  const topMunicipios = getTopMunicipios(5);
  const ufsOrdenadas = Object.entries(stats.porUF).sort(
    ([, a], [, b]) => b - a,
  );

  // 8 perguntas categoria "rede-credenciada" do catálogo (Story 4.7).
  const faqRede = FAQS_AMIL_EMPRESARIAL.filter(
    (f) => f.category === 'rede-credenciada',
  );

  return (
    <>
      <SchemaGraph
        pageType="page"
        breadcrumb={[{ name: 'Rede Credenciada', href: '/rede-credenciada' }]}
        faq={faqRede.map((f) => ({ question: f.question, answer: f.answer }))}
      />
      <BreadcrumbNav
        items={[{ label: 'Rede Credenciada', href: '/rede-credenciada' }]}
      />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Rede Credenciada Amil 2026
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Encontre hospitais, laboratórios, clínicas e centros médicos
            credenciados Amil em todo o Brasil. Dataset oficial atualizado
            mensalmente — última geração em{' '}
            <time dateTime={stats.geradoEm}>
              {new Date(stats.geradoEm).toLocaleDateString('pt-BR')}
            </time>
            .
          </p>

          {/* Estatísticas dataset-driven */}
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Prestadores
              </dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900">
                {stats.totalPrestadores.toLocaleString('pt-BR')}
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                UFs cobertas
              </dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900">
                {stats.totalUFs}
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Municípios
              </dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900">
                {stats.totalMunicipios}
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Top municípios
              </dt>
              <dd className="mt-1 text-sm text-slate-700">
                {topMunicipios.map((m) => `${m.municipio}/${m.uf}`).join(' · ')}
              </dd>
            </div>
          </dl>

          {/* Busca livre — Client component */}
          <div className="mt-10">
            <Suspense
              fallback={
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                  Carregando busca da rede credenciada...
                </div>
              }
            >
              <NetworkSearch />
            </Suspense>
          </div>

          {/* Sub-redes (Story 7.11) */}
          <h2 className="mt-12 text-xl font-bold text-slate-900">
            Sub-redes Amil
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {subRedes.map((s) => (
              <Link
                key={s.slug}
                href={`/rede-credenciada/${s.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-teal-600"
              >
                <p className="text-sm font-semibold text-slate-900">{s.nome}</p>
                <p className="mt-1 text-xs text-slate-600">{s.descricao}</p>
              </Link>
            ))}
          </div>

          {/* Por estado */}
          <h2 className="mt-12 text-xl font-bold text-slate-900">
            Rede por estado
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Acesse a rede credenciada Amil por unidade federativa. Estados
            ordenados por densidade de prestadores.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {ufsOrdenadas.map(([uf, total]) => (
              <Link
                key={uf}
                href={`/rede/${uf.toLowerCase()}`}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:border-teal-600 hover:text-teal-600"
              >
                <span className="font-semibold">{uf}</span>
                <span className="ml-2 text-xs text-slate-500">
                  {total.toLocaleString('pt-BR')}
                </span>
              </Link>
            ))}
          </div>

          {/* FAQ rede credenciada (8 perguntas) */}
          {faqRede.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-slate-900">
                Perguntas frequentes
              </h2>
              <div className="mt-4">
                <FAQAccordion
                  items={faqRede}
                  headingLevel="h3"
                  id="faq-rede-credenciada"
                  emitSchema={false}
                />
              </div>
            </div>
          )}

          {/* Disclaimer compliance */}
          <footer className="mt-16 border-t border-slate-200 pt-6 text-xs text-slate-500">
            <p>
              BeneficioRH Corretora de Seguros — SUSEP 201054484 · CNPJ
              14.764.085/0001-99. Operadora Amil ANS 326305. Dataset oficial
              público Amil. Esta página é informativa; preços e cobertura podem
              variar conforme produto e negociação. Consulte sempre o site
              oficial Amil para confirmar credenciamento atual.
            </p>
          </footer>
        </div>
      </section>
    </>
  );
}
