/**
 * Tests Story 7.2 AC2/AC3 — NetworkResultCard primitive de display.
 *
 * Coverage:
 * - Render shape (header + tipo badge + redes chips)
 * - Bairro opcional (alguns prestadores podem ter bairro vazio)
 * - maxRedeChips truncation + "+N" indicator
 * - showDetailLink condicional
 * - SEM endereço/telefone/especialidade (gap dataset enforced)
 * - Dataset attribute para CSS hooks (data-prestador-codigo, data-prestador-tipo)
 */

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { NetworkResultCard } from '@/components/network/NetworkResultCard';
import type { PrestadorAmil } from '@/types/rede-credenciada-amil';

const fixturePrestador: PrestadorAmil = {
  codigo: '10000020',
  nome: 'INSTITUTO DE OLHOS DE TAGUATINGA',
  uf: 'DF',
  municipio: 'BRASILIA',
  bairro: 'TAGUATINGA NORTE',
  redes: [
    'AMIL ONE S6500 BLACK QP',
    'AMIL S750 QP',
    'BLACK',
    'AMIL S580 QP',
    'AMIL S450 QP',
  ],
  tipoInferido: 'Centro/Instituto',
  slug: '10000020-instituto-de-olhos-de-taguatinga-taguatinga-norte',
};

const prestadorSemBairro: PrestadorAmil = {
  ...fixturePrestador,
  bairro: '',
  codigo: '99999999',
};

describe('NetworkResultCard render', () => {
  it('renderiza nome do prestador como H3', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={fixturePrestador} />);
    expect(html).toContain('<h3');
    expect(html).toContain('INSTITUTO DE OLHOS DE TAGUATINGA');
  });

  it('renderiza bairro + município + UF na linha de localização', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={fixturePrestador} />);
    expect(html).toContain('TAGUATINGA NORTE');
    expect(html).toContain('BRASILIA');
    expect(html).toContain('DF');
  });

  it('renderiza tipo inferido como badge', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={fixturePrestador} />);
    expect(html).toContain('Centro/Instituto');
  });

  it('omit bairro quando string vazia (gap dataset)', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={prestadorSemBairro} />);
    expect(html).toContain('BRASILIA');
    expect(html).toContain('DF');
    expect(html).not.toContain('TAGUATINGA NORTE');
  });

  it('renderiza data attributes para CSS/JS hooks', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={fixturePrestador} />);
    expect(html).toContain('data-prestador-codigo="10000020"');
    expect(html).toContain('data-prestador-tipo="Centro/Instituto"');
  });
});

describe('NetworkResultCard redes chips truncation', () => {
  it('default mostra 3 chips de redes', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={fixturePrestador} />);
    expect(html).toContain('AMIL ONE S6500 BLACK QP');
    expect(html).toContain('AMIL S750 QP');
    expect(html).toContain('BLACK');
  });

  it('default mostra "+2" para 5 redes (5-3=2 hidden)', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={fixturePrestador} />);
    expect(html).toContain('+2');
  });

  it('maxRedeChips=5 mostra todas + sem "+N"', () => {
    const html = renderToStaticMarkup(
      <NetworkResultCard prestador={fixturePrestador} maxRedeChips={5} />
    );
    expect(html).toContain('AMIL S450 QP');
    expect(html).not.toMatch(/\+\d+/);
  });

  it('maxRedeChips=10 (mais que prestador tem) NÃO renderiza "+N"', () => {
    const html = renderToStaticMarkup(
      <NetworkResultCard prestador={fixturePrestador} maxRedeChips={10} />
    );
    expect(html).not.toMatch(/\+\d+/);
  });

  it('prestador SEM redes não renderiza chips section', () => {
    const semRedes: PrestadorAmil = { ...fixturePrestador, redes: [] };
    const html = renderToStaticMarkup(<NetworkResultCard prestador={semRedes} />);
    expect(html).not.toContain('Aceita as redes');
  });
});

describe('NetworkResultCard showDetailLink', () => {
  it('default false não renderiza link', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={fixturePrestador} />);
    expect(html).not.toContain('Ver detalhes');
  });

  it('true renderiza "Ver detalhes →"', () => {
    const html = renderToStaticMarkup(
      <NetworkResultCard prestador={fixturePrestador} showDetailLink />
    );
    expect(html).toContain('Ver detalhes');
  });
});

describe('NetworkResultCard a11y + gaps dataset enforced', () => {
  it('NÃO renderiza endereço/CEP (gap conhecido FE Spec v1.1)', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={fixturePrestador} />);
    expect(html.toLowerCase()).not.toMatch(/cep|endereço|street/);
  });

  it('NÃO renderiza telefone (gap dataset)', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={fixturePrestador} />);
    expect(html.toLowerCase()).not.toMatch(/telefone|phone|tel:/);
  });

  it('NÃO renderiza especialidades (gap conhecido ADR-007)', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={fixturePrestador} />);
    expect(html.toLowerCase()).not.toMatch(/especialidade|especialista/);
  });

  it('contém sr-only para "Aceita as redes" (a11y)', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={fixturePrestador} />);
    expect(html).toContain('Aceita as redes');
  });

  it('icon do tipo é aria-hidden', () => {
    const html = renderToStaticMarkup(<NetworkResultCard prestador={fixturePrestador} />);
    expect(html).toMatch(/aria-hidden="true"/);
  });
});
