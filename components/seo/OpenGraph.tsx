/**
 * OpenGraph Helper — Story 3.25 (FR53 / NFR11)
 *
 * Gera metadata.openGraph + metadata.twitter para Next.js App Router
 * Metadata API com fallbacks contextuais. Não renderiza JSX — é
 * helper de build-time, zero runtime overhead em SSG.
 *
 * Uso típico em `generateMetadata()`:
 *
 *     export async function generateMetadata(): Promise<Metadata> {
 *       return {
 *         title: 'Tabela Amil 2026',
 *         ...buildOpenGraphMetadata({
 *           title: 'Tabela Amil 2026',
 *           description: 'Preços atualizados',
 *           url: '/tabela-de-precos',
 *           type: 'product',
 *         }),
 *       };
 *     }
 *
 * Convenções:
 * - og:site_name = 'BeneficioRH' (NFR54 — não 'Amil', evita confusão de marca)
 * - twitter:card = 'summary_large_image' (default)
 * - Imagens 1200×630 (padrão Facebook OG)
 * - Title truncado a 60 chars; description a 200 chars (sem cortar palavra)
 */

import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seusite.com.br';
const DEFAULT_IMAGE = '/og-default.jpg';
const DEFAULT_TITLE =
  'Plano de Saúde Amil Empresarial 2026 | BeneficioRH';
const DEFAULT_DESCRIPTION =
  'Compare planos Amil Empresarial: S380, S450, S750 e Amil One. Cobertura nacional, coparticipação opcional. Simule grátis em 30 segundos.';
const DEFAULT_TWITTER_HANDLE = '@beneficiorh'; // TODO Story 1.0 confirmar handle

export type OpenGraphType = 'website' | 'product' | 'article' | 'profile';

export interface OpenGraphOpts {
  /** Title visível em share. Fallback: DEFAULT_TITLE. */
  title?: string;
  /** Description visível em share. Fallback: DEFAULT_DESCRIPTION. */
  description?: string;
  /** Image URL (relativa ou absoluta). Fallback: /og-default.jpg. */
  image?: string;
  /** Alt text da imagem. Fallback: derivado de title. */
  imageAlt?: string;
  /** Tipo OG. Fallback: 'website'. */
  type?: OpenGraphType;
  /** Path da página. Fallback: SITE_URL. */
  url?: string;
  /** Article only — ISO 8601. */
  publishedTime?: string;
  /** Article only — ISO 8601. */
  modifiedTime?: string;
  /** Article only. */
  author?: string;
  /** Locale OG. Fallback: 'pt_BR'. */
  locale?: string;
}

export interface OpenGraphMetadataOutput {
  openGraph: NonNullable<Metadata['openGraph']>;
  twitter: NonNullable<Metadata['twitter']>;
}

/**
 * Trunca string em maxLen sem cortar palavra; appende ellipsis se cortou.
 */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  // Reserva 1 char para o ellipsis.
  const sliceEnd = maxLen - 1;
  const slice = text.slice(0, sliceEnd);
  const lastSpace = slice.lastIndexOf(' ');
  // Se houver espaço razoável (>50% do limite), corta no espaço.
  const cutPoint = lastSpace > maxLen * 0.5 ? lastSpace : sliceEnd;
  return `${slice.slice(0, cutPoint).trimEnd()}…`;
}

/** Resolve URL relativa para absoluta (idempotente em URLs já absolutas). */
export function toAbsoluteUrl(input: string | undefined): string {
  if (!input) return SITE_URL;
  if (input.startsWith('http://') || input.startsWith('https://')) return input;
  const path = input.startsWith('/') ? input : `/${input}`;
  return `${SITE_URL}${path}`;
}

/**
 * Constrói openGraph + twitter metadata para uso em `generateMetadata()`.
 * Retorna objeto pronto para spread em `Metadata`.
 */
export function buildOpenGraphMetadata(
  opts: OpenGraphOpts = {},
): OpenGraphMetadataOutput {
  const title = truncate(opts.title || DEFAULT_TITLE, 60);
  const description = truncate(
    opts.description || DEFAULT_DESCRIPTION,
    200,
  );
  const image = toAbsoluteUrl(opts.image || DEFAULT_IMAGE);
  const imageAlt = opts.imageAlt || title;
  const type: OpenGraphType = opts.type || 'website';
  const url = toAbsoluteUrl(opts.url);
  const locale = opts.locale || 'pt_BR';

  // OpenGraph base. Next.js Metadata API tipa `type` como discriminator
  // ('website' | 'article' | 'profile' | ...). 'product' não é nativo —
  // emitimos como 'website' base + override via og:type custom em outras
  // tags. Para simplicidade desta v1, mapeamos 'product' → 'website' e
  // o consumidor que precisar de og:type=product pode usar `other` em
  // metadata da page (raro até Story 5.X).
  const ogType: 'website' | 'article' | 'profile' =
    type === 'article' ? 'article' : type === 'profile' ? 'profile' : 'website';

  const openGraph: NonNullable<Metadata['openGraph']> =
    ogType === 'article'
      ? {
          title,
          description,
          url,
          siteName: 'BeneficioRH',
          locale,
          type: 'article',
          images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
          ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
          ...(opts.modifiedTime ? { modifiedTime: opts.modifiedTime } : {}),
          ...(opts.author ? { authors: [opts.author] } : {}),
        }
      : {
          title,
          description,
          url,
          siteName: 'BeneficioRH',
          locale,
          type: ogType,
          images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
        };

  const twitter: NonNullable<Metadata['twitter']> = {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
    site: DEFAULT_TWITTER_HANDLE,
    creator: DEFAULT_TWITTER_HANDLE,
  };

  return { openGraph, twitter };
}
