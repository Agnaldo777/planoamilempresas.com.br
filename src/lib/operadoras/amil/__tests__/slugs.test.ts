/**
 * Tests Story 7.1 AC2-bis (amendment O-1) — slugs.ts canônicos ADR-006.
 *
 * Cobertura:
 * - REDE_SLUGS tem exatamente 11 entradas (compilação garante via Record<RedeAmilNome, string>;
 *   este test valida runtime via Object.keys.length)
 * - Round-trip rede → slug → rede (redeSlug + redeFromSlug)
 * - redeFromSlug retorna null em slug inválido
 * - validateRedeSlugsCoverage detecta drift
 * - Snapshot cross-file: slugs literalmente alinhados com ADR-006 §"Slug rules"
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  REDE_SLUGS,
  SLUG_TO_REDE,
  redeFromSlug,
  redeSlug,
  validateRedeSlugsCoverage,
} from '@/lib/operadoras/amil/slugs';
import { REDES_AMIL_ATIVAS, type RedeAmilNome } from '@/types/rede-credenciada-amil';

describe('REDE_SLUGS', () => {
  it('tem exatamente 11 entradas (cobertura das redes ativas)', () => {
    expect(Object.keys(REDE_SLUGS)).toHaveLength(11);
  });

  it('cobre todas as 11 redes de REDES_AMIL_ATIVAS', () => {
    for (const rede of REDES_AMIL_ATIVAS) {
      expect(REDE_SLUGS[rede]).toBeDefined();
      expect(REDE_SLUGS[rede]).not.toBe('');
    }
  });

  it('todos os slugs são URL-safe (lowercase + a-z0-9-)', () => {
    for (const slug of Object.values(REDE_SLUGS)) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(slug).not.toMatch(/--/);
      expect(slug).not.toMatch(/^-|-$/);
    }
  });

  it('alinhamento literal com ADR-006 §"Slug rules" (snapshot cross-file)', () => {
    const adrPath = resolve(__dirname, '../../../../../docs/decisions/adr-006-url-as-trademark-policy.md');
    const adrContent = readFileSync(adrPath, 'utf-8');

    const expectedPairs: Array<[RedeAmilNome, string]> = [
      ['AMIL ONE S6500 BLACK QP', 'amil-one-s6500-black-qp'],
      ['AMIL S750 QP', 'amil-s750-qp'],
      ['AMIL S580 QP', 'amil-s580-qp'],
      ['AMIL S450 QP', 'amil-s450-qp'],
      ['AMIL S450 QC', 'amil-s450-qc'],
      ['AMIL S380 QP', 'amil-s380-qp'],
      ['AMIL S380 QC', 'amil-s380-qc'],
      ['BLACK', 'black'],
      ['ADESÃO OURO MAIS', 'adesao-ouro-mais'],
      ['ADESÃO BRONZE RJ', 'adesao-bronze-rj'],
      ['ADESÃO BRONZE SP', 'adesao-bronze-sp'],
    ];

    for (const [rede, slug] of expectedPairs) {
      expect(REDE_SLUGS[rede]).toBe(slug);
      expect(adrContent).toContain(slug);
    }
  });
});

describe('SLUG_TO_REDE (mapping inverso)', () => {
  it('é frozen (imutável)', () => {
    expect(Object.isFrozen(SLUG_TO_REDE)).toBe(true);
  });

  it('cobre todos os 11 slugs', () => {
    expect(Object.keys(SLUG_TO_REDE)).toHaveLength(11);
  });

  it('é coerente com REDE_SLUGS (round-trip)', () => {
    for (const [rede, slug] of Object.entries(REDE_SLUGS) as [RedeAmilNome, string][]) {
      expect(SLUG_TO_REDE[slug]).toBe(rede);
    }
  });
});

describe('redeSlug()', () => {
  it('retorna slug canônico para cada rede ativa', () => {
    expect(redeSlug('AMIL S750 QP')).toBe('amil-s750-qp');
    expect(redeSlug('BLACK')).toBe('black');
    expect(redeSlug('ADESÃO OURO MAIS')).toBe('adesao-ouro-mais');
  });

  it('é determinístico (mesmo input → mesmo output)', () => {
    const slug1 = redeSlug('AMIL ONE S6500 BLACK QP');
    const slug2 = redeSlug('AMIL ONE S6500 BLACK QP');
    expect(slug1).toBe(slug2);
    expect(slug1).toBe('amil-one-s6500-black-qp');
  });
});

describe('redeFromSlug()', () => {
  it('resolve slug válido para rede canônica', () => {
    expect(redeFromSlug('amil-s750-qp')).toBe('AMIL S750 QP');
    expect(redeFromSlug('black')).toBe('BLACK');
    expect(redeFromSlug('adesao-bronze-sp')).toBe('ADESÃO BRONZE SP');
  });

  it('retorna null para slug inválido (Story 7.7 notFound trigger)', () => {
    expect(redeFromSlug('inexistente')).toBeNull();
    expect(redeFromSlug('')).toBeNull();
    expect(redeFromSlug('AMIL-S750-QP')).toBeNull(); // case-sensitive
    expect(redeFromSlug('amil_s750_qp')).toBeNull(); // underscore não aceito
  });

  it('round-trip rede → slug → rede preserva valor', () => {
    for (const rede of REDES_AMIL_ATIVAS) {
      const slug = redeSlug(rede);
      expect(redeFromSlug(slug)).toBe(rede);
    }
  });
});

describe('validateRedeSlugsCoverage()', () => {
  it('reporta ok=true quando REDE_SLUGS cobre exatamente REDES_AMIL_ATIVAS', () => {
    const result = validateRedeSlugsCoverage();
    expect(result.ok).toBe(true);
    expect(result.faltando).toEqual([]);
    expect(result.extras).toEqual([]);
  });
});
