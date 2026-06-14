import type { Metadata } from 'next';
import Link from 'next/link';
import { buildOpenGraphMetadata } from '@/components/seo/OpenGraph';
import {
  DISCLAIMER_AMIL_REDE,
  ORGANIZATION_JSONLD_DEFAULTS,
} from '@/content/disclaimers/amil-rede';

export const revalidate = 2592000; // 30 dias

const TITLE = 'Reajuste do Amil veio alto? Veja como reduzir antes de cancelar';
const DESCRIPTION =
  'Reajuste do plano Amil empresarial alto? Entenda o pool de risco (RN 309), a portabilidade sem nova carência (RN 438) e a cotação anual — formas honestas de reduzir o custo sem perder cobertura.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  ...buildOpenGraphMetadata({ title: TITLE, description: DESCRIPTION, type: 'website' }),
  alternates: { canonical: '/reduzir-reajuste-amil' },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    pergunta: 'Por que o reajuste do plano Amil empresarial veio tão alto?',
    resposta:
      'O reajuste dos planos coletivos não tem teto da ANS — é calculado pela sinistralidade (uso vs. mensalidades) do contrato ou do pool. Em 2025, a Amil aplicou um dos maiores reajustes coletivos do mercado, cerca de 15,75%. Em 2026, a média setorial de coletivos ficou próxima de 9,9%, mas pequenas empresas (menos de 30 vidas) tendem a sentir um pouco mais.',
  },
  {
    pergunta: 'O que é o pool de risco (RN 309) e como ele me protege?',
    resposta:
      'Pela RN 309/2012 da ANS, todos os contratos com menos de 30 vidas de uma operadora são reajustados em conjunto, num pool único. Isso impede que um único colaborador com sinistro alto dispare o reajuste só da sua empresa — o risco é diluído entre milhares de contratos pequenos. É uma proteção real para a micro e pequena empresa.',
  },
  {
    pergunta: 'Posso trocar de plano sem cumprir carência de novo?',
    resposta:
      'Sim, pela portabilidade de carências (RN 438/2018). Cumprindo os requisitos (tempo de permanência, plano de origem regular e destino compatível), você muda de plano ou de operadora sem cumprir novas carências. É a principal alavanca contra um reajuste abusivo — e também de negociação com a operadora atual.',
  },
  {
    pergunta: 'Vale a pena cancelar o plano por causa do reajuste?',
    resposta:
      'Cancelar sem alternativa significa reentrar em carências depois. Antes disso, avalie: renegociar pela sinistralidade, fazer a cotação anual de mercado, e usar a portabilidade para migrar sem perder carência. Cancelar é o último recurso, não o primeiro.',
  },
  {
    pergunta: 'O reajuste de 2-29 vidas é maior que o de empresas maiores?',
    resposta:
      'Em geral, sim. Em 2026, contratos com menos de 30 vidas tiveram reajuste médio em torno de 13,5%, contra cerca de 8,7% das empresas com 30+ vidas. A contrapartida do porte menor é a proteção do pool de risco. Ao crescer e passar de 30 vidas, a empresa ganha poder de negociação.',
  },
];

const acoes = [
  {
    titulo: '1. Cotação anual de mercado',
    texto:
      'Todo ano, antes da renovação, compare o que sua empresa paga com o que o mercado oferece pela mesma rede. Uma cotação por CNPJ atualizada é o melhor argumento de negociação — e, muitas vezes, revela uma economia que justifica a troca.',
  },
  {
    titulo: '2. Portabilidade sem nova carência (RN 438)',
    texto:
      'Se o reajuste veio abusivo, a portabilidade permite migrar para outro plano ou operadora compatível sem recomeçar as carências. É a alavanca mais poderosa: muda o jogo da negociação porque você deixa de ser refém do contrato atual.',
  },
  {
    titulo: '3. Pool de risco e renegociação (RN 309)',
    texto:
      'Empresas com menos de 30 vidas estão protegidas pelo pool. Empresas maiores negociam pela própria sinistralidade — e podem reduzir o reajuste com gestão (prevenção, uso consciente, coparticipação bem desenhada) e dados de uso na mesa.',
  },
];

