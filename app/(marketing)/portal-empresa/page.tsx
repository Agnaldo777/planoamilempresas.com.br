import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  title: 'Portal Amil Empresa — Login do Cliente Empresarial',
  description: 'Acesse o Portal Amil Empresa: gerencie vidas, boletos, segunda via, inclusão de beneficiários. Login do cliente empresarial.',
  canonical: '/portal-empresa',
});

export default function PortalEmpresaPage() {
  return (
    <>
      <SchemaGraph pageType="page" breadcrumb={[{ name: 'Portal Empresa', href: '/portal-empresa' }]} />
      <BreadcrumbNav items={[{ label: 'Portal Empresa', href: '/portal-empresa' }]} />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Portal Amil Empresa — Acesso do Cliente Empresarial
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Gerencie seu plano empresarial: inclusão/exclusão de vidas, 2ª via de boleto, relatórios.
          </p>

          <div className="mt-8 rounded-xl border-2 border-slate-900 bg-slate-50 p-8 text-center">
            <p className="text-lg font-semibold text-slate-900">Acessar Portal Amil Empresa</p>
            <a
              href="https://www.amil.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-lg bg-teal-600 px-8 py-3 font-semibold text-white hover:bg-teal-500"
            >
              Ir para o Portal →
            </a>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              { title: '2ª Via de Boleto', desc: 'Emita a segunda via do seu boleto empresarial', href: '/portal-empresa/segunda-via-boleto' },
              { title: 'Incluir Beneficiário', desc: 'Adicione novos colaboradores ao plano', href: '/portal-empresa/incluir-beneficiario' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg border border-gray-200 p-6 hover:shadow-md">
                <h2 className="font-bold text-gray-900">{item.title}</h2>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
