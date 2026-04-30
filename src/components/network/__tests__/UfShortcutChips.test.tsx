/**
 * Tests Story 7.2 AC4 — UfShortcutChips.
 *
 * Coverage:
 * - Top N UFs por densidade desc
 * - Chip overflow "+N" para UFs além do top N
 * - Format pt-BR (3.696 com ponto separador)
 * - Edge cases (porUF vazio, exatamente topN UFs)
 * - a11y (nav aria-label, ul lista semântica)
 */

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { UfShortcutChips } from '@/components/network/UfShortcutChips';

const fixturePorUF = {
  RJ: 3696,
  SP: 2996,
  DF: 447,
  PR: 394,
  MG: 350,
  RS: 280,
  BA: 250,
  PE: 200,
  CE: 180,
  GO: 150,
};

describe('UfShortcutChips top-N rendering', () => {
  it('default topN=5 mostra exatamente 5 UFs principais', () => {
    const html = renderToStaticMarkup(<UfShortcutChips porUF={fixturePorUF} />);
    expect(html).toContain('RJ');
    expect(html).toContain('SP');
    expect(html).toContain('DF');
    expect(html).toContain('PR');
    expect(html).toContain('MG');
    expect(html).not.toContain('>RS<');
    expect(html).not.toContain('>BA<');
  });

  it('ordena UFs desc por contagem', () => {
    const html = renderToStaticMarkup(<UfShortcutChips porUF={fixturePorUF} />);
    const rjPos = html.indexOf('RJ');
    const spPos = html.indexOf('SP');
    const dfPos = html.indexOf('DF');
    expect(rjPos).toBeGreaterThan(0);
    expect(spPos).toBeGreaterThan(rjPos);
    expect(dfPos).toBeGreaterThan(spPos);
  });

  it('topN=3 mostra apenas 3 UFs', () => {
    const html = renderToStaticMarkup(<UfShortcutChips porUF={fixturePorUF} topN={3} />);
    expect(html).toContain('RJ');
    expect(html).toContain('SP');
    expect(html).toContain('DF');
  });

  it('topN maior que total mostra todas as UFs (sem overflow chip)', () => {
    const html = renderToStaticMarkup(<UfShortcutChips porUF={fixturePorUF} topN={20} />);
    expect(html).toContain('GO');
    expect(html).not.toMatch(/\+\d+ UFs/);
  });
});

describe('UfShortcutChips overflow "+N"', () => {
  it('com 10 UFs e topN=5 mostra "+5 UFs"', () => {
    const html = renderToStaticMarkup(<UfShortcutChips porUF={fixturePorUF} />);
    expect(html).toContain('+5 UFs');
  });

  it('com exatamente 5 UFs (topN default) NÃO mostra overflow', () => {
    const onlyFive = { RJ: 3696, SP: 2996, DF: 447, PR: 394, MG: 350 };
    const html = renderToStaticMarkup(<UfShortcutChips porUF={onlyFive} />);
    expect(html).not.toContain('+0 UFs');
    expect(html).not.toMatch(/\+\d+ UFs/);
  });
});

describe('UfShortcutChips formatação pt-BR', () => {
  it('formata 3696 como "3.696" (separador de milhar)', () => {
    const html = renderToStaticMarkup(<UfShortcutChips porUF={fixturePorUF} />);
    expect(html).toContain('3.696');
  });

  it('formata 447 sem separador (< 1000)', () => {
    const html = renderToStaticMarkup(<UfShortcutChips porUF={fixturePorUF} />);
    expect(html).toContain('447');
    expect(html).not.toContain('0.447');
  });
});

describe('UfShortcutChips a11y', () => {
  it('renderiza <nav aria-label> descritivo', () => {
    const html = renderToStaticMarkup(<UfShortcutChips porUF={fixturePorUF} />);
    expect(html).toMatch(/<nav[^>]*aria-label="[^"]+"/);
  });

  it('usa <ul><li> para semantica de lista', () => {
    const html = renderToStaticMarkup(<UfShortcutChips porUF={fixturePorUF} />);
    expect(html).toMatch(/<ul[\s>]/);
    expect(html).toMatch(/<li[\s>]/);
  });

  it('chip overflow tem aria-label expandido', () => {
    const html = renderToStaticMarkup(<UfShortcutChips porUF={fixturePorUF} />);
    expect(html).toContain('aria-label="Mais 5 UFs disponíveis"');
  });
});

describe('UfShortcutChips edge cases', () => {
  it('porUF vazio NÃO quebra (mostra <ul> vazio)', () => {
    const html = renderToStaticMarkup(<UfShortcutChips porUF={{}} />);
    expect(html).toContain('<ul');
    expect(html).not.toContain('+0 UFs');
  });

  it('1 UF apenas (sem overflow)', () => {
    const html = renderToStaticMarkup(
      <UfShortcutChips porUF={{ SP: 100 }} />
    );
    expect(html).toContain('SP');
    expect(html).not.toMatch(/\+\d+/);
  });
});
