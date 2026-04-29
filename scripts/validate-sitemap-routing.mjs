#!/usr/bin/env node
/**
 * validate-sitemap-routing.mjs — Story 1.9 (NFR26)
 *
 * Valida bidirectional consistency entre `app/sitemap.ts` e routes
 * descobertas em `app/**\/page.tsx` (Next.js App Router).
 *
 * Anti-padrão alvo (`amilsaudebr.com.br`): sitemap declara URLs que
 * não correspondem a routes implementadas, ou routes indexáveis sem
 * entry no sitemap → drift silencioso de SEO.
 *
 * Estratégia (sem rodar `next build` — hermetic):
 * 1. Lista A: importa sitemap default export (tsx) via tsx-runner
 *    ou parse heurístico → URLs declaradas
 * 2. Lista B: glob `app/**\/page.{tsx,ts,jsx,js}` → routes
 *    - Resolve route groups `(marketing)/` (removidos do path)
 *    - Resolve dynamic segments `[slug]` via `generateStaticParams`
 *      lookup heurístico (ou skip com warning se não detectável)
 *    - Exclui paths em `noindex` (metadata.robots.index = false)
 * 3. Diff bidirectional → exit 1 em divergência
 *
 * Limitações documentadas:
 * - generateStaticParams() runtime requer execução TS — fallback:
 *   trata path com `[slug]` como cobertura genérica do prefixo no
 *   sitemap. Para validação completa, use `next build` mode.
 *
 * Adapter pattern: `loadSitemapUrls()` é o ponto de extensão para
 * migrar a `next-sitemap` ou outro fonte (AC14).
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const COLOR = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

/**
 * Carrega config de exclusões.
 */
async function loadConfig() {
  const configPath = path.join(ROOT, 'scripts', 'sitemap-routing.config.json');
  if (!existsSync(configPath)) {
    return {
      excludeFromSitemap: [],
      excludeFromRoutingCheck: [],
      noindexRoutes: [],
    };
  }
  const raw = await readFile(configPath, 'utf8');
  return JSON.parse(raw);
}

/**
 * Adapter: carrega URLs declaradas no sitemap.
 * Implementação atual usa parse heurístico do source (sem build).
 * Para precisão completa, use modo `--from-build` (lê .next manifest).
 */
