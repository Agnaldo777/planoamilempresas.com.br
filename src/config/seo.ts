/**
 * Thresholds e constantes de SEO programático (anti-thin content).
 *
 * Centraliza os mínimos de prestadores por tipo de página de rede para que
 * o filtro de `generateStaticParams` seja consistente e testável.
 */

/**
 * Mínimo de prestadores para gerar uma página Cluster E `/rede/[redeSlug]/[uf]`
 * (Story 7.7). Combinações com 0 ou 1 prestador são thin → `notFound()`.
 *
 * Rationale (ADR-005 + Story 7.7 Dev Notes): rede × UF tolera mais cauda que
 * bairro (=3) porque a intenção pre-purchase é alta; 2 (ex.: 1 hospital + 1
 * outro) já forma lista relevante.
 */
export const MIN_PRESTADORES_REDE_UF = 2 as const;

/** Limite de itens no `ItemList` JSON-LD das páginas de rede (Story 7.7 AC6). */
export const ITEMLIST_MAX_PRESTADORES = 30 as const;

/**
 * Mínimo de prestadores para um bairro ser INDEXÁVEL (Story 7.6).
 * Bairros com 1-2 prestadores são gerados como SSG porém `noindex,follow`
 * + canonical para a cidade-pai (preserva link equity — O-3 Caminho A).
 */
export const MIN_PRESTADORES_BAIRRO = 3 as const;

/** Mínimo de prestadores de um tipo no município para gerar página (Story 7.8). */
export const MIN_PRESTADORES_TIPO = 3 as const;

/**
 * Allowlist dos 8 tipos válidos como segmento de URL (Story 7.8 AC2),
 * mapeando slug de URL → `TipoAtendimentoInferido` do loader.
 * `'Outro'` é intencionalmente excluído (slug genérico, thin).
 */
export const TIPO_SLUG_TO_INFERIDO = {
  hospital: 'Hospital',
  laboratorio: 'Laboratório',
  clinica: 'Clínica',
  'diagnostico-imagem': 'Diagnóstico por Imagem',
  maternidade: 'Maternidade',
  'pronto-socorro': 'Pronto-Socorro',
  odontologia: 'Odontologia',
  'centro-instituto': 'Centro/Instituto',
} as const;

export type TipoSlug = keyof typeof TIPO_SLUG_TO_INFERIDO;
