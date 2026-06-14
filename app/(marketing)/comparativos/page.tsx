import type { Metadata } from 'next';
import Link from 'next/link';
import { buildOpenGraphMetadata } from '@/components/seo/OpenGraph';
import { COMPARATIVOS_INFO, COMPARATIVO_SLUGS } from '@/content/comparativos-concorrentes';
import { DISCLAIMER_AMIL_REDE } from '@/content/disclaimers/amil-rede';

export const revalidate = 2592000;

const TITLE = 'Amil vs concorrentes: comparativos de plano empresarial 2026';
const DESCRIPTION =
  'Comparativos honestos da Amil empresarial vs Bradesco, SulAmérica, Hapvida, Unimed e Porto Seguro: modelo, rede, reputação e para qual perfil cada uma é melhor.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  ...buildOpenGraphMetadata({ title: TITLE, description: DESCRIPTION, type: 'website' }),
  alternates: { canonical: '/comparativos' },
  robots: { index: true, follow: true },
};

export default function ComparativosIndexPage() {
  const itens = COMPARATIVO_SLUGS.map((s) => COMPARATIVOS_INFO[s]);

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <nav className="mb-5 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Início</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Comparativos</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Amil vs concorrentes: comparativos empresariais
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          Comparações honestas e factuais da Amil empresarial com as principais operadoras do mercado.
          Mostramos onde cada uma é mais forte — para você decidir pela rede e pelo valor do seu CNPJ.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {itens.map((c) => (
            <Link
              key={c.slug}
              href={`/comparativos/${c.slug}`}
              className="rounded-xl border border-slate-200 p-6 transition hover:border-blue-400 hover:shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900">Amil vs {c.concorrente}</h2>
              <p className="mt-2 text-sm text-gray-600">{c.tagline}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-blue-700">Ver comparativo →</span>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-blue-600 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Não sabe qual escolher?</h2>
          <p className="mt-2 text-blue-100">Comparamos as operadoras para o seu CNPJ, sem custo de corretagem.</p>
          <Link href="/cotacao-online?origem=comparativos" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
            Solicitar cotação comparada →
          </Link>
        </div>

        <footer className="mt-10 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Aviso:</strong> {DISCLAIMER_AMIL_REDE} Comparações imparciais com dados de referência pública.
        </footer>
      </div>
    </section>
  );
}
