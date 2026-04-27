import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';

export const metadata: Metadata = generatePageMetadata({
  type: 'blog',
  blogTitle: 'Blog Amil Empresarial — Guias, Comparativos e Notícias',
  description: 'Artigos sobre planos de saúde empresariais: guias de contratação, comparativos de planos, legislação ANS, dicas de RH e benefícios corporativos.',
  canonical: '/blog',
});

export const revalidate = 3600;

export default function BlogPage() {
  return (
    <>
      <SchemaGraph pageType="page" breadcrumb={[{ name: 'Blog', href: '/blog' }]} />
      <BreadcrumbNav items={[{ label: 'Blog', href: '/blog' }]} />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Blog Amil Empresarial
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Guias, comparativos, notícias e dicas sobre planos de saúde para empresas.
          </p>

          <div className="mt-10 rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-400">
            Posts do blog serão carregados do Sanity CMS.
          </div>
        </div>
      </section>
    </>
  );
}
