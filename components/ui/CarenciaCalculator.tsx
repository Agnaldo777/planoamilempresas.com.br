'use client';

/**
 * CarenciaCalculator — Story 3.20 (FR39)
 *
 * Widget client-side single-purpose: usuário informa **data de contratação**
 * e o componente calcula a **data prevista de liberação** para cada categoria
 * de carência (ANS RN 195/2009).
 *
 * **Decisões de design:**
 *   - `'use client'` apenas pelo input controlado (`useState`); zero deps.
 *   - Markup `<table>` semântico (alinha Story 3.24 / FR52).
 *   - Paleta Opção A: slate-900, teal-600, amber-700, sky-600.
 *   - WCAG AA: `<label>` para input, `aria-live="polite"` no resultado,
 *     foco visível, contraste ≥ 4.5:1.
 *   - SSG-friendly: o componente roda no client mas markup inicial é
 *     renderizado no server (Next.js App Router default).
 *
 * **Compliance regulatória (AC3.20.3):**
 *   - Disclaimer obrigatório no rodapé do widget.
 *   - Prazos = limites mínimos legais ANS; PME 30+ pode ter isenção.
 *   - Não promete nada — sempre "carência mínima estimada".
 */

import { useMemo, useState } from 'react';
import {
  CARENCIAS_AMIL_ORDENADAS,
  adicionarDias,
  formatarDataBR,
  parseDataInput,
  type CarenciaItem,
} from '@/data/carencias';

interface CarenciaCalculatorProps {
  /** Data inicial em formato `yyyy-mm-dd`. Se omitido, usa hoje. */
  defaultDate?: string;
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
const TD_CLASSES = 'px-4 py-3 text-slate-900';
const ROW_CLASSES =
  'border-t border-slate-200 transition-colors hover:bg-sky-50';

function todayISO(): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

interface LinhaCalculada {
  item: CarenciaItem;
  dataLiberacao: string | null;
}

export function CarenciaCalculator({
  defaultDate,
  className,
}: CarenciaCalculatorProps) {
  const initial = defaultDate ?? todayISO();
  const [dataInicio, setDataInicio] = useState<string>(initial);

  const linhas = useMemo<LinhaCalculada[]>(() => {
    const parsed = parseDataInput(dataInicio);
    return CARENCIAS_AMIL_ORDENADAS.map((item) => ({
      item,
      dataLiberacao: parsed
        ? formatarDataBR(adicionarDias(parsed, item.dias))
        : null,
    }));
  }, [dataInicio]);

  const dataValida = parseDataInput(dataInicio) !== null;

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-6 shadow-sm ${className ?? ''}`}
    >
      <div className="mb-6">
        <label
          htmlFor="carencia-data-inicio"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Data de contratação do plano
        </label>
        <input
          id="carencia-data-inicio"
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          aria-describedby="carencia-data-help"
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1"
        />
        <p id="carencia-data-help" className="mt-2 text-xs text-slate-600">
          Selecione a data de início da vigência do contrato Amil. As datas
          de liberação serão recalculadas automaticamente.
        </p>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="overflow-x-auto rounded-lg border border-slate-200"
      >
        <table className={TABLE_BASE_CLASSES}>
          <caption className={CAPTION_CLASSES}>
            Datas previstas de liberação por categoria — limites máximos ANS
          </caption>
          <thead className={THEAD_CLASSES}>
            <tr>
              <th scope="col" className={TH_COL_CLASSES}>
                Categoria
              </th>
              <th scope="col" className={TH_COL_CLASSES}>
                Carência
              </th>
              <th scope="col" className={TH_COL_CLASSES}>
                Liberação prevista
              </th>
            </tr>
          </thead>
          <tbody>
            {linhas.map(({ item, dataLiberacao }) => (
              <tr key={item.id} className={ROW_CLASSES}>
                <th scope="row" className={TH_ROW_CLASSES}>
                  <span className="block">{item.categoria}</span>
                  <span className="mt-1 block text-xs font-normal text-slate-600">
                    {item.baseLegal}
                  </span>
                </th>
                <td className={TD_CLASSES}>
                  <span className="font-medium tabular-nums">
                    {item.dias === 0 ? 'Imediato' : `${item.dias} dias`}
                  </span>
                </td>
                <td className={TD_CLASSES}>
                  {dataLiberacao ? (
                    <span className="font-semibold tabular-nums text-teal-700">
                      {dataLiberacao}
                    </span>
                  ) : (
                    <span
                      className="text-amber-700"
                      aria-label="Data inválida — informe data de contratação"
                    >
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!dataValida && (
        <p className="mt-3 text-sm text-amber-700" role="alert">
          Data inválida. Use o seletor para escolher uma data válida.
        </p>
      )}

      <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-slate-700">
        <p className="font-semibold text-amber-700">
          Disclaimer ANS — leia antes de decidir.
        </p>
        <p className="mt-2">
          Os prazos exibidos correspondem aos <strong>limites máximos legais</strong>{' '}
          regulamentados pela ANS (RN 195/2009 + atualizações). Empresas com 30+
          vidas geralmente têm <strong>isenção total de carência</strong>{' '}
          negociada comercialmente. Cobertura Parcial Temporária (CPT) pode ser
          aplicada para Doenças e Lesões Preexistentes (DLP) declaradas, por até
          24 meses (720 dias). Confirme as carências exatas na proposta
          comercial antes de assinar — elas dependem do produto Amil contratado
          e do porte da empresa.
        </p>
      </div>
    </div>
  );
}
