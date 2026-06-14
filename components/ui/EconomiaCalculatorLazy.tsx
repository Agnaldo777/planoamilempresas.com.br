'use client';

/**
 * Loader lazy da EconomiaCalculator (performance INP/TBT).
 *
 * A calculadora importa as tabelas de preço de 18 estados (data/tabelas-amil,
 * ~500 linhas) — peso que não precisa estar no bundle inicial da página. Lazy
 * com ssr: false move esse JS+dados para carregamento sob demanda, mantendo o
 * conteúdo SEO ao redor (server-rendered) intacto. Placeholder evita CLS.
 */

import dynamic from 'next/dynamic';

const EconomiaCalculator = dynamic(
  () => import('@/components/ui/EconomiaCalculator').then((m) => m.EconomiaCalculator),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-64 animate-pulse rounded-xl bg-slate-100" aria-hidden="true" />
        <p className="mt-3 text-center text-sm text-slate-500">Carregando calculadora…</p>
      </div>
    ),
  },
);

export function EconomiaCalculatorLazy() {
  return <EconomiaCalculator />;
}
