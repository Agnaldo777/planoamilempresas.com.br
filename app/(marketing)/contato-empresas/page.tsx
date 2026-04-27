import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { Phone } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  title: 'Telefone Amil para Empresas — Contato Comercial e Suporte',
  description: 'Telefones Amil para empresas em SP, RJ, BH, Curitiba, Brasília e mais. Contato comercial para cotação empresarial e suporte ao RH.',
  canonical: '/contato-empresas',
});

const telefones = [
  { cidade: 'São Paulo', tel: '(11) 4200-7866' },
  { cidade: 'Rio de Janeiro', tel: '(21) 2042-2690' },
  { cidade: 'Belo Horizonte', tel: '(31) 2342-0743' },
  { cidade: 'Curitiba', tel: '(41) 3542-1590' },
  { cidade: 'Brasília', tel: '(61) 3142-0100' },
  { cidade: 'Salvador', tel: '(71) 4042-1632' },
  { cidade: 'Porto Alegre', tel: '(51) 2042-0132' },
  { cidade: 'Campinas', tel: '(19) 2042-2040' },
  { cidade: 'Florianópolis', tel: '(48) 3197-9957' },
];

export default function ContatoEmpresasPage() {
  return (
    <>
      <SchemaGraph pageType="page" breadcrumb={[{ name: 'Contato Empresas', href: '/contato-empresas' }]} />
      <BreadcrumbNav items={[{ label: 'Contato Empresas', href: '/contato-empresas' }]} />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Telefones Amil para Empresas
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Central de vendas empresarial. Ligue e receba sua cotação personalizada.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {telefones.map((item) => (
              <a
                key={item.cidade}
                href={`tel:${item.tel.replace(/\D/g, '')}`}
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-amil-blue hover:bg-amil-blue-light"
              >
                <Phone className="h-5 w-5 text-amil-blue" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.cidade}</p>
                  <p className="text-sm text-amil-blue">{item.tel}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 rounded-xl bg-whatsapp/10 p-6 text-center">
            <p className="font-semibold text-gray-900">Prefere WhatsApp?</p>
            <a
              href="https://wa.me/5511942007866?text=Olá! Gostaria de uma cotação empresarial Amil."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-lg bg-whatsapp px-6 py-3 font-semibold text-white hover:opacity-90"
            >
              Chamar no WhatsApp →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
