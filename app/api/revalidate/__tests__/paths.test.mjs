/**
 * Unit tests for revalidate paths mapping (Story 6.11.e — AC1, AC8).
 *
 * Roda com:
 *   node --test app/api/revalidate/__tests__/paths.test.mjs
 *
 * Cobre os 7 cenários canônicos do webhook:
 *   1. blogPost com slug → revalida /blog, /blog/[slug], 8 categorias,
 *      feed.xml, sitemap
 *   2. blogPost sem slug → revalida /blog + categorias + sitemap
 *      (mas não /blog/[slug] — tolerância a payload incompleto)
 *   3. author com slug string → revalida /autores/[slug] + /blog
 *   4. faq → revalida /perguntas-frequentes + sitemap
 *   5. cidade → revalida /rede-credenciada + sitemap
 *   6. plano com slug.current → revalida /planos/[slug] + /planos
 *   7. tipo desconhecido → array vazio
 *   8. validateSecret matching/mismatch/missing
 *   9. safeEqual constant-time semantics
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  pathsForWebhook,
  normalizeSlug,
  safeEqual,
  validateSecret,
  BLOG_CATEGORY_SLUGS,
} from '../paths.mjs';

describe('normalizeSlug', () => {
  it('aceita string simples', () => {
    assert.equal(normalizeSlug('foo-bar'), 'foo-bar');
  });
  it('extrai .current de objeto Sanity', () => {
    assert.equal(normalizeSlug({ current: 'foo' }), 'foo');
  });
  it('retorna null para undefined', () => {
    assert.equal(normalizeSlug(undefined), null);
  });
  it('retorna null para objeto sem current', () => {
    assert.equal(normalizeSlug({}), null);
  });
});

describe('pathsForWebhook — blogPost', () => {
  it('com slug → revalida /blog, /blog/[slug], 8 categorias, feed, sitemap', () => {
    const paths = pathsForWebhook({
      _type: 'blogPost',
      slug: { current: 'meu-post' },
    });
    assert.ok(paths.includes('/blog'));
    assert.ok(paths.includes('/blog/meu-post'));
    assert.ok(paths.includes('/blog/feed.xml'));
    assert.ok(paths.includes('/sitemap.xml'));
    for (const cat of BLOG_CATEGORY_SLUGS) {
      assert.ok(
        paths.includes(`/blog/categoria/${cat}`),
        `falta categoria ${cat}`,
      );
    }
    // 3 base + 8 categorias + 1 slug = 12
    assert.equal(paths.length, 12);
  });

  it('sem slug ainda revalida listing + categorias + sitemap', () => {
    const paths = pathsForWebhook({ _type: 'blogPost' });
    assert.ok(paths.includes('/blog'));
    assert.ok(paths.includes('/blog/feed.xml'));
    assert.ok(paths.includes('/sitemap.xml'));
    // Nenhum path /blog/<slug-individual> sem categoria
    const individualSlugPaths = paths.filter(
      (p) => /^\/blog\/[^/]+$/.test(p) && p !== '/blog/feed.xml',
    );
    assert.equal(individualSlugPaths.length, 0);
    assert.equal(paths.length, 11); // 3 base + 8 cats
  });
});

describe('pathsForWebhook — author', () => {
  it('com slug → revalida /autores/[slug] + /blog + sitemap', () => {
    const paths = pathsForWebhook({
      _type: 'author',
      slug: 'agnaldo-silva',
    });
    assert.deepEqual(paths.sort(), [
      '/autores/agnaldo-silva',
      '/blog',
      '/sitemap.xml',
    ].sort());
  });
  it('sem slug → revalida /blog + sitemap', () => {
    const paths = pathsForWebhook({ _type: 'author' });
    assert.deepEqual(paths.sort(), ['/blog', '/sitemap.xml'].sort());
  });
});

describe('pathsForWebhook — faq / cidade / plano', () => {
  it('faq', () => {
    const paths = pathsForWebhook({ _type: 'faq' });
    assert.deepEqual(paths.sort(), [
      '/perguntas-frequentes',
      '/sitemap.xml',
    ].sort());
  });
  it('cidade', () => {
    const paths = pathsForWebhook({ _type: 'cidade' });
    assert.deepEqual(paths.sort(), [
      '/rede-credenciada',
      '/sitemap.xml',
    ].sort());
  });
  it('plano com slug', () => {
    const paths = pathsForWebhook({ _type: 'plano', slug: 'amil-s750' });
    assert.deepEqual(paths.sort(), [
      '/planos',
      '/planos/amil-s750',
      '/sitemap.xml',
    ].sort());
  });
});

describe('pathsForWebhook — tipo desconhecido', () => {
  it('retorna array vazio (noop)', () => {
    assert.deepEqual(pathsForWebhook({ _type: 'desconhecido' }), []);
    assert.deepEqual(pathsForWebhook({}), []);
  });
  it('aceita campo legacy `type` em vez de `_type`', () => {
    const paths = pathsForWebhook({ type: 'faq' });
    assert.ok(paths.includes('/perguntas-frequentes'));
  });
});

describe('safeEqual', () => {
  it('match exato', () => {
    assert.equal(safeEqual('abc123', 'abc123'), true);
  });
  it('mismatch length', () => {
    assert.equal(safeEqual('abc', 'abcd'), false);
  });
  it('mismatch content same length', () => {
    assert.equal(safeEqual('abc', 'abd'), false);
  });
  it('non-string defensive', () => {
    // @ts-expect-error testando entrada inválida
    assert.equal(safeEqual(null, 'x'), false);
  });
});

describe('validateSecret', () => {
  function mkHeaders(map) {
    return {
      get: (key) => map[key.toLowerCase()] ?? null,
    };
  }

  it('header x-webhook-secret válido', () => {
    const h = mkHeaders({ 'x-webhook-secret': 's3cret' });
    assert.equal(validateSecret(h, 's3cret'), true);
  });
  it('header alias x-revalidate-secret válido', () => {
    const h = mkHeaders({ 'x-revalidate-secret': 's3cret' });
    assert.equal(validateSecret(h, 's3cret'), true);
  });
  it('mismatch → false', () => {
    const h = mkHeaders({ 'x-webhook-secret': 'wrong' });
    assert.equal(validateSecret(h, 's3cret'), false);
  });
  it('header ausente → false', () => {
    assert.equal(validateSecret(mkHeaders({}), 's3cret'), false);
  });
  it('expected ausente → false (fail-secure)', () => {
    const h = mkHeaders({ 'x-webhook-secret': 's3cret' });
    assert.equal(validateSecret(h, undefined), false);
  });
});
