import type { Metadata } from 'next';
import Link from 'next/link';
import { buildOpenGraphMetadata } from '@/components/seo/OpenGraph';
import { EconomiaCalculatorLazy } from '@/components/ui/EconomiaCalculatorLazy';
import {
  DISCLAIMER_AMIL_REDE,
  ORGANIZATION_JSONLD_DEFAULTS,
} from '@/content/disclaimers/amil-rede';

export const revalidate = 2592000;

const TITLE = 'Calculadora: quanto sua empresa economiza no plano Amil PJ vs individual';
const DESCRIPTION =
  'Calcule a economia do plano de saúde Amil empresarial (PJ) frente ao plano individual: informe estado, número de vidas e faixa etária e veja a estimativa por mês e por ano. Preços de referência por faixa.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  ...buildOpenGraphMetadata({ title: TITLE, description: DESCRIPTION, type: 'website' }),
  alternates: { canonical: '/calculadora-economia' },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    pergunta: 'Quanto a empresa economiza no plano Amil PJ frente ao individual?',
    resposta:
      'Em média de 30% a 40% para cobertura equivalente. O plano empresarial usa tabela coletiva, que dilui o risco no grupo, enquanto o individual precifica uma única pessoa e tem valor de entrada mais alto. A calculadora estima a diferença a partir do preço real por faixa etária do plano de entrada do estado.',
  },
  {
    pergunta: 'A partir de quantas vidas vale a pena o plano empresarial?',
    resposta:
      'A partir de 2 vidas — inclusive para MEI com CNPJ ativo há 6 meses. Já no mínimo, a tabela coletiva costuma sair bem abaixo do individual com a mesma rede Amil.',
  },
  {
    pergunta: 'Os valores da calculadora são o preço final?',
    resposta:
      'Não. São estimativas de referência baseadas no preço por faixa etária do plano de entrada de cada estado. O valor final depende do número de vidas, da composição exata de idades, do porte da empresa e da linha escolhida — por isso a cotação por CNPJ é o número real.',
  },
];

export default function CalculadoraEconomiaPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: f.resposta },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Calculadora de economia', item: '/calculadora-economia' },
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_JSONLD_DEFAULTS.name,
    sameAs: ORGANIZATION_JSONLD_DEFAULTS.sameAs,
  };

  return (
    <>
      {[faqSchema, breadcrumbSchema, organizationSchema].map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <section className="bg-gradient-to-b from-blue-700 to-blue-600 px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-3xl font-bold md:text-4xl">
            Quanto sua empresa economiza no plano Amil PJ?
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-blue-100">
            Informe estado, número de vidas e faixa etária predominante e veja a estimativa de economia
            do plano empresarial frente ao individual — com a mesma rede Amil.
          </p>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <EconomiaCalculatorLazy />

          <section className="mt-10 space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">Por que o plano PJ é mais barato que o individual</h2>
            <p>
              O plano individual precifica o risco de uma única pessoa e tem valor de entrada alto. O plano
              empresarial (PJ) dilui o risco no grupo e parte de tabelas coletivas — por isso, com a mesma rede
              Amil, a economia costuma ficar entre 30% e 40%. É o motivo de mais de 13 milhões de MEIs migrarem
              para o CNPJ: o individual encarece e quase não é mais vendido, enquanto o empresarial PME segue
              acessível e protegido por regras coletivas.
            </p>
            <p>
              A partir de 2 vidas qualquer CNPJ ativo (MEI, ME, EPP, LTDA) já contrata na modalidade empresarial.
              Veja os <Link href="/empresarial" className="text-blue-600 hover:underline">planos por porte</Link> ou
              a <Link href="/tabela-de-precos" className="text-blue-600 hover:underline">tabela de preços completa</Link>.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Perguntas frequentes</h2>
            <dl className="mt-6 space-y-6">
              {faqs.map((f) => (
                <div key={f.pergunta}>
                  <dt className="font-semibold text-gray-900">{f.pergunta}</dt>
                  <dd className="mt-2 text-gray-700">{f.resposta}</dd>
                </div>
              ))}
            </dl>
          </section>

          <footer className="mt-10 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Aviso:</strong> {DISCLAIMER_AMIL_REDE} Valores são estimativas de referência por faixa
            etária; a cotação por CNPJ define o preço exato.
          </footer>
        </div>
      </section>
    </>
  );
}
