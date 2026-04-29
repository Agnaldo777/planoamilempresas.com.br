/**
 * PriceTable — Story 3.24 (FR52 PRD v1.3.1)
 *
 * Tabela de preços HTML semântica com `<caption>`, `<thead>`, `<tbody>`,
 * `<th scope="col">` (faixas etárias) e `<th scope="row">` (nome do plano).
 * Markup é table real (não div/grid) para Featured Snippet do Google e
 * acessibilidade WCAG 2.1 AA (NFR9).
 *
 * **Decisões de design:**
 *   - RSC (zero JS client-side) — sem useState; filtro/sort em escopo Story 6.1
 *   - Paleta Opção A: slate-900, teal-600, amber-700, sky-600
 *   - Responsivo via CSS (overflow-x-auto), markup permanece `<table>` no mobile
 *   - Backward compat: signature legacy `{ planoNome, precos }` preservada via
 *     prop `legacy` (deprecated, será removida em v2)
 *
 * **Featured Snippet target:** estrutura `<table><caption><thead><tbody>` é
 * detectada pelo Google crawler como "Tabela" rich result. Diferenciação vs
 * concorrentes que usam div/CSS Grid (sem semântica).
 */

import { formatCurrency } from '@/lib/utils/format';

/** Linha de dados — uma faixa etária + valor. Backward compat com Story 6.1 legacy. */
export interface PriceRow {
  faixa_etaria: string;
  preco: number;
}

/** Estrutura matriz: planos[] × faixas[]. Story 3.24 / FR52. */
export interface PriceTableData {
  /** Lista de faixas etárias (ordem das colunas em `<thead>`). */
  faixaEtarias: readonly string[];
  /** Lista de planos com nome + preços por faixa. */
  planos: ReadonlyArray<{
    /** Identificador único do plano (usado em key React). */
    id: string;
    /** Nome legível do plano (ex: "Bronze QC"). */
    nome: string;
    /** Mapping faixa → preço; faixa ausente ou preço 0/null → "—" indisponível. */
    precos: Readonly<Record<string, number | null | undefined>>;
  }>;
  /** Texto do `<caption>` (descritivo, ex: "Tabela Amil PME São Paulo — Atualizada em 04/2026"). */
  caption: string;
  /** Texto opcional para `<tfoot>` (ex: data de atualização, disclaimer). */
  footnote?: string;
}

interface PriceTableProps {
  /** Modo principal — matriz planos × faixas. */
  data?: PriceTableData;
  /**
   * @deprecated Backward compat com Story 6.1 — modo legacy single-plano.
   * Usar `data` para nova matriz. Remoção planejada em v2.
   */
  planoNome?: string;
  /**
   * @deprecated Backward compat com Story 6.1 — array de linhas single-plano.
   */
  precos?: readonly PriceRow[];
  /** Classe CSS extra opcional para o wrapper. */
  className?: string;
}

const TABLE_BASE_CLASSES =
  'w-full border-collapse text-left text-sm text-slate-900';

const CAPTION_CLASSES =
  'caption-top px-4 py-3 text-left text-base font-semibold text-slate-900';

const THEAD_CLASSES = 'bg-teal-600 text-white';
const TH_COL_CLASSES = 'px-4 py-3 font-semibold text-sm';
const TH_ROW_CLASSES =
  'px-4 py-3 text-left font-semibold text-slate-900 bg-slate-50';
const TD_CLASSES = 'px-4 py-3 text-right tabular-nums text-slate-900';
const ROW_CLASSES =
  'border-t border-slate-200 transition-colors hover:bg-sky-50';
const TFOOT_CLASSES =
  'border-t-2 border-slate-200 bg-slate-50 text-xs text-slate-600';

/**
 * Renderiza uma célula de preço — `formatCurrency` se número válido,
 * placeholder "—" caso contrário (estado "indisponível" graceful, AC3.24.6).
 */
function PriceCell({ value }: { value: number | null | undefined }) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return (
      <td className={TD_CLASSES} aria-label="Preço indisponível">
        —
      </td>
    );
  }
  return <td className={TD_CLASSES}>{formatCurrency(value)}</td>;
}

/**
 * PriceTable — RSC server-rendered HTML semântico.
 *
 * Modos:
 *   1. Matriz (recomendado): `<PriceTable data={data} />`
 *   2. Legacy single-plano (backward compat): `<PriceTable planoNome="X" precos={...} />`
 */
export function PriceTable({ data, planoNome, precos, className }: PriceTableProps) {
  // Backward compat: converte legacy → matriz
  if (!data && planoNome && precos) {
    const legacyData: PriceTableData = {
      faixaEtarias: precos.map((p) => p.faixa_etaria),
      planos: [
        {
          id: planoNome,
          nome: planoNome,
          precos: Object.fromEntries(precos.map((p) => [p.faixa_etaria, p.preco])),
        },
      ],
      caption: `Tabela de preços — ${planoNome}`,
      footnote: 'Valores sujeitos a alteração. Consulte condições.',
    };
    return <PriceTable data={legacyData} className={className} />;
  }

  // Estado vazio graceful — sem dados, renderiza fallback acessível
  if (!data || data.planos.length === 0 || data.faixaEtarias.length === 0) {
    return (
      <div
        className={`rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600 ${className ?? ''}`}
        role="status"
      >
        Tabela de preços indisponível no momento.
      </div>
    );
  }

  const wrapperClasses = `overflow-x-auto rounded-lg border border-slate-200 ${className ?? ''}`;

  return (
    <div className={wrapperClasses}>
      <table className={TABLE_BASE_CLASSES}>
        <caption className={CAPTION_CLASSES}>{data.caption}</caption>
        <thead className={THEAD_CLASSES}>
          <tr>
            {/* Coluna identificador da linha — header vazio mas presente para estrutura */}
            <th scope="col" className={TH_COL_CLASSES}>
              Plano
            </th>
            {data.faixaEtarias.map((faixa) => (
              <th
                key={faixa}
                scope="col"
                className={`${TH_COL_CLASSES} text-right`}
              >
                {faixa}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.planos.map((plano) => (
            <tr key={plano.id} className={ROW_CLASSES}>
              <th scope="row" className={TH_ROW_CLASSES}>
                {plano.nome}
              </th>
              {data.faixaEtarias.map((faixa) => (
                <PriceCell key={faixa} value={plano.precos[faixa]} />
              ))}
            </tr>
          ))}
        </tbody>
        {data.footnote && (
          <tfoot className={TFOOT_CLASSES}>
            <tr>
              <td colSpan={data.faixaEtarias.length + 1} className="px-4 py-2">
                {data.footnote}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
