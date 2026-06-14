import Link from 'next/link';
import { BROKER_INFO, whatsappLink } from '@/content/corretor';

/**
 * Bloco "Seu corretor Amil em [cidade]" — E-E-A-T + NAP + prova social + CTA.
 *
 * Reaproveita o ângulo de corretor local do satélite Bradesco, mas injetado
 * em páginas que JÁ têm dado real (rede/cidade/prestador) — sem criar URL nova
 * (zero canibalização). Server component.
 */
export function CorretorLocalCard({
  cidade,
  uf,
  contextoWhats,
}: {
  cidade: string;
  uf: string;
  /** Sufixo para a mensagem de WhatsApp, ex: " em São Paulo/SP". */
  contextoWhats?: string;
}) {
  const ctx = contextoWhats ?? ` em ${cidade}/${uf}`;
  return (
    <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="text-xl font-bold text-slate-900">
        Seu corretor Amil em {cidade}
      </h2>
      <p className="mt-2 text-sm text-slate-700">
        Atendimento por corretora autorizada, <strong>sem custo para a empresa</strong> — a
        remuneração vem da operadora. Cuidamos da cotação, da comparação de linhas e da
        contratação do plano Amil empresarial para CNPJ em {cidade} e região.
      </p>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-slate-900">Corretora</dt>
          <dd className="text-slate-700">{BROKER_INFO.razaoSocial}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Registro SUSEP</dt>
          <dd className="text-slate-700">{BROKER_INFO.susep} · CNPJ {BROKER_INFO.cnpj}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Tempo de resposta</dt>
          <dd className="text-slate-700">proposta em até {BROKER_INFO.respostaHoras} horas úteis</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Reputação Amil</dt>
          <dd className="text-slate-700">Reclame Aqui nota {BROKER_INFO.reclameAquiNota} (BOA)</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={whatsappLink(ctx)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-whatsapp px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Falar no WhatsApp ({BROKER_INFO.whatsappDisplay})
        </a>
        <Link
          href={`/cotacao-online?uf=${uf.toLowerCase()}&cidade=${encodeURIComponent(cidade)}`}
          className="inline-block rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          Cotação por CNPJ →
        </Link>
      </div>
    </section>
  );
}
