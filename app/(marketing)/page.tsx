import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaGraph } from '@/components/seo/SchemaGraph';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Plano de Saúde Amil Empresarial 2026 | Cotação Online Grátis',
  description:
    'Compare planos Amil Empresarial: S380, S450, S750 e Amil One. Cobertura nacional, coparticipação opcional. Simule agora e receba sua tabela de preços em minutos.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      {/* Schema @graph: Organization + WebSite */}
      <SchemaGraph pageType="home" />

      {/* Hero Section */}
      <section className="bg-amil-blue px-4 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Plano de Saúde Amil Empresarial 2026
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-amil-blue-light md:text-xl">
            Compare planos Amil para sua empresa. Cobertura nacional, hospitais renomados,
            telemedicina 24h. Cotação grátis em 30 segundos.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/cotacao-online"
              className="rounded-lg bg-cta-green px-8 py-4 text-center text-lg font-semibold text-white transition-colors hover:bg-cta-green-hover"
            >
              Simular meu plano empresarial →
            </Link>
            <Link
              href="/planos"
              className="rounded-lg border-2 border-white px-8 py-4 text-center text-lg font-semibold text-white transition-colors hover:bg-white hover:text-amil-blue"
            >
              Ver todos os planos
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { number: '5,4M', label: 'Beneficiários' },
            { number: '+28K', label: 'Médicos credenciados' },
            { number: '+383K', label: 'Empresas clientes' },
            { number: '97K', label: 'Teleconsultas/mês' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-amil-blue md:text-4xl">{stat.number}</p>
              <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Preview */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Planos Amil para Sua Empresa
          </h2>
          <p className="mt-4 text-center text-lg text-gray-500">
            Escolha a linha ideal: acessível, completa ou premium
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                name: 'Amil Fácil',
                desc: 'Valores acessíveis para sua empresa',
                price: 'A partir de R$ 101,84',
                href: '/planos/amil-facil-s80',
                color: 'bg-cta-green',
              },
              {
                name: 'Amil Saúde',
                desc: 'Cobertura nacional com hospitais renomados',
                price: 'A partir de R$ 184,21',
                href: '/planos/amil-s450',
                color: 'bg-amil-blue',
              },
              {
                name: 'Amil One',
                desc: 'Rede premium exclusiva com concierge',
                price: 'A partir de R$ 591,63',
                href: '/planos/amil-one-s2500',
                color: 'bg-amil-blue-dark',
              },
            ].map((plan) => (
              <Link
                key={plan.name}
                href={plan.href}
                className="group rounded-xl border border-gray-200 p-8 transition-shadow hover:shadow-lg"
              >
                <div className={`inline-block rounded-lg ${plan.color} px-3 py-1 text-sm font-medium text-white`}>
                  {plan.name}
                </div>
                <p className="mt-4 text-gray-700">{plan.desc}</p>
                <p className="mt-4 text-2xl font-bold text-gray-900">{plan.price}</p>
                <p className="mt-4 text-sm font-medium text-amil-blue group-hover:underline">
                  Ver detalhes →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amil-blue-dark px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold">Cotação Grátis em 30 Segundos</h2>
          <p className="mt-4 text-lg text-amil-blue-light">
            Formulário simples com apenas 4 campos. Receba sua proposta no WhatsApp.
          </p>
          <Link
            href="/cotacao-online"
            className="mt-8 inline-block rounded-lg bg-cta-green px-10 py-4 text-lg font-semibold text-white transition-colors hover:bg-cta-green-hover"
          >
            Simular agora →
          </Link>
        </div>
      </section>
    </>
  );
}
