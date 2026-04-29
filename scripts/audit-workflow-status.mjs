#!/usr/bin/env node
/**
 * audit-workflow-status.mjs — Story 6.10 (NFR23)
 *
 * Gate técnico que falha CI se algum post com `workflowStatus = published`
 * não cumprir o pipeline editorial obrigatório:
 *
 *   - Posts YMYL (categorias `requiresLegalReview === true`) precisam de:
 *       * ≥2 entries em `reviewTrack`
 *       * ≥1 entry com `role === 'medico'` E `decision === 'approved'`
 *       * ≥1 entry com `role === 'advogado'` E `decision === 'approved'`
 *   - Última entry temporal NÃO pode ter `decision === 'rejected'` (regra
 *     universal — não-YMYL inclusive).
 *   - Posts não-YMYL com `workflowStatus = published` não exigem
 *     reviewTrack (cadência operacional).
 *
 * Categorias YMYL espelham `data/blog/categories.ts` `requiresLegalReview`:
 *   - carencias
 *   - coparticipacao
 *   - ans-regulamentacao
 *   - cobertura
 *   - cancelamento
 *
 * Este script roda em paralelo a `audit-author-ymyl.mjs` (Story 6.11.e):
 * aquele valida AUTORIA YMYL, este valida PIPELINE editorial.
 *
 * Modos:
 *   default       → carrega mock-posts.ts (parser estático)
 *   --from-sanity → query GROQ (TODO Aria: implementação real)
 *   --json        → saída machine-readable
 *
 * Uso:
 *   node scripts/audit-workflow-status.mjs
 *   node scripts/audit-workflow-status.mjs --json
 *
 * Exit code: 0 = pass, 1 = fail
 */

import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

/** Categorias YMYL que exigem pipeline médico+advogado. */
export const YMYL_CATEGORIES = new Set([
  'carencias',
  'coparticipacao',
  'ans-regulamentacao',
  'cobertura',
  'cancelamento',
]);

/** Status que disparam o gate (apenas published em v1). */
export const ENFORCED_STATUSES = new Set(['published']);

/**
 * Pure validation — recebe array e retorna violações.
 *
 * Cada post tem shape:
 *   {
 *     _id, title, slug, category, workflowStatus,
 *     reviewTrack?: Array<{ role, decision, reviewedAt, ... }>,
 *     enabled?
 *   }
 *
 * @param {Array<{
 *   _id: string,
 *   title: string,
 *   slug: string,
 *   category: string,
 *   workflowStatus?: string,
 *   reviewTrack?: Array<{role: string, decision: string, reviewedAt: string}>,
 *   enabled?: boolean
 * }>} posts
 * @returns {{
 *   violations: Array<{slug:string, code:string, message:string}>,
 *   ok: number,
 *   ymylPublished: number,
 *   skipped: number
 * }}
 */
