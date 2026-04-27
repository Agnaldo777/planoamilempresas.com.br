const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seusite.com.br';

export function buildWebSite() {
  return {
    '@type': 'WebSite',
    name: 'Amil Saúde — Corretora Autorizada',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/busca?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
