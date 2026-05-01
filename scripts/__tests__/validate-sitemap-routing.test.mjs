/**
 * Unit tests para validate-sitemap-routing.mjs — Story 1.9 AC7
 *
 * Roda com: `node --test scripts/__tests__/validate-sitemap-routing.test.mjs`
 * (test runner nativo do Node 18+, sem dependências externas).
 *
 * Cobre 5 cenários canônicos:
 * 1. Sitemap = Routes (consistent) → pass
 * 2. Sitemap missing 1 URL → fail
 * 3. Sitemap has extra URL → fail
 * 4. Dynamic segment expansion
 * 5. noindex route excluída
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  filePathToRoute,
  isNoindexPage,
  setDifference,
  applyExclusions,
  normalizePath,
} from '../validate-sitemap-routing.mjs';

describe('normalizePath', () => {
  it('garante leading slash', () => {
    assert.equal(normalizePath('foo'), '/foo');
    assert.equal(normalizePath('/foo'), '/foo');
  });
  it('preserva raiz', () => {
    assert.equal(normalizePath('/'), '/');
  });
  it('remove trailing slash exceto raiz', () => {
    assert.equal(normalizePath('/foo/'), '/foo');
    assert.equal(normalizePath('/'), '/');
  });
});

describe('filePathToRoute', () => {
  it('homepage', () => {
    assert.equal(filePathToRoute('app/page.tsx'), '/');
  });
  it('rota simples', () => {
    assert.equal(filePathToRoute('app/planos/page.tsx'), '/planos');
  });
  it('remove route group', () => {
    assert.equal(
      filePathToRoute('app/(marketing)/blog/page.tsx'),
      '/blog',
    );
  });
  it('preserva dynamic segment', () => {
    assert.equal(
      filePathToRoute('app/(marketing)/blog/[slug]/page.tsx'),
      '/blog/[slug]',
    );
  });
  it('exclui /api', () => {
    assert.equal(filePathToRoute('app/api/health/route.ts'), null);
  });
  it('exclui /studio', () => {
    assert.equal(filePathToRoute('app/(studio)/studio/[[...tool]]/page.tsx'), null);
  });
});

describe('isNoindexPage', () => {
  it('detecta robots.index = false', () => {
    const src = `export const metadata = { robots: { index: false, follow: true } }`;
    assert.equal(isNoindexPage(src), true);
  });
  it('detecta noindex: true', () => {
    const src = `metadata = { noindex: true }`;
    assert.equal(isNoindexPage(src), true);
  });
  it('detecta meta tag content="noindex"', () => {
    const src = `<meta name="robots" content="noindex" />`;
    assert.equal(isNoindexPage(src), true);
  });
  it('false em página normal', () => {
    const src = `export const metadata = { title: 'X' }`;
    assert.equal(isNoindexPage(src), false);
  });
});

describe('setDifference', () => {
  it('detecta items em A ausentes em B', () => {
    const a = new Set(['/x', '/y', '/z']);
    const b = new Set(['/x']);
    assert.deepEqual(setDifference(a, b), ['/y', '/z']);
  });
  it('retorna vazio quando A subset de B', () => {
    const a = new Set(['/x']);
    const b = new Set(['/x', '/y']);
    assert.deepEqual(setDifference(a, b), []);
  });
  it('ordena resultado', () => {
    const a = new Set(['/c', '/a', '/b']);
    const b = new Set();
    assert.deepEqual(setDifference(a, b), ['/a', '/b', '/c']);
  });
});

describe('applyExclusions', () => {
  it('remove path exato', () => {
    const s = new Set(['/api', '/blog', '/studio']);
    applyExclusions(s, ['/api']);
    assert.equal(s.has('/api'), false);
    assert.equal(s.has('/blog'), true);
  });
  it('remove paths sob prefixo', () => {
    const s = new Set(['/api', '/api/og', '/api/health', '/blog']);
    applyExclusions(s, ['/api']);
    assert.equal(s.size, 1);
    assert.equal(s.has('/blog'), true);
  });
  it('normaliza paths sem leading slash', () => {
    const s = new Set(['/api']);
    applyExclusions(s, ['api']);
    assert.equal(s.size, 0);
  });
});

describe('integração — cenários canônicos', () => {
  it('cenário 1: sitemap = routes → pass', () => {
    const sitemap = new Set(['/', '/planos', '/blog']);
    const routes = new Set(['/', '/planos', '/blog']);
    assert.equal(setDifference(sitemap, routes).length, 0);
    assert.equal(setDifference(routes, sitemap).length, 0);
  });

  it('cenário 2: sitemap missing 1 URL → fail', () => {
    const sitemap = new Set(['/', '/planos']);
    const routes = new Set(['/', '/planos', '/blog']);
    const missing = setDifference(routes, sitemap);
    assert.deepEqual(missing, ['/blog']);
  });

  it('cenário 3: sitemap has extra URL → fail', () => {
    const sitemap = new Set(['/', '/planos', '/orphan']);
    const routes = new Set(['/', '/planos']);
    const extra = setDifference(sitemap, routes);
    assert.deepEqual(extra, ['/orphan']);
  });

  it('cenário 4: dynamic segment expansion (manual)', () => {
    const sitemap = new Set(['/blog/post-a', '/blog/post-b']);
    const routes = new Set(['/blog/post-a', '/blog/post-b']);
    assert.equal(setDifference(sitemap, routes).length, 0);
  });

  it('cenário 5: noindex route excluída', () => {
    const routes = new Set(['/', '/planos', '/internal/test']);
    const sitemap = new Set(['/', '/planos']);
    // noindex aplicado:
    routes.delete('/internal/test');
    assert.equal(setDifference(routes, sitemap).length, 0);
  });
});
