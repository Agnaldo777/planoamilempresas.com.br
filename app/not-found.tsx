/**
 * 404 page — Story 1.4 (AC3)
 *
 * Render: React Server Component (sem 'use client').
 * Mantém paleta canary (slate-900 + teal-600) para coerência
 * visual com `/`. Zero classes legacy `amil-blue*` e zero
 * referências ao operador anterior do template (audit Story 1.1).
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Página não encontrada — 404',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6 py-16 text-white">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <span
          className="inline-flex items-center rounded-full bg-teal-600 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-white"
          aria-label="Erro 404"
        >
          404
        </span>

        <h1 className="text-balance text-4xl font-bold leading-tight md:text-5xl">
          Página não encontrada
        </h1>

        <p className="max-w-md text-balance text-lg text-slate-300">
          O endereço acessado não existe ou foi movido. Volte para a página
          inicial e tente novamente.
        </p>

        <Link
          href="/"
          className="rounded-lg bg-teal-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </main>
  );
}
