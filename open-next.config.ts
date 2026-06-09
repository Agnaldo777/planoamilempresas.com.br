/**
 * OpenNext Cloudflare config — ADR-011.
 *
 * Strategy (go-live MVP, sem R2):
 * - Incremental cache: DEFAULT (sem R2). O site é majoritariamente SSG
 *   (`force-static` + revalidate 30d), pré-renderizado nos assets — não depende
 *   de cache persistente para o go-live. ISR on-demand regenera por request.
 * - Reintroduzir `r2IncrementalCache` quando o volume de ISR justificar
 *   (requer R2 ativo na conta + bucket `planoamilempresas-opennext-cache`).
 * - Tag cache / Queue: in-memory (default).
 *
 * Refs:
 *   - https://opennext.js.org/cloudflare/caching
 *   - docs/decisions/adr-011-deployment-platform-cloudflare.md
 */
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({});
