/**
 * Dados canônicos do corretor (BeneficioRH) — E-E-A-T + NAP.
 *
 * Fonte única para blocos de "corretor local", microcopy de confiança e schema.
 * O E-E-A-T de corretora autorizada (SUSEP visível, NAP consistente, prova
 * social) é diferencial de Trust em nicho YMYL — captura o que o satélite
 * Bradesco acerta, aplicado às páginas de rede que já têm dado real.
 *
 * ADR-006: somos corretor INDEPENDENTE autorizado a intermediar Amil — nunca
 * a própria Amil. Sem logo/trade dress da operadora.
 */

import { CORRETOR_SUSEP } from '@/content/disclaimers/amil-rede';

export const BROKER_INFO = {
  nome: 'BeneficioRH',
  razaoSocial: 'BeneficioRH Corretora de Seguros',
  cnpj: '14.764.085/0001-99',
  susep: CORRETOR_SUSEP, // 201054484
  whatsapp: '5511926510515',
  whatsappDisplay: '(11) 92651-0515',
  email: 'beneficiorh@gmail.com',
  respostaHoras: 2,
  reclameAquiNota: '7,7',
} as const;

/**
 * Monta o link wa.me com mensagem contextual por cidade (ou genérica).
 */
export function whatsappLink(contexto?: string): string {
  const base = contexto
    ? `Olá! Gostaria de uma cotação de plano Amil empresarial${contexto}.`
    : 'Olá! Gostaria de uma cotação de plano Amil empresarial.';
  return `https://wa.me/${BROKER_INFO.whatsapp}?text=${encodeURIComponent(base)}`;
}
