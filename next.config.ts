import type { NextConfig } from 'next';
import path from 'node:path';

/**
 * Next.js config — alvo Cloudflare Workers via @opennextjs/cloudflare (ADR-011).
 *
 * Notas Cloudflare:
 * - `images.unoptimized: true` desliga o `/_next/image` loader. Em Workers, a
 *   otimização nativa é feita via binding `IMAGES` (Cloudflare Images) — opt-in
 *   futuro; por ora todas as imagens são servidas como assets estáticos. CDN
 *   Sanity já entrega AVIF/WebP, então a perda é marginal.
 * - Headers de segurança permanecem aqui (válidos no runtime Worker) e são
 *   espelhados em `public/_headers` como defesa em profundidade contra
 *   regressões de build.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
      ],
    },
  ],
};

export default nextConfig;
