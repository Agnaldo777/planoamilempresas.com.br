import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  title: 'Amil Dental 2026 | Plano Odontológico Empresarial e Individual',
  description: 'Plano Amil Dental: cobertura completa, rede credenciada com milhares de dentistas. Empresarial e individual. Preços a partir de R$ 29,90.',
  canonical: '/amil-dental',
});

export default function AmilDentalPage() {
  return (
    <>
      <SchemaGraph
        pageType="page"
        breadcrumb={[{ name: 'Amil Dental', href: '/amil-dental' }]}
      />
      <BreadcrumbNav items={[{ label: 'Amil Dental', href: '/amil-dental' }]} />

      <section className="bg-slate-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold md:text-4xl">
            Amil Dental 2026 — Plano Odontológico
          </h1>
          <p className="mt-4 text-lg text-slate-200">
            Cobertura completa para sua empresa: consultas, ortodontia, implantes e mais.
          </p>
          <Link
            href="/cotacao-online"
            className="mt-8 inline-block rounded-lg bg-cta-green px-8 py-4 font-semibold text-white hover:bg-cta-green-hover"
          >
            Simular plano dental →
          </Link>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl grid gap-4 md:grid-cols-3">
          {[
            { href: '/amil-dental-empresarial', title: 'Dental Empresarial', desc: 'Plano dental para sua empresa' },
            { href: '/amil-dental/rede-credenciada', title: 'Rede Credenciada', desc: 'Encontre dentistas Amil' },
            { href: '/amil-dental/precos', title: 'Tabela de Preços', desc: 'Valores atualizados 2026' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg border border-gray-200 p-6 hover:shadow-md">
              <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
