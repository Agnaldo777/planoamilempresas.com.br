/**
 * Disclaimers canônicos da rede credenciada Amil.
 *
 * Fonte única de verdade para a Mitigação 1 do ADR-006 (URL-as-Trademark Policy).
 * Reusado por todas as páginas que mencionam marca/produto Amil em URL ou texto:
 *   - Story 7.2  (hub /rede-credenciada)
 *   - Story 7.4b (páginas-prestador)
 *   - Story 7.6  (páginas-bairro)
 *   - Story 7.7  (Cluster E /rede/[redeSlug]/[uf]) — gate ADR-006
 *   - Story 7.8  (tipo × UF × município)
 *
 * NÃO duplicar este texto inline em páginas — importar daqui (DRY enforced).
 *
 * @see docs/decisions/adr-006-url-as-trademark-policy.md §Decision → Mitigação 1
 * @see docs/editorial/brand-usage-policy.md
 */

/** Registro da operadora Amil na ANS (referência factual, não promocional). */
export const AMIL_ANS_REGISTRO = '326305' as const;

/** Registro SUSEP do corretor (BeneficioRH). */
export const CORRETOR_SUSEP = '201054484' as const;

/** Razão social completa da operadora (para atribuição inequívoca). */
export const AMIL_RAZAO_SOCIAL =
  'Amil Assistência Médica Internacional S.A.' as const;

/** Canal oficial da operadora — usado também em `Organization.sameAs`. */
export const AMIL_SITE_OFICIAL = 'https://www.amil.com.br' as const;

/**
 * Disclaimer canônico (ADR-006 Mitigação 1).
 * Renderizar no TOPO e no RODAPÉ de toda página de rede credenciada.
 */
export const DISCLAIMER_AMIL_REDE: string =
  `Corretor autorizado a intermediar planos da ${AMIL_RAZAO_SOCIAL} ` +
  `(registro ANS nº ${AMIL_ANS_REGISTRO}). Este site é independente; ` +
  `não substitui canais oficiais Amil.`;

/**
 * Variante curta para uso em rodapé compacto / metadados.
 */
export const DISCLAIMER_AMIL_REDE_CURTO: string =
  `Site independente de corretor autorizado (SUSEP ${CORRETOR_SUSEP}). ` +
  `Não é canal oficial da Amil (ANS ${AMIL_ANS_REGISTRO}).`;

/**
 * Props canônicas para `<OrganizationJsonLd />` (ADR-006 Mitigação 2).
 * Garante `sameAs` apontando para o canal oficial Amil em todas as páginas.
 */
export const ORGANIZATION_JSONLD_DEFAULTS = {
  name: 'BeneficioRH (corretor)',
  sameAs: [AMIL_SITE_OFICIAL],
} as const;
