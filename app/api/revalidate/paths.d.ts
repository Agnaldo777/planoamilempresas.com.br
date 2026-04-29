/**
 * TypeScript declarations for `paths.mjs` — Story 6.11.e.
 *
 * O `.mjs` é puro JS para permitir testes em `node --test` sem
 * transpiler; este `.d.ts` expõe tipos para consumo TS via
 * `@/app/api/revalidate/paths.mjs`.
 */

export interface SanityPayload {
  _type?: string;
  type?: string;
  slug?: string | { current?: string };
  _id?: string;
}

export const BLOG_CATEGORY_SLUGS: readonly string[];

export function normalizeSlug(slug: SanityPayload['slug']): string | null;

export function pathsForWebhook(payload: SanityPayload): string[];

export function safeEqual(a: string, b: string): boolean;

export function validateSecret(
  headers: { get: (key: string) => string | null },
  expected: string | undefined,
): boolean;
