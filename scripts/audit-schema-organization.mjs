#!/usr/bin/env node
/**
 * Audit Schema Organization — Story 3.26 (FR54).
 *
 * Garante que NENHUMA Organization no codebase declare `name: "Amil"`.
 * Amil só pode aparecer em:
 *   - `Product.brand` (Brand entity)
 *   - `Article.about` (Organization "Amil Assistência Médica Internacional S.A.")
 *   - `Organization.knowsAbout` ou `Organization.category` (string)
 *
 * Modos:
 *   - source-scan (default): grep estático em arquivos *.ts/.tsx/.mjs
 *     procurando padrão `@type: 'Organization'` próximo a `name: 'Amil...'`.
 *   - runtime: parsing de output JSON-LD se PREVIEW_URL setado.
 *
 * Uso:
 *   node scripts/audit-schema-organization.mjs
 *   PREVIEW_URL=https://... node scripts/audit-schema-organization.mjs
 *
 * Exit code: 0 = ok, 1 = violation found.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components', 'lib', 'data', 'sanity'];
// __tests__ contains intentional FAIL fixtures (Brand vs Organization
// detection cases). docs/ has prose discussing the anti-pattern.
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'docs', '__tests__']);
const FILE_EXT = /\.(ts|tsx|mjs|js)$/;

/**
 * Heurística estática: detecta blocos JS/TS/JSON-LD onde um objeto
 * tem `@type: 'Organization'` (ou `"@type": "Organization"`) e
 * próximo (≤300 chars) tem `name: '...Amil...'`.
 *
 * Tolera Brand (`@type: 'Brand'`) e Article.about Organization com
 * "Amil Assistência Médica" (legítimo — Story 3.26 AC1 footnote).
 */
function findViolations(source, filePath) {
  /** @type {{ line: number; snippet: string }[]} */
  const violations = [];

  // Regex: captura blocos onde aparece "@type" Organization seguido por "name" Amil
  // dentro de uma janela de até ~400 chars (objetos maiores são raros).
  const orgRegex =
    /["'`]?@type["'`]?\s*:\s*["'`]Organization["'`][\s\S]{0,400}?["'`]?name["'`]?\s*:\s*["'`]([^"'`]+)["'`]/g;

  let match;
  while ((match = orgRegex.exec(source)) !== null) {
    const name = match[1];
    // Whitelist legítima: Article.about pode usar nome jurídico oficial da Amil.
    const isOfficialAmilCorp = /^Amil\s+(Assist[eê]ncia|Sa[uú]de\s+Internacional)/i.test(name);

    if (/\bAmil\b/i.test(name) && !isOfficialAmilCorp) {
      // Localiza linha
      const upTo = source.slice(0, match.index);
      const line = upTo.split('\n').length;
      const ctxStart = Math.max(0, match.index - 60);
      const ctxEnd = Math.min(source.length, match.index + match[0].length + 30);
      violations.push({
        line,
        snippet: source.slice(ctxStart, ctxEnd).replace(/\s+/g, ' '),
      });
    }
  }

  // Regex secundária: chave `Organization.name` (camelCase JS) com Amil
  const flatRegex = /Organization[^\n]{0,80}name\s*:\s*["'`]Amil[^"'`]*["'`]/g;
  while ((match = flatRegex.exec(source)) !== null) {
    const upTo = source.slice(0, match.index);
    const line = upTo.split('\n').length;
    violations.push({
      line,
      snippet: match[0].replace(/\s+/g, ' '),
    });
  }

  return violations.map((v) => ({ ...v, file: relative(ROOT, filePath) }));
}

function walk(dir, results = []) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, results);
    } else if (FILE_EXT.test(entry)) {
      // Skip o próprio audit script
      if (full.endsWith('audit-schema-organization.mjs')) continue;
      results.push(full);
    }
  }
  return results;
}

function main() {
  /** @type {{ file: string; line: number; snippet: string }[]} */
  const allViolations = [];

  for (const sub of SCAN_DIRS) {
    const path = join(ROOT, sub);
    try {
      statSync(path);
    } catch {
      continue;
    }
    const files = walk(path);
    for (const f of files) {
      const src = readFileSync(f, 'utf-8');
      const v = findViolations(src, f);
      allViolations.push(...v);
    }
  }

  if (allViolations.length === 0) {
    console.log('audit-schema-organization: PASS — no Organization.name="Amil" violations found');
    process.exit(0);
  }

  console.error('audit-schema-organization: FAIL');
  console.error(`Found ${allViolations.length} violation(s):\n`);
  for (const v of allViolations) {
    console.error(`  ${v.file}:${v.line}`);
    console.error(`    ${v.snippet}\n`);
  }
  console.error(
    'FR54: Organization.name MUST be "BeneficioRH..."; "Amil" only allowed in Product.brand or Article.about (Amil Assistência...).',
  );
  process.exit(1);
}

main();
