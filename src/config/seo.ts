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
