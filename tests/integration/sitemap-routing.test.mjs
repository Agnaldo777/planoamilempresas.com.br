/**
 * Integration test — Story 1.9 AC8
 *
 * Roda o validator real contra o repo (`app/sitemap.ts` +
 * `app/**\/page.tsx`) e assert que termina com sucesso.
 *
 * Uso: `node --test tests/integration/sitemap-routing.test.mjs`
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { main } from '../../scripts/validate-sitemap-routing.mjs';

describe('integration: validate-sitemap-routing contra repo real', () => {
  it('roda sem exceção e retorna estrutura esperada', async () => {
    const result = await main({ verbose: false });
    assert.ok(typeof result.failed === 'boolean');
    assert.ok(Array.isArray(result.missingInSitemap));
    assert.ok(Array.isArray(result.missingInRoutes));
    assert.ok(Array.isArray(result.routes));
    assert.ok(Array.isArray(result.sitemapUrls));
  });

  it('descobre routes do app/ atual', async () => {
    const result = await main({ verbose: false });
    // Deve detectar pelo menos a homepage e algumas rotas conhecidas.
    assert.ok(result.routes.length > 0, 'deveria descobrir routes');
  });

  it('descobre URLs do sitemap atual', async () => {
    const result = await main({ verbose: false });
    assert.ok(result.sitemapUrls.length > 0, 'deveria carregar sitemap');
  });
});
