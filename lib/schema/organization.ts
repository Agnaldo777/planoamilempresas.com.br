const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seusite.com.br';

export function buildOrganization() {
  return {
    '@type': 'Organization',
    name: 'Corretora Amil Autorizada',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    telephone: '+55-11-4200-7866',
    sameAs: [
      'https://www.facebook.com/amilsaude',
      'https://www.instagram.com/amilsaude',
      'https://www.linkedin.com/company/amil',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-11-4200-7866',
      contactType: 'sales',
      areaServed: 'BR',
      availableLanguage: 'Portuguese',
    },
  };
}
