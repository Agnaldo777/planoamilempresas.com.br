/**
 * Home — Landing comercial B2B (substitui a canary da Story 1.4).
 *
 * Vive dentro do grupo (marketing) para herdar Header + Footer + StickyQuoteCTA
 * do layout compartilhado (app/(marketing)/layout.tsx). O <main> e o rodapé
 * são fornecidos pelo layout — aqui ficam só as seções de conteúdo.
 *
 * RSC (sem 'use client'). Disclaimer canônico ADR-006, sem logo/trade dress Amil
 * (NFR8 + brand-usage-policy). Operador = BeneficioRH (corretora SUSEP 201054484).
 * Números reais do dataset de rede credenciada.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getEstatisticasRede } from '@/lib/operadoras/amil/rede-credenciada-loader';
import {
  DISCLAIMER_AMIL_REDE,
  AMIL_SITE_OFICIAL,
} from '@/content/disclaimers/amil-rede';

export const revalidate = 2592000;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://planoamilempresas.com.br';

export const metadata: Metadata = {
  title: 'Plano de Saúde Amil Empresarial 2026 | Cotação PJ — BeneficioRH',
  description:
    'Plano Amil Empresarial para CNPJ: linhas S380, S450, S750, One e Black, rede credenciada em todo o Brasil e cotação online. Corretora autorizada SUSEP 201054484.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

const LINHAS = [
  { nome: 'Amil S380', desc: 'Entrada nacional — o mais contratado por PMEs.', tag: 'Nacional' },
  { nome: 'Amil S450', desc: 'Intermediário, rede ampliada de hospitais e maternidades.', tag: 'Nacional' },
  { nome: 'Amil S750', desc: 'Topo da Linha Selecionada, rede mais completa.', tag: 'Nacional' },
  { nome: 'Amil One S6500 Black', desc: 'Premium, com cobertura internacional.', tag: 'Premium' },
  { nome: 'Amil Black', desc: 'Linha Clássica de alto padrão de rede.', tag: 'Clássica' },
];

const DIFERENCIAIS = [
  { t: 'Atendimento por corretor autorizado', d: 'Intermediação SUSEP 201054484, sem custo adicional para a empresa.' },
  { t: 'Cobertura nacional', d: 'Linhas Selecionadas (S380/S450/S750) com rede em todo o Brasil.' },
  { t: 'Cotação personalizada', d: 'Preço por perfil etário, número de vidas e CNPJ — sem tabela genérica.' },
  { t: 'Rede transparente', d: 'Consulte hospitais, laboratórios e clínicas credenciados por cidade e bairro.' },
];

export default function HomePage() {
  const stats = getEstatisticasRede();

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE_URL}#website`, url: SITE_URL, name: 'planoamilempresas.com.br', inLanguage: 'pt-BR' },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: 'BeneficioRH',
        url: SITE_URL,
        identifier: 'SUSEP 201054484',
        taxID: '14.764.085/0001-99',
        sameAs: [AMIL_SITE_OFICIAL],
      },
    ],
  };

  return (
    <div className="bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-700 to-blue-600 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-sm font-semibold uppercase tracking-wide">
            Corretora autorizada · SUSEP 201054484
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold leading-tight md:text-5xl">
            Plano de Saúde Amil Empresarial para a sua empresa
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-blue-100 md:text-xl">
            Cobertura nacional, rede credenciada ampla e cotação personalizada por CNPJ.
            Atendimento por corretor autorizado, sem custo adicional.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/cotacao-online" className="rounded-lg bg-white px-7 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
              Solicitar cotação →
            </Link>
            <Link href="/rede-credenciada" className="rounded-lg border border-white/40 px-7 py-3 font-semibold text-white transition hover:bg-white/10">
              Ver rede credenciada
            </Link>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-xs text-blue-200">{DISCLAIMER_AMIL_REDE}</p>
        </div>
      </section>

      {/* Stats reais do dataset */}
      <section className="border-b border-slate-100 bg-slate-50 px-6 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 text-center sm:grid-cols-3">
          {[
            { n: stats.totalPrestadores.toLocaleString('pt-BR'), l: 'Prestadores credenciados' },
            { n: String(stats.totalUFs), l: 'Estados com cobertura' },
            { n: stats.totalMunicipios.toLocaleString('pt-BR'), l: 'Municípios atendidos' },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-bold text-blue-700 md:text-4xl">{s.n}</div>
              <div className="mt-1 text-sm text-slate-600">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Linhas de plano */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold">Linhas de plano Amil 2026</h2>
          <p className="mt-2 text-center text-slate-600">Da entrada nacional ao premium internacional — escolha pela rede e pelo perfil da equipe.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LINHAS.map((p) => (
              <div key={p.nome} className="rounded-xl border border-slate-200 p-6 transition hover:border-blue-400 hover:shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{p.tag}</span>
                <h3 className="mt-2 text-xl font-bold">{p.nome}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
              </div>
            ))}
            <Link href="/planos" className="flex items-center justify-center rounded-xl border border-dashed border-blue-300 p-6 font-semibold text-blue-700 transition hover:bg-blue-50">
              Ver todos os planos →
            </Link>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold">Por que contratar com a BeneficioRH</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {DIFERENCIAIS.map((d) => (
              <div key={d.t} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">{d.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-blue-700 p-10 text-center text-white">
          <h2 className="text-3xl font-bold">Receba uma cotação para o seu CNPJ</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Informe número de vidas e perfil da equipe e retornamos com as melhores opções de plano Amil empresarial.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/cotacao-online" className="rounded-lg bg-white px-7 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
              Solicitar cotação →
            </Link>
            <Link href="/contato-empresas" className="rounded-lg border border-white/40 px-7 py-3 font-semibold text-white transition hover:bg-white/10">
              Falar com um corretor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
