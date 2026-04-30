/**
 * Hub `/rede-credenciada` — Story 7.2.
 *
 * RSC + ISR 7d (AC1). Stats dataset-driven via getEstatisticasRede() (AC6).
 * Renderiza:
 *   - Hero com stats reais (9.325 prestadores · 26 UFs · 438 municípios · 11 redes ativas)
 *   - <UfShortcutChips /> top-5 UFs por densidade
 *   - <NetworkSearch /> Client orquestrador (busca + filtros + resultados)
 *   - <RedeCredenciadaFAQ /> 8 perguntas + FAQPage schema (AC5)
 *   - <OrganizationJsonLd /> primitive (AC5-bis)
 *   - Disclaimer canônico ANS + SUSEP (AC7)
 *
 * Substitui versão legada do template Bradesco fork (Story 1.1) que tinha
 * dados fake "+28.000 médicos" + especialidades inventadas.
 */

import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { NetworkSearch } from '@/components/network/NetworkSearch';
import { RedeCredenciadaFAQ } from '@/components/network/RedeCredenciadaFAQ';
import { UfShortcutChips } from '@/components/network/UfShortcutChips';
import { OrganizationJsonLd } from '@/components/schema/OrganizationJsonLd';
import {
  DISCLAIMER_AMIL_REDE,
  DISCLAIMER_REDE_FRESHNESS,
} from '@/content/disclaimers/amil-rede';
import {
  getDatasetMetadata,
  getEstatisticasRede,
} from '@/lib/operadoras/amil/rede-credenciada-loader';

export const metadata: Metadata = {
  title:
    'Rede Credenciada Amil 2026 — 9.325 Prestadores em 26 UFs | Hospitais, Laboratórios e Clínicas',
  description:
    'Encontre hospitais, laboratórios e clínicas da rede credenciada Amil em sua cidade. Busca por bairro, produto e tipo de atendimento. Corretor SUSEP autorizado.',
  alternates: { canonical: '/rede-credenciada' },
  openGraph: {
    title: 'Rede Credenciada Amil 2026 — 9.325 Prestadores em 26 UFs',
    description:
      'Hospitais, laboratórios e clínicas Amil em todo Brasil. Busca por cidade, bairro e produto.',
    url: '/rede-credenciada',
    type: 'website',
  },
};

export const revalidate = 604800; // 7 dias (AC1)
export const dynamic = 'force-static'; // AC1

function formatBR(n: number): string {
  return n.toLocaleString('pt-BR');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function RedeCredenciadaPage(): ReactElement {
  const stats = getEstatisticasRede();
  const meta = getDatasetMetadata();
  const totalRedesAtivas = Object.keys(stats.porRede).length;

  return (
    <>
      <OrganizationJsonLd />

      {/* Hero com stats dataset-driven (AC6) */}
      <section className="bg-gradient-to-b from-amil-blue/5 to-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
            Rede Credenciada Amil 2026 — {formatBR(stats.totalPrestadores)} Prestadores
          </h1>
          <p className="mt-4 text-lg text-gray-600 md:text-xl">
            Hospitais, laboratórios, clínicas e prontos-socorros da rede credenciada Amil
            em sua cidade. Busca por bairro, produto e tipo de atendimento.
          </p>

          {/* Stats grid */}
          <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Prestadores
              </dt>
              <dd className="mt-1 text-2xl font-bold text-amil-blue">
                {formatBR(stats.totalPrestadores)}
              </dd>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Estados
              </dt>
              <dd className="mt-1 text-2xl font-bold text-amil-blue">{stats.totalUFs}</dd>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Municípios
              </dt>
              <dd className="mt-1 text-2xl font-bold text-amil-blue">
                {formatBR(stats.totalMunicipios)}
              </dd>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Redes ativas
              </dt>
              <dd className="mt-1 text-2xl font-bold text-amil-blue">{totalRedesAtivas}</dd>
            </div>
          </dl>

          <p className="mt-4 text-sm text-gray-500">
            <span aria-hidden="true">📅 </span>
            {DISCLAIMER_REDE_FRESHNESS} {formatDate(meta.geradoEm)}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="my-8 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong className="font-semibold">Importante:</strong> {DISCLAIMER_AMIL_REDE}
        </div>

        <UfShortcutChips porUF={stats.porUF} topN={5} />

        <NetworkSearch defaultUf="SP" />
      </div>

      <RedeCredenciadaFAQ />

      {/* Footer disclaimer (Story 7.2 AC7 — repete em footer para reforço compliance) */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm text-gray-600">{DISCLAIMER_AMIL_REDE}</p>
        </div>
      </footer>
    </>
  );
}
