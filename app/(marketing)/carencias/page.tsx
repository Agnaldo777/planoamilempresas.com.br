/**
 * /carencias — Story 3.20 (FR39)
 *
 * Página dedicada à Calculadora de Carências do Plano Amil Empresarial.
 *
 * **Estrutura:**
 *   - SSG (static shell) + Client island (`<CarenciaCalculator />`)
 *   - H1 "Carências do Plano Amil 2026"
 *   - Conteúdo editorial explicando regras ANS RN 195/2009
 *   - Schema HowTo "Como calcular sua carência"
 *   - FAQAccordion com 5 Q&As categoria "Carências"
 *   - Disclaimer ANS obrigatório
 *
 * **Compliance (FR39, NFR21, NFR23, FR54):**
 *   - SchemaGraph com Organization=BeneficioRH (NUNCA Amil)
 *   - HowTo emitido inline para Featured Snippet
 *   - Conteúdo editorial original ≥600 palavras (NFR25 anti-cookie-cutter)
 */

import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FAQAccordion } from '@/components/seo/FAQAccordion';
import { CarenciaCalculator } from '@/components/ui/CarenciaCalculator';
import { buildHowToNode } from '@/lib/schema/howto';
import { FAQS_BY_CATEGORY } from '@/data/faqs/faq-amil-empresarial';
import { getCurrentYear } from '@/lib/seo/title';

const CURRENT_YEAR = getCurrentYear();

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  title: `Calculadora de Carências Amil ${CURRENT_YEAR} | Quando Posso Usar?`,
  description: `Calculadora interativa de carências do Plano Amil Empresarial ${CURRENT_YEAR}. Informe a data de contratação e veja quando cada cobertura libera. Baseado em ANS RN 195/2009.`,
  canonical: '/carencias',
});

const HOWTO_NODE = buildHowToNode({
  name: 'Como calcular sua carência no Plano Amil Empresarial',
  description:
    'Tutorial passo a passo para descobrir a data prevista de liberação de cada cobertura do plano Amil, baseado nos limites máximos legais da ANS.',
  totalTime: 'PT2M',
  steps: [
    {
      name: 'Selecione a data de contratação',
      text: 'No campo "Data de contratação", escolha a data em que o contrato Amil entrará (ou entrou) em vigência. Use o seletor de data ou digite no formato dd/mm/aaaa.',
    },
    {
      name: 'Visualize a tabela com datas previstas de liberação',
      text: 'A tabela é recalculada automaticamente. Cada categoria (urgência, consultas, exames, internações, parto, CPT) mostra a carência mínima ANS e a data prevista de liberação da cobertura.',
    },
    {
      name: 'Verifique a base legal de cada categoria',
      text: 'Cada linha cita a Resolução Normativa da ANS aplicável (RN 195/2009, RN 162/2007, RN 593/2024). Use essa referência ao revisar sua proposta comercial Amil.',
    },
    {
      name: 'Confirme as carências reais com seu corretor',
      text: 'Empresas com 30+ vidas geralmente têm isenção total negociada comercialmente. A calculadora mostra os limites máximos legais — sua proposta Amil pode ter prazos menores. Solicite cotação personalizada com a BeneficioRH.',
    },
  ],
});

const carenciaFaqs = FAQS_BY_CATEGORY['carencias']?.slice(0, 5) ?? [];

