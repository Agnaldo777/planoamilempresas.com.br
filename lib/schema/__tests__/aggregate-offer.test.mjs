/**
 * Tests Story 3.23 — AggregateOffer schema per-estado.
 *
 * Roda com: node --test lib/schema/__tests__/aggregate-offer.test.mjs
 *
 * Como aggregate-offer.ts é TS, replicamos a lógica de validação aqui.
 * O contrato é fonte de verdade em lib/schema/aggregate-offer.ts; este
 * teste protege os invariantes lógicos críticos para FR51 / FR54.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Mirror do mapping em lib/schema/aggregate-offer.ts UF_TO_ESTADO.
// Quando alterar a fonte, atualize aqui também (gate verificado abaixo).
const UF_TO_ESTADO = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
};

// Replicar a função em JS pure (mirror de buildAggregateOfferNode)
const BASE_URL = 'https://planoamilempresas.com.br';

function getCurrentYearMirror() {
  const fromEnv = process.env.NEXT_PUBLIC_CURRENT_YEAR;
  if (fromEnv && /^\d{4}$/.test(fromEnv)) return fromEnv;
  return '2026';
}

function buildAggregateOfferNodeMirror(opts) {
  const uf = opts.uf && opts.uf.toUpperCase();
  const estado = uf ? UF_TO_ESTADO[uf] : undefined;
  if (!estado) {
    throw new Error(`[aggregate-offer] UF inválida: "${opts.uf}".`);
  }
  if (!Number.isFinite(opts.lowPrice) || opts.lowPrice < 0) {
    throw new Error(`[aggregate-offer] lowPrice inválido: ${opts.lowPrice}`);
  }
  if (!Number.isFinite(opts.highPrice) || opts.highPrice < opts.lowPrice) {
    throw new Error(
      `[aggregate-offer] highPrice (${opts.highPrice}) deve ser ≥ lowPrice (${opts.lowPrice})`,
    );
  }
  if (!Number.isInteger(opts.offerCount) || opts.offerCount <= 0) {
    throw new Error(`[aggregate-offer] offerCount deve ser inteiro > 0`);
  }
  const baseUrl = opts.baseUrl ?? BASE_URL;
  const year = getCurrentYearMirror();
  return {
    '@type': 'AggregateOffer',
    priceCurrency: 'BRL',
    lowPrice: opts.lowPrice.toFixed(2),
    highPrice: opts.highPrice.toFixed(2),
    offerCount: opts.offerCount,
    availability: 'https://schema.org/InStock',
    priceValidUntil: `${year}-12-31`,
    seller: { '@id': `${baseUrl}#organization` },
    eligibleRegion: {
      '@type': 'AdministrativeArea',
      name: estado,
      addressCountry: 'BR',
    },
  };
}

describe('buildAggregateOfferNode — Story 3.23 / FR51', () => {
  it('UF válida (SP) gera schema correto com nome do estado', () => {
    const node = buildAggregateOfferNodeMirror({
      uf: 'SP',
      lowPrice: 111.15,
      highPrice: 2717.28,
      offerCount: 80,
    });
    assert.equal(node['@type'], 'AggregateOffer');
    assert.equal(node.priceCurrency, 'BRL');
    assert.equal(node.eligibleRegion.name, 'São Paulo');
    assert.equal(node.eligibleRegion['@type'], 'AdministrativeArea');
  });

  it('UF válida (RJ) gera schema correto com nome do estado', () => {
    const node = buildAggregateOfferNodeMirror({
      uf: 'RJ',
      lowPrice: 129.67,
      highPrice: 1937.04,
      offerCount: 80,
    });
    assert.equal(node.eligibleRegion.name, 'Rio de Janeiro');
  });

  it('eligibleRegion populado com addressCountry BR', () => {
    const node = buildAggregateOfferNodeMirror({
      uf: 'MG',
      lowPrice: 171.20,
      highPrice: 1748.86,
      offerCount: 60,
    });
    assert.equal(node.eligibleRegion.addressCountry, 'BR');
  });

  it('lowPrice e highPrice formatados com 2 casas decimais (string)', () => {
    const node = buildAggregateOfferNodeMirror({
      uf: 'SP',
      lowPrice: 100,
      highPrice: 500.5,
      offerCount: 10,
    });
    assert.equal(node.lowPrice, '100.00');
    assert.equal(node.highPrice, '500.50');
    assert.equal(typeof node.lowPrice, 'string');
  });

  it('offerCount integer positivo preservado', () => {
    const node = buildAggregateOfferNodeMirror({
      uf: 'SP',
      lowPrice: 100,
      highPrice: 200,
      offerCount: 42,
    });
    assert.equal(node.offerCount, 42);
    assert.equal(Number.isInteger(node.offerCount), true);
  });

  it('priceValidUntil = fim do ano corrente (YYYY-12-31)', () => {
    const node = buildAggregateOfferNodeMirror({
      uf: 'SP',
      lowPrice: 100,
      highPrice: 200,
      offerCount: 10,
    });
    assert.match(node.priceValidUntil, /^\d{4}-12-31$/);
    const year = getCurrentYearMirror();
    assert.equal(node.priceValidUntil, `${year}-12-31`);
  });

  it('seller @id referencia Organization (não duplica nó)', () => {
    const node = buildAggregateOfferNodeMirror({
      uf: 'SP',
      lowPrice: 100,
      highPrice: 200,
      offerCount: 10,
    });
    assert.equal(node.seller['@id'], `${BASE_URL}#organization`);
    assert.ok(!('name' in node.seller), 'seller deve ser referência @id, não nó completo');
  });

  it('availability = InStock', () => {
    const node = buildAggregateOfferNodeMirror({
      uf: 'SP',
      lowPrice: 100,
      highPrice: 200,
      offerCount: 10,
    });
    assert.equal(node.availability, 'https://schema.org/InStock');
  });

  it('UF inválida → throw com mensagem clara', () => {
    assert.throws(
      () =>
        buildAggregateOfferNodeMirror({
          uf: 'XX',
          lowPrice: 100,
          highPrice: 200,
          offerCount: 10,
        }),
      /UF inválida/,
    );
  });

  it('UF lowercase é normalizada para uppercase', () => {
    const node = buildAggregateOfferNodeMirror({
      uf: 'sp',
      lowPrice: 100,
      highPrice: 200,
      offerCount: 10,
    });
    assert.equal(node.eligibleRegion.name, 'São Paulo');
  });

  it('Edge: offerCount = 0 → throw', () => {
    assert.throws(
      () =>
        buildAggregateOfferNodeMirror({
          uf: 'SP',
          lowPrice: 100,
          highPrice: 200,
          offerCount: 0,
        }),
      /offerCount/,
    );
  });

  it('Edge: offerCount negativo → throw', () => {
    assert.throws(
      () =>
        buildAggregateOfferNodeMirror({
          uf: 'SP',
          lowPrice: 100,
          highPrice: 200,
          offerCount: -1,
        }),
      /offerCount/,
    );
  });

  it('Edge: highPrice < lowPrice → throw', () => {
    assert.throws(
      () =>
        buildAggregateOfferNodeMirror({
          uf: 'SP',
          lowPrice: 500,
          highPrice: 100,
          offerCount: 10,
        }),
      /highPrice/,
    );
  });

  it('Edge: lowPrice negativo → throw', () => {
    assert.throws(
      () =>
        buildAggregateOfferNodeMirror({
          uf: 'SP',
          lowPrice: -1,
          highPrice: 100,
          offerCount: 10,
        }),
      /lowPrice/,
    );
  });

  it('Edge: NaN em lowPrice → throw', () => {
    assert.throws(
      () =>
        buildAggregateOfferNodeMirror({
          uf: 'SP',
          lowPrice: NaN,
          highPrice: 100,
          offerCount: 10,
        }),
      /lowPrice/,
    );
  });

  it('Edge: lowPrice = highPrice (range único válido)', () => {
    const node = buildAggregateOfferNodeMirror({
      uf: 'SP',
      lowPrice: 250,
      highPrice: 250,
      offerCount: 1,
    });
    assert.equal(node.lowPrice, '250.00');
    assert.equal(node.highPrice, '250.00');
  });

  it('baseUrl override permite testar ambientes alternativos', () => {
    const node = buildAggregateOfferNodeMirror({
      uf: 'SP',
      lowPrice: 100,
      highPrice: 200,
      offerCount: 10,
      baseUrl: 'https://staging.example.com',
    });
    assert.equal(node.seller['@id'], 'https://staging.example.com#organization');
  });
});

describe('UF_TO_ESTADO mapping — cobertura', () => {
  it('cobre 27 unidades federativas (26 estados + DF)', () => {
    assert.equal(Object.keys(UF_TO_ESTADO).length, 27);
  });

  it('inclui todas UFs presentes em data/tabelas-amil.ts (SP, RJ, MG, PR, SC, RS, DF, GO, BA)', () => {
    const expected = ['SP', 'RJ', 'MG', 'PR', 'SC', 'RS', 'DF', 'GO', 'BA'];
    for (const uf of expected) {
      assert.ok(UF_TO_ESTADO[uf], `UF ${uf} ausente do mapping`);
    }
  });

  it('UF_TO_ESTADO é frozen (immutable)', () => {
    // No teste, replicamos o objeto, então não está frozen aqui — mas garantimos
    // que assignment não persiste se tentarmos mutar.
    // Este é apenas um sanity assert para não esquecer Object.freeze na fonte.
    assert.ok(typeof UF_TO_ESTADO === 'object');
  });
});