export default function ReduzirReajusteAmilPage() {
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
      { '@type': 'ListItem', position: 2, name: 'Reduzir reajuste Amil', item: '/reduzir-reajuste-amil' },
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

      {/* Hero */}
      <section className="bg-slate-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <nav className="mb-6 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">Início</Link>
            <span className="mx-2">›</span>
            <span className="text-white">Reduzir reajuste Amil</span>
          </nav>
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{TITLE}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Em 2025, a Amil aplicou um dos maiores reajustes coletivos do mercado (cerca de 15,75%).
            A boa notícia: existem caminhos legítimos para reduzir o custo sem perder cobertura — e
            nenhum deles é prometer reajuste baixo.
          </p>
          <Link
            href="/cotacao-online?origem=reajuste"
            className="mt-8 inline-block rounded-lg bg-cta-green px-8 py-4 text-lg font-semibold text-white hover:bg-cta-green-hover"
          >
            Simular portabilidade sem perder carência →
          </Link>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Resposta direta (AI Overview) */}
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 text-gray-800">
            <p>
              <strong>Como reduzir o reajuste do plano Amil empresarial?</strong> Faça a cotação anual de
              mercado, use a portabilidade de carências (RN 438) para migrar sem recomeçar carências e,
              em contratos com menos de 30 vidas, conte com a proteção do pool de risco (RN 309). Cancelar
              deve ser o último recurso — antes disso, renegocie com dados de uso na mesa.
            </p>
          </div>

          {/* Editorial */}
          <section className="mt-10 space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">A objeção é real — e tem solução honesta</h2>
            <p>
              Quem pesquisa &ldquo;reajuste Amil 2026&rdquo; ou &ldquo;reduzir reajuste do plano empresarial&rdquo;
              geralmente acabou de receber um aviso de reajuste e está decidindo se renova, renegocia ou troca.
              É um momento de decisão — e a pior escolha é cancelar no impulso, porque isso significa reentrar
              em carências num plano novo.
            </p>
            <p>
              O reajuste dos planos coletivos é calculado por sinistralidade e não tem teto da ANS (diferente do
              individual, com teto de 5,11% em 2026). Por isso ele varia tanto entre operadoras e portes. O caminho
              não é buscar quem &ldquo;promete reajuste baixo&rdquo; — ninguém sério promete —, e sim usar os três
              instrumentos abaixo a seu favor.
            </p>
          </section>

          {/* Ações */}
          <section className="mt-10 space-y-6">
            {acoes.map((a) => (
              <div key={a.titulo} className="rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900">{a.titulo}</h2>
                <p className="mt-2 text-gray-700">{a.texto}</p>
              </div>
            ))}
          </section>

          {/* CTA */}
          <div className="mt-12 rounded-lg bg-blue-600 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Compare antes de renovar</h2>
            <p className="mt-2 text-blue-100">
              Uma cotação por CNPJ atualizada é o seu maior poder de negociação — e a base para uma
              portabilidade sem perder carência.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href="/cotacao-online?origem=reajuste" className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
                Fazer cotação por CNPJ →
              </Link>
              <Link href="/empresarial/pme-2-a-29-vidas" className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                Entender o pool de risco (PME)
              </Link>
            </div>
          </div>

          {/* Microcopy honesto */}
          <p className="mt-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Transparência:</strong> não prometemos reajuste baixo — nenhum corretor sério promete.
            Prometemos cotação anual, comparação honesta e portabilidade quando ela vale a pena.
          </p>

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Perguntas frequentes sobre reajuste Amil</h2>
            <dl className="mt-6 space-y-6">
              {faqs.map((f) => (
                <div key={f.pergunta}>
                  <dt className="font-semibold text-gray-900">{f.pergunta}</dt>
                  <dd className="mt-2 text-gray-700">{f.resposta}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="mt-10 text-sm text-gray-600">
            Veja também os <Link href="/empresarial" className="text-blue-600 hover:underline">planos empresariais por porte</Link>{' '}
            ou faça sua <Link href="/cotacao-online" className="text-blue-600 hover:underline">cotação por CNPJ</Link>.
          </p>

          <footer className="mt-10 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Aviso:</strong> {DISCLAIMER_AMIL_REDE} Percentuais de reajuste citados são de referência
            de mercado (ANS/operadora) e variam por contrato.
          </footer>
        </div>
      </section>
    </>
  );
}
