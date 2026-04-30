/**
 * `<NetworkResultCard />` — Story 7.2 AC2/AC3 (FE Spec Screen 7 v1.1).
 *
 * Renderiza um prestador da rede credenciada Amil em formato de card.
 * Reusado por:
 *   - Story 7.2 (hub /rede-credenciada): resultados da busca
 *   - Story 7.5 (página-cidade): lista de prestadores
 *   - Story 7.6 (páginas-bairro): lista local
 *   - Story 7.8 (tipo×UF×município): lista filtrada
 *
 * Conformidade FE Spec v1.1 (linhas 786):
 *   - Nome + bairro + município + UF + tipo (badge) + chips de redes
 *   - SEM endereço completo (gap dataset Power BI)
 *   - SEM telefone (gap)
 *   - SEM especialidades médicas (gap conhecido — confirmado ADR-007)
 *
 * RSC-friendly. Para futuras interações (favoritar, etc.), Story 7.x
 * pode wrappar em Client Component.
 */

import type { ReactElement } from 'react';

import type { PrestadorAmil } from '@/types/rede-credenciada-amil';

interface NetworkResultCardProps {
  prestador: PrestadorAmil;
  /**
   * Limite de chips de redes a exibir. Default 3 (espaço card).
   * Se prestador tem mais redes, mostra `+N` indicator.
   */
  maxRedeChips?: number;
  /**
   * Quando true, exibe link "Ver detalhes →" para `/rede/[uf]/[municipio]/[prestadorSlug]/`
   * (Story 7.4). Default false até 7.4 ser implementada.
   */
  showDetailLink?: boolean;
}

const TIPO_ICONS: Record<string, string> = {
  Hospital: '🏥',
  'Pronto-Socorro': '🚑',
  Maternidade: '👶',
  Clínica: '🏨',
  Laboratório: '🔬',
  'Diagnóstico por Imagem': '📷',
  'Centro/Instituto': '🏛️',
  Odontologia: '🦷',
  Outro: '⚕️',
};

export function NetworkResultCard({
  prestador,
  maxRedeChips = 3,
  showDetailLink = false,
}: NetworkResultCardProps): ReactElement {
  const visibleRedes = prestador.redes.slice(0, maxRedeChips);
  const remainingCount = prestador.redes.length - visibleRedes.length;
  const tipoIcon = TIPO_ICONS[prestador.tipoInferido] ?? '⚕️';

  return (
    <article
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
      data-prestador-codigo={prestador.codigo}
      data-prestador-tipo={prestador.tipoInferido}
    >
      <header className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">
          {tipoIcon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 leading-tight">
            {prestador.nome}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {prestador.bairro && (
              <>
                <span>{prestador.bairro}</span>
                <span aria-hidden="true"> · </span>
              </>
            )}
            <span>{prestador.municipio}</span>
            <span aria-hidden="true"> · </span>
            <span className="font-medium">{prestador.uf}</span>
          </p>
        </div>
      </header>

      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-amil-blue/10 px-2.5 py-0.5 text-xs font-medium text-amil-blue">
          {prestador.tipoInferido}
        </span>
      </div>

      {visibleRedes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="sr-only">Aceita as redes:</span>
          {visibleRedes.map((rede) => (
            <span
              key={rede}
              className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
            >
              {rede}
            </span>
          ))}
          {remainingCount > 0 && (
            <span
              className="inline-flex items-center rounded bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500"
              aria-label={`mais ${remainingCount} redes`}
            >
              +{remainingCount}
            </span>
          )}
        </div>
      )}

      {showDetailLink && (
        <p className="mt-3 text-right">
          <span className="text-sm font-medium text-amil-blue">
            Ver detalhes →
          </span>
        </p>
      )}
    </article>
  );
}
