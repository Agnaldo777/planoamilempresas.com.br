import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  title: 'Rede Credenciada Amil 2026 | Hospitais, Laboratórios e Especialistas',
  description: 'Encontre hospitais, laboratórios, clínicas e especialistas da rede credenciada Amil. +28.000 médicos credenciados em todo o Brasil.',
  canonical: '/rede-credenciada',
});

export const revalidate = 86400;

const categorias = [
  { nome: 'Hospitais', slug: 'hospitais', icon: '🏥' },
  { nome: 'Laboratórios', slug: 'laboratorios', icon: '🔬' },
  { nome: 'Clínicas', slug: 'clinicas', icon: '🏨' },
  { nome: 'Pronto-Socorro', slug: 'pronto-socorro', icon: '🚑' },
  { nome: 'Amil Espaço Saúde', slug: 'amil-espaco-saude', icon: '💚' },
];

const especialidades = [
  { nome: 'Ginecologista', slug: 'ginecologista' },
  { nome: 'Dermatologista', slug: 'dermatologista' },
  { nome: 'Endocrinologista', slug: 'endocrinologista' },
  { nome: 'Ortopedista', slug: 'ortopedista' },
  { nome: 'Oftalmologista', slug: 'oftalmologista' },
  { nome: 'Nutricionista', slug: 'nutricionista' },
  { nome: 'Dentista', slug: 'dentista' },
  { nome: 'Pediatra', slug: 'pediatra' },
  { nome: 'Cardiologista', slug: 'cardiologista' },
  { nome: 'Psicólogo', slug: 'psicologo' },
];

export default function RedeCredenciadaPage() {
  return (
    <>
      <SchemaGraph pageType="page" breadcrumb={[{ name: 'Rede Credenciada', href: '/rede-credenciada' }]} />
      <BreadcrumbNav items={[{ label: 'Rede Credenciada', href: '/rede-credenciada' }]} />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Rede Credenciada Amil 2026
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            +28.000 médicos e serviços credenciados em todo o Brasil.
          </p>

          <h2 className="mt-10 text-xl font-bold text-gray-900">Por Categoria</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-5">
            {categorias.map((cat) => (
              <Link key={cat.slug} href={`/rede-credenciada/${cat.slug}`} className="rounded-lg border border-gray-200 p-4 text-center hover:shadow-md">
                <span className="text-2xl">{cat.icon}</span>
                <p className="mt-2 text-sm font-semibold text-gray-900">{cat.nome}</p>
              </Link>
            ))}
          </div>

          <h2 className="mt-10 text-xl font-bold text-gray-900">Por Especialidade</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {especialidades.map((esp) => (
              <Link key={esp.slug} href={`/rede-credenciada/${esp.slug}`} className="rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700 hover:border-amil-blue hover:text-amil-blue">
                {esp.nome}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
