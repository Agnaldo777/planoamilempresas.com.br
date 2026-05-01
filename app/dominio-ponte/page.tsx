import type { Metadata } from 'next';

/**
 * Landing minimalista para o domínio-ponte de contingência
 * `planosaudeempresas.com.br` (Story 1.2a — Mitigação 4 da Story 1.0 Bloco 2).
 *
 * Enquanto não-acionada, serve uma página estática única sem dependências de
 * CMS, formulários ou banco de dados. Em caso de notificação Amil sobre uso
 * da marca em `planoamilempresas.com.br`, o domínio principal será apontado
 * para esta rota via `vercel.contingency.json` (rollback em <1h).
 *
 * Texto exato conforme AC4 da Story 1.2a.
 *
 * NFR24 (compliance cross-domain): disclaimer SUSEP/CNPJ no footer.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planosaudeempresas.com.br';
const PAGE_URL = `${SITE_URL.replace(/\/$/, '')}/dominio-ponte`;
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511926510515';

export const metadata: Metadata = {
  title: 'Plano de saúde empresarial — em breve novidades',
  description:
    'Plano de saúde empresarial — em breve novidades. Fale com nosso corretor pelo WhatsApp.',
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Plano de saúde empresarial — em breve novidades',
    description:
      'Plano de saúde empresarial — em breve novidades. Fale com nosso corretor pelo WhatsApp.',
    url: PAGE_URL,
    type: 'website',
  },
};

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1.25rem',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  background: '#ffffff',
  color: '#0f172a',
  textAlign: 'center',
};

const headlineStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
  lineHeight: 1.25,
  fontWeight: 600,
  margin: '0 0 1.5rem',
  maxWidth: '36rem',
};

const ctaStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.875rem 1.5rem',
  borderRadius: '0.5rem',
  background: '#16a34a',
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '1rem',
};

const footerStyle: React.CSSProperties = {
  marginTop: 'auto',
  paddingTop: '3rem',
  fontSize: '0.75rem',
  lineHeight: 1.5,
  color: '#64748b',
  maxWidth: '40rem',
};

export default function DominioPontePage() {
  return (
    <main style={containerStyle}>
      <h1 style={headlineStyle}>
        Plano de saúde empresarial — em breve novidades.
      </h1>
      <p style={{ margin: '0 0 2rem', maxWidth: '32rem', color: '#475569' }}>
        Fale com nosso corretor:
      </p>
      <a
        href={`https://wa.me/${WHATSAPP}`}
        style={ctaStyle}
        rel="noopener noreferrer"
        target="_blank"
      >
        WhatsApp {WHATSAPP}
      </a>

      <footer style={footerStyle}>
        <p>
          BeneficioRH — Agnaldo Silva. Corretor autorizado SUSEP nº 201054484.
          CNPJ 14.764.085/0001-99.
        </p>
        <p>
          Site independente operado por corretor habilitado a intermediar
          planos de saúde empresariais. Não substitui canais oficiais das
          operadoras. Conformidade ANS / SUSEP / LGPD.
        </p>
      </footer>
    </main>
  );
}
