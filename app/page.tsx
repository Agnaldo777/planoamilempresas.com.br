/**
 * Canary page — Story 1.4 (AC1)
 *
 * Rota: `/` — primeira página visível em produção pós-fork.
 * Render: React Server Component (sem 'use client'), markup
 * mínimo para Lighthouse ≥95 sem optimização adicional.
 *
 * Restrições visuais (paleta Opção A — slate-900 + teal-600,
 * NÃO azul Amil oficial #0066B3):
 * - Background: slate-900
 * - CTA badge: teal-600
 * - Texto principal: branco
 * - Tipografia: Inter (já carregado em RootLayout)
 *
 * Build info exposto:
 * - GITHUB_SHA / VERCEL_GIT_COMMIT_SHA (curto, 7 chars) — seguro de expor
 * - BUILD_TIME — timestamp injetado em build via Date.now()
 * - Cloudflare Workers preenche `CF_VERSION_METADATA`; CI fallback
 *   é `GITHUB_SHA`. Legacy `VERCEL_GIT_COMMIT_SHA` removível Story 1.5+.
 *
 * Schema JSON-LD inline mínimo (WebSite + Organization
 * BeneficioRH; conformidade FR54 — operador é a corretora,
 * não a Amil).
 */

import type { Metadata } from 'next';

// Build-time constants. Resolvidos uma vez quando o módulo é
// avaliado em build; não recalculados a cada request graças a
// SSG. Em dev (`next dev`) refletem o último reload.
function resolveBuildSha(): string {
  const cfMeta = process.env.CF_VERSION_METADATA;
  if (cfMeta) {
    try {
      const parsed = JSON.parse(cfMeta) as { id?: string; tag?: string };
      const id = parsed.id ?? parsed.tag;
      if (id && id.length >= 7) return id.slice(0, 7);
    } catch {
      // ignore
    }
  }
  const gh = process.env.GITHUB_SHA;
  if (gh && gh.length >= 7) return gh.slice(0, 7);
  const vercel = process.env.VERCEL_GIT_COMMIT_SHA;
  if (vercel && vercel.length >= 7) return vercel.slice(0, 7);
  return 'local';
}

const BUILD_SHA: string = resolveBuildSha();
const BUILD_TIME_ISO: string = new Date(Date.now()).toISOString();
const BUILD_TIME_HUMAN: string = new Date(BUILD_TIME_ISO).toLocaleString(
  'pt-BR',
  { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' },
);

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://planoamilempresas.com.br';

export const metadata: Metadata = {
  title: 'Em breve — planoamilempresas.com.br',
  description:
    'Plano Amil Empresarial 2026 — em breve, conteúdo completo da BeneficioRH (corretora autorizada SUSEP 201054484). Cotação online, comparativos e tabela de preços.',
  alternates: { canonical: '/' },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CanaryPage() {
  // Schema JSON-LD: WebSite + Organization (escopo Story 1.4
  // mínimo; rich schemas vêm em Stories 2.x+ via SchemaGraph).
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        url: SITE_URL,
        name: 'planoamilempresas.com.br',
        inLanguage: 'pt-BR',
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: 'BeneficioRH',
        url: SITE_URL,
        // FR54 — operador é a corretora; SUSEP confirma autorização.
        identifier: 'SUSEP 201054484',
        taxID: '14.764.085/0001-99',
      },
    ],
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6 py-16 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <span
          className="inline-flex items-center rounded-full bg-teal-600 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-white"
          aria-label="Status: em breve"
        >
          Em breve
        </span>

        <h1 className="text-balance text-4xl font-bold leading-tight md:text-5xl">
          planoamilempresas.com.br
        </h1>

        <p className="max-w-xl text-balance text-lg text-slate-300 md:text-xl">
          Conteúdo completo sobre Plano Amil Empresarial está em produção.
          Site operado pela <strong className="text-white">BeneficioRH</strong>,
          corretora autorizada SUSEP 201054484.
        </p>

        <p className="text-sm text-slate-400">
          CNPJ 14.764.085/0001-99 — Agnaldo Silva (responsável técnico).
        </p>
      </div>

      <footer className="mt-16 text-center text-xs text-slate-500">
        <p>
          Build <code className="font-mono text-slate-300">{BUILD_SHA}</code>
          {' · '}
          <time dateTime={BUILD_TIME_ISO}>{BUILD_TIME_HUMAN}</time>
        </p>
        <p className="mt-2">
          <a
            href="/api/healthz"
            className="text-sky-400 underline-offset-2 hover:underline"
          >
            /api/healthz
          </a>
        </p>
      </footer>
    </main>
  );
}
