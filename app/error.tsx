'use client';

/**
 * Error boundary — Story 1.4 (AC4)
 *
 * Captura runtime errors em qualquer rota dentro de `app/`.
 * Renderização client-side (Next.js requirement).
 *
 * Sentry condicional: integração real virá em Story 1.5 com
 * `@sentry/nextjs`. Por enquanto, apenas logging condicional
 * via `console.error` quando NEXT_PUBLIC_SENTRY_DSN estiver
 * configurada — evita import de pacote ainda não instalado.
 *
 * Paleta: slate-900 + teal-600 (Opção A), zero classes
 * `amil-blue*` legacy.
 */

import { useEffect } from 'react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (sentryDsn) {
      // Story 1.5 substituirá por `Sentry.captureException(error)`.
      // Por enquanto, log estruturado para Vercel logs picarem.
      console.error('[error.tsx] Runtime error', {
        message: error.message,
        digest: error.digest,
        sentryDsnConfigured: true,
      });
    } else {
      console.error('[error.tsx] Runtime error', {
        message: error.message,
        digest: error.digest,
      });
    }
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6 py-16 text-white">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <span
          className="inline-flex items-center rounded-full bg-amber-700 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-white"
          aria-label="Erro inesperado"
        >
          Erro inesperado
        </span>

        <h1 className="text-balance text-4xl font-bold leading-tight md:text-5xl">
          Algo deu errado
        </h1>

        <p className="max-w-md text-balance text-lg text-slate-300">
          Não foi possível carregar esta página. Tente novamente em alguns
          instantes.
        </p>

        {error.digest ? (
          <p className="text-xs text-slate-500">
            Código do erro:{' '}
            <code className="font-mono text-slate-400">{error.digest}</code>
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-teal-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
