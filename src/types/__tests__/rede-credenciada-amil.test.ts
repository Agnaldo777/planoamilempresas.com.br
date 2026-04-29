/**
 * Tests Story 7.1 AC1 — type guards runtime de rede-credenciada-amil.
 *
 * Cobertura:
 * - isDatasetRedeAmil aceita dataset bem-formado
 * - isDatasetRedeAmil rejeita objetos malformados (sem campos, com tipo errado)
 * - isPrestadorAmilRaw aceita prestador completo
 * - isPrestadorAmilRaw rejeita prestador com campo faltante
 * - REDES_AMIL_ATIVAS tem 11 entradas alinhadas com type RedeAmilNome
 */

import { describe, expect, it } from 'vitest';

import {
  REDES_AMIL_ATIVAS,
  isDatasetRedeAmil,
  isPrestadorAmilRaw,
} from '@/types/rede-credenciada-amil';

const validPrestador = {
  codigo: '10000020',
  nome: 'INSTITUTO DE OLHOS DE TAGUATINGA',
  uf: 'DF',
  municipio: 'BRASILIA',
  bairro: 'TAGUATINGA NORTE',
  redes: ['AMIL S750 QP', 'BLACK'],
};

const validDataset = {
  geradoEm: '2026-04-26T02:21:13.770Z',
  fonte: 'powerbi-amil-public',
  totalRedes: 49,
  totalPrestadores: 1,
  redes: ['AMIL S750 QP'],
  prestadores: [validPrestador],
};

describe('isPrestadorAmilRaw()', () => {
  it('aceita prestador bem-formado', () => {
    expect(isPrestadorAmilRaw(validPrestador)).toBe(true);
  });

  it('aceita prestador sem bairro (string vazia)', () => {
    expect(isPrestadorAmilRaw({ ...validPrestador, bairro: '' })).toBe(true);
  });

  it('rejeita null e undefined', () => {
    expect(isPrestadorAmilRaw(null)).toBe(false);
    expect(isPrestadorAmilRaw(undefined)).toBe(false);
  });

  it('rejeita objeto com campo faltante', () => {
    const { codigo: _codigo, ...semCodigo } = validPrestador;
    expect(isPrestadorAmilRaw(semCodigo)).toBe(false);

    const { redes: _redes, ...semRedes } = validPrestador;
    expect(isPrestadorAmilRaw(semRedes)).toBe(false);
  });

  it('rejeita campo com tipo errado', () => {
    expect(isPrestadorAmilRaw({ ...validPrestador, codigo: 123 })).toBe(false);
    expect(isPrestadorAmilRaw({ ...validPrestador, redes: 'not-array' })).toBe(false);
    expect(isPrestadorAmilRaw({ ...validPrestador, redes: [123, 456] })).toBe(false);
  });

  it('rejeita primitivos', () => {
    expect(isPrestadorAmilRaw('string')).toBe(false);
    expect(isPrestadorAmilRaw(42)).toBe(false);
    expect(isPrestadorAmilRaw(true)).toBe(false);
  });
});

describe('isDatasetRedeAmil()', () => {
  it('aceita dataset bem-formado', () => {
    expect(isDatasetRedeAmil(validDataset)).toBe(true);
  });

  it('rejeita null e undefined', () => {
    expect(isDatasetRedeAmil(null)).toBe(false);
    expect(isDatasetRedeAmil(undefined)).toBe(false);
  });

  it('rejeita objeto sem geradoEm', () => {
    const { geradoEm: _geradoEm, ...semGeradoEm } = validDataset;
    expect(isDatasetRedeAmil(semGeradoEm)).toBe(false);
  });

  it('rejeita objeto com totalPrestadores não-number', () => {
    expect(isDatasetRedeAmil({ ...validDataset, totalPrestadores: 'mil' })).toBe(false);
  });

  it('rejeita objeto com prestadores não-array', () => {
    expect(isDatasetRedeAmil({ ...validDataset, prestadores: 'not-array' })).toBe(false);
  });

  it('rejeita dataset com prestador malformado dentro', () => {
    expect(
      isDatasetRedeAmil({
        ...validDataset,
        prestadores: [validPrestador, { incompleto: true }],
      })
    ).toBe(false);
  });

  it('rejeita redes[] com elementos não-string', () => {
    expect(isDatasetRedeAmil({ ...validDataset, redes: [1, 2, 3] })).toBe(false);
  });
});

describe('REDES_AMIL_ATIVAS', () => {
  it('tem exatamente 11 entradas', () => {
    expect(REDES_AMIL_ATIVAS).toHaveLength(11);
  });

  it('todas as entradas são strings não-vazias', () => {
    for (const rede of REDES_AMIL_ATIVAS) {
      expect(typeof rede).toBe('string');
      expect(rede.length).toBeGreaterThan(0);
    }
  });

  it('inclui as 4 redes "AMIL S*" + "BLACK"', () => {
    expect(REDES_AMIL_ATIVAS).toContain('AMIL S750 QP');
    expect(REDES_AMIL_ATIVAS).toContain('AMIL S380 QC');
    expect(REDES_AMIL_ATIVAS).toContain('BLACK');
  });

  it('inclui as 3 redes "ADESÃO *"', () => {
    expect(REDES_AMIL_ATIVAS).toContain('ADESÃO OURO MAIS');
    expect(REDES_AMIL_ATIVAS).toContain('ADESÃO BRONZE RJ');
    expect(REDES_AMIL_ATIVAS).toContain('ADESÃO BRONZE SP');
  });
});
