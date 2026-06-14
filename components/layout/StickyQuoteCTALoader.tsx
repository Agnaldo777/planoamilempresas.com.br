'use client';

/**
 * Loader lazy do StickyQuoteCTA (performance INP/TBT).
 *
 * O CTA flutuante é decorativo e só aparece após ~600px de scroll — não é
 * crítico para LCP nem para SEO. Carregá-lo sob demanda (ssr: false) remove o
 * componente + ícones do bundle inicial de TODAS as páginas do site.
 */

import dynamic from 'next/dynamic';

const StickyQuoteCTA = dynamic(
  () => import('@/components/layout/StickyQuoteCTA').then((m) => m.StickyQuoteCTA),
  { ssr: false },
);

export function StickyQuoteCTALoader() {
  return <StickyQuoteCTA />;
}
