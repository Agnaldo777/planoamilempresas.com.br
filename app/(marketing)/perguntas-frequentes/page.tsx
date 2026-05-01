/**
 * /perguntas-frequentes — Story 4.7 (FR36)
 *
 * Renderiza 45+ Q&A canônicos via <FAQAccordion> (SEO RSC), agrupados
 * por categoria, com JSON-LD FAQPage único agregando todas as Q&As.
 *
 * Decisão: usamos um único schema FAQPage no topo da página (mainEntity
 * com 45 entradas) para Google Rich Results "FAQ accordion" SERP.
 * Cada categoria também é renderizada como seção visual com seu próprio
 * <FAQAccordion> sem schema duplicado (emitSchema={false}).
 *
 * Build-time data: FAQS_AMIL_EMPRESARIAL (data/faqs/...). Migração
 * para Sanity GROQ é v2 (não bloqueia esta story).
 */

import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FAQAccordion } from '@/components/seo/FAQAccordion';
import {
  FAQS_AMIL_EMPRESARIAL,
  FAQS_BY_CATEGORY,
  FAQ_CATEGORY_LABELS,
  type FAQCategory,
} from '@/data/faqs/faq-amil-empresarial';
import { getCurrentYear } from '@/lib/seo/title';

const CURRENT_YEAR = getCurrentYear();

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  title: `Perguntas Frequentes Amil ${CURRENT_YEAR} — FAQ Plano Empresarial`,
  description: `45+ perguntas e respostas sobre Plano Amil Empresarial ${CURRENT_YEAR}: carência, coparticipação, reembolso, rede credenciada, MEI, ANS e mais. Atualizado e revisado.`,
  canonical: '/perguntas-frequentes',
});

const CATEGORY_ORDER: FAQCategory[] = [
  'carencias',
  'coparticipacao',
  'reembolso',
  'rede-credenciada',
  'adesao',
  'ans',
  'cobertura',
  'cancelamento',
];

export default function PerguntasFrequentesPage() {
  return (
    <>
      {/* Schema gráfico — Organization (BeneficioRH) + Breadcrumb */}
      <SchemaGraph
        pageType="faq"
        breadcrumb={[
          { name: 'Perguntas Frequentes', href: '/perguntas-frequentes' },
        ]}
      />

      <BreadcrumbNav
        items={[
          { label: 'Perguntas Frequentes', href: '/perguntas-frequentes' },
        ]}
      />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-balance text-3xl font-bold text-slate-900 md:text-4xl">
            Perguntas Frequentes — Plano Amil Empresarial {CURRENT_YEAR}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            {FAQS_AMIL_EMPRESARIAL.length} respostas detalhadas sobre carência, coparticipação,
            reembolso, rede credenciada, adesão MEI/PME, ANS e mais. Conteúdo
            revisado pela BeneficioRH (corretora SUSEP 201054484).
          </p>

          {/* JSON-LD único agregando TODAS as 45+ Q&As (Google Rich Results) */}
          <FAQAccordion
            items={FAQS_AMIL_EMPRESARIAL}
            emitSchema
            id="faq-all"
            className="sr-only"
            headingLevel="h3"
          />

          {/* Renderização visual por categoria — schema NÃO duplicado */}
          {CATEGORY_ORDER.map((cat) => {
            const items = FAQS_BY_CATEGORY[cat];
            if (!items || items.length === 0) return null;
            return (
              <section
                key={cat}
                id={`faq-${cat}`}
                className="mt-12"
                aria-labelledby={`heading-${cat}`}
              >
                <h2
                  id={`heading-${cat}`}
                  className="mb-4 text-2xl font-semibold text-slate-900"
                >
                  {FAQ_CATEGORY_LABELS[cat]}
                  <span className="ml-2 text-base font-normal text-slate-500">
                    ({items.length} {items.length === 1 ? 'pergunta' : 'perguntas'})
                  </span>
                </h2>
                <FAQAccordion
                  items={items}
                  emitSchema={false}
                  headingLevel="h3"
                />
              </section>
            );
          })}

          {/* Aviso revisão NFR23 */}
          <aside
            role="note"
            className="mt-12 rounded-xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-900"
          >
            <p>
              <strong>Conteúdo em revisão</strong> — algumas respostas seguem
              em validação pela equipe técnica BeneficioRH (NFR23: revisão
              humana obrigatória em conteúdo regulatório). Para dúvidas
              urgentes ou esclarecimentos específicos sobre o seu contrato,
              entre em contato com o nosso atendimento. SUSEP 201054484.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
