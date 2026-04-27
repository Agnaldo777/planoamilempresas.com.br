import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { QuoteForm } from '@/components/forms/QuoteForm';

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  title: 'Cotação Amil Online Grátis — Simule seu Plano em 30 Segundos',
  description: 'Simulador de planos Amil: empresarial, MEI, individual e familiar. Formulário simples com 4 campos. Receba sua proposta no WhatsApp.',
  canonical: '/cotacao-online',
});

export default function CotacaoOnlinePage() {
  return (
    <>
      <SchemaGraph pageType="page" breadcrumb={[{ name: 'Cotação Online', href: '/cotacao-online' }]} />
      <BreadcrumbNav items={[{ label: 'Cotação Online', href: '/cotacao-online' }]} />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Cotação Grátis em 30 Segundos
          </h1>
          <p className="mt-4 text-gray-500">
            Apenas 4 campos. Receba sua proposta personalizada no WhatsApp.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-lg rounded-xl border border-gray-200 p-8">
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
