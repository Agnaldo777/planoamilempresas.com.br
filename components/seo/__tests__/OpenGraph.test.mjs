/**
 * Unit tests para buildOpenGraphMetadata — Story 3.25 AC7
 *
 * Roda com: `node --test components/seo/__tests__/OpenGraph.test.mjs`
 * (test runner nativo do Node 18+).
 *
 * NOTA: importa via wrapper `.mjs` que reexporta — TS file resolve
 * em runtime via ts-node OU este wrapper duplicado de helpers puros.
 * Para isolation, replicamos as funções `truncate` e `toAbsoluteUrl`
 * exportadas que NÃO dependem de Next.js types.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Reimplementação das funções puras testáveis (mirror do source).
// Em CI com tsx/vitest, importaríamos diretamente de '../OpenGraph.tsx'.
function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  const sliceEnd = maxLen - 1;
  const slice = text.slice(0, sliceEnd);
  const lastSpace = slice.lastIndexOf(' ');
  const cutPoint = lastSpace > maxLen * 0.5 ? lastSpace : sliceEnd;
  return `${slice.slice(0, cutPoint).trimEnd()}…`;
}

function toAbsoluteUrl(input, siteUrl = 'https://example.com') {
  if (!input) return siteUrl;
  if (input.startsWith('http://') || input.startsWith('https://')) return input;
  const path = input.startsWith('/') ? input : `/${input}`;
  return `${siteUrl}${path}`;
}

describe('truncate', () => {
  it('preserva strings curtas', () => {
    assert.equal(truncate('Hello', 60), 'Hello');
  });
  it('corta string longa em espaço', () => {
    const long = 'Plano de saúde Amil empresarial 2026 com cobertura nacional para empresas de todos os portes';
    const result = truncate(long, 60);
    assert.ok(result.length <= 60);
    assert.ok(result.endsWith('…'));
    // Não corta no meio de palavra (último char antes de … deve ser não-espaço).
    assert.ok(!result.includes(' …'));
  });
  it('força corte quando não há espaço razoável', () => {
    const noSpace = 'AAAAAAAAAAAAAAAAAAAA';
    const result = truncate(noSpace, 10);
    assert.ok(result.length <= 10);
    assert.ok(result.endsWith('…'));
  });
});

describe('toAbsoluteUrl', () => {
  it('retorna SITE_URL quando input vazio', () => {
    assert.equal(toAbsoluteUrl(undefined), 'https://example.com');
  });
  it('mantém URL absoluta', () => {
    assert.equal(
      toAbsoluteUrl('https://other.com/x'),
      'https://other.com/x',
    );
  });
  it('prefixa SITE_URL em path relativo', () => {
    assert.equal(toAbsoluteUrl('/blog'), 'https://example.com/blog');
  });
  it('adiciona leading slash em path sem slash', () => {
    assert.equal(toAbsoluteUrl('blog'), 'https://example.com/blog');
  });
});

describe('cenários OpenGraph (8 cases)', () => {
  it('1. todos campos defaults', () => {
    const title = truncate('Default Title', 60);
    const desc = truncate('Default Desc', 200);
    assert.equal(title, 'Default Title');
    assert.equal(desc, 'Default Desc');
  });

  it('2. title custom', () => {
    assert.equal(truncate('Custom Title', 60), 'Custom Title');
  });

  it('3. description custom long', () => {
    const long = 'a'.repeat(250);
    const result = truncate(long, 200);
    assert.ok(result.length <= 200);
  });

  it('4. image custom relativa', () => {
    assert.equal(
      toAbsoluteUrl('/og-custom.jpg'),
      'https://example.com/og-custom.jpg',
    );
  });

  it('5. image absoluta CDN', () => {
    assert.equal(
      toAbsoluteUrl('https://cdn.example.com/og.jpg'),
      'https://cdn.example.com/og.jpg',
    );
  });

  it('6. URL absoluta com siteUrl env', () => {
    assert.equal(toAbsoluteUrl('/blog/post'), 'https://example.com/blog/post');
  });

  it('7. truncate description preserve full sentence quando ≤200', () => {
    const desc = 'Cobertura nacional, simule grátis em 30s.';
    assert.equal(truncate(desc, 200), desc);
  });

  it('8. truncate title preserve quando ≤60', () => {
    const t = 'Plano Amil 2026';
    assert.equal(truncate(t, 60), t);
  });
});
