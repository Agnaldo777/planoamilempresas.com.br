import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FAQAccordion } from '@/components/ui/FAQAccordion';

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  title: 'Perguntas Frequentes Amil 2026 | FAQ Planos de Saúde',
  description: 'Respostas para as dúvidas mais comuns sobre planos Amil: carência, coparticipação, reembolso, rede credenciada, MEI e mais.',
  canonical: '/perguntas-frequentes',
});

const faqItems = [
  { question: 'Qual o valor do plano Amil Empresarial?', answer: 'O plano Amil Empresarial varia conforme a faixa etária dos beneficiários e o tipo de plano escolhido. Para a faixa de 00 a 18 anos, o Amil Fácil S80 começa em R$ 101,84. O preço final é calculado de acordo com o número de vidas e idades dos funcionários.' },
  { question: 'O plano Amil Empresarial aceita MEI?', answer: 'Sim. O Plano Amil MEI é comercializado para Microempreendedores Individuais a partir de 2 vidas, com CNPJ com no mínimo 180 dias de abertura.' },
  { question: 'O plano Amil Empresarial tem carência?', answer: 'Para empresas com 30 ou mais vidas, geralmente há isenção de carência. Para empresas menores (2-29 vidas), pode haver carência reduzida conforme negociação.' },
  { question: 'Qual a diferença entre Amil S380 e S450?', answer: 'O Amil S450 tem uma rede credenciada mais ampla que o S380, incluindo hospitais de maior referência. Ambos têm cobertura nacional, mas o S450 oferece mais opções de reembolso.' },
  { question: 'O que é coparticipação no plano Amil?', answer: 'Coparticipação é quando o beneficiário paga uma parte do custo de cada procedimento utilizado, além da mensalidade. Isso reduz o valor da mensalidade mensal do plano.' },
  { question: 'Como funciona o reembolso da Amil?', answer: 'O reembolso Amil permite que você consulte médicos fora da rede credenciada e seja ressarcido parcialmente. O valor e prazo variam por plano: Amil One reembolsa em até 3 dias úteis.' },
  { question: 'A Amil cobre cirurgia bariátrica?', answer: 'Sim, a Amil cobre cirurgia bariátrica conforme as regras da ANS, para pacientes com IMC acima de 40 ou IMC acima de 35 com comorbidades, após avaliação médica.' },
  { question: 'Como fazer portabilidade para a Amil?', answer: 'A portabilidade permite trocar de operadora sem cumprir novas carências. Você precisa ter pelo menos 2 anos no plano atual (ou 3 anos se tiver usado cobertura parcial temporária) e o plano Amil deve ser compatível.' },
];

export default function FAQPage() {
  return (
    <>
      <SchemaGraph
        pageType="faq"
        breadcrumb={[{ name: 'Perguntas Frequentes', href: '/perguntas-frequentes' }]}
        faq={faqItems}
      />
      <BreadcrumbNav items={[{ label: 'Perguntas Frequentes', href: '/perguntas-frequentes' }]} />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Perguntas Frequentes — Amil Saúde 2026
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Tire suas dúvidas sobre planos Amil, carência, preços e cobertura.
          </p>

          <div className="mt-10">
            <FAQAccordion items={faqItems} includeSchema={false} />
          </div>
        </div>
      </section>
    </>
  );
}
