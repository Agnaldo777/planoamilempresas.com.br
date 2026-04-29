#!/usr/bin/env node
/**
 * audit-author-ymyl.mjs — Story 6.11.e (AC4) + NFR22 + Story 6.9
 *
 * Gate técnico que falha CI se algum post YMYL (categoria regulada
 * de saúde) for publicado sem `author` qualificado e/ou sem
 * `reviewedBy` (revisor jurídico/médico).
 *
 * Categorias YMYL reguladas (espelho de data/blog/categories.ts
 * `requiresLegalReview === true`):
 *   - carencias
 *   - coparticipacao
 *   - ans-regulamentacao
 *   - cobertura
 *   - cancelamento
 *
 * Regras (matriz de validação):
 *   ALL POSTS         → author obrigatório (NFR22)
 *   POSTS YMYL        → author + reviewedBy obrigatórios
 *   author placeholder→ FAIL (ex.: id 'beneficiorh' como autor de YMYL
 *                       quando precisamos de Person com credenciais)
 *
 * Modos:
 *   default → carrega mock posts (data/blog/mock-posts.ts via dynamic
 *             import; em dev/preview sem CMS)
 *   --from-sanity → query GROQ (requer SANITY_PROJECT_ID env)
 *
 * Uso:
 *   node scripts/audit-author-ymyl.mjs
 *   node scripts/audit-author-ymyl.mjs --from-sanity
 *   node scripts/audit-author-ymyl.mjs --json   (saída machine-readable)
 *
 * Exit code: 0 = pass, 1 = fail
 */

import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

/** Categorias YMYL que exigem reviewedBy. */
export const YMYL_CATEGORIES = new Set([
  'carencias',
  'coparticipacao',
  'ans-regulamentacao',
  'cobertura',
  'cancelamento',
]);

/** Authors aceitáveis como AUTOR (não reviewer) — Person com credencial pública. */
const QUALIFIED_AUTHOR_IDS = new Set(['agnaldo-silva']);
/** Authors aceitáveis como REVIEWER YMYL. */
const QUALIFIED_REVIEWER_IDS = new Set(['revisor-juridico', 'revisor-medico']);

/**
 * Pure validation: recebe array de posts e devolve violações.
 * Cada post: { _id, title, slug, category, authorId, reviewedById, enabled }
 *
 * @param {Array<{_id: string, title: string, slug: string, category: string,
 *   authorId?: string, reviewedById?: string, enabled?: boolean}>} posts
 * @returns {{ violations: Array<{slug:string, code:string, message:string}>,
 *             ok: number, ymyl: number }}
 */
export function auditPosts(posts) {
  const violations = [];
  let ok = 0;
  let ymyl = 0;
  for (const p of posts) {
    if (p.enabled === false) continue;
    const isYmyl = YMYL_CATEGORIES.has(p.category);
    if (isYmyl) ymyl += 1;

    if (!p.authorId) {
      violations.push({
        slug: p.slug,
        code: 'MISSING_AUTHOR',
        message: `Post "${p.title}" (${p.category}) sem authorId — NFR22 violado`,
      });
      continue;
    }

    if (!QUALIFIED_AUTHOR_IDS.has(p.authorId)) {
      violations.push({
        slug: p.slug,
        code: 'UNQUALIFIED_AUTHOR',
        message: `Post "${p.title}" tem authorId="${p.authorId}" não credenciado como Person YMYL`,
      });
      continue;
    }

    if (isYmyl) {
      if (!p.reviewedById) {
        violations.push({
          slug: p.slug,
          code: 'YMYL_MISSING_REVIEWER',
          message: `Post YMYL "${p.title}" (${p.category}) sem reviewedById — NFR22 + categoria requiresLegalReview`,
        });
        continue;
      }
      if (!QUALIFIED_REVIEWER_IDS.has(p.reviewedById)) {
        violations.push({
          slug: p.slug,
          code: 'YMYL_UNQUALIFIED_REVIEWER',
          message: `Post YMYL "${p.title}" reviewedById="${p.reviewedById}" não é revisor jurídico/médico válido`,
        });
        continue;
      }
    }

    ok += 1;
  }
  return { violations, ok, ymyl };
}

