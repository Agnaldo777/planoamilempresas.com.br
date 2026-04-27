export interface ProductSchemaData {
  name: string;
  description: string;
  lowPrice: number;
  highPrice: number;
  offerCount?: number;
  image?: string;
}

export function buildProduct(data: ProductSchemaData) {
  return {
    '@type': 'Product',
    name: data.name,
    description: data.description,
    brand: { '@type': 'Brand', name: 'Amil' },
    ...(data.image && { image: data.image }),
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: data.lowPrice.toFixed(2),
      highPrice: data.highPrice.toFixed(2),
      priceCurrency: 'BRL',
      offerCount: data.offerCount || 10,
      availability: 'https://schema.org/InStock',
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
