import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  title: 'Plano Amil Empresarial 2026 | PME, MEI e Grandes Empresas',
  description: 'Plano de saúde Amil Empresarial para empresas de todos os portes. MEI, PME de 2 a 99 vidas, grandes empresas 100+. Cotação grátis em 30 segundos.',
  canonical: '/empresarial',
});

const segmentos = [
  { nome: 'MEI', slug: 'mei', desc: 'Microempreendedor individual, a partir de 2 vidas' },
  { nome: 'PME 2-29 vidas', slug: 'pme-2-a-29-vidas', desc: 'Pequenas empresas' },
  { nome: 'PME 30-99 vidas', slug: 'pme-30-a-99-vidas', desc: 'Médias empresas' },
  { nome: 'Grandes Empresas 100+', slug: 'grandes-empresas', desc: 'Corporativo com personalização' },
];

export default function EmpresarialPage() {
  return (
    <>
      <SchemaGraph pageType="page" breadcrumb={[{ name: 'Empresarial', href: '/empresarial' }]} />
      <BreadcrumbNav items={[{ label: 'Empresarial', href: '/empresarial' }]} />

      <section className="bg-slate-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Plano de Saúde Amil Empresarial
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Para empresas de todos os portes: MEI, PME e grandes corporações. Cobertura nacional,
            hospitais renomados, telemedicina 24h.
          </p>
          <Link
            href="/cotacao-online"
            className="mt-8 inline-block rounded-lg bg-cta-green px-8 py-4 text-lg font-semibold text-white hover:bg-cta-green-hover"
          >
            Simular plano empresarial →
          </Link>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900">Escolha por Porte da Empresa</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {segmentos.map((seg) => (
              <Link
                key={seg.slug}
                href={`/empresarial/${seg.slug}`}
                className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-900">{seg.nome}</h3>
                <p className="mt-2 text-sm text-gray-500">{seg.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
