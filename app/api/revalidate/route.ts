/**
 * Sanity webhook → Vercel revalidate (Story 6.11.e — AC1, AC5, AC7)
 *
 * Recebe POST do Sanity Studio (ou cron rotation manual) e revalida
 * paths Next.js correspondentes ao tipo de documento alterado.
 *
 * Auth:
 *   - Header `x-webhook-secret` (alias: `x-revalidate-secret` para
 *     compat com chamadas legacy) comparado contra
 *     `SANITY_REVALIDATE_SECRET` (env Vercel).
 *   - 401 se ausente/divergente. Comparação tolerante a length
 *     diferente — não vaza informação sobre o secret real.
 *
 * Tipos suportados:
 *   - `blogPost` → /blog, /blog/[slug], /blog/categoria/[categoria],
 *                  /blog/feed.xml, /sitemap.xml
 *   - `author`   → /autores/[slug] + /blog (revalida listagem,
 *                  posts individuais re-resolvem author no fetch)
 *   - `faq`      → /perguntas-frequentes
 *   - `cidade`   → /rede-credenciada (granularidade fina exige UF
 *                  no payload — TODO Aria)
 *   - `plano`    → /planos/[slug]
 *
 * Observability (AC7): cada chamada loga `[revalidate]` JSON
 * estruturado com type, slug, paths, ts, source — captado por
 * Vercel Function Logs.
 */

import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import {
  pathsForWebhook,
  validateSecret,
  normalizeSlug,
  type SanityPayload,
} from '@/app/api/revalidate/paths.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RevalidateResult {
  revalidated: boolean;
  type: string | null;
  slug: string | null;
  paths: string[];
  reason?: string;
}

export interface HandleRevalidateInput {
  headers: Headers;
  payload: SanityPayload;
  expectedSecret: string | undefined;
  revalidator?: (path: string) => void;
  now?: () => string;
  logger?: (entry: Record<string, unknown>) => void;
}

export async function handleRevalidate(
  input: HandleRevalidateInput,
): Promise<{ status: number; body: RevalidateResult | { error: string } }> {
  const { headers, payload, expectedSecret } = input;
  const revalidator = input.revalidator ?? revalidatePath;
  const now = input.now ?? (() => new Date().toISOString());
  const logger =
    input.logger ?? ((entry) => console.warn(JSON.stringify(entry)));

  if (!expectedSecret) {
    return {
      status: 500,
      body: { error: 'Server misconfigured: SANITY_REVALIDATE_SECRET ausente' },
    };
  }

  if (!validateSecret(headers, expectedSecret)) {
    return { status: 401, body: { error: 'Invalid secret' } };
  }

  const type = payload._type ?? payload.type ?? null;
  const slug = normalizeSlug(payload.slug);
  const paths = pathsForWebhook(payload);

  if (paths.length === 0) {
    logger({
      scope: 'revalidate',
      event: 'noop',
      type,
      slug,
      ts: now(),
    });
    return {
      status: 200,
      body: {
        revalidated: false,
        type,
        slug,
        paths: [],
        reason: 'Tipo de documento sem mapping',
      },
    };
  }

  for (const p of paths) {
    revalidator(p);
  }

  logger({
    scope: 'revalidate',
    event: 'ok',
    type,
    slug,
    paths,
    ts: now(),
    source: headers.get('user-agent') ?? 'unknown',
  });

  return {
    status: 200,
    body: { revalidated: true, type, slug, paths },
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  let payload: SanityPayload = {};
  try {
    payload = (await request.json()) as SanityPayload;
  } catch {
    return NextResponse.json(
      { error: 'Body JSON inválido' },
      { status: 400 },
    );
  }

  const { status, body } = await handleRevalidate({
    headers: request.headers,
    payload,
    expectedSecret: process.env.SANITY_REVALIDATE_SECRET,
  });
  return NextResponse.json(body, { status });
}
