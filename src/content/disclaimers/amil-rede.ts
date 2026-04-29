/**
 * Disclaimers canônicos da rede credenciada Amil.
 *
 * Source-of-truth único — reusado por:
 *   - Story 7.2 (hub /rede-credenciada): topo do <NetworkSearch /> + footer
 *   - Story 7.4 (páginas-prestador): footer
 *   - Story 7.6 (páginas-bairro): footer
 *   - Story 7.7 (Cluster E rede × UF): topo + footer (ADR-006 mit. 1)
 *   - Story 7.8 (tipo × UF × município): footer
 *
 * NUNCA duplicar texto em components — sempre importar daqui.
 *
 * Conformidade:
 *   - ADR-006 mitigação 1 (URL-as-Trademark Policy)
 *   - NFR8 (uso de marca Amil — corretor autorizado)
 *   - SUSEP 201054484 (corretor pessoa física Agnaldo Silva)
 *   - ANS 326305 (operadora Amil — referência de fonte oficial)
 */

/**
 * Texto principal do disclaimer ANS + corretor SUSEP.
 *
 * Formato canônico do ADR-006 §"5 Mitigações obrigatórias" item 1:
 * "Corretor autorizado a intermediar planos da Amil Assistência Médica
 * Internacional S.A. (registro ANS nº 326305). Este site é independente;
 * não substitui canais oficiais Amil."
 *
 * Story 7.2 + outras Epic 7 importam DISCLAIMER_AMIL_REDE para renderizar
 * em footer + topo do hub.
 */
export const DISCLAIMER_AMIL_REDE = `Corretor autorizado a intermediar planos da Amil Assistência Médica Internacional S.A. (registro ANS nº 326305). Este site é independente; não substitui canais oficiais Amil. Para informações oficiais sempre consulte amil.com.br ou o aplicativo oficial Amil. Corretor BeneficioRH — Agnaldo Silva, SUSEP 201054484.`;

/**
 * Aviso de freshness do dataset Power BI Amil.
 *
 * Renderizado próximo aos números de prestadores/UFs/municípios para
 * indicar quando os dados foram capturados (mitiga risk de exibir
 * dados desatualizados — Story 7.10 atualiza mensalmente via cron).
 *
 * Uso: `${DISCLAIMER_REDE_FRESHNESS} ${dataset.geradoEm}`
 */
export const DISCLAIMER_REDE_FRESHNESS = 'Rede sujeita a alterações pela operadora. Última atualização do dataset:';

/**
 * Aviso curto para hover/tooltip em chips de redes/produtos.
 *
 * Uso em micro-copy onde o disclaimer completo não cabe (chips de UF,
 * dropdown de redes, etc.).
 */
export const DISCLAIMER_REDE_SHORT = 'Verifique sempre na fonte oficial Amil antes de procedimentos.';
