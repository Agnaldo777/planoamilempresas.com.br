/**
 * PlanComparison — Story 3.21 (FR38)
 *
 * Componente RSC (server-rendered) que exibe 2-4 planos Amil lado-a-lado
 * em tabela HTML semântica + cards mobile-friendly. Embedado em
 * `/comparar/?planos=bronze,prata,ouro`.
 *
 * **Decisões de design:**
 *   - RSC (zero JS client-side) — leitura de URL params é responsabilidade
 *     da página container (`searchParams`). O componente recebe `planos`
 *     já parseados.
 *   - HTML `<table>` real (não div/grid) — alinha Story 3.24 / FR52.
 *   - Mobile: tabela ganha `overflow-x-auto`; cards stacked não exigem
 *     duplicação de markup (CSS responsivo). Iteração futura pode
 *     ramificar UX (Uma).
 *   - Paleta Opção A: slate, teal, sky, amber.
 *
 * **Compliance:**
 *   - FR38: tabela comparativa + URL shareable (página gerencia URL)
 *   - FR54: schema é responsabilidade da página `/comparar/page.tsx`
 *     (Product × N + Brand=Amil + provider=BeneficioRH)
 *   - WCAG AA: `<th scope="col">`, `<th scope="row">`, badges semânticos
 *     com texto + ícone (não apenas cor).
 */

import Link from 'next/link';
import {
  FEATURE_ROWS,
  type FeatureValue,
  type PlanoComparison,
} from '@/data/planos-comparison';

interface PlanComparisonProps {
  planos: ReadonlyArray<PlanoComparison>;
  /** URL base da cotação para CTA por plano. Default: '/cotacao-online'. */
  cotacaoBaseUrl?: string;
  /** Classe CSS extra opcional para o wrapper. */
  className?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Tokens de classe (paleta Opção A)
// ────────────────────────────────────────────────────────────────────────

const TABLE_BASE_CLASSES =
  'w-full border-collapse text-left text-sm text-slate-900';
const CAPTION_CLASSES =
  'caption-top px-4 py-3 text-left text-base font-semibold text-slate-900';
const THEAD_CLASSES = 'bg-teal-600 text-white';
const TH_COL_CLASSES =
  'px-4 py-3 font-semibold text-sm align-bottom min-w-[140px]';
const TH_ROW_CLASSES =
  'px-4 py-3 text-left font-semibold text-slate-900 bg-slate-50 align-top';
const TD_CLASSES = 'px-4 py-3 align-top text-slate-900';
const ROW_CLASSES =
  'border-t border-slate-200 transition-colors hover:bg-sky-50';
const TFOOT_CLASSES =
  'border-t-2 border-slate-200 bg-slate-50 text-xs text-slate-600';

// ────────────────────────────────────────────────────────────────────────
// Helpers de renderização de FeatureValue
// ────────────────────────────────────────────────────────────────────────

function FeatureCell({ value }: { value: FeatureValue | undefined }) {
  if (!value || value.kind === 'indisponivel') {
    return (
      <td className={TD_CLASSES} aria-label="Informação indisponível">
        <span className="text-slate-400">—</span>
      </td>
    );
  }

  if (value.kind === 'incluso') {
    return (
      <td className={TD_CLASSES}>
        <span
          className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700"
          aria-label="Incluso no plano"
        >
          <span aria-hidden="true">✓</span>
          Incluso
        </span>
      </td>
    );
  }

  if (value.kind === 'nao-incluso') {
    return (
      <td className={TD_CLASSES}>
        <span
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
          aria-label="Não incluso"
        >
          <span aria-hidden="true">✕</span>
          Não incluso
        </span>
      </td>
    );
  }

  if (value.kind === 'premium') {
    return (
      <td className={TD_CLASSES}>
        <span
          className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800"
          aria-label="Cobertura premium ampliada"
        >
          <span aria-hidden="true">★</span>
          Premium
        </span>
      </td>
    );
  }

  // value.kind === 'texto'
  return (
    <td className={TD_CLASSES}>
      <span className="text-sm">{value.valor}</span>
    </td>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Componente principal
// ────────────────────────────────────────────────────────────────────────

export function PlanComparison({
  planos,
  cotacaoBaseUrl = '/cotacao-online',
  className,
}: PlanComparisonProps) {
  if (!planos || planos.length === 0) {
    return (
      <div
        role="status"
        className={`rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600 ${className ?? ''}`}
      >
        Selecione ao menos 2 planos para comparar.
      </div>
    );
  }

  if (planos.length === 1) {
    return (
      <div
        role="status"
        className={`rounded-lg border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-800 ${className ?? ''}`}
      >
        É necessário pelo menos 2 planos para usar o comparador. Adicione outro
        plano na seleção.
      </div>
    );
  }

  const wrapperClasses = `space-y-6 ${className ?? ''}`;
  const planosCount = planos.length;
  const captionText = `Comparativo Amil — ${planos.map((p) => p.nome).join(' × ')}`;

  return (
    <div className={wrapperClasses}>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className={TABLE_BASE_CLASSES}>
          <caption className={CAPTION_CLASSES}>{captionText}</caption>
          <thead className={THEAD_CLASSES}>
            <tr>
              <th scope="col" className={TH_COL_CLASSES}>
                Característica
              </th>
              {planos.map((plano) => (
                <th
                  key={plano.slug}
                  scope="col"
                  className={`${TH_COL_CLASSES} text-left`}
                >
                  <span className="block text-base font-semibold">
                    {plano.nome}
                  </span>
                  <span className="mt-0.5 block text-xs font-normal text-teal-50">
                    Tier {plano.tier}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURE_ROWS.map((row) => (
              <tr key={row.id} className={ROW_CLASSES}>
                <th scope="row" className={TH_ROW_CLASSES}>
                  <span className="block">{row.label}</span>
                  {row.descricao && (
                    <span className="mt-1 block text-xs font-normal text-slate-600">
                      {row.descricao}
                    </span>
                  )}
                </th>
                {planos.map((plano) => (
                  <FeatureCell
                    key={`${plano.slug}-${row.id}`}
                    value={plano.features[row.id]}
                  />
                ))}
              </tr>
            ))}
            {/* Row final: CTAs */}
            <tr className={`${ROW_CLASSES} bg-sky-50`}>
              <th scope="row" className={TH_ROW_CLASSES}>
                <span className="block">Solicitar cotação</span>
                <span className="mt-1 block text-xs font-normal text-slate-600">
                  Personalizada por porte e perfil
                </span>
              </th>
              {planos.map((plano) => (
                <td key={`cta-${plano.slug}`} className={TD_CLASSES}>
                  <Link
                    href={`${cotacaoBaseUrl}?plano=${plano.slug}`}
                    className="inline-block rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                    aria-label={`Quero cotação Amil ${plano.nome}`}
                  >
                    Quero esse →
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
          <tfoot className={TFOOT_CLASSES}>
            <tr>
              <td colSpan={planosCount + 1} className="px-4 py-3">
                Comparativo informativo. Valores e coberturas sujeitos a
                análise contratual da operadora. Confirme com a BeneficioRH
                (SUSEP 201054484) antes de contratar.
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
