/**
 * Tests global design tokens — Story migração globals.css 2026-04-29.
 *
 * Roda com: node --test components/ui/__tests__/global-tokens.test.mjs
 *
 * Garante que `app/globals.css` esteja alinhado com a Paleta Opção A
 * (canonical em docs/design/visual-benchmark-and-design-system.md v1.0)
 * e livre dos tokens legacy `--color-amil-blue*`.
 *
 * Compliance:
 *   - ADR-006 (anti-trademark Amil — `#0066B3`/`#0066CC` proibidos como brand primary)
 *   - FR54 (Schema Organization — BeneficioRH, não Amil)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GLOBALS_CSS_PATH = path.resolve(__dirname, '../../../app/globals.css');
const cssSource = fs.readFileSync(GLOBALS_CSS_PATH, 'utf8');

describe('globals.css — tokens legacy removidos', () => {
  it('NÃO contém token legacy --color-amil-blue', () => {
    // Custom property; comentários informativos sobre a remoção são OK
    // — só falhamos se alguma definição CSS ativa for declarada.
    const declaration = /^\s*--color-amil-blue\s*:/m;
    assert.equal(declaration.test(cssSource), false);
  });

  it('NÃO contém token legacy --color-amil-blue-dark', () => {
    const declaration = /^\s*--color-amil-blue-dark\s*:/m;
    assert.equal(declaration.test(cssSource), false);
  });

  it('NÃO contém token legacy --color-amil-blue-light', () => {
    const declaration = /^\s*--color-amil-blue-light\s*:/m;
    assert.equal(declaration.test(cssSource), false);
  });

  it('NÃO contém hex literal #0066CC (azul Amil oficial)', () => {
    // Em comentários de docstring é OK; em valor de CSS property NÃO.
    // Heurística: aceita match dentro de comentário /* ... */; rejeita
    // fora de comentário.
    const stripped = cssSource.replace(/\/\*[\s\S]*?\*\//g, '');
    assert.equal(/#0066CC/i.test(stripped), false);
  });

  it('NÃO contém hex literal #0066B3 (azul UnitedHealth)', () => {
    const stripped = cssSource.replace(/\/\*[\s\S]*?\*\//g, '');
    assert.equal(/#0066B3/i.test(stripped), false);
  });
});

describe('globals.css — tokens canônicos Opção A', () => {
  it('declara --color-brand-primary (slate-900 #0F172A)', () => {
    assert.match(cssSource, /--color-brand-primary\s*:\s*#0F172A/i);
  });

  it('declara --color-cta (teal-600 #0D9488)', () => {
    assert.match(cssSource, /--color-cta\s*:\s*#0D9488/i);
  });

  it('declara --color-accent (amber-700 #B45309)', () => {
    assert.match(cssSource, /--color-accent\s*:\s*#B45309/i);
  });

  it('declara --color-link (sky-600 #0284C7)', () => {
    assert.match(cssSource, /--color-link\s*:\s*#0284C7/i);
  });
});

describe('globals.css — diretivas Tailwind v4', () => {
  it('importa tailwindcss (v4 single import)', () => {
    assert.match(cssSource, /@import\s+["']tailwindcss["']/);
  });

  it('declara bloco @theme com tokens semânticos', () => {
    assert.match(cssSource, /@theme\s*\{/);
  });

  it('preserva tokens utilitários legacy compat (cta-green, whatsapp, urgency)', () => {
    // Tokens que NÃO são parte da migração de paleta brand — mantidos
    // por compatibilidade com componentes que ainda os referenciam.
    assert.match(cssSource, /--color-cta-green\s*:/);
    assert.match(cssSource, /--color-whatsapp\s*:/);
    assert.match(cssSource, /--color-urgency\s*:/);
  });

  it('preserva fonte Inter como --font-sans', () => {
    assert.match(cssSource, /--font-sans\s*:\s*['"]?Inter/);
  });
});
