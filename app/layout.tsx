/**
 * RootLayout — Story 1.4 (AC5)
 *
 * Metadata API global: title template, description, OG tags
 * via helper `buildOpenGraphMetadata` (Story 3.25), viewport,
 * charset (UTF-8 default Next.js), favicon (`app/icon.svg`
 * auto-detect Next.js 16).
 *
 * Defaults canary: title/description voltadas a "em breve"
 * para evitar OG sharing prematuro de claims comerciais. Stories
 * de conteúdo (Epic 3) substituem via `metadata` por rota.
 *
 * Robots: durante canary deixamos `index: false` no level page
 * (`app/page.tsx`), mas mantemos `index: true` global para que
 * rotas marketing já indexáveis (Story 6.x+) possam herdar.
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { buildOpenGraphMetadata } from '@/components/seo/OpenGraph';
import {
  getCurrentYear,
  getDefaultSiteTitle,
  getSiteTitleTemplate,
} from '@/lib/seo/title';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://planoamilempresas.com.br';

// Story 3.22 (FR50) — title pattern dinâmico via helper.
// SSOT: env var NEXT_PUBLIC_CURRENT_YEAR (fallback 2026).
const CURRENT_YEAR = getCurrentYear();
const DEFAULT_TITLE = getDefaultSiteTitle();
const DEFAULT_DESCRIPTION =
  `Plano Amil Empresarial ${CURRENT_YEAR}: cotação online, comparativos e tabela de preços pela BeneficioRH (corretora autorizada SUSEP 201054484).`;

const defaultOg = buildOpenGraphMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  type: 'website',
  url: SITE_URL,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F172A', // slate-900 (Opção A)
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: getSiteTitleTemplate(),
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: 'planoamilempresas.com.br',
  authors: [{ name: 'BeneficioRH', url: SITE_URL }],
  generator: 'Next.js',
  openGraph: defaultOg.openGraph,
  twitter: defaultOg.twitter,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    // app/icon.svg é auto-detectado pelo Next.js 16, mas declaramos
    // explicitamente para clareza + permitir override por rota.
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}

        {/* Google Analytics 4 — Story 1.5 hidrata env real. */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_title: document.title,
                  send_page_view: true,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
