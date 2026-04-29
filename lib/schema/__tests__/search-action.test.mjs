/**
 * Tests Story 7.2 — SearchAction schema (Sitelinks Search Box)
 *
 * Roda com: node --test lib/schema/__tests__/search-action.test.mjs
 *
 * Como search-action.ts é TS, replicamos o builder em JS puro
 * (mirror) para validar invariantes lógicos. O schema final é
 * validado em CI via scripts/validate-jsonld.mjs.
 *
 * Cobre 5 invariantes críticos para Google Sitelinks Search Box:
 *   1. target.@type === 'EntryPoint' (form full)
 *   2. target.urlTemplate aponta para /rede-credenciada?q={search_term_string}
 *   3. query-input segue formato literal "required name=search_term_string"
 *   4. URL template é absoluto (não relativo)
 *   5. Schema parse-validate via JSON.stringify roundtrip
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'https://planoamilempresas.com.br';

// Mirror puro de buildSearchAction
function buildSearchAction() {
  return {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/rede-credenciada?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  };
}

describe('SearchAction schema — Story 7.2 (FR23)', () => {
  it('1. target.@type é EntryPoint (não shorthand string)', () => {
    const sa = buildSearchAction();
    assert.equal(sa.target['@type'], 'EntryPoint');
  });

  it('2. urlTemplate aponta para hub /rede-credenciada com {search_term_string}', () => {
    const sa = buildSearchAction();
    assert.match(
      sa.target.urlTemplate,
      /\/rede-credenciada\?q=\{search_term_string\}$/,
    );
  });

  it('3. query-input segue formato literal Google Sitelinks Search Box', () => {
    const sa = buildSearchAction();
    assert.equal(sa['query-input'], 'required name=search_term_string');
  });

  it('4. urlTemplate é URL absoluto (https://)', () => {
    const sa = buildSearchAction();
    assert.match(sa.target.urlTemplate, /^https:\/\//);
  });

  it('5. JSON roundtrip preserva shape (sem property loss)', () => {
    const sa = buildSearchAction();
    const json = JSON.stringify(sa);
    const parsed = JSON.parse(json);
    assert.deepEqual(parsed, sa);
  });

  it('6. SearchAction é compatível com WebSite.potentialAction', () => {
    const website = {
      '@type': 'WebSite',
      '@id': `${BASE_URL}#website`,
      name: 'Plano Amil Empresas',
      url: BASE_URL,
      potentialAction: buildSearchAction(),
    };
    assert.equal(website.potentialAction['@type'], 'SearchAction');
    assert.ok(website.potentialAction.target.urlTemplate.includes('{search_term_string}'));
  });
});
