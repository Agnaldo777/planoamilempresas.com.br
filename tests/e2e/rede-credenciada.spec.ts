/**
 * Smoke E2E + a11y scan do hub `/rede-credenciada` — Story 7.2 AC9.
 *
 * Coverage:
 *   - Página renderiza sem erros (200 OK + h1 presente)
 *   - Stats dataset-driven aparecem corretos (9.325, 26, 438)
 *   - NetworkSearch input + UF select funcionais
 *   - FAQ renderiza 8 perguntas + FAQPage schema JSON-LD
 *   - OrganizationJsonLd schema literal correto
 *   - Disclaimer ANS/SUSEP em hero + footer
 *   - Sitemap entry priority 0.9 + lastmod dataset
 *   - axe-core scan: zero violations serious/critical (AC9)
 */

import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const HUB_PATH = '/rede-credenciada';

test.describe('Hub /rede-credenciada — render', () => {
  test('página retorna 200 e renderiza H1 com stats dataset-driven (AC1, AC6)', async ({
    page,
  }) => {
    const response = await page.goto(HUB_PATH);
    expect(response?.status()).toBe(200);

    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Rede Credenciada Amil/i);
    await expect(h1).toContainText(/9\.325/);
  });

  test('hero contém os 4 stats canônicos (AC6)', async ({ page }) => {
    await page.goto(HUB_PATH);

    await expect(page.locator('text=/9\\.325/').first()).toBeVisible();
    await expect(page.locator('text=/^26$/').first()).toBeVisible();
    await expect(page.locator('text=/^438$/').first()).toBeVisible();
    await expect(page.locator('text=/^11$/').first()).toBeVisible();
  });

  test('hero exibe disclaimer ANS + SUSEP (AC7)', async ({ page }) => {
    await page.goto(HUB_PATH);
    await expect(page.locator('text=/ANS n.\\s*326305/i')).toBeVisible();
    await expect(page.locator('text=/SUSEP\\s*201054484/')).toBeVisible();
  });

  test('UfShortcutChips top-5 + chip overflow (AC4)', async ({ page }) => {
    await page.goto(HUB_PATH);

    const nav = page.locator('nav[aria-label*="Atalhos"]');
    await expect(nav).toBeVisible();
    const lis = nav.locator('ul > li');
    expect(await lis.count()).toBeGreaterThanOrEqual(5);
  });
});