export default function CarenciasPage() {
  return (
    <>
      <SchemaGraph
        pageType="page"
        breadcrumb={[{ name: 'Carências', href: '/carencias' }]}
      />

      {/* HowTo schema standalone — Story 3.20 AC4 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            ...HOWTO_NODE,
          }),
        }}
      />

      <BreadcrumbNav items={[{ label: 'Carências', href: '/carencias' }]} />

      <section className="bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-balance text-3xl font-bold text-slate-900 md:text-4xl lg:text-5xl">
            Carências do Plano Amil {CURRENT_YEAR}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-700">
            Quanto tempo até usar consulta, exame, internação ou parto? Informe
            a data de contratação e a calculadora abaixo mostra a data prevista
            de liberação de cada cobertura — baseada nos limites máximos legais
            da ANS (RN 195/2009 e atualizações).
          </p>
        </div>
      </section>

      <section className="px-4 py-12" aria-labelledby="calculadora-heading">
        <div className="mx-auto max-w-4xl">
          <h2
            id="calculadora-heading"
            className="text-2xl font-semibold text-slate-900"
          >
            Calculadora de carência interativa
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Recalcula automaticamente ao alterar a data. Sem cadastro, sem
            envio de dados.
          </p>
          <div className="mt-6">
            <CarenciaCalculator />
          </div>
        </div>
      </section>

      <section
        className="bg-white px-4 py-12"
        aria-labelledby="contexto-heading"
      >
        <div className="mx-auto max-w-4xl space-y-6 text-base leading-relaxed text-slate-800">
          <h2
            id="contexto-heading"
            className="text-2xl font-semibold text-slate-900"
          >
            Como funcionam as carências regulamentadas pela ANS
          </h2>
          <p>
            Carência é o período, contado a partir do início da vigência do
            contrato, durante o qual o beneficiário ainda não tem direito a
            usar determinadas coberturas do plano de saúde. Para planos
            empresariais e coletivos por adesão, a Agência Nacional de Saúde
            Suplementar (ANS) estabelece limites máximos via{' '}
            <strong>Resolução Normativa 195/2009</strong>: 24 horas para
            urgência e emergência, 30 dias para consultas e exames simples, 180
            dias para internações e exames de alta complexidade, e 300 dias
            para parto a termo. Esses são tetos legais — a operadora pode
            oferecer prazos menores ou isenção total.
          </p>
          <p>
            No Plano Amil Empresarial, empresas com{' '}
            <strong>30 ou mais beneficiários</strong> tipicamente recebem{' '}
            <strong>isenção total de carência</strong> negociada comercialmente.
            Para PMEs menores (2-29 vidas), as carências geralmente seguem os
            limites máximos da ANS, mas podem ser reduzidas via promoções
            comerciais sazonais. Já beneficiários que migram de outra operadora
            podem usar a <strong>portabilidade de carências</strong>{' '}
            (RN 438/2018) e ingressar no plano sem cumprir novos prazos, desde
            que atendam aos critérios de tempo de permanência (mínimo 2 anos no
            plano de origem).
          </p>
          <p>
            Caso o beneficiário declare uma <strong>Doença ou Lesão
            Preexistente (DLP)</strong> no momento da adesão, a operadora pode
            aplicar <strong>Cobertura Parcial Temporária (CPT)</strong> de até{' '}
            <strong>24 meses</strong> para Procedimentos de Alta Complexidade
            (PAC), leitos de alta tecnologia e cirurgias relacionadas à
            condição declarada. Durante a CPT, consultas, exames básicos e
            internações clínicas relacionadas à DLP continuam cobertos
            normalmente — apenas os procedimentos de alta complexidade ficam
            suspensos. A omissão de DLP detectada posteriormente pode acarretar
            rescisão contratual ou reposicionamento de cobertura, então é
            sempre melhor declarar tudo na ficha.
          </p>
          <p>
            A calculadora acima usa apenas matemática de calendário —
            adiciona os dias de carência da ANS à data de contratação que você
            informa. Os resultados são <strong>estimativas conservadoras</strong>{' '}
            do pior caso legal; sua proposta Amil real pode ter prazos
            significativamente menores. Para confirmar carências exatas,{' '}
            <strong>solicite uma cotação personalizada</strong> com a
            BeneficioRH (corretora autorizada SUSEP 201054484) — analisaremos o
            porte da sua empresa, o produto Amil mais adequado e as condições
            comerciais vigentes.
          </p>
          <p>
            Importante: a calculadora não considera variáveis específicas como
            isenção PME 30+ vidas, portabilidade já contratada, ou promoções
            sazonais Amil. Use-a como referência de planejamento — a fonte
            definitiva sempre será a proposta comercial assinada e o contrato
            firmado entre operadora e empresa. Em caso de dúvida sobre carência
            durante o uso do plano, consulte o canal oficial da Amil ou
            recorra à ANS via Disque ANS (0800 701 9656).
          </p>
        </div>
      </section>

      <section
        className="bg-slate-50 px-4 py-12"
        aria-labelledby="faq-heading"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="faq-heading"
            className="text-2xl font-semibold text-slate-900"
          >
            Perguntas frequentes sobre carências
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            5 perguntas mais comuns sobre carências no Plano Amil Empresarial.
            Para o catálogo completo (45+), visite{' '}
            <a
              href="/perguntas-frequentes"
              className="font-medium text-teal-700 underline hover:text-teal-800"
            >
              Perguntas Frequentes
            </a>
            .
          </p>
          <div className="mt-6">
            <FAQAccordion
              items={carenciaFaqs}
              emitSchema
              id="faq-carencias"
              headingLevel="h3"
            />
          </div>
        </div>
      </section>

      <aside
        role="note"
        className="mx-auto my-12 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-900"
      >
        <p>
          <strong>Disclaimer ANS — leia antes de decidir.</strong> Os prazos
          exibidos correspondem aos limites máximos legais regulamentados pela
          ANS. Empresas PME 30+ vidas geralmente têm isenção total negociada;
          confirme as carências exatas na proposta comercial Amil antes de
          assinar. CPT (24 meses) pode ser aplicada a DLP declaradas. SUSEP
          201054484. Conteúdo informativo, não substitui consulta jurídica
          especializada.
        </p>
      </aside>
    </>
  );
}
