import type { Metadata } from 'next';
import Link from 'next/link';
import { buildOpenGraphMetadata } from '@/components/seo/OpenGraph';

const SUSEP = '201054484';
const CNPJ = '14.764.085/0001-99';
const ANS_AMIL = '326305';

export const metadata: Metadata = {
  title: 'Sobre a BeneficioRH — Corretora autorizada SUSEP',
  description: `BeneficioRH (CNPJ ${CNPJ}, SUSEP ${SUSEP}): corretora autorizada a intermediar planos da Amil Assistência Médica Internacional S.A. (registro ANS nº ${ANS_AMIL}).`,
  ...buildOpenGraphMetadata({
    title: 'Sobre a BeneficioRH — Corretora autorizada',
    description:
      'Corretora autorizada SUSEP 201054484 especializada em planos de saúde Amil empresariais. Conheça nossa equipe e parceria.',
    type: 'website',
  }),
  alternates: { canonical: '/sobre-nos' },
};

export default function SobreNosPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <span className="inline-flex items-center rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          Sobre nós
        </span>
        <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
          BeneficioRH — Corretora autorizada em planos de saúde Amil
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Corretora especializada em planos empresariais da Amil Assistência Médica Internacional
          S.A.
        </p>
      </header>

      <section className="prose prose-slate max-w-none">
        <h2 className="text-2xl font-semibold text-slate-900">Quem somos</h2>
        <p>
          A <strong>BeneficioRH Corretora de Seguros</strong> (CNPJ {CNPJ}) é uma corretora
          autorizada SUSEP {SUSEP}, liderada por Agnaldo Silva como responsável técnico.
          Trabalhamos com foco exclusivo em planos de saúde empresariais (PJ), atendendo PME,
          Empresas de Adesão e Empresariais com 100+ vidas.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">Parceria com a Amil</h2>
        <p>
          Somos corretores autorizados a intermediar contratação dos planos da{' '}
          <strong>Amil Assistência Médica Internacional S.A.</strong> (registro ANS nº{' '}
          {ANS_AMIL}). Este site é independente e não substitui canais oficiais Amil.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">Compliance</h2>
        <ul>
          <li>CNPJ: {CNPJ}</li>
          <li>SUSEP: {SUSEP}</li>
          <li>Operadora-alvo: Amil — registro ANS nº {ANS_AMIL}</li>
          <li>Adesão a LGPD + ANS RN 195/2009 + 593/2024</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-900">Como podemos ajudar</h2>
        <p>
          Solicite uma cotação personalizada para sua empresa, compare planos lado a lado ou
          calcule sua carência:
        </p>
        <ul>
          <li>
            <Link href="/cotacao-online" className="text-sky-600 hover:underline">
              Cotação online
            </Link>
          </li>
          <li>
            <Link href="/comparar" className="text-sky-600 hover:underline">
              Comparador de planos
            </Link>
          </li>
          <li>
            <Link href="/carencias" className="text-sky-600 hover:underline">
              Calculadora de carências
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
