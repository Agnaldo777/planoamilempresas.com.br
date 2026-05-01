/**
 * Tests Story 3.26 — Organization schema.
 *
 * Roda com: node --test lib/schema/__tests__/organization.test.mjs
 *
 * Como organization.ts é TS, testamos contra o output esperado via
 * regex/snapshot em fixtures replicados (mirror dos invariantes).
 * O audit script (scripts/audit-schema-organization.mjs) é fonte de
 * verdade para enforcement em CI; este test cobre os invariantes
 * lógicos.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Espelho dos invariantes (NUNCA alterar sem atualizar lib/schema/organization.ts)
const ORGANIZATION_NAME = 'BeneficioRH Corretora de Seguros';
const ORGANIZATION_LEGAL_NAME = 'BENEFICIO RH CORRETORA DE SEGUROS LTDA';
const ORGANIZATION_CNPJ = '14.764.085/0001-99';
const ORGANIZATION_SUSEP = '201054484';

describe('Organization invariants — Story 3.26 / FR54', () => {
  it('name começa com BeneficioRH', () => {
    assert.match(ORGANIZATION_NAME, /^BeneficioRH/);
  });

  it('name NUNCA é "Amil"', () => {
    assert.notEqual(ORGANIZATION_NAME, 'Amil');
    // Permitimos a presença substring "Amil" se for em legal name?
    // Não. BeneficioRH legalName é estável.
    assert.equal(/\bAmil\b/.test(ORGANIZATION_NAME), false);
  });

  it('CNPJ tem formato xx.xxx.xxx/xxxx-xx', () => {
    assert.match(ORGANIZATION_CNPJ, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
  });

  it('SUSEP é numérico de 9 dígitos', () => {
    assert.match(ORGANIZATION_SUSEP, /^\d{9}$/);
  });

  it('legalName é uppercase corporate', () => {
    assert.equal(ORGANIZATION_LEGAL_NAME, ORGANIZATION_LEGAL_NAME.toUpperCase());
  });
});

describe('Audit detection — heurística do audit-schema-organization.mjs', () => {
  // Replica regex do script para garantir que detecta cases óbvios
  const orgRegex =
    /["'`]?@type["'`]?\s*:\s*["'`]Organization["'`][\s\S]{0,400}?["'`]?name["'`]?\s*:\s*["'`]([^"'`]+)["'`]/g;

  it('detecta Organization name=Amil (FAIL case)', () => {
    const src = `{ "@type": "Organization", "name": "Amil", "url": "x" }`;
    orgRegex.lastIndex = 0;
    const match = orgRegex.exec(src);
    assert.ok(match);
    assert.equal(match[1], 'Amil');
  });

  it('detecta Organization name=Amil Saúde (FAIL case)', () => {
    const src = `{
      "@type": "Organization",
      "name": "Amil Saúde Corretora"
    }`;
    orgRegex.lastIndex = 0;
    const match = orgRegex.exec(src);
    assert.ok(match);
    assert.match(match[1], /Amil/);
  });

  it('NÃO confunde Brand name=Amil (OK case)', () => {
    const src = `{ "@type": "Brand", "name": "Amil" }`;
    orgRegex.lastIndex = 0;
    const match = orgRegex.exec(src);
    assert.equal(match, null);
  });

  it('detecta Organization name=BeneficioRH como NÃO violação (OK case)', () => {
    const src = `{ "@type": "Organization", "name": "BeneficioRH Corretora de Seguros" }`;
    orgRegex.lastIndex = 0;
    const match = orgRegex.exec(src);
    assert.ok(match);
    // Match acontece, mas o name não tem token Amil → não é violação.
    assert.equal(/\bAmil\b/.test(match[1]), false);
  });

  it('Article.about com Organization "Amil Assistência Médica..." é whitelist', () => {
    const officialName = 'Amil Assistência Médica Internacional S.A.';
    // Whitelist regex do script
    const isOfficialAmilCorp = /^Amil\s+(Assist[eê]ncia|Sa[uú]de\s+Internacional)/i.test(officialName);
    assert.equal(isOfficialAmilCorp, true);
  });
});
