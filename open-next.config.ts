/**
 * OpenNext Cloudflare config — ADR-011.
 *
 * Strategy:
 * - Incremental cache via R2 bucket (`NEXT_INC_CACHE_R2_BUCKET`).
 * - Tag cache: in-memory (default) — adequado para MVP. Migrar para Durable
 *   Objects (`do-tag-cache`) quando volume de revalidação on-demand crescer.
 * - Queue: in-memory (default) — webhooks Sanity revalidam síncrono via
 *   `app/api/revalidate/route.ts`. Não há filas pesadas no MVP.
 *
 * Refs:
 *   - https://opennext.js.org/cloudflare/caching
 *   - docs/decisions/adr-011-deployment-platform-cloudflare.md (Aria, em escrita)
 */
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
