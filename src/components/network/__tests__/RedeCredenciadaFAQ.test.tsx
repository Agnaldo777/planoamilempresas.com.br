/**
 * Tests Story 7.2 AC5 — RedeCredenciadaFAQ + FAQPage schema JSON-LD.
 *
 * Coverage:
 * - 8 perguntas exatas (count + ordem)
 * - FAQPage schema válido (Schema.org structure)
 * - Cada pergunta tem Question + Answer pair
 * - Heading hierarchy correta (H2 + H3)
 * - Sem JS runtime necessário (RSC puro)
 */

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { RedeCredenciadaFAQ } from '@/components/network/RedeCredenciadaFAQ';
import { REDE_CREDENCIADA_FAQS } from '@/content/rede-credenciada-faq';

function extractJsonLd(html: string): unknown {
  const match = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  );
  if (!match) {
    throw new Error('No JSON-LD <script> tag found');
  }
  return JSON.parse(match[1]);
}

describe('REDE_CREDENCIADA_FAQS content (constant)', () => {
  it('tem exatamente 8 perguntas (Story 7.2 AC5)', () => {
    expect(REDE_CREDENCIADA_FAQS).toHaveLength(8);
  });

  it('cada FAQ tem question + answer não-vazios', () => {
    for (const faq of REDE_CREDENCIADA_FAQS) {
      expect(faq.question.length).toBeGreaterThan(10);
      expect(faq.answer.length).toBeGreaterThan(40);
    }
  });

  it('perguntas terminam com ponto de interrogação', () => {
    for (const faq of REDE_CREDENCIADA_FAQS) {
      expect(faq.question).toMatch(/\?$/);
    }
  });

  it('respostas têm 40-120 palavras (Featured Snippet target)', () => {
    for (const faq of REDE_CREDENCIADA_FAQS) {
      const wordCount = faq.answer.split(/\s+/).length;
      expect(wordCount).toBeGreaterThanOrEqual(40);
      expect(wordCount).toBeLessThanOrEqual(120);
    }
  });
});

describe('RedeCredenciadaFAQ component render', () => {
  it('renderiza section com aria-labelledby (a11y)', () => {
    const html = renderToStaticMarkup(<RedeCredenciadaFAQ />);
    expect(html).toContain('aria-labelledby="rede-credenciada-faq-heading"');
  });

  it('renderiza H2 principal com id correto', () => {
    const html = renderToStaticMarkup(<RedeCredenciadaFAQ />);
    expect(html).toContain('id="rede-credenciada-faq-heading"');
    expect(html).toContain('<h2');
  });

  it('renderiza 8 H3 (uma por pergunta)', () => {
    const html = renderToStaticMarkup(<RedeCredenciadaFAQ />);
    const h3Matches = html.match(/<h3/g) ?? [];
    expect(h3Matches).toHaveLength(8);
  });

  it('cada pergunta aparece literalmente no HTML', () => {
    const html = renderToStaticMarkup(<RedeCredenciadaFAQ />);
    for (const faq of REDE_CREDENCIADA_FAQS) {
      expect(html).toContain(faq.question);
    }
  });

  it('cada resposta aparece literalmente no HTML', () => {
    const html = renderToStaticMarkup(<RedeCredenciadaFAQ />);
    for (const faq of REDE_CREDENCIADA_FAQS) {
      expect(html).toContain(faq.answer);
    }
  });

  it('usa <dl><dt><dd> para semantica FAQ correta', () => {
    const html = renderToStaticMarkup(<RedeCredenciadaFAQ />);
    expect(html).toContain('<dl');
    expect(html).toMatch(/<dt[\s>]/);
    expect(html).toMatch(/<dd[\s>]/);
  });
});

describe('FAQPage JSON-LD schema (Story 7.2 AC5 Schema.org validator gate)', () => {
  it('renderiza <script type="application/ld+json">', () => {
    const html = renderToStaticMarkup(<RedeCredenciadaFAQ />);
    expect(html).toContain('<script type="application/ld+json">');
  });

  it('schema @type === "FAQPage"', () => {
    const html = renderToStaticMarkup(<RedeCredenciadaFAQ />);
    const schema = extractJsonLd(html) as { '@type': string };
    expect(schema['@type']).toBe('FAQPage');
  });

  it('schema mainEntity tem 8 Questions (cobertura completa)', () => {
    const html = renderToStaticMarkup(<RedeCredenciadaFAQ />);
    const schema = extractJsonLd(html) as { mainEntity: unknown[] };
    expect(schema.mainEntity).toHaveLength(8);
  });

  it('cada Question tem name + acceptedAnswer.text', () => {
    const html = renderToStaticMarkup(<RedeCredenciadaFAQ />);
    const schema = extractJsonLd(html) as {
      mainEntity: Array<{
        '@type': string;
        name: string;
        acceptedAnswer: { '@type': string; text: string };
      }>;
    };
    for (const q of schema.mainEntity) {
      expect(q['@type']).toBe('Question');
      expect(q.name.length).toBeGreaterThan(10);
      expect(q.acceptedAnswer['@type']).toBe('Answer');
      expect(q.acceptedAnswer.text.length).toBeGreaterThan(40);
    }
  });

  it('schema é JSON parseable (round-trip)', () => {
    const html = renderToStaticMarkup(<RedeCredenciadaFAQ />);
    const raw =
      html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '';
    expect(raw).not.toBe('');
    expect(() => JSON.parse(raw)).not.toThrow();
  });
});
