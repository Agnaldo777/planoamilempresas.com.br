/**
 * SKU-mínimo de acesso por prestador (Onda 2 — plano Atlas 2026-06-14).
 *
 * Traduz os códigos brutos de rede do dataset Power BI (ex: "AMIL S380 QP")
 * para o PLANO de entrada que dá acesso ao prestador — o gancho de decisão
 * "qual o plano mais barato que me atende neste hospital?". É o diferencial
 * sobre os EMDs thin, que listam só nomes de rede sem traduzir em produto/preço.
 *
 * Usa o dado real `prestador.redes` (não heurística de nome). Valores "desde"
 * são REFERÊNCIA por vida, sujeitos a cotação (feedback_claims_metricas).
 */

import type { PrestadorAmil } from '@/lib/operadoras/amil/rede-credenciada-loader';

export type NivelAcesso = 'adesao' | 'entrada' | 'intermediario' | 'premium';

export interface ProdutoAcesso {
  /** Ordem de acesso: menor = mais barato/acessível. */
  ordem: number;
  /** Nome comercial do produto. */
  produto: string;
  /** Slug em /planos/[slug] (null para adesão Medial, sem página dedicada). */
  planoSlug: string | null;
  /** Valor de referência por vida. */
  desde: string;
  nivel: NivelAcesso;
}

/**
 * Mapa código de rede (dataset Power BI) → produto/plano de entrada.
 * Cobre as 11 redes ativas do dataset (2026-04-26).
 */
const REDE_PARA_PRODUTO: Record<string, ProdutoAcesso> = {
  'ADESÃO BRONZE RJ': { ordem: 5, produto: 'Adesão Bronze (linha Medial)', planoSlug: null, desde: 'sob consulta', nivel: 'adesao' },
  'ADESÃO BRONZE SP': { ordem: 5, produto: 'Adesão Bronze (linha Medial)', planoSlug: null, desde: 'sob consulta', nivel: 'adesao' },
  'ADESÃO OURO MAIS': { ordem: 8, produto: 'Adesão Ouro Mais (linha Medial)', planoSlug: null, desde: 'sob consulta', nivel: 'adesao' },
  'AMIL S380 QP': { ordem: 10, produto: 'Amil S380', planoSlug: 'amil-s380', desde: 'R$ 165,52', nivel: 'entrada' },
  'AMIL S380 QC': { ordem: 10, produto: 'Amil S380', planoSlug: 'amil-s380', desde: 'R$ 165,52', nivel: 'entrada' },
  'AMIL S450 QP': { ordem: 20, produto: 'Amil S450', planoSlug: 'amil-s450', desde: 'R$ 184,21', nivel: 'intermediario' },
  'AMIL S450 QC': { ordem: 20, produto: 'Amil S450', planoSlug: 'amil-s450', desde: 'R$ 184,21', nivel: 'intermediario' },
  'AMIL S580 QP': { ordem: 25, produto: 'Amil S580', planoSlug: 'amil-s580', desde: 'sob consulta', nivel: 'intermediario' },
  'AMIL S750 QP': { ordem: 30, produto: 'Amil S750', planoSlug: 'amil-s750', desde: 'R$ 251,95', nivel: 'intermediario' },
  'AMIL ONE S6500 BLACK QP': { ordem: 50, produto: 'Amil One S6500 Black', planoSlug: 'amil-one-s6500-black', desde: 'R$ 591,63', nivel: 'premium' },
  BLACK: { ordem: 50, produto: 'Amil One / Black', planoSlug: 'amil-one-s6500-black', desde: 'R$ 591,63', nivel: 'premium' },
};

/**
 * Retorna o plano de ENTRADA (mais barato) que credencia o prestador,
 * ou null se nenhuma rede do prestador está mapeada.
 */
export function getSkuMinimo(prestador: PrestadorAmil): ProdutoAcesso | null {
  const mapeadas = prestador.redes
    .map((r) => REDE_PARA_PRODUTO[r])
    .filter((x): x is ProdutoAcesso => Boolean(x));
  if (mapeadas.length === 0) return null;
  return mapeadas.reduce((min, cur) => (cur.ordem < min.ordem ? cur : min));
}

/**
 * Lista (ordenada, sem duplicatas) dos produtos que credenciam o prestador —
 * do mais acessível ao premium. Usado para a "escada de acesso" na página.
 */
export function getProdutosAcesso(prestador: PrestadorAmil): ProdutoAcesso[] {
  const vistos = new Set<string>();
  return prestador.redes
    .map((r) => REDE_PARA_PRODUTO[r])
    .filter((x): x is ProdutoAcesso => Boolean(x))
    .sort((a, b) => a.ordem - b.ordem)
    .filter((x) => {
      if (vistos.has(x.produto)) return false;
      vistos.add(x.produto);
      return true;
    });
}
