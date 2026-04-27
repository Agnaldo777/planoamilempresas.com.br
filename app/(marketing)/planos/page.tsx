import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  title: 'Planos Amil 2026 | Compare S60, S80, S380, S450, S750, One',
  description: 'Compare todos os planos Amil: Fácil, Saúde e One. Cobertura regional e nacional, preços por faixa etária. Escolha o ideal para sua empresa.',
  canonical: '/planos',
});

const planos = [
  { nome: 'Amil Fácil S60', slug: 'amil-facil-s60', linha: 'Fácil', preco: 'R$ 89,90' },
  { nome: 'Amil Fácil S80', slug: 'amil-facil-s80', linha: 'Fácil', preco: 'R$ 101,84' },
  { nome: 'Amil S380', slug: 'amil-s380', linha: 'Amil', preco: 'R$ 165,52' },
  { nome: 'Amil S450', slug: 'amil-s450', linha: 'Amil', preco: 'R$ 184,21' },
  { nome: 'Amil S580', slug: 'amil-s580', linha: 'Amil', preco: 'R$ 216,83' },
  { nome: 'Amil S750', slug: 'amil-s750', linha: 'Amil', preco: 'R$ 251,95' },
  { nome: 'Amil One S2500', slug: 'amil-one-s2500', linha: 'One', preco: 'R$ 591,63' },
  { nome: 'Amil One S6500 Black', slug: 'amil-one-s6500-black', linha: 'One', preco: 'R$ 891,20' },
];

export default function PlanosPage() {
  return (
    <>
      <SchemaGraph pageType="page" breadcrumb={[{ name: 'Planos', href: '/planos' }]} />
      <BreadcrumbNav items={[{ label: 'Planos', href: '/planos' }]} />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Planos Amil 2026 — Compare Todos
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Escolha entre Amil Fácil (acessível), Amil Saúde (completo) e Amil One (premium).
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {planos.map((plano) => (
              <Link
                key={plano.slug}
                href={`/planos/${plano.slug}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-5 transition-shadow hover:shadow-md"
              >
                <div>
                  <span className="text-xs font-medium text-amil-blue">{plano.linha}</span>
                  <h2 className="text-lg font-bold text-gray-900">{plano.nome}</h2>
                  <p className="text-sm text-gray-500">A partir de {plano.preco}/mês</p>
                </div>
                <span className="text-amil-blue">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
