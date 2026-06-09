import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/studio/'],
    },
    // Todos os sitemaps — o principal NÃO referencia os shards, então listamos
    // cada shard aqui para o Google descobrir as ~10.000 URLs do moat (rede
    // credenciada). Sem isto, só 42 URLs eram descobríveis.
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-prestadores.xml`,
      `${baseUrl}/sitemap-rede-bairros.xml`,
      `${baseUrl}/sitemap-tipos.xml`,
      `${baseUrl}/sitemap-rede-produto.xml`,
    ],
  };
}