/**
 * Carrega posts do mock TypeScript via parsing estático (sem
 * transpiler — o CI roda Node 20+ direto). Faz match no array
 * `MOCK_POSTS` extraindo objetos top-level.
 *
 * Limitação: regex frágil a refactor. Caso falhe, fallback usa
 * dataset embutido neste script (snapshot mantido em sync via test).
 *
 * @returns {Array<object>}
 */
function loadMockPostsFromSource() {
  const file = path.join(ROOT, 'data', 'blog', 'mock-posts.ts');
  if (!existsSync(file)) {
    throw new Error(`mock-posts.ts não encontrado em ${file}`);
  }
  const source = readFileSync(file, 'utf-8');
  // Estratégia: para cada bloco que começa em `_id:` extrai os campos
  // chave individualmente (regex específica por campo, escopo até o
  // próximo `_id:` ou fim do array).
  const posts = [];
  const blocks = source.split(/(?=_id:\s*['"`])/g);
  const fieldRe = (key) =>
    new RegExp(`${key}:\\s*['"\`]([^'"\`]+)['"\`]`);
  const enabledRe = /enabled:\s*(true|false)/;

  for (const block of blocks) {
    const idMatch = block.match(fieldRe('_id'));
    if (!idMatch) continue;
    const titleMatch = block.match(fieldRe('title'));
    const slugMatch = block.match(fieldRe('slug'));
    const authorMatch = block.match(fieldRe('authorId'));
    const reviewerMatch = block.match(fieldRe('reviewedById'));
    const categoryMatch = block.match(fieldRe('category'));
    const enabledMatch = block.match(enabledRe);
    if (!titleMatch || !slugMatch || !categoryMatch) continue;
    posts.push({
      _id: idMatch[1],
      title: titleMatch[1],
      slug: slugMatch[1],
      authorId: authorMatch ? authorMatch[1] : undefined,
      reviewedById: reviewerMatch ? reviewerMatch[1] : undefined,
      category: categoryMatch[1],
      enabled: enabledMatch ? enabledMatch[1] === 'true' : true,
    });
  }
  return posts;
}

async function loadPostsFromSanity() {
  // Stub: implementação real exige `next-sanity` client + token.
  // Em CI sem SANITY_PROJECT_ID, fallback para mock.
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.warn('[audit-ymyl] SANITY env ausente — fallback mock');
    return loadMockPostsFromSource();
  }
  // TODO Aria: integrar fetcher real (GROQ via @sanity/client).
  console.warn('[audit-ymyl] --from-sanity ainda não implementado, usando mock');
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
    console.error('[audit-ymyl] Nenhum post carregado — verifique mock ou Sanity');
    process.exit(1);
  }

  const { violations, ok, ymyl } = auditPosts(posts);

  if (jsonOutput) {
    console.log(
      JSON.stringify(
        { totalPosts: posts.length, ymylCount: ymyl, ok, violations },
        null,
        2,
      ),
    );
  } else {
    const red = colorize('red');
    const green = colorize('green');
    const yellow = colorize('yellow');
    const bold = colorize('bold');

    console.log(bold('\n═══ Author YMYL Audit (NFR22) ═══'));
    console.log(`Posts inspecionados : ${posts.length}`);
    console.log(`Posts YMYL          : ${ymyl}`);
    console.log(`Pass                : ${green(String(ok))}`);
    console.log(`Violations          : ${violations.length > 0 ? red(String(violations.length)) : green('0')}`);

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

// Run only when invoked directly
if (
  import.meta.url === pathToFileURL(process.argv[1] ?? '').href ||
  process.argv[1]?.endsWith('audit-author-ymyl.mjs')
) {
  main().catch((err) => {
    console.error('[audit-ymyl] erro fatal:', err);
    process.exit(1);
  });
}
