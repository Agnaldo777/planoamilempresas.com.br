/**
 * Ponte de tráfego para o site de plano por ADESÃO (planodeadesao.com.br).
 *
 * Este site é EMPRESARIAL (B2B). Quando um prestador só atende Amil por adesão
 * (pessoa física via entidade de classe), o honesto é dizer isso e encaminhar
 * o visitante ao produto certo — em vez de fingir um "plano de entrada PME".
 *
 * `DISPONIVEL` deve virar `true` quando o planodeadesao.com.br estiver no ar
 * (domínio registrado + deploy). Enquanto false, mostramos a explicação honesta
 * e o WhatsApp do corretor, sem link externo que daria 404.
 */
export const ADESAO_SITE = {
  url: 'https://planosdesaudeadesao.com.br',
  nome: 'Planos de Saúde por Adesão',
  /** Trocar para true quando o site de adesão estiver publicado. */
  DISPONIVEL: false,
} as const;
