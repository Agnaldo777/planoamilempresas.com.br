/**
 * Tests — Story 7.7 (Cluster E rede × UF).
 * Data-driven contra o dataset real (sem fixtures frágeis hardcoded).
 */

import { describe, it, expect } from 'vitest';
import {
  getRedeUfCombosViaveis,
  getEstatisticasRedeUF,
  getPrestadoresPorRedeUF,
} from '@/lib/operadoras/amil/rede-credenciada-loader';
import { redeFromSlug } from '@/lib/operadoras/amil/slugs';
import { isUfValida } from '@/lib/uf';
import { buildClusterEFaqs } from '@/content/cluster-e-faq';
import { MIN_PRESTADORES_REDE_UF } from '@/config/seo';

describe('getRedeUfCombosViaveis', () => {
  const combos = getRedeUfCombosViaveis(MIN_PRESTADORES_REDE_UF);

  it('gera ao menos uma combinação viável', () => {
    expect(combos.length).toBeGreaterThan(0);
  });

  it('todo redeSlug resolve para uma rede ativa', () => {
    for (const { redeSlug } of combos) {
      expect(redeFromSlug(redeSlug)).not.toBeNull();
    }
  });

  it('toda UF é válida e lowercase', () => {
    for (const { uf } of combos) {
      expect(isUfValida(uf)).toBe(true);
      expect(uf).toBe(uf.toLowerCase());
    }
  });

  it('toda combinação respeita o threshold mínimo', () => {
    for (const { redeSlug, uf } of combos) {
      const rede = redeFromSlug(redeSlug)!;
      const n = getPrestadoresPorRedeUF(rede, uf).length;
      expect(n).toBeGreaterThanOrEqual(MIN_PRESTADORES_REDE_UF);
    }
  });

  it('não tem combinações duplicadas', () => {
    const chaves = combos.map((c) => `${c.redeSlug}/${c.uf}`);
    expect(new Set(chaves).size).toBe(chaves.length);
  });
});

describe('getEstatisticasRedeUF', () => {
  const combos = getRedeUfCombosViaveis(MIN_PRESTADORES_REDE_UF);
  const { redeSlug, uf } = combos[0];
  const rede = redeFromSlug(redeSlug)!;
  const stats = getEstatisticasRedeUF(rede, uf);

  it('total bate com o nº de prestadores filtrados', () => {
    expect(stats.totalPrestadores).toBe(getPrestadoresPorRedeUF(rede, uf).length);
  });

  it('soma de porTipo == total', () => {
    const soma = Object.values(stats.porTipo).reduce((a, b) => a + b, 0);
    expect(soma).toBe(stats.totalPrestadores);
  });

  it('topCidades ordenadas por total (desc)', () => {
    const totais = stats.topCidades.map((c) => c.total);
    const ordenado = [...totais].sort((a, b) => b - a);
    expect(totais).toEqual(ordenado);
  });

  it('soma das topCidades == total', () => {
    const soma = stats.topCidades.reduce((a, c) => a + c.total, 0);
    expect(soma).toBe(stats.totalPrestadores);
  });
});

describe('getPrestadoresPorRedeUF', () => {
  it('só retorna prestadores da UF pedida', () => {
    const combos = getRedeUfCombosViaveis(MIN_PRESTADORES_REDE_UF);
    const { redeSlug, uf } = combos[0];
    const rede = redeFromSlug(redeSlug)!;
    const prestadores = getPrestadoresPorRedeUF(rede, uf);
    for (const p of prestadores) {
      expect(p.uf.toLowerCase()).toBe(uf);
      expect(p.redes).toContain(rede);
    }
  });
});

describe('buildClusterEFaqs', () => {
  const faqs = buildClusterEFaqs('Amil S750 QP', 'São Paulo', 42, ['São Paulo', 'Campinas']);

  it('gera exatamente 5 FAQs', () => {
    expect(faqs).toHaveLength(5);
  });

  it('interpola a rede em todas as perguntas e tem respostas substanciais', () => {
    for (const f of faqs) {
      expect(f.pergunta).toContain('Amil S750 QP');
      expect(f.resposta.length).toBeGreaterThan(20);
    }
  });

  it('interpola a UF na maioria das perguntas (≥4 de 5)', () => {
    const comUf = faqs.filter((f) => f.pergunta.includes('São Paulo')).length;
    expect(comUf).toBeGreaterThanOrEqual(4);
  });
});
