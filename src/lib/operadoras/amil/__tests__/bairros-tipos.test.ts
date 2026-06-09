/**
 * Tests — Stories 7.6 (bairros) e 7.8 (tipo × UF × município).
 * Data-driven contra o dataset real.
 */

import { describe, it, expect } from 'vitest';
import {
  getMunicipios,
  getTodosBairrosPorCidade,
  getBairrosViaveisPorCidade,
  getTipoUfMunicipios,
  getPrestadoresPorMunicipio,
} from '@/lib/operadoras/amil/rede-credenciada-loader';
import {
  MIN_PRESTADORES_BAIRRO,
  MIN_PRESTADORES_TIPO,
  TIPO_SLUG_TO_INFERIDO,
} from '@/config/seo';

describe('Story 7.6 — bairros por cidade', () => {
  const cidadeDensa = getMunicipios()[0]; // mais prestadores

  it('getTodosBairrosPorCidade retorna bairros com ≥1 prestador', () => {
    const todos = getTodosBairrosPorCidade(cidadeDensa.ufSlug, cidadeDensa.cidadeSlug);
    expect(todos.length).toBeGreaterThan(0);
    for (const b of todos) expect(b.total).toBeGreaterThanOrEqual(1);
  });

  it('viáveis (≥3) são subconjunto de todos e respeitam o threshold', () => {
    const todos = getTodosBairrosPorCidade(cidadeDensa.ufSlug, cidadeDensa.cidadeSlug);
    const viaveis = getBairrosViaveisPorCidade(cidadeDensa.ufSlug, cidadeDensa.cidadeSlug);
    const slugsTodos = new Set(todos.map((b) => b.slug));
    for (const v of viaveis) {
      expect(v.total).toBeGreaterThanOrEqual(MIN_PRESTADORES_BAIRRO);
      expect(slugsTodos.has(v.slug)).toBe(true);
    }
    expect(viaveis.length).toBeLessThanOrEqual(todos.length);
  });

  it('bairros ordenados por total (desc)', () => {
    const todos = getTodosBairrosPorCidade(cidadeDensa.ufSlug, cidadeDensa.cidadeSlug);
    const totais = todos.map((b) => b.total);
    expect(totais).toEqual([...totais].sort((a, b) => b - a));
  });
});

describe('Story 7.8 — tipo × UF × município', () => {
  it('allowlist tem 8 tipos e não inclui "Outro"', () => {
    const tipos = Object.values(TIPO_SLUG_TO_INFERIDO);
    expect(tipos).toHaveLength(8);
    expect(tipos).not.toContain('Outro');
  });

  it('getTipoUfMunicipios respeita o threshold mínimo', () => {
    const combos = getTipoUfMunicipios('Hospital', MIN_PRESTADORES_TIPO);
    expect(combos.length).toBeGreaterThan(0);
    for (const c of combos) {
      expect(c.total).toBeGreaterThanOrEqual(MIN_PRESTADORES_TIPO);
      expect(c.uf).toBe(c.uf.toUpperCase());
      expect(c.ufSlug).toBe(c.ufSlug.toLowerCase());
    }
  });

  it('total bate com prestadores do tipo no município', () => {
    const combos = getTipoUfMunicipios('Hospital', MIN_PRESTADORES_TIPO);
    const c = combos[0];
    const reais = getPrestadoresPorMunicipio(c.ufSlug, c.cidadeSlug).filter(
      (p) => p.tipoInferido === 'Hospital'
    );
    expect(c.total).toBe(reais.length);
  });

  it('não gera combinações duplicadas', () => {
    const combos = getTipoUfMunicipios('Laboratório', MIN_PRESTADORES_TIPO);
    const chaves = combos.map((c) => `${c.ufSlug}|${c.cidadeSlug}`);
    expect(new Set(chaves).size).toBe(chaves.length);
  });
});