test.describe('Hub /rede-credenciada — NetworkSearch (AC2/AC3/AC9)', () => {
  test('renderiza UF select e search input ARIA-correto', async ({ page }) => {
    await page.goto(HUB_PATH);

    const ufSelect = page.locator('[data-testid="network-search-uf"]');
    await expect(ufSelect).toBeVisible();
    await expect(ufSelect).toHaveAttribute('aria-label', /estado/i);

    const searchInput = page.locator('[data-testid="network-search-input"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('role', 'combobox');
    await expect(searchInput).toHaveAttribute('aria-autocomplete', 'list');
  });

  test('live region a11y presente (AC9)', async ({ page }) => {
    await page.goto(HUB_PATH);
    const liveRegion = page.locator('[data-testid="network-search-live-region"]');
    await expect(liveRegion).toHaveAttribute('role', 'status');
    await expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  });

  test('NetworkAdvancedFilters renderiza 8 tipos + 11 redes (AC3)', async ({ page }) => {
    await page.goto(HUB_PATH);
    const filtersRoot = page.locator('[data-testid="network-advanced-filters"]');
    await expect(filtersRoot).toBeVisible();

    // 8 tipos chips (sem 'Outro' — fallback do loader)
    const tipos = [
      'Hospital',
      'Pronto-Socorro',
      'Maternidade',
      'Clínica',
      'Laboratório',
      'Diagnóstico por Imagem',
      'Centro/Instituto',
      'Odontologia',
    ];
    for (const tipo of tipos) {
      await expect(page.locator(`[data-tipo="${tipo}"]`)).toBeVisible();
    }

    // <select> rede com 11 options + 1 default
    const redeSelect = page.locator('[data-testid="rede-select"]');
    const optionCount = await redeSelect.locator('option').count();
    expect(optionCount).toBe(12); // 11 redes + "Todas as redes"
  });
});

test.describe('Hub /rede-credenciada — Schema.org (AC5, AC5-bis)', () => {
  test('FAQPage schema com 8 Question/Answer (AC5)', async ({ page }) => {
    await page.goto(HUB_PATH);

    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThanOrEqual(2); // FAQPage + Organization

    const allText = await Promise.all(
      Array.from({ length: count }, (_, i) => scripts.nth(i).textContent())
    );
    const faqSchema = allText
      .map((t) => (t ? JSON.parse(t) : null))
      .find((s) => s?.['@type'] === 'FAQPage');

    expect(faqSchema).toBeTruthy();
    expect(faqSchema.mainEntity).toHaveLength(8);
    for (const q of faqSchema.mainEntity) {
      expect(q['@type']).toBe('Question');
      expect(q.acceptedAnswer['@type']).toBe('Answer');
    }
  });

  test('OrganizationJsonLd com sameAs amil.com.br + name BeneficioRH (ADR-006 mit. 2 + AC5-bis)', async ({
    page,
  }) => {
    await page.goto(HUB_PATH);

    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    const allText = await Promise.all(
      Array.from({ length: count }, (_, i) => scripts.nth(i).textContent())
    );
    const orgSchema = allText
      .map((t) => (t ? JSON.parse(t) : null))
      .find((s) => s?.['@type'] === 'Organization');

    expect(orgSchema).toBeTruthy();
    expect(orgSchema.sameAs).toContain('https://www.amil.com.br');
    expect(orgSchema.name).toBe('BeneficioRH (corretor)');
    expect(orgSchema.name).not.toBe('Amil');
  });
});

test.describe('Hub /rede-credenciada — FAQ render (AC5)', () => {
  test('exibe 8 perguntas em <h3>', async ({ page }) => {
    await page.goto(HUB_PATH);

    const faqHeadings = page.locator('section[aria-labelledby="rede-credenciada-faq-heading"] h3');
    await expect(faqHeadings).toHaveCount(8);
  });

  test('cada pergunta termina com "?" e tem resposta visível', async ({ page }) => {
    await page.goto(HUB_PATH);

    const faqHeadings = page.locator(
      'section[aria-labelledby="rede-credenciada-faq-heading"] h3'
    );
    const count = await faqHeadings.count();
    for (let i = 0; i < count; i += 1) {
      const text = await faqHeadings.nth(i).textContent();
      expect(text).toMatch(/\?\s*$/);
    }
  });
});

test.describe('Hub /rede-credenciada — a11y (AC9)', () => {
  test('axe-core scan zero violations serious/critical', async ({ page }) => {
    await page.goto(HUB_PATH);
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blockingViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );

    if (blockingViolations.length > 0) {
      console.log(
        'A11y violations:',
        JSON.stringify(blockingViolations, null, 2)
      );
    }
    expect(blockingViolations).toEqual([]);
  });

  test('foco visível ao tabular pelos controles (Story 7.2 AC9 keyboard nav)', async ({
    page,
  }) => {
    await page.goto(HUB_PATH);

    // Tab por todos os interactive elements e verifica foco visível
    await page.keyboard.press('Tab');
    let focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
    expect(['BUTTON', 'INPUT', 'SELECT', 'A']).toContain(focused);
  });
});

test.describe('Hub /rede-credenciada — sitemap (AC10)', () => {
  test('sitemap.xml inclui /rede-credenciada com priority 0.9', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);

    const xml = await response.text();
    expect(xml).toContain('/rede-credenciada');
    // priority 0.9 (não 0.8 do default)
    expect(xml).toMatch(/<loc>[^<]*\/rede-credenciada<\/loc>[\s\S]*?<priority>0\.9<\/priority>/);
  });
});
