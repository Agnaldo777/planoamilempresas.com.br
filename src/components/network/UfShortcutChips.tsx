/**
 * `<UfShortcutChips />` — Story 7.2 AC4 (FE Spec Screen 7 v1.1).
 *
 * Renderiza chips horizontais com top-5 UFs por densidade de prestadores
 * + chip overflow (`+N`) que abre drawer com lista das 26 UFs.
 *
 * Stats consumidas via prop `porUF` de `getEstatisticasRede()` (loader 7.1).
 * Componente é puro (RSC) — drawer interativo será wrapper Client em Story 7.x
 * posterior, se necessário.
 *
 * Story 7.4 (páginas-prestador) reusa este componente como "Outras cidades de
 * {UF}" drawer footer.
 *
 * Critério visual da FE Spec linha 754:
 *   [RJ 3.696] [SP 2.996] [DF 447] [PR 394] [MG XXX] [+22]
 */

import type { ReactElement } from 'react';

import type { EstatisticasRede } from '@/types/rede-credenciada-amil';

interface UfShortcutChipsProps {
  /** Stats `porUF` do loader (UF -> total prestadores). */
  porUF: EstatisticasRede['porUF'];
  /**
   * Top N UFs a exibir antes do chip overflow `+N`. Default 5.
   * FE Spec especifica 5 mas pode ser customizado.
   */
  topN?: number;
}

/**
 * Formata número como `3.696` (pt-BR thousands separator).
 */
function formatBR(n: number): string {
  return n.toLocaleString('pt-BR');
}

/**
 * Ordena UFs por contagem desc + retorna top N + remaining count.
 */
function sortAndSplit(
  porUF: EstatisticasRede['porUF'],
  topN: number
): { top: Array<readonly [string, number]>; remaining: number } {
  const sorted = Object.entries(porUF).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, topN);
  const remaining = sorted.length - topN;
  return { top, remaining };
}

export function UfShortcutChips({
  porUF,
  topN = 5,
}: UfShortcutChipsProps): ReactElement {
  const { top, remaining } = sortAndSplit(porUF, topN);

  return (
    <nav
      aria-label="Atalhos por estado (top UFs por densidade de prestadores)"
      className="my-6"
    >
      <ul className="flex flex-wrap gap-2">
        {top.map(([uf, total]) => (
          <li key={uf}>
            <span
              className="inline-flex items-center gap-2 rounded-full border border-amil-blue/30 bg-amil-blue/5 px-3 py-1.5 text-sm font-medium text-amil-blue hover:bg-amil-blue/10"
              data-uf={uf}
            >
              <span className="font-bold">{uf}</span>
              <span className="text-xs opacity-75">{formatBR(total)}</span>
            </span>
          </li>
        ))}
        {remaining > 0 && (
          <li>
            <span
              className="inline-flex items-center rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
              aria-label={`Mais ${remaining} UFs disponíveis`}
            >
              +{remaining} UFs
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
}
