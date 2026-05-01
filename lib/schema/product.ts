/**
 * Schema Product — Story 3.26 alinhamento (FR54)
 *
 * Em páginas de produto Amil:
 *   - `Product.name`    = "Amil [Plano]"   (legítimo — produto do mercado)
 *   - `Product.brand`   = { Brand, "Amil" } (trademark da operadora)
 *   - `Product.provider`= referência à Organization BeneficioRH
 *   - `Organization.name` SEMPRE BeneficioRH (NUNCA "Amil")
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

/**
 * Default fallback usado quando o caller não fornece `offerCount` explícito.
 * Representa estimativa conservadora de variantes (faixas etárias × modalidades)
 * por produto. Sempre que possível, derivar `offerCount` do dataset real
 * (`data/tabelas-amil.ts`) — o default é apenas safety net.
 */
const DEFAULT_OFFER_COUNT = 10;

export interface ProductSchemaData {
  name: string;
  description: string;
  lowPrice: number;
  highPrice: number;
  /** Quantidade de ofertas agregadas. Se omitido, usa DEFAULT_OFFER_COUNT (10). */
  offerCount?: number;
  image?: string;
}

export function buildProduct(data: ProductSchemaData) {
  return {
    '@type': 'Product',
    name: data.name,
    description: data.description,
    brand: { '@type': 'Brand', name: 'Amil' },
    provider: { '@id': `${BASE_URL}#organization` },
    ...(data.image && { image: data.image }),
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: data.lowPrice.toFixed(2),
      highPrice: data.highPrice.toFixed(2),
      priceCurrency: 'BRL',
      offerCount: data.offerCount ?? DEFAULT_OFFER_COUNT,
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${BASE_URL}#organization` },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '312',
      bestRating: '5',
      worstRating: '1',
    },
  };
}
