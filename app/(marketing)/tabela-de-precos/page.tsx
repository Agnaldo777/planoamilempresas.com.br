import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';

export const metadata: Metadata = generatePageMetadata({
  type: 'preco',
  canonical: '/tabela-de-precos',
});

export const revalidate = 3600;

const tabelas = [
  { nome: 'Amil Fácil', slug: 'amil-facil', desde: 'R$ 89,90' },
  { nome: 'Amil S380', slug: 'amil-s380', desde: 'R$ 165,52' },
  { nome: 'Amil S450', slug: 'amil-s450', desde: 'R$ 184,21' },
  { nome: 'Amil S750', slug: 'amil-s750', desde: 'R$ 251,95' },
  { nome: 'Amil One', slug: 'amil-one', desde: 'R$ 591,63' },
  { nome: 'Amil Dental', slug: 'amil-dental', desde: 'R$ 29,90' },
  { nome: 'Empresarial', slug: 'empresarial', desde: 'R$ 101,84' },
  { nome: 'Individual', slug: 'individual', desde: 'R$ 165,52' },
];

export default function TabelaPrecosPage() {
  return (
    <>
      <SchemaGraph pageType="page" breadcrumb={[{ name: 'Tabela de Preços', href: '/tabela-de-precos' }]} />
      <BreadcrumbNav items={[{ label: 'Tabela de Preços', href: '/tabela-de-precos' }]} />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Tabela de Preços Amil 2026
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Valores atualizados por faixa etária. Selecione o plano para ver a tabela completa.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tabelas.map((t) => (
              <Link
                key={t.slug}
                href={`/tabela-de-precos/${t.slug}`}
                className="rounded-lg border border-gray-200 p-5 text-center transition-shadow hover:shadow-md"
              >
                <h2 className="font-bold text-gray-900">{t.nome}</h2>
                <p className="mt-1 text-sm text-gray-500">Desde {t.desde}/mês</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
