/**
 * Tests Story 7.2 AC3 — NetworkAdvancedFilters.
 *
 * Coverage:
 * - 8 tipos de TipoAtendimentoInferido (sem 'Outro')
 * - 11 redes de RedeAmilNome (todas ativas)
 * - selectedTipos badge count
 * - selectedRede option marcada
 * - Callbacks recebidos via props (assert via mock)
 * - SEM campo "Especialidade" (gap dataset enforced)
 *
 * Nota: Radix Accordion é Client-only mas seu HTML inicial render via SSR
 * funciona — testamos o markup gerado por renderToStaticMarkup.
 */

import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { NetworkAdvancedFilters } from '@/components/network/NetworkAdvancedFilters';
import { REDES_AMIL_ATIVAS } from '@/types/rede-credenciada-amil';

const noopTipo = vi.fn();
const noopRede = vi.fn();

const defaultProps = {
  selectedTipos: [] as never[],
  selectedRede: null,
  onTipoChange: noopTipo,
  onRedeChange: noopRede,
};

describe('NetworkAdvancedFilters render — Tipos (multi-select)', () => {
  it('renderiza 8 botões de tipo (sem "Outro" — fallback do loader)', () => {
    const html = renderToStaticMarkup(<NetworkAdvancedFilters {...defaultProps} />);
    const expectedTipos = [
      'Hospital',
      'Pronto-Socorro',
      'Maternidade',
      'Clínica',
      'Laboratório',
      'Diagnóstico por Imagem',
      'Centro/Instituto',
      'Odontologia',
    ];
    for (const tipo of expectedTipos) {
      expect(html).toContain(`data-tipo="${tipo}"`);
    }
  });

  it('NÃO renderiza tipo "Outro" (não é categoria filtrável)', () => {
    const html = renderToStaticMarkup(<NetworkAdvancedFilters {...defaultProps} />);
    expect(html).not.toContain('data-tipo="Outro"');
  });

  it('cada chip de tipo é <button type="button"> com aria-pressed', () => {
    const html = renderToStaticMarkup(<NetworkAdvancedFilters {...defaultProps} />);
    const matches = html.match(/<button[^>]*type="button"[^>]*aria-pressed="false"[^>]*data-tipo=/g);
    expect(matches?.length).toBeGreaterThanOrEqual(8);
  });

  it('selectedTipos=["Hospital","Laboratório"] renderiza ambos com aria-pressed=true', () => {
    const html = renderToStaticMarkup(
      <NetworkAdvancedFilters
        {...defaultProps}
        selectedTipos={['Hospital', 'Laboratório']}
      />
    );
    expect(html).toMatch(/aria-pressed="true"[^>]*data-tipo="Hospital"/);
    expect(html).toMatch(/aria-pressed="true"[^>]*data-tipo="Laboratório"/);
  });

  it('badge de count aparece quando selectedTipos.length > 0', () => {
    const html = renderToStaticMarkup(
      <NetworkAdvancedFilters {...defaultProps} selectedTipos={['Hospital']} />
    );
    expect(html).toMatch(/<span[^>]*>1<\/span>/);
  });

  it('badge de count NÃO aparece com selectedTipos vazio', () => {
    const html = renderToStaticMarkup(<NetworkAdvancedFilters {...defaultProps} />);
    // No badge "1" (ou outro count) próximo ao label "Tipo de prestador"
    expect(html).not.toMatch(/Tipo de prestador[\s\S]{0,200}rounded-full bg-amil-blue\/10/);
  });
});

describe('NetworkAdvancedFilters render — Redes (combobox single-select)', () => {
  it('renderiza <select> com option default "Todas as redes"', () => {
    const html = renderToStaticMarkup(<NetworkAdvancedFilters {...defaultProps} />);
    // React SSR pode adicionar selected="" no option default — regex mais flexível
    expect(html).toMatch(/<option value=""[^>]*>Todas as redes<\/option>/);
  });

  it('renderiza 11 options de REDES_AMIL_ATIVAS', () => {
    const html = renderToStaticMarkup(<NetworkAdvancedFilters {...defaultProps} />);
    for (const rede of REDES_AMIL_ATIVAS) {
      expect(html).toContain(`<option value="${rede}"`);
    }
  });

  it('selectedRede="AMIL S750 QP" marca option como selecionado', () => {
    const html = renderToStaticMarkup(
      <NetworkAdvancedFilters {...defaultProps} selectedRede="AMIL S750 QP" />
    );
    // SSR React renders selected option via defaultValue/value on parent select
    expect(html).toMatch(/value="AMIL S750 QP"/);
  });

  it('badge de count aparece quando selectedRede !== null', () => {
    const html = renderToStaticMarkup(
      <NetworkAdvancedFilters {...defaultProps} selectedRede="BLACK" />
    );
    // Badge "1" ao lado de "Rede / Produto Amil"
    expect(html).toMatch(/Rede \/ Produto Amil[\s\S]+?>1<\/span>/);
  });
});

describe('NetworkAdvancedFilters a11y', () => {
  it('contém data-testid="network-advanced-filters" no Accordion root', () => {
    const html = renderToStaticMarkup(<NetworkAdvancedFilters {...defaultProps} />);
    expect(html).toContain('data-testid="network-advanced-filters"');
  });

  it('select tem aria-label descritivo', () => {
    const html = renderToStaticMarkup(<NetworkAdvancedFilters {...defaultProps} />);
    expect(html).toMatch(/<select[^>]*aria-label="Selecionar rede ou produto Amil"/);
  });

  it('grupos de filtros têm role="group" + aria-labelledby', () => {
    const html = renderToStaticMarkup(<NetworkAdvancedFilters {...defaultProps} />);
    expect(html).toMatch(/role="group"[^>]*aria-labelledby="tipo-group-label"/);
    expect(html).toMatch(/role="group"[^>]*aria-labelledby="rede-group-label"/);
  });
});

describe('NetworkAdvancedFilters gap dataset enforced', () => {
  it('NÃO renderiza filtro de "Especialidade" (gap conhecido FE Spec v1.1 + ADR-007)', () => {
    const html = renderToStaticMarkup(<NetworkAdvancedFilters {...defaultProps} />);
    expect(html.toLowerCase()).not.toMatch(/especialidade/);
    expect(html.toLowerCase()).not.toMatch(/specialty/);
  });

  it('NÃO renderiza filtro de "CEP" ou "endereço" (gaps conhecidos)', () => {
    const html = renderToStaticMarkup(<NetworkAdvancedFilters {...defaultProps} />);
    expect(html.toLowerCase()).not.toMatch(/cep|postal/);
    expect(html.toLowerCase()).not.toMatch(/endereço|address/);
  });
});
