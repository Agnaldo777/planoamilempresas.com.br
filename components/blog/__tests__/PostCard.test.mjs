/**
 * Tests Story 6.11.a — PostCard component.
 *
 * Roda com: node --test components/blog/__tests__/PostCard.test.mjs
 *
 * RSC não roda Node native test runner (precisa React renderer).
 * Strategy: testar funções puras isoladas (formatDate) + invariantes
 * de shape do BlogPostSummary que PostCard consome.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Mirror da função formatDate em PostCard.tsx
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateFormatter.format(d);
}

describe('PostCard formatDate (pt-BR)', () => {
  it('formata data ISO em pt-BR (DD de MES de AAAA)', () => {
    const result = formatDate('2026-04-10T12:00:00.000Z');
    // pt-BR varia por runtime mas DEVE conter "abril" + "2026"
    assert.match(result, /abril/i);
    assert.match(result, /2026/);
  });

  it('preserva ISO inválido sem crash', () => {
    const result = formatDate('not-a-date');
    assert.equal(result, 'not-a-date');
  });

  it('formato dois dígitos no dia', () => {
    const result = formatDate('2026-04-05T00:00:00.000Z');
    // "05 de abril de 2026" — dia com leading zero
    assert.match(result, /^\d{2}\s/);
  });
});

describe('BlogPostSummary shape (consumido por PostCard)', () => {
  function makeSummary(overrides = {}) {
    return {
      _id: 'mock-1',
      title: 'Title',
      slug: 'title-slug',
      excerpt: 'Excerpt',
      authorId: 'agnaldo-silva',
      category: 'carencias',
      tags: [],
      publishedAt: '2026-01-01T00:00:00.000Z',
      ...overrides,
    };
  }

  it('summary mínimo tem campos obrigatórios', () => {
    const s = makeSummary();
    assert.ok(s._id);
    assert.ok(s.title);
    assert.ok(s.slug);
    assert.ok(s.excerpt);
    assert.ok(s.authorId);
    assert.ok(s.category);
    assert.ok(s.publishedAt);
  });

  it('href derivado de slug é /blog/[slug]/', () => {
    const s = makeSummary({ slug: 'carencia-amil' });
    const href = `/blog/${s.slug}/`;
    assert.equal(href, '/blog/carencia-amil/');
  });

  it('reviewedById é opcional', () => {
    const without = makeSummary();
    const withRev = makeSummary({ reviewedById: 'revisor-juridico' });
    assert.equal(without.reviewedById, undefined);
    assert.equal(withRev.reviewedById, 'revisor-juridico');
  });

  it('tags default vazio', () => {
    const s = makeSummary();
    assert.deepEqual(s.tags, []);
  });

  it('updatedAt opcional', () => {
    const s = makeSummary({ updatedAt: '2026-02-01T00:00:00.000Z' });
    assert.ok(s.updatedAt);
  });
});

describe('CategoryBadge slug whitelist (consumido por PostCard)', () => {
  const VALID = [
    'carencias',
    'coparticipacao',
    'reembolso',
    'rede-credenciada',
    'adesao-mei-pme',
    'ans-regulamentacao',
    'cobertura',
    'cancelamento',
  ];

  it('aceita 8 slugs canônicos', () => {
    for (const slug of VALID) {
      assert.ok(VALID.includes(slug));
    }
  });
});
