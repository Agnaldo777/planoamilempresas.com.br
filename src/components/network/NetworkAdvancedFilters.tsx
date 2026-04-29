'use client';

/**
 * `<NetworkAdvancedFilters />` — Story 7.2 AC3 (filtros progressivos).
 *
 * Renderiza Accordion (Radix) com 2 grupos:
 *   1. Tipo de prestador (8 chips multi-select)
 *   2. Rede/Produto Amil (combobox 11 redes ativas)
 *
 * **NÃO** inclui campo "Especialidade" (gap dataset Power BI confirmed
 * em FE Spec v1.1 linha 761 + ADR-007).
 *
 * Componente é controlled — pai (NetworkSearch) gerencia state via callbacks
 * `onTipoChange` e `onRedeChange`. Props `selectedTipos` / `selectedRede`
 * permitem render server-side inicial sem hidration mismatch.
 *
 * a11y:
 *   - Radix Accordion fornece keyboard nav nativo
 *   - role="group" + aria-labelledby em cada section
 *   - Chips são <button type="button"> com aria-pressed
 */

import * as Accordion from '@radix-ui/react-accordion';
import type { ReactElement } from 'react';

import {
  REDES_AMIL_ATIVAS,
  type RedeAmilNome,
  type TipoAtendimentoInferido,
} from '@/types/rede-credenciada-amil';

const TIPOS: readonly TipoAtendimentoInferido[] = [
  'Hospital',
  'Pronto-Socorro',
  'Maternidade',
  'Clínica',
  'Laboratório',
  'Diagnóstico por Imagem',
  'Centro/Instituto',
  'Odontologia',
] as const;

interface NetworkAdvancedFiltersProps {
  /** Tipos atualmente selecionados (multi-select). */
  selectedTipos: readonly TipoAtendimentoInferido[];
  /** Rede atualmente selecionada (single-select via combobox). null = nenhuma. */
  selectedRede: RedeAmilNome | null;
  /** Callback ao toggle de um chip de tipo. */
  onTipoChange: (tipo: TipoAtendimentoInferido) => void;
  /** Callback ao escolher rede no select. */
  onRedeChange: (rede: RedeAmilNome | null) => void;
}

export function NetworkAdvancedFilters({
  selectedTipos,
  selectedRede,
  onTipoChange,
  onRedeChange,
}: NetworkAdvancedFiltersProps): ReactElement {
  return (
    <Accordion.Root
      type="multiple"
      defaultValue={['tipo', 'rede']}
      className="my-6 rounded-lg border border-gray-200 bg-white"
      data-testid="network-advanced-filters"
    >
      <Accordion.Item value="tipo" className="border-b border-gray-200 last:border-b-0">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50">
            <span>
              Tipo de prestador
              {selectedTipos.length > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-amil-blue/10 px-2 py-0.5 text-xs font-medium text-amil-blue">
                  {selectedTipos.length}
                </span>
              )}
            </span>
            <span className="text-gray-400 group-data-[state=open]:rotate-180 transition-transform" aria-hidden="true">
              ▼
            </span>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content
          className="px-4 pb-4 pt-1"
          role="group"
          aria-labelledby="tipo-group-label"
        >
          <span id="tipo-group-label" className="sr-only">
            Filtrar por tipo de prestador (multi-seleção)
          </span>
          <div className="flex flex-wrap gap-2">
            {TIPOS.map((tipo) => {
              const isSelected = selectedTipos.includes(tipo);
              return (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => onTipoChange(tipo)}
                  aria-pressed={isSelected}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    isSelected
                      ? 'border-amil-blue bg-amil-blue text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-amil-blue hover:text-amil-blue'
                  }`}
                  data-tipo={tipo}
                >
                  {tipo}
                </button>
              );
            })}
          </div>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="rede">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50">
            <span>
              Rede / Produto Amil
              {selectedRede !== null && (
                <span className="ml-2 inline-flex items-center rounded-full bg-amil-blue/10 px-2 py-0.5 text-xs font-medium text-amil-blue">
                  1
                </span>
              )}
            </span>
            <span className="text-gray-400 group-data-[state=open]:rotate-180 transition-transform" aria-hidden="true">
              ▼
            </span>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content
          className="px-4 pb-4 pt-1"
          role="group"
          aria-labelledby="rede-group-label"
        >
          <span id="rede-group-label" className="sr-only">
            Filtrar por rede ou produto Amil (uma rede por vez)
          </span>
          <select
            value={selectedRede ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              onRedeChange(value === '' ? null : (value as RedeAmilNome));
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amil-blue focus:outline-none focus:ring-2 focus:ring-amil-blue/20"
            data-testid="rede-select"
            aria-label="Selecionar rede ou produto Amil"
          >
            <option value="">Todas as redes</option>
            {REDES_AMIL_ATIVAS.map((rede) => (
              <option key={rede} value={rede}>
                {rede}
              </option>
            ))}
          </select>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
