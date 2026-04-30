/**
 * Tests Story 7.2 AC5-bis — OrganizationJsonLd primitive (ADR-006 mit. 2).
 *
 * Coverage:
 * - Default props produzem schema canônico ADR-006
 * - Override props funciona (tests/admin scenarios)
 * - JSON-LD válido (parse round-trip)
 * - sameAs sempre contém amil.com.br (literal, não regex)
 * - name nunca é 'Amil' (FR54 + ADR-006 mit. 2)
 */

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { OrganizationJsonLd } from '@/components/schema/OrganizationJsonLd';

function extractJsonLd(html: string): unknown {
  const match = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  );
  if (!match) {
    throw new Error('No JSON-LD <script> tag found in output');
  }
  return JSON.parse(match[1]);
}

describe('OrganizationJsonLd default props (ADR-006 canonical)', () => {
  it('renders <script type="application/ld+json">', () => {
    const html = renderToStaticMarkup(<OrganizationJsonLd />);
    expect(html).toContain('<script type="application/ld+json">');
  });

  it('schema @type === "Organization"', () => {
    const html = renderToStaticMarkup(<OrganizationJsonLd />);
    const schema = extractJsonLd(html) as { '@type': string };
    expect(schema['@type']).toBe('Organization');
  });

  it('schema @context === "https://schema.org"', () => {
    const html = renderToStaticMarkup(<OrganizationJsonLd />);
    const schema = extractJsonLd(html) as { '@context': string };
    expect(schema['@context']).toBe('https://schema.org');
  });

  it('default name is "BeneficioRH (corretor)" (FR54 + NFR8)', () => {
    const html = renderToStaticMarkup(<OrganizationJsonLd />);
    const schema = extractJsonLd(html) as { name: string };
    expect(schema.name).toBe('BeneficioRH (corretor)');
  });

  it('default name NUNCA é "Amil" (FR54 + ADR-006 mit. 2)', () => {
    const html = renderToStaticMarkup(<OrganizationJsonLd />);
    const schema = extractJsonLd(html) as { name: string };
    expect(schema.name).not.toBe('Amil');
    expect(schema.name).not.toMatch(/^Amil/);
  });

  it('default sameAs inclui literalmente https://www.amil.com.br (mitigação 2)', () => {
    const html = renderToStaticMarkup(<OrganizationJsonLd />);
    const schema = extractJsonLd(html) as { sameAs: string[] };
    expect(schema.sameAs).toContain('https://www.amil.com.br');
  });

  it('output produz JSON válido (parse round-trip)', () => {
    const html = renderToStaticMarkup(<OrganizationJsonLd />);
    const raw = html.match(/>([\s\S]*?)<\/script>/)?.[1] ?? '';
    expect(() => JSON.parse(raw)).not.toThrow();
  });
});

describe('OrganizationJsonLd override props', () => {
  it('aceita name customizado (test scenario)', () => {
    const html = renderToStaticMarkup(<OrganizationJsonLd name="Custom Test Name" />);
    const schema = extractJsonLd(html) as { name: string };
    expect(schema.name).toBe('Custom Test Name');
  });

  it('aceita sameAs customizado (admin override)', () => {
    const html = renderToStaticMarkup(
      <OrganizationJsonLd sameAs={['https://example.com', 'https://other.com']} />
    );
    const schema = extractJsonLd(html) as { sameAs: string[] };
    expect(schema.sameAs).toHaveLength(2);
    expect(schema.sameAs).toContain('https://example.com');
    expect(schema.sameAs).toContain('https://other.com');
  });
});

describe('OrganizationJsonLd schema shape validation', () => {
  it('output tem exatamente 4 keys do schema canônico', () => {
    const html = renderToStaticMarkup(<OrganizationJsonLd />);
    const schema = extractJsonLd(html) as Record<string, unknown>;
    const keys = Object.keys(schema).sort();
    expect(keys).toEqual(['@context', '@type', 'name', 'sameAs']);
  });

  it('sameAs é sempre array (nunca string isolada)', () => {
    const html = renderToStaticMarkup(<OrganizationJsonLd />);
    const schema = extractJsonLd(html) as { sameAs: unknown };
    expect(Array.isArray(schema.sameAs)).toBe(true);
  });
});