export function auditWorkflow(posts) {
  const violations = [];
  let ok = 0;
  let ymylPublished = 0;
  let skipped = 0;

  for (const p of posts) {
    if (p.enabled === false) {
      skipped += 1;
      continue;
    }

    const status = p.workflowStatus ?? 'draft';

    // Posts não-published são parte normal do fluxo (draft, review_*,
    // approved, archived) — gate só dispara em published.
    if (!ENFORCED_STATUSES.has(status)) {
      skipped += 1;
      continue;
    }

    const isYmyl = YMYL_CATEGORIES.has(p.category);
    if (isYmyl) ymylPublished += 1;

    const track = Array.isArray(p.reviewTrack) ? p.reviewTrack : [];

    // Regra universal: última entry temporal não pode ser rejected
    if (track.length > 0) {
      const sorted = [...track].sort((a, b) => {
        const ta = Date.parse(a.reviewedAt ?? '');
        const tb = Date.parse(b.reviewedAt ?? '');
        if (Number.isNaN(ta) || Number.isNaN(tb)) return 0;
        return ta - tb;
      });
      const last = sorted[sorted.length - 1];
      if (last && last.decision === 'rejected') {
        violations.push({
          slug: p.slug,
          code: 'LAST_REVIEW_REJECTED',
          message: `Post "${p.title}" published com última revisão (${last.role}) rejected — bypass do pipeline`,
        });
        continue;
      }
    }

    if (isYmyl) {
      if (track.length < 2) {
        violations.push({
          slug: p.slug,
          code: 'YMYL_INSUFFICIENT_TRACK',
          message: `Post YMYL "${p.title}" (${p.category}) com reviewTrack=${track.length} (mínimo 2)`,
        });
        continue;
      }

      const hasMedico = track.some(
        (e) => e.role === 'medico' && e.decision === 'approved',
      );
      if (!hasMedico) {
        violations.push({
          slug: p.slug,
          code: 'YMYL_MISSING_MEDICO',
          message: `Post YMYL "${p.title}" sem revisão médica aprovada (role=medico, decision=approved)`,
        });
        continue;
      }

      const hasAdvogado = track.some(
        (e) => e.role === 'advogado' && e.decision === 'approved',
      );
      if (!hasAdvogado) {
        violations.push({
          slug: p.slug,
          code: 'YMYL_MISSING_ADVOGADO',
          message: `Post YMYL "${p.title}" sem revisão jurídica aprovada (role=advogado, decision=approved)`,
        });
        continue;
      }
    }

    ok += 1;
  }

  return { violations, ok, ymylPublished, skipped };
}

/**
 * Carrega mock-posts.ts via parser estático. Lê o arquivo, divide por
 * blocos de `_id`, e extrai campos relevantes — incluindo `reviewTrack`
 * (array de objetos) via parser reentrante simples.
 *
 * Limitação assumida: regex frágil a refactors profundos do mock. Tests
 * em `__tests__/audit-workflow-status.test.mjs` usam fixtures inline
 * (não dependem do parser).
 *
 * @returns {Array<object>}
 */
