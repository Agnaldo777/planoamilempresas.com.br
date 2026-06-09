import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { DISCLAIMER_AMIL_REDE } from '@/content/disclaimers/amil-rede';

export const metadata: Metadata = {
  title: 'Tabela de Preços Amil Empresarial 2026 — Valores por Faixa, Porte e Linha',
  description:
    'Tabela de preços Amil 2026: como o valor é calculado por faixa etária, número de vidas, linha (S380/S450/S750/One) e acomodação. Empresarial e MEI — cotação online.',
  alternates: { canonical: '/tabela-de-precos' },
};

export const revalidate = 3600;

// Valores de REFERÊNCIA ("a partir de") — indicativos, sujeitos a cotação por
// perfil. Não são tabela oficial Amil; servem só de ordem de grandeza.
const LINHAS = [
  { nome: 'Amil Fácil', abrangencia: 'Regional (SP/RJ/PR)', acomodacao: 'Enfermaria', desde: 'R$ 89,90', nota: 'Custo-benefício regional' },
  { nome: 'Amil S380', abrangencia: 'Nacional', acomodacao: 'Enfermaria/Apto', desde: 'R$ 165,52', nota: 'Entrada nacional — mais vendido em PME' },
  { nome: 'Amil S450', abrangencia: 'Nacional', acomodacao: 'Apartamento', desde: 'R$ 184,21', nota: 'Intermediário, rede ampliada' },
  { nome: 'Amil S750', abrangencia: 'Nacional', acomodacao: 'Apartamento', desde: 'R$ 251,95', nota: 'Topo da Linha Selecionada' },
  { nome: 'Amil One S6500 Black', abrangencia: 'Nacional + Internacional', acomodacao: 'Apartamento', desde: 'R$ 591,63', nota: 'Premium' },
  { nome: 'Amil Dental', abrangencia: 'Nacional', acomodacao: '—', desde: 'R$ 29,90', nota: 'Plano odontológico' },
];

const FATORES = [
  { t: 'Faixa etária', d: 'Principal fator. O preço sobe nas 10 faixas da ANS — a última (59+) pode ser várias vezes a primeira.' },
  { t: 'Número de vidas', d: 'Planos empresariais ficam mais baratos por vida conforme o porte (2-29, 30-99, 100+).' },
  { t: 'Linha do plano', d: 'S380 < S450 < S750 < One — quanto maior a rede credenciada, maior o valor.' },
  { t: 'Acomodação', d: 'Enfermaria (quarto coletivo) é mais barata que apartamento (quarto particular).' },
  { t: 'Coparticipação', d: 'Planos com coparticipação (paga-se parte do uso) têm mensalidade menor.' },
  { t: 'Região', d: 'O preço varia conforme a cidade/UF de contratação e a rede local.' },
];

const FAIXAS_ANS = [
  '0 a 18', '19 a 23', '24 a 28', '29 a 33', '34 a 38',
  '39 a 43', '44 a 48', '49 a 53', '54 a 58', '59 ou mais',
];

const FAQS = [
  {
    pergunta: 'Qual o preço do plano Amil empresarial em 2026?',
    resposta:
      'Não há um preço único: o valor do Amil empresarial depende da faixa etária dos colaboradores, ' +
      'do número de vidas, da linha (S380, S450, S750, One) e da acomodação. As linhas nacionais começam ' +
      'em torno de R$ 165/vida (S380) como referência; o preço exato vem da cotação por CNPJ.',
  },
  {
    pergunta: 'O plano Amil aceita MEI?',
    resposta:
      'Sim. MEI com CNPJ ativo há pelo menos 180 dias pode contratar o Amil empresarial, geralmente a ' +
      'partir de 2 vidas, incluindo titular e dependentes — com preço de tabela coletiva (mais vantajoso ' +
      'que o individual).',
  },
  {
    pergunta: 'O Amil tem coparticipação?',
    resposta:
      'Há planos com e sem coparticipação. Na coparticipação, o beneficiário paga uma parte a cada uso ' +
      '(consulta/exame), e em troca a mensalidade é menor. É uma boa opção para equipes com baixa ' +
      'frequência de uso.',
  },
  {
    pergunta: 'Como funciona o reajuste por faixa etária?',
    resposta:
      'O preço muda nas 10 faixas etárias definidas pela ANS, sendo a última a partir dos 59 anos. ' +
      'Esse reajuste por mudança de faixa é diferente do reajuste anual do contrato.',
  },
  {
    pergunta: 'Qual o plano Amil mais barato?',
    resposta:
      'Regionalmente, o Amil Fácil costuma ser o de menor mensalidade (SP/RJ/PR). Em cobertura nacional, ' +
      'o S380 é a porta de entrada mais econômica. O ideal é comparar custo × rede na cotação.',
  },
];