export async function loadSitemapUrls(opts = {}) {
  const sitemapPath = path.join(ROOT, 'app', 'sitemap.ts');
  if (!existsSync(sitemapPath)) {
    throw new Error(`sitemap não encontrado em ${sitemapPath}`);
  }
  const source = await readFile(sitemapPath, 'utf8');

  // Extrai URLs literais via regex sobre `${BASE_URL}/...` e BASE_URL puro.
  const urls = new Set();
  // Match url: `${BASE_URL}/path` SEM interpolações adicionais (literal).
  const templateRegex = /url:\s*`\$\{BASE_URL\}([^`]*)`/g;
  let match;
  while ((match = templateRegex.exec(source)) !== null) {
    const captured = match[1];
    // Skip se houver outra interpolação `${...}` — esses são tratados
    // pelo dynamic template loop abaixo.
    if (captured.includes('${')) continue;
    const path = captured || '/';
    urls.add(normalizePath(path));
  }
  // Match `url: BASE_URL,` (homepage)
  if (/url:\s*BASE_URL\b/.test(source)) {
    urls.add('/');
  }

  // Detecta loops por slugs literais (ex.: planoSlugs array).
  const slugArrayRegex = /const\s+(\w+Slugs)\s*=\s*\[([^\]]+)\]/g;
  const arrayMap = new Map();
  while ((match = slugArrayRegex.exec(source)) !== null) {
    const items = [...match[2].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    arrayMap.set(match[1], items);
  }
  // Para cada array conhecido, busca uso em template `${BASE_URL}/.../${slug}`.
  const dynTemplateRegex =
    /url:\s*`\$\{BASE_URL\}([^`]*)\$\{(\w+)\}([^`]*)`/g;
  while ((match = dynTemplateRegex.exec(source)) !== null) {
    const [, prefix, _varName, suffix] = match;
    // Se varName mapeado a array, expande; senão preserva placeholder genérico.
    const sourceArrayMatch = source.match(
      new RegExp(`(\\w+Slugs)\\.map\\(\\(\\s*${_varName}\\s*\\)`),
    );
    const arrayName = sourceArrayMatch?.[1];
    if (arrayName && arrayMap.has(arrayName)) {
      for (const slug of arrayMap.get(arrayName)) {
        urls.add(normalizePath(`${prefix}${slug}${suffix}`));
      }
    }
  }

  // Detecta `Object.values(authors).filter(...).map(... a.url)` ou similar.
  // Para fins desta v1, marca prefixos dinâmicos como genérico (a v2 usa AST).
  if (
    /Object\.values\(authors\)/.test(source) &&
    /a\.url\.startsWith\('\/autores\/'\)/.test(source)
  ) {
    // Carrega data/authors.ts e expande URLs /autores/.
    const authorIds = await loadAuthorIds();
    for (const id of authorIds) {
      urls.add(normalizePath(`/autores/${id}`));
    }
  }

  if (opts.verbose) {
    console.log(COLOR.cyan(`[sitemap] ${urls.size} URLs extraídas`));
  }

  return urls;
}

async function loadAuthorIds() {
  const dataPath = path.join(ROOT, 'data', 'authors.ts');
  if (!existsSync(dataPath)) return [];
  const source = await readFile(dataPath, 'utf8');
  // Match `'id-slug': {` no objeto authors.
  const ids = new Set();
  const regex = /'([a-z0-9-]+)':\s*\{/g;
  let m;
  while ((m = regex.exec(source)) !== null) {
    ids.add(m[1]);
  }
  // Filtra IDs que tem url começando com /autores/ (heurística).
  const filtered = [];
  for (const id of ids) {
    const block = source.slice(source.indexOf(`'${id}':`));
    const urlMatch = block.match(/url:\s*'([^']+)'/);
    if (urlMatch && urlMatch[1].startsWith('/autores/')) {
      filtered.push(id);
    }
  }
  return filtered;
}

function normalizePath(p) {
  if (!p) return '/';
  let out = p.startsWith('/') ? p : `/${p}`;
  // Remove trailing slash exceto raiz.
  if (out.length > 1 && out.endsWith('/')) out = out.slice(0, -1);
  return out;
}

/**
 * Glob `app/**\/page.{tsx,ts,jsx,js}` e converte para route paths.
 */
export async function discoverRoutes(opts = {}) {
  const appDir = path.join(ROOT, 'app');
  if (!existsSync(appDir)) {
    throw new Error(`app/ não encontrado em ${appDir}`);
  }

  const routes = new Set();
  const noindexRoutes = new Set();
  const dynamicRoutes = new Set();

  for await (const file of glob('app/**/page.{tsx,ts,jsx,js}', { cwd: ROOT })) {
    const fullPath = path.join(ROOT, file);
    const route = filePathToRoute(file);

    if (route === null) continue; // arquivo em _internal ou inválido

    // Detecta noindex via parse simples.
    const source = await readFile(fullPath, 'utf8');
    if (isNoindexPage(source)) {
      noindexRoutes.add(route);
      continue;
    }

    // Dynamic segment? Expande via generateStaticParams se possível.
    if (route.includes('[')) {
      const expanded = await tryExpandDynamic(file, route, source);
      if (expanded.length > 0) {
        for (const r of expanded) routes.add(r);
      } else {
        // Fallback: marca como dinâmico genérico.
        dynamicRoutes.add(route);
      }
      continue;
    }

    routes.add(route);
  }

  if (opts.verbose) {
    console.log(
      COLOR.cyan(
        `[routes] ${routes.size} concretas, ${dynamicRoutes.size} dinâmicas, ${noindexRoutes.size} noindex`,
      ),
    );
  }

  return { routes, noindexRoutes, dynamicRoutes };
}

/**
 * Converte file path Next.js → route path.
 * - Remove `app/` prefix
 * - Remove `(group)/` segments (route groups)
 * - Remove `/page.tsx` suffix
 * - Mantém `[slug]` em dinâmicas
 */
function filePathToRoute(filePath) {
  let route = filePath
    .replace(/\\/g, '/')
    .replace(/^app\//, '')
    .replace(/(?:^|\/)page\.(tsx|ts|jsx|js)$/, '');

  // Remove route groups (parentheses): `(group)/`, `/(group)`, ou `(group)` solo.
  route = route
    .replace(/\([^)]+\)\//g, '')
    .replace(/\/\([^)]+\)/g, '')
    .replace(/^\([^)]+\)$/g, '');

  // Edge case: root.
  if (route === '' || route === 'page') return '/';

  // API routes ficam fora.
  if (route.startsWith('api/') || route === 'api') return null;
  // Studio Sanity.
  if (route.startsWith('studio')) return null;

  return normalizePath(`/${route}`);
}

function isNoindexPage(source) {
  // Padrões: `robots: { index: false }`, `noindex: true`,
  // `<meta name="robots" content="noindex">`.
  if (/robots\s*:\s*\{\s*index\s*:\s*false/.test(source)) return true;
  if (/noindex\s*:\s*true/.test(source)) return true;
  if (/content=["']noindex["']/.test(source)) return true;
  return false;
}

/**
 * Expansão heurística de generateStaticParams.
 * Para v1: detecta arrays literais de slugs no mesmo arquivo OU import
 * direto de `data/authors.ts`. Casos complexos (Sanity query) retornam
 * lista vazia → fallback para "rota dinâmica genérica".
 */
async function tryExpandDynamic(filePath, route, source) {
  const expanded = [];

  // Padrão: `return [...].map((id) => ({ slug: id }))` com array literal
  // declarado in-file ou via import de catálogo conhecido.
  const segmentRegex = /\[([^\]]+)\]/g;
  const segments = [...route.matchAll(segmentRegex)].map((m) => m[1]);
  if (segments.length === 0) return expanded;

  // Caso 1: /autores/[slug] importa authors.
  if (
    /from\s+['"]@\/data\/authors['"]/.test(source) &&
    /Object\.keys\(authors\)/.test(source)
  ) {
    const ids = await loadAuthorIds();
    for (const id of ids) {
      expanded.push(normalizePath(route.replace(/\[[^\]]+\]/, id)));
    }
    return expanded;
  }

  // Sem detecção: retorna vazio (fallback genérico).
  return expanded;
}

/**
 * Compute set difference: itens em `a` ausentes em `b`.
 */
function setDifference(a, b) {
  const out = [];
  for (const item of a) {
    if (!b.has(item)) out.push(item);
  }
  return out.sort();
}

/**
 * Aplica config: remove paths excluídos.
 */
function applyExclusions(set, exclusions) {
  for (const ex of exclusions) {
    const norm = normalizePath(ex);
    set.delete(norm);
    // Remove paths sob prefixo (ex.: /api remove /api/...).
    for (const item of set) {
      if (item.startsWith(`${norm}/`)) set.delete(item);
    }
  }
}

/**
 * Gera relatório markdown de divergências (para PR comment).
 */
function formatReport(missingInSitemap, missingInRoutes, dynamicRoutes) {
  const lines = [];
  lines.push('## Sitemap × Routing Validation Report\n');

  if (missingInSitemap.length === 0 && missingInRoutes.length === 0) {
    lines.push(COLOR.green('✓ Consistent — sitemap e routing alinhados.'));
    return lines.join('\n');
  }

  if (missingInRoutes.length > 0) {
    lines.push(COLOR.red(`### ${missingInRoutes.length} URL(s) no sitemap sem rota correspondente`));
    lines.push('');
    for (const url of missingInRoutes) {
      lines.push(`- \`${url}\``);
    }
    lines.push('');
    lines.push(
      COLOR.yellow(
        '> Sugestão: rota provavelmente removida em refactor — remover do sitemap OU criar redirect 301.',
      ),
    );
    lines.push('');
  }

  if (missingInSitemap.length > 0) {
    lines.push(COLOR.red(`### ${missingInSitemap.length} rota(s) indexável(eis) sem entry no sitemap`));
    lines.push('');
    for (const url of missingInSitemap) {
      lines.push(`- \`${url}\``);
    }
    lines.push('');
    lines.push(
      COLOR.yellow(
        '> Sugestão: adicionar em `app/sitemap.ts` OU marcar como noindex se intencional (e atualizar `scripts/sitemap-routing.config.json`).',
      ),
    );
    lines.push('');
  }

  if (dynamicRoutes.length > 0) {
    lines.push(COLOR.cyan(`### ${dynamicRoutes.length} rota(s) dinâmica(s) não-expandida(s) (informativo)`));
    for (const url of dynamicRoutes) {
      lines.push(`- \`${url}\` (verificar generateStaticParams alinhado ao sitemap)`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Entrypoint principal.
 */
export async function main(opts = {}) {
  const verbose = opts.verbose ?? process.argv.includes('--verbose');
  const config = await loadConfig();

  const sitemapUrls = await loadSitemapUrls({ verbose });
  const { routes, dynamicRoutes } = await discoverRoutes({ verbose });

  // Aplica exclusões config-driven.
  applyExclusions(sitemapUrls, config.excludeFromSitemap);
  applyExclusions(routes, config.excludeFromSitemap);
  applyExclusions(routes, config.excludeFromRoutingCheck);
  for (const noindex of config.noindexRoutes) {
    routes.delete(normalizePath(noindex));
  }

  const missingInSitemap = setDifference(routes, sitemapUrls);
  const missingInRoutesRaw = setDifference(sitemapUrls, routes);

  // `excludeFromRoutingCheck`: URLs cobertas por generateStaticParams ou
  // assertadas como válidas externamente — não devem ser reportadas como
  // "sitemap sem rota" mesmo que o parser estático não detecte.
  const excludedSet = new Set(config.excludeFromRoutingCheck.map(normalizePath));
  const missingInRoutes = missingInRoutesRaw.filter((url) => !excludedSet.has(url));

  const report = formatReport(
    missingInSitemap,
    missingInRoutes,
    [...dynamicRoutes],
  );

  console.log(report);

  const failed = missingInSitemap.length > 0 || missingInRoutes.length > 0;
  return {
    failed,
    missingInSitemap,
    missingInRoutes,
    dynamicRoutes: [...dynamicRoutes],
    sitemapUrls: [...sitemapUrls],
    routes: [...routes],
  };
}

// CLI execution.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .then((result) => {
      process.exit(result.failed ? 1 : 0);
    })
    .catch((err) => {
      console.error(COLOR.red(`✗ Erro inesperado: ${err.message}`));
      console.error(err.stack);
      process.exit(2);
    });
}

// Exports for testing.
export {
  filePathToRoute,
  isNoindexPage,
  setDifference,
  applyExclusions,
  normalizePath,
  formatReport,
};
