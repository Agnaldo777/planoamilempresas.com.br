/**
 * Schema AggregateOffer per-Estado — Story 3.23 (FR51)
 *
 * Declara `AggregateOffer` schema.org por UF, com `lowPrice`, `highPrice`,
 * `offerCount`, `priceCurrency: BRL`, `availability: InStock` derivados de
 * dataset (caller injeta `tabelas-amil.ts` ou fixture per-uf).
 *
 * **Estratégia:** AggregateOffer per-estado vence concorrentes que declaram
 * apenas AggregateOffer nacional (gap explorável para SERP regional, ex:
 * "preço plano amil são paulo" deve ter range diferente de "minas gerais").
 *
 * **Compliance:**
 *   - FR51: per-estado lowPrice/highPrice/offerCount derivados do dataset
 *   - FR54: `seller` aponta para Organization @id (BeneficioRH), nunca duplica
 *   - NFR21: schema coverage mínima
 *   - ADR-006: Amil é trademark — só pode aparecer em `Product.brand`
 *
 * **Caller usage** (página estadual `/precos/[uf]/`):
 *   ```ts
 *   import { buildAggregateOfferNode } from '@/lib/schema/aggregate-offer';
 *   const offer = buildAggregateOfferNode({
 *     uf: 'SP',
 *     lowPrice: 111.15,
 *     highPrice: 2717.28,
 *     offerCount: 80,
 *   });
 *   ```
 *
 * **Renovação anual:** `priceValidUntil` é calculado dinamicamente via
 * `getCurrentYear()` (Story 3.22), portanto rola automático com bump da env
 * `NEXT_PUBLIC_CURRENT_YEAR`.
 */

import { getCurrentYear } from '@/lib/seo/title';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

/**
 * Mapeamento UF → nome completo do estado em pt-BR.
 *
 * Cobertura: 27 unidades federativas (26 estados + DF), conforme IBGE.
 * Usado para popular `eligibleRegion.name` (Schema.org AdministrativeArea).
 */
export const UF_TO_ESTADO: Readonly<Record<string, string>> = Object.freeze({
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
});

export interface AggregateOfferInput {
  /** Sigla UF — uppercase 2 chars (ex: 'SP', 'RJ'). */
  uf: string;
  /** Preço mínimo do range em BRL (≥ 0, ≤ highPrice). */
  lowPrice: number;
  /** Preço máximo do range em BRL (≥ lowPrice). */
  highPrice: number;
  /** Quantidade total de offers distintos no UF (planos × faixas × variants). */
  offerCount: number;
  /** Override opcional do BASE_URL para testes ou ambientes alternativos. */
  baseUrl?: string;
}

export interface AggregateOfferNode {
  '@type': 'AggregateOffer';
  priceCurrency: 'BRL';
  lowPrice: string;
  highPrice: string;
  offerCount: number;
  availability: 'https://schema.org/InStock';
  priceValidUntil: string;
  seller: { '@id': string };
  eligibleRegion: {
    '@type': 'AdministrativeArea';
    name: string;
    addressCountry: 'BR';
  };
}

/**
 * Constrói nó AggregateOffer schema.org para uma UF.
 *
 * **Validação:**
 *   - UF deve estar em `UF_TO_ESTADO` (throw se inválida)
 *   - lowPrice ≥ 0
 *   - highPrice ≥ lowPrice
 *   - offerCount inteiro positivo (> 0)
 *
 * **Decisões de schema:**
 *   - `lowPrice` / `highPrice` formatados com 2 casas decimais (string)
 *   - `priceValidUntil` = 31/dez do ano corrente (`getCurrentYear()`)
 *   - `seller` referencia Organization @id (BeneficioRH) — não duplica nó
 *   - `eligibleRegion` é AdministrativeArea (NFR17 escopo Brasil)
 *
 * @throws Error se UF inválida, range inválido, ou offerCount ≤ 0.
 */
export function buildAggregateOfferNode(opts: AggregateOfferInput): AggregateOfferNode {
  const uf = opts.uf?.toUpperCase();
  const estado = uf ? UF_TO_ESTADO[uf] : undefined;
  if (!estado) {
    throw new Error(
      `[aggregate-offer] UF inválida: "${opts.uf}". Aceitos: ${Object.keys(UF_TO_ESTADO).join(', ')}`,
    );
  }

  if (!Number.isFinite(opts.lowPrice) || opts.lowPrice < 0) {
    throw new Error(`[aggregate-offer] lowPrice inválido: ${opts.lowPrice} (UF=${uf})`);
  }
  if (!Number.isFinite(opts.highPrice) || opts.highPrice < opts.lowPrice) {
    throw new Error(
      `[aggregate-offer] highPrice (${opts.highPrice}) deve ser ≥ lowPrice (${opts.lowPrice}) (UF=${uf})`,
    );
  }
  if (!Number.isInteger(opts.offerCount) || opts.offerCount <= 0) {
    throw new Error(
      `[aggregate-offer] offerCount deve ser inteiro > 0 (recebido: ${opts.offerCount}, UF=${uf})`,
    );
  }

  const baseUrl = opts.baseUrl ?? BASE_URL;
  const year = getCurrentYear();
  const priceValidUntil = `${year}-12-31`;

  return {
    '@type': 'AggregateOffer',
    priceCurrency: 'BRL',
    lowPrice: opts.lowPrice.toFixed(2),
    highPrice: opts.highPrice.toFixed(2),
    offerCount: opts.offerCount,
    availability: 'https://schema.org/InStock',
    priceValidUntil,
    seller: { '@id': `${baseUrl}#organization` },
    eligibleRegion: {
      '@type': 'AdministrativeArea',
      name: estado,
      addressCountry: 'BR',
    },
  };
}

/**
 * Type guard útil para callers que recebem input parcial.
 */
export function isValidUF(uf: string): boolean {
  return uf?.toUpperCase() in UF_TO_ESTADO;
}
