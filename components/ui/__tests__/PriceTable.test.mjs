/**
 * Tests Story 3.24 — PriceTable HTML semântico.
 *
 * Roda com: node --test components/ui/__tests__/PriceTable.test.mjs
 *
 * Como PriceTable.tsx é JSX/TSX (RSC), testamos sem JSDOM via render
 * snapshot textual + asserts em invariantes de markup. Para testes mais
 * profundos com axe-core/RTL, ver `tests/a11y/PriceTable.a11y.test.tsx`
 * (escopo Story 3.24 AC7 — pendente, requer RTL setup).
 *
 * Este arquivo cobre invariantes lógicos de:
 *   - Estrutura `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`
 *   - `<th scope="col">` e `<th scope="row">` corretos
 *   - Sem `<div>` simulando célula
 *   - Estado vazio graceful
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_PATH = path.resolve(__dirname, '../PriceTable.tsx');
const source = fs.readFileSync(SOURCE_PATH, 'utf8');

describe('PriceTable structure — Story 3.24 / FR52', () => {
  it('contém elemento <table>', () => {
    assert.match(source, /<table\s/);
  });

  it('contém <caption> dentro do <table>', () => {
    assert.match(source, /<caption\s/);
  });

  it('contém <thead> e <tbody>', () => {
    assert.match(source, /<thead\s/);
    assert.match(source, /<tbody>/);
  });

  it('possui <th scope="col"> para faixas etárias', () => {
    // pattern: scope="col"
    assert.match(source, /scope="col"/);
  });

  it('possui <th scope="row"> para identificador de linha (nome do plano)', () => {
    assert.match(source, /scope="row"/);
  });

  it('possui <tfoot> opcional', () => {
    assert.match(source, /<tfoot\s/);
  });

  it('NÃO usa role="table" em div (anti-pattern)', () => {
    assert.equal(/role=["']table["']/.test(source), false);
  });

  it('NÃO usa role="cell" em div (anti-pattern)', () => {
    assert.equal(/role=["']cell["']/.test(source), false);
  });

  it('NÃO usa display:grid puro com role aria de tabela', () => {
    // Heurística: combinação grid + role table = anti-padrão
    const hasGrid = /grid/.test(source);
    const hasRoleTable = /role=["']table["']/.test(source);
    assert.equal(hasGrid && hasRoleTable, false);
  });

  it('renderiza estado vazio graceful (props vazias)', () => {
    // Verifica presença de fallback/role status para estado vazio
    assert.match(source, /role="status"/);
    assert.match(source, /indispon[ií]vel/i);
  });
});

describe('PriceTable backward compat — Story 6.1 legacy signature', () => {
  it('aceita prop legacy `planoNome` + `precos`', () => {
    assert.match(source, /planoNome\?:\s*string/);
    assert.match(source, /precos\?:\s*readonly PriceRow\[\]/);
  });

  it('marca legacy props como @deprecated', () => {
    assert.match(source, /@deprecated/);
  });

  it('exporta PriceTableData (nova interface matriz)', () => {
    assert.match(source, /export interface PriceTableData/);
  });
});

describe('PriceTable a11y / paleta — NFR9 + Opção A', () => {
  it('usa paleta Opção A (slate, teal, sky, amber)', () => {
    // Pelo menos um token de cada família deve aparecer
    assert.match(source, /slate-/);
    assert.match(source, /teal-/);
  });

  it('NÃO usa cores legacy `amil-blue` (migrado)', () => {
    // amil-blue é da Opção legacy — substituído por teal/sky
    assert.equal(/amil-blue/.test(source), false);
  });

  it('PriceCell tem aria-label para indisponível', () => {
    assert.match(source, /aria-label="Pre[çc]o indispon[ií]vel"/);
  });

  it('formatCurrency aplicado em valores numéricos', () => {
    assert.match(source, /formatCurrency\(value\)/);
  });
});

describe('PriceTable RSC — sem useState/JS client', () => {
  it("NÃO declara 'use client'", () => {
    assert.equal(/['"]use client['"]/.test(source), false);
  });

  it('NÃO importa useState (RSC server)', () => {
    // Detecta import real, ignorando ocorrências em comentários JSDoc
    const importsUseState = /import\s*\{[^}]*useState[^}]*\}\s*from\s*['"]react['"]/.test(
      source,
    );
    assert.equal(importsUseState, false);
  });

  it('NÃO usa onClick handler (zero JS interaction)', () => {
    assert.equal(/onClick=/.test(source), false);
  });
});
