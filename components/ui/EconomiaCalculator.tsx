'use client';

/**
 * Calculadora de economia PJ vs PF (Onda 3 — plano Atlas 2026-06-14).
 *
 * Usa os preços REAIS por faixa etária de `data/tabelas-amil.ts` (plano de
 * entrada do estado) para estimar a mensalidade empresarial e compará-la com
 * o plano individual equivalente. A economia PJ vs PF (~35%) é fator de
 * referência de mercado (ANS/operadora) — resultado é estimativa, sujeita a
 * cotação por CNPJ (feedback_claims_metricas: sem claim oficial).
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  ESTADOS_DISPONIVEIS,
  getPlanosDoEstado,
  FAIXAS_ETARIAS,
  type FaixaEtaria,
} from '@/data/tabelas-amil';

/** PJ é, em média, ~35% mais barato que PF com cobertura equivalente. */
const FATOR_ECONOMIA_PF = 0.35;

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

interface Resultado {
  pjMes: number;
  pfMes: number;
  economiaMes: number;
  economiaAno: number;
  planoNome: string;
}

export function EconomiaCalculator() {
  const [uf, setUf] = useState('SP');
  const [vidas, setVidas] = useState(2);
  const [faixa, setFaixa] = useState<FaixaEtaria>('29 a 33');
  const [resultado, setResultado] = useState<Resultado | null>(null);

  function calcular() {
    const planos = getPlanosDoEstado(uf);
    if (planos.length === 0) {
      setResultado(null);
      return;
    }
    // Plano de entrada = menor preço na faixa selecionada.
    const entrada = planos.reduce((min, p) =>
      p.precos[faixa] < min.precos[faixa] ? p : min,
    );
    const vidasNum = Math.max(1, Math.min(99, vidas || 1));
    const pjMes = entrada.precos[faixa] * vidasNum;
    const pfMes = pjMes / (1 - FATOR_ECONOMIA_PF);
    setResultado({
      pjMes,
      pfMes,
      economiaMes: pfMes - pjMes,
      economiaAno: (pfMes - pjMes) * 12,
      planoNome: entrada.nome,
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="font-semibold text-slate-700">Estado</span>
          <select
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600"
          >
            {ESTADOS_DISPONIVEIS.map((sigla) => (
              <option key={sigla} value={sigla}>{sigla}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-semibold text-slate-700">Nº de vidas</span>
          <input
            type="number"
            min={1}
            max={99}
            value={vidas}
            onChange={(e) => setVidas(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600"
          />
        </label>

        <label className="block text-sm">
          <span className="font-semibold text-slate-700">Faixa etária predominante</span>
          <select
            value={faixa}
            onChange={(e) => setFaixa(e.target.value as FaixaEtaria)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600"
          >
            {FAIXAS_ETARIAS.map((f) => (
              <option key={f} value={f}>{f} anos</option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={calcular}
        className="mt-5 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Calcular minha economia →
      </button>

      {resultado && (
        <div className="mt-6 rounded-xl bg-slate-50 p-5">
          <div className="grid gap-4 text-center sm:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Plano empresarial (PJ)</div>
              <div className="mt-1 text-2xl font-bold text-blue-700">{brl(resultado.pjMes)}<span className="text-sm font-normal text-slate-500">/mês</span></div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Individual (PF) equivalente</div>
              <div className="mt-1 text-2xl font-bold text-slate-400 line-through">{brl(resultado.pfMes)}<span className="text-sm font-normal">/mês</span></div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Economia estimada</div>
              <div className="mt-1 text-2xl font-bold text-emerald-600">{brl(resultado.economiaMes)}<span className="text-sm font-normal">/mês</span></div>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-700">
            Em <strong>{resultado.planoNome}</strong>, sua empresa economiza cerca de{' '}
            <strong className="text-emerald-700">{brl(resultado.economiaAno)} por ano</strong> frente ao plano
            individual — pela tabela coletiva, com a mesma rede Amil.
          </p>
          <div className="mt-5 text-center">
            <Link
              href={`/cotacao-online?uf=${uf}&vidas=${vidas}&origem=calculadora`}
              className="inline-block rounded-lg bg-cta-green px-6 py-3 font-semibold text-white transition hover:bg-cta-green-hover"
            >
              Receber a cotação exata para o meu CNPJ →
            </Link>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        * Estimativa de referência: usa o preço por faixa etária do plano de entrada do estado e um fator
        médio de economia PJ vs PF (~35%, fonte ANS/mercado). O valor final depende do número de vidas,
        da composição de idades e do porte — confirme na cotação por CNPJ.
      </p>
    </div>
  );
}
