/**
 * Health check endpoint — Story 1.4 (AC2), atualizada ADR-011.
 *
 * Runtime: nodejs (Cloudflare Workers via OpenNext) — Worker já é "edge"
 * por natureza globalmente; flag `runtime = 'edge'` removida porque OpenNext
 * roteia tudo via worker compatibility layer (`nodejs_compat`).
 *
 * Retorno (200):
 *   {
 *     "status": "ok",
 *     "version": "<git-sha-7>",
 *     "timestamp": "<ISO8601>",
 *     "environment": "production" | "preview" | "development"
 *   }
 *
 * Headers: Cache-Control: no-store (sempre fresco; usado para
 * smoke test de deploy + monitoring uptime externo).
 */

export const dynamic = 'force-dynamic';

type HealthEnvironment = 'production' | 'preview' | 'development';

interface HealthResponse {
  status: 'ok';
  version: string;
  timestamp: string;
  environment: HealthEnvironment;
}

/**
 * Resolve environment a partir de:
 *   1. `CF_ENV` (custom var setada via wrangler.jsonc por env)
 *   2. `NEXT_PUBLIC_SITE_URL` (heurística canônica × staging)
 *   3. fallback `development`
 *
 * Mantém compat retroativa com `VERCEL_ENV` (legacy, removível em Story 1.5+).
 */
function resolveEnvironment(): HealthEnvironment {
  const cfEnv = process.env.CF_ENV;
  if (cfEnv === 'production' || cfEnv === 'preview') {
    return cfEnv;
  }
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === 'production' || vercelEnv === 'preview') {
    return vercelEnv;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  if (siteUrl.includes('planoamilempresas.com.br') && !siteUrl.includes('staging')) {
    return 'production';
  }
  if (siteUrl.includes('staging') || siteUrl.includes('preview')) {
    return 'preview';
  }
  return 'development';
}

/**
 * Resolve version a partir de:
 *   1. `CF_VERSION_METADATA` JSON (`{id,tag}` injetado por Cloudflare em deploy)
 *   2. `GITHUB_SHA` (CI fallback)
 *   3. `VERCEL_GIT_COMMIT_SHA` (legacy)
 *   4. fallback `local`
 */
function resolveVersion(): string {
  const cfMeta = process.env.CF_VERSION_METADATA;
  if (cfMeta) {
    try {
      const parsed = JSON.parse(cfMeta) as { id?: string; tag?: string };
      const id = parsed.id ?? parsed.tag;
      if (id && id.length >= 7) return id.slice(0, 7);
    } catch {
      // ignore parse error
    }
  }
  const ghSha = process.env.GITHUB_SHA;
  if (ghSha && ghSha.length >= 7) return ghSha.slice(0, 7);
  const vercelSha = process.env.VERCEL_GIT_COMMIT_SHA;
  if (vercelSha && vercelSha.length >= 7) return vercelSha.slice(0, 7);
  return 'local';
}

export async function GET(): Promise<Response> {
  const body: HealthResponse = {
    status: 'ok',
    version: resolveVersion(),
    timestamp: new Date().toISOString(),
    environment: resolveEnvironment(),
  };

  return Response.json(body, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