export default function TabelaPrecosPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: f.resposta },
    })),
  };

  return (
    <>
      <SchemaGraph pageType="page" breadcrumb={[{ name: 'Tabela de Preços', href: '/tabela-de-precos' }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbNav items={[{ label: 'Tabela de Preços', href: '/tabela-de-precos' }]} />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Tabela de Preços Amil Empresarial 2026
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            O preço do plano Amil é <strong>personalizado</strong> — varia por faixa etária, número de
            vidas, linha e acomodação. Abaixo, os valores de referência por linha e tudo o que define a
            mensalidade. Para o valor exato do seu CNPJ, faça uma cotação.
          </p>

          <div className="mt-6">
            <Link href="/cotacao-online" className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Cotar preço para meu CNPJ →
            </Link>
          </div>

          {/* Tabela comparativa de linhas */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Valores de referência por linha</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left text-gray-500">
                    <th className="py-3 pr-4 font-semibold">Linha</th>
                    <th className="py-3 pr-4 font-semibold">Abrangência</th>
                    <th className="py-3 pr-4 font-semibold">Acomodação</th>
                    <th className="py-3 pr-4 font-semibold">A partir de*</th>
                    <th className="py-3 pr-4 font-semibold">Observação</th>
                    <th className="py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {LINHAS.map((l) => (
                    <tr key={l.nome} className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-semibold text-gray-900">{l.nome}</td>
                      <td className="py-3 pr-4 text-gray-700">{l.abrangencia}</td>
                      <td className="py-3 pr-4 text-gray-700">{l.acomodacao}</td>
                      <td className="py-3 pr-4 font-semibold text-blue-700">{l.desde}</td>
                      <td className="py-3 pr-4 text-gray-500">{l.nota}</td>
                      <td className="py-3">
                        <Link href={`/cotacao-online?produto=${encodeURIComponent(l.nome)}`} className="whitespace-nowrap text-blue-600 hover:underline">
                          Cotar →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              *Valores de referência (a partir de), indicativos e sujeitos a cotação por perfil. Não
              constituem tabela oficial da operadora.
            </p>
          </section>

          {/* Fatores de preço */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">O que define o preço do plano Amil</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {FATORES.map((f) => (
                <div key={f.t} className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900">{f.t}</h3>
                  <p className="mt-1 text-sm text-gray-600">{f.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Faixas etárias ANS */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">As 10 faixas etárias da ANS</h2>
            <p className="mt-2 text-gray-600">
              O preço sobe a cada faixa. Estas são as faixas oficiais (Resolução ANS) usadas por todas as
              operadoras:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {FAIXAS_ANS.map((f) => (
                <span key={f} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-900">{f} anos</span>
              ))}
            </div>
          </section>

          {/* MEI / portes */}
          <section className="mt-12 max-w-3xl space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">Empresarial, PME e MEI</h2>
            <p>
              O plano Amil empresarial é vendido por porte: <strong>2 a 29 vidas (PME)</strong>,
              {' '}<strong>30 a 99</strong> e <strong>100+</strong>. Quanto maior o grupo, menor tende a ser
              o preço por vida. O <strong>MEI</strong> (CNPJ ativo há 180+ dias) também contrata na
              modalidade coletiva, mais vantajosa que a pessoa física.
            </p>
          </section>

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Perguntas frequentes sobre preços Amil</h2>
            <dl className="mt-6 space-y-6">
              {FAQS.map((f) => (
                <div key={f.pergunta}>
                  <dt className="font-semibold text-gray-900">{f.pergunta}</dt>
                  <dd className="mt-2 text-gray-700">{f.resposta}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* CTA final */}
          <div className="mt-12 rounded-lg bg-blue-600 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Receba a tabela exata para o seu CNPJ</h2>
            <p className="mt-2 text-blue-100">Cotação personalizada por faixa etária e número de vidas — inclusive MEI.</p>
            <Link href="/cotacao-online" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
              Solicitar cotação →
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Veja também os <Link href="/planos" className="text-blue-600 hover:underline">planos Amil empresariais</Link>{' '}
            e a <Link href="/rede-credenciada" className="text-blue-600 hover:underline">rede credenciada</Link>.
          </p>

          <footer className="mt-10 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Aviso:</strong> {DISCLAIMER_AMIL_REDE} Valores de referência sujeitos a cotação;
            consulte condições atualizadas na proposta.
          </footer>
        </div>
      </section>
    </>
  );
}
