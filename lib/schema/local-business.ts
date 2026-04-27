export interface LocalBusinessData {
  name: string;
  city: string;
  state: string;
  telephone: string;
  address?: string;
  postalCode?: string;
}

export function buildLocalBusiness(data: LocalBusinessData) {
  return {
    '@type': 'InsuranceAgency',
    name: data.name,
    telephone: data.telephone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.city,
      addressRegion: data.state,
      addressCountry: 'BR',
      ...(data.address && { streetAddress: data.address }),
      ...(data.postalCode && { postalCode: data.postalCode }),
    },
    geo: {
      '@type': 'GeoCoordinates',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '156',
    },
  };
}
