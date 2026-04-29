/**
 * Title Helper — Story 3.22 (FR50)
 *
 * Constrói titles consistentes com pattern `[Tipo] Amil [ANO] — [Qualificador]`,
 * garante max 60 chars (NFR11), e centraliza o ano via env var
 * `NEXT_PUBLIC_CURRENT_YEAR` (single source of truth, renovação anual
 * é bump de env var em Vercel + redeploy).
 *
 * Decisão (PR Story 3.22):
 *   - v1: env var `NEXT_PUBLIC_CURRENT_YEAR` (immediate, build-time, zero deps)
 *   - v2 (futura, se Sanity Studio for adotado): GROQ `siteSettings.currentYear`
 *     com helper `getCurrentYearFromSanity()` que faz fallback para env.
 *   - v3 (futura): GitHub Action `yearly-bump.yml` automática 1/jan.
 *
 * Renovação anual (runbook): docs/devops/year-rollover.md
 */

const FALLBACK_YEAR = '2026';

/**
 * Resolve o ano corrente da SSOT (env var). Roda em build/runtime;
 * retorna string para uso direto em template.
 */
export function getCurrentYear(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CURRENT_YEAR;
  if (fromEnv && /^\d{4}$/.test(fromEnv)) {
    return fromEnv;
  }
  return FALLBACK_YEAR;
}

export interface BuildTitleOpts {
  /** Tipo principal — "Plano de Saúde", "Tabela", "Comparar Planos" etc. */
  tipo: string;
  /** Qualificador opcional — "PME", "MEI", "Empresarial PJ". */
  qualificador?: string;
  /** Cidade quando programmatic. */
  cidade?: string;
  /** UF quando programmatic estado. */
  uf?: string;
  /** Override do ano (default: getCurrentYear()). */
  year?: string;
  /** Limite de chars. Default 60 (NFR11). */
  maxLen?: number;
}

/**
 * Constrói o title final.
 *
 * Exemplos (year=2026):
 *   buildTitle({ tipo: 'Plano de Saúde', qualificador: 'Empresarial PJ' })
 *     → "Plano de Saúde Amil 2026 — Empresarial PJ"
 *   buildTitle({ tipo: 'Tabela', cidade: 'São Paulo' })
 *     → "Tabela Amil 2026 — São Paulo"
 *   buildTitle({ tipo: 'Comparar Planos' })
 *     → "Comparar Planos Amil 2026"
 *
 * Truncate inteligente:
 *   - Tenta cortar no qualificador inteiro (drop se total exceder)
 *   - Se ainda exceder, corta no espaço mais próximo de maxLen-1 + "…"
 */
export function buildTitle(opts: BuildTitleOpts): string {
  const year = opts.year ?? getCurrentYear();
  const maxLen = opts.maxLen ?? 60;

  const tail =
    opts.qualificador ??
    opts.cidade ??
    opts.uf ??
    undefined;

  const base = `${opts.tipo} Amil ${year}`;
  const full = tail ? `${base} — ${tail}` : base;

  if (full.length <= maxLen) {
    return full;
  }

  // Tentativa 1: drop tail
  if (base.length <= maxLen) {
    return base;
  }

  // Tentativa 2: truncate hard com elipse no espaço mais próximo
  const sliceEnd = maxLen - 1;
  const slice = full.slice(0, sliceEnd);
  const lastSpace = slice.lastIndexOf(' ');
  const cutPoint = lastSpace > maxLen * 0.5 ? lastSpace : sliceEnd;
  return `${slice.slice(0, cutPoint).trimEnd()}…`;
}

/**
 * Title pattern do site para template Metadata API.
 *
 * Uso em layout.tsx:
 *   metadata.title = { default: DEFAULT_TITLE, template: getSiteTitleTemplate() }
 *
 * Resultado: "[page title] — Plano Amil 2026 | BeneficioRH"
 */
export function getSiteTitleTemplate(): string {
  return `%s — Plano Amil ${getCurrentYear()} | BeneficioRH`;
}

/**
 * Title default da homepage.
 */
export function getDefaultSiteTitle(): string {
  return buildTitle({
    tipo: 'Plano de Saúde',
    qualificador: 'Empresarial PJ',
  }) + ' | BeneficioRH';
}
