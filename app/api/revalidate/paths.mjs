/**
 * Pure path-mapping logic for Sanity webhook → revalidate paths.
 *
 * Extraído de `route.ts` (Story 6.11.e) para permitir testes
 * unitários em `node --test` (mjs) sem transpiler TS.
 *
 * @typedef {Object} SanityPayload
 * @property {string=} _type
 * @property {string=} type
 * @property {(string|{current?: string})=} slug
 * @property {string=} _id
 */

/** 8 categorias canônicas — espelho de data/blog/categories.ts. */
export const BLOG_CATEGORY_SLUGS = [
  'carencias',
  'coparticipacao',
  'reembolso',
  'rede-credenciada',
  'adesao-mei-pme',
  'ans-regulamentacao',
  'cobertura',
  'cancelamento',
];

/**
 * @param {SanityPayload['slug']} slug
 * @returns {string|null}
 */
export function normalizeSlug(slug) {
  if (typeof slug === 'string') return slug;
  if (slug && typeof slug === 'object' && typeof slug.current === 'string') {
    return slug.current;
  }
  return null;
}

/**
 * @param {SanityPayload} payload
 * @returns {string[]}
 */
export function pathsForWebhook(payload) {
  const type = payload._type ?? payload.type;
  const slug = normalizeSlug(payload.slug);

  if (!type) return [];

  switch (type) {
    case 'blogPost': {
      const base = ['/blog', '/blog/feed.xml', '/sitemap.xml'];
      if (slug) base.push(`/blog/${slug}`);
      for (const c of BLOG_CATEGORY_SLUGS) base.push(`/blog/categoria/${c}`);
      return base;
    }
    case 'author': {
      const paths = ['/blog', '/sitemap.xml'];
      if (slug) paths.push(`/autores/${slug}`);
      return paths;
    }
    case 'faq': {
      return ['/perguntas-frequentes', '/sitemap.xml'];
    }
    case 'cidade': {
      return ['/rede-credenciada', '/sitemap.xml'];
    }
    case 'plano': {
      const paths = ['/planos', '/sitemap.xml'];
      if (slug) paths.push(`/planos/${slug}`);
      return paths;
    }
    default:
      return [];
  }
}

/**
 * Constant-time string comparison (length-aware).
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Validates webhook secret in headers against expected secret.
 * @param {{ get: (k: string) => string|null }} headers
 * @param {string|undefined} expected
 * @returns {boolean}
 */
export function validateSecret(headers, expected) {
  if (!expected) return false;
  const provided =
    headers.get('x-webhook-secret') ?? headers.get('x-revalidate-secret');
  if (!provided) return false;
  return safeEqual(provided, expected);
}