function loadMockPostsFromSource() {
  const file = path.join(ROOT, 'data', 'blog', 'mock-posts.ts');
  if (!existsSync(file)) {
    throw new Error(`mock-posts.ts não encontrado em ${file}`);
  }
  const source = readFileSync(file, 'utf-8');

  // Identifica posts via separador `_id:`
  const blocks = source.split(/(?=_id:\s*['"`])/g);
  const fieldRe = (key) =>
    new RegExp(`${key}:\\s*['"\`]([^'"\`]+)['"\`]`);

  const posts = [];
  for (const block of blocks) {
    const idMatch = block.match(fieldRe('_id'));
    if (!idMatch) continue;
    const titleMatch = block.match(fieldRe('title'));
    const slugMatch = block.match(fieldRe('slug'));
    const categoryMatch = block.match(fieldRe('category'));
    const enabledMatch = block.match(/enabled:\s*(true|false)/);
    const statusMatch = block.match(fieldRe('workflowStatus'));
    if (!titleMatch || !slugMatch || !categoryMatch) continue;

    // Parser de reviewTrack: extrai sub-objetos com role/decision/reviewedAt.
    // Simplificação: scan linha-a-linha dentro da seção reviewTrack: [...].
    const reviewTrack = [];
    const trackStart = block.indexOf('reviewTrack:');
    if (trackStart !== -1) {
      // Acha o array bracket-balanced após reviewTrack:
      let depth = 0;
      let started = false;
      let trackBody = '';
      for (let i = trackStart; i < block.length; i++) {
        const ch = block[i];
        if (ch === '[') {
          depth += 1;
          started = true;
        }
        if (started) trackBody += ch;
        if (ch === ']') {
          depth -= 1;
          if (depth === 0) break;
        }
      }
      // Divide em entries por `{` top-level (depth 1)
      const entryBlocks = [];
      let cur = '';
      let d = 0;
      for (const ch of trackBody) {
        if (ch === '{') {
          if (d === 0) cur = '';
          d += 1;
          cur += ch;
        } else if (ch === '}') {
          d -= 1;
          cur += ch;
          if (d === 0) entryBlocks.push(cur);
        } else if (d > 0) {
          cur += ch;
        }
      }
      for (const eb of entryBlocks) {
        const role = eb.match(fieldRe('role'));
        const decision = eb.match(fieldRe('decision'));
        const reviewedAt = eb.match(fieldRe('reviewedAt'));
        if (role && decision && reviewedAt) {
          reviewTrack.push({
            role: role[1],
            decision: decision[1],
            reviewedAt: reviewedAt[1],
          });
        }
      }
    }

    posts.push({
      _id: idMatch[1],
      title: titleMatch[1],
      slug: slugMatch[1],
      category: categoryMatch[1],
      enabled: enabledMatch ? enabledMatch[1] === 'true' : true,
      workflowStatus: statusMatch ? statusMatch[1] : 'draft',
      reviewTrack,
    });
  }
  return posts;
}

async function loadPostsFromSanity() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.warn('[audit-workflow] SANITY env ausente — fallback mock');
    return loadMockPostsFromSource();
  }
  // TODO Aria: integrar @sanity/client GROQ real para inspecionar dataset
  // production. Query: *[_type=="blogPost" && enabled==true]{ ... reviewTrack[]{ role, decision, reviewedAt } }
  console.warn('[audit-workflow] --from-sanity ainda não implementado, usando mock');
  return loadMockPostsFromSource();
}

function colorize(code) {
  return {
    red: (s) => `\x1b[31m${s}\x1b[0m`,
    green: (s) => `\x1b[32m${s}\x1b[0m`,
    yellow: (s) => `\x1b[33m${s}\x1b[0m`,
    bold: (s) => `\x1b[1m${s}\x1b[0m`,
  }[code];
}

async function main() {
  const args = process.argv.slice(2);
  const fromSanity = args.includes('--from-sanity');
  const jsonOutput = args.includes('--json');

  const posts = fromSanity
    ? await loadPostsFromSanity()
    : loadMockPostsFromSource();

  if (posts.length === 0) {
    console.error(
      '[audit-workflow] Nenhum post carregado — verifique mock ou Sanity',
    );
    process.exit(1);
  }

  const { violations, ok, ymylPublished, skipped } = auditWorkflow(posts);

  if (jsonOutput) {
    console.log(
      JSON.stringify(
        {
          totalPosts: posts.length,
          ymylPublished,
          ok,
          skipped,
          violations,
        },
        null,
        2,
      ),
    );
  } else {
    const red = colorize('red');
    const green = colorize('green');
    const yellow = colorize('yellow');
    const bold = colorize('bold');

    console.log(bold('\n═══ Workflow Status Audit (NFR23) ═══'));
    console.log(`Posts inspecionados : ${posts.length}`);
    console.log(`YMYL published      : ${ymylPublished}`);
    console.log(`Skipped (draft/etc) : ${skipped}`);
    console.log(`Pass                : ${green(String(ok))}`);
    console.log(
      `Violations          : ${
        violations.length > 0 ? red(String(violations.length)) : green('0')
      }`,
    );

    if (violations.length > 0) {
      console.log(bold('\nViolations:'));
      for (const v of violations) {
        console.log(`  ${red('✗')} [${yellow(v.code)}] ${v.slug}`);
        console.log(`     ${v.message}`);
      }
      console.log('');
    }
  }

  process.exit(violations.length === 0 ? 0 : 1);
}

if (
  import.meta.url === pathToFileURL(process.argv[1] ?? '').href ||
  process.argv[1]?.endsWith('audit-workflow-status.mjs')
) {
  main().catch((err) => {
    console.error('[audit-workflow] erro fatal:', err);
    process.exit(1);
  });
}
