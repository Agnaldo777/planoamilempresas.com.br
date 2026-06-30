import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { QuoteForm } from '@/components/forms/QuoteForm';

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  title: 'Cotacao Amil Empresarial Online 2026 | Simule por CNPJ',
  description:
    'Solicite cotacao Amil empresarial para MEI, PME e grandes empresas. Compare preco, rede credenciada, carencias e linhas S380, S450, S750 e One com corretora autorizada SUSEP.',
  canonical: '/cotacao-online',
});

const trustItems = [
  {
    title: 'Corretora autorizada',
    text: 'Atendimento pela BeneficioRH, com SUSEP 201054484 e orientacao sem custo de corretagem para a empresa.',
  },
  {
    title: 'Comparacao por rede',
    text: 'A cotacao considera hospitais, laboratorios e clinicas relevantes para a cidade e o perfil do CNPJ.',
  },
  {
    title: 'Preco por perfil real',
    text: 'O valor final depende de faixa etaria, vidas, porte, UF e linha escolhida. Nao usamos preco generico como promessa.',
  },
];

const steps = [
  {
    title: '1. Informe o perfil',
    text: 'Diga se e MEI, PME, familia ou empresa maior, alem do numero aproximado de vidas.',
  },
  {
    title: '2. Cruzamos preco e rede',
    text: 'A analise compara linhas Amil, rede credenciada regional e requisitos de contratacao por CNPJ.',
  },
  {
    title: '3. Receba a proposta',
    text: 'Um corretor retorna pelo WhatsApp com a alternativa mais adequada para contratar ou migrar.',
  },
];

const quickLinks = [
  { href: '/tabela-de-precos', label: 'Tabela de precos Amil' },
  { href: '/rede-credenciada', label: 'Rede credenciada Amil' },
  { href: '/empresarial/mei', label: 'Plano Amil para MEI' },
  { href: '/empresarial/pme-2-a-29-vidas', label: 'Amil PME 2 a 29 vidas' },
  { href: '/calculadora-economia', label: 'Calculadora de economia PJ' },
  { href: '/reduzir-reajuste-amil', label: 'Reduzir reajuste Amil' },
];

const faqs = [
  {
    pergunta: 'A cotacao Amil online tem custo?',
    resposta:
      'Nao. A cotacao e o atendimento da corretora nao geram custo de corretagem para a empresa. O pagamento do plano, quando contratado, e feito conforme proposta da operadora.',
  },
  {
    pergunta: 'O valor mostrado na tabela e o preco final?',
    resposta:
      'Nao necessariamente. Tabelas publicas e valores de referencia ajudam a comparar linhas, mas o preco final depende do CNPJ, quantidade de vidas, idades, cidade, acomodacao e regra comercial vigente.',
  },
  {
    pergunta: 'MEI pode solicitar cotacao Amil empresarial?',
    resposta:
      'Sim. O MEI pode cotar plano empresarial quando atende aos requisitos comerciais, como CNPJ ativo e quantidade minima de vidas. A analise confirma elegibilidade antes da proposta.',
  },
  {
    pergunta: 'Da para cotar mantendo um hospital especifico da rede?',
    resposta:
      'Sim. Informe a cidade e, se houver um hospital ou laboratorio essencial, o corretor compara quais linhas Amil tendem a dar acesso a essa rede antes da contratacao.',
  },
];

export default function CotacaoOnlinePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: faq.resposta },
    })),
  };

  return (
    <>
      <SchemaGraph pageType="page" breadcrumb={[{ name: 'Cotacao Online', href: '/cotacao-online' }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbNav items={[{ label: 'Cotacao Online', href: '/cotacao-online' }]} />

      <section className="bg-slate-950 px-4 py-12 text-white md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_440px] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">
              Cotacao Amil empresarial
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold md:text-5xl">
              Compare preco, rede e carencias antes de contratar o Amil para sua empresa
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-200">
              Envie o perfil do CNPJ e receba uma proposta orientada por rede credenciada,
              faixa etaria e porte. Atendimento por corretora autorizada, sem custo de corretagem.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="border-l border-teal-300/50 pl-4">
                <strong className="block text-2xl">2+</strong>
                <span className="text-sm text-slate-300">vidas para PME/MEI elegivel</span>
              </div>
              <div className="border-l border-teal-300/50 pl-4">
                <strong className="block text-2xl">26 UFs</strong>
                <span className="text-sm text-slate-300">com rede mapeada no site</span>
              </div>
              <div className="border-l border-teal-300/50 pl-4">
                <strong className="block text-2xl">9.325</strong>
                <span className="text-sm text-slate-300">prestadores no dataset Amil</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white p-6 text-slate-900 shadow-xl">
            <h2 className="text-center text-xl font-bold">Receber cotacao pelo WhatsApp</h2>
            <p className="mx-auto mt-2 max-w-sm text-center text-sm text-slate-600">
              Formulario rapido para iniciar a simulacao com um corretor.
            </p>
            <div className="mt-6">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 md:grid-cols-3">
            {trustItems.map((item) => (
              <section key={item.title} className="rounded-lg border border-slate-200 p-5">
                <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </section>
            ))}
          </div>

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">Como a cotacao e analisada</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.title} className="border-t border-slate-300 pt-4">
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-lg bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-900">Antes de decidir, compare o que muda o custo</h2>
            <p className="mt-3 max-w-3xl text-slate-700">
              O melhor plano nao e sempre o mais barato. Para empresa, a decisao correta cruza preco,
              rede utilizada pela equipe, carencias, acomodacao e previsibilidade de reajuste.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-teal-500 hover:text-teal-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">Perguntas frequentes sobre cotacao Amil</h2>
            <dl className="mt-6 grid gap-6 md:grid-cols-2">
              {faqs.map((faq) => (
                <div key={faq.pergunta}>
                  <dt className="font-semibold text-slate-900">{faq.pergunta}</dt>
                  <dd className="mt-2 text-sm leading-6 text-slate-700">{faq.resposta}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </section>
    </>
  );
}
