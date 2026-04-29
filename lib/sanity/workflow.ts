/**
 * Sanity Editorial Workflow Helpers — Story 6.10 (NFR23)
 *
 * Tipos e validadores para o pipeline obrigatório de revisão humana
 * em conteúdo YMYL (Your Money or Your Life). NFR23 proíbe publicação
 * IA-only de conteúdo médico/regulatório — exige trilha auditável de
 * revisão médica + jurídica antes de `workflowStatus = published`.
 *
 * Categorias YMYL alinhadas a `data/blog/categories.ts`
 * (`requiresLegalReview === true`):
 *   - carencias
 *   - coparticipacao
 *   - ans-regulamentacao
 *   - cobertura
 *   - cancelamento
 *
 * Os helpers aqui são puros (sem I/O Sanity) para facilitar testing
 * e reuso em CI gates (`scripts/audit-workflow-status.mjs`).
 */

import type { AuthorId } from '@/data/authors';
import type { BlogCategorySlug } from '@/data/blog/categories';
import { getBlogCategory } from '@/data/blog/categories';

// ─────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────

export type WorkflowStatus =
  | 'draft'
  | 'review_tecnico'
  | 'review_juridico'
  | 'approved'
  | 'published'
  | 'archived';

export type ReviewRole =
  | 'redator'
  | 'corretor'
  | 'medico'
  | 'advogado'
  | 'po';

export type ReviewDecision = 'approved' | 'rejected' | 'request_changes';

/**
 * Entrada de revisão arquivada — espelho do schema Sanity
 * `reviewTrack[].reviewEntry`. Não-Sanity callers (mock posts, audit
 * scripts) usam este shape diretamente.
 */
export interface ReviewTrackEntry {
  /** AuthorId (data/authors.ts) — pode vir como ref expandido ou string. */
  reviewer?: AuthorId;
  role: ReviewRole;
  reviewedAt: string;
  comments?: string;
  changes?: string;
  decision: ReviewDecision;
}

/** Subset do BlogPost relevante ao gate. */
export interface WorkflowPost {
  _id: string;
  title: string;
  slug: string;
  category: BlogCategorySlug;
  workflowStatus: WorkflowStatus;
  reviewTrack?: ReviewTrackEntry[];
  enabled?: boolean;
}

// ─────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────

/**
 * Status que enforçam validação completa do pipeline. `archived`
 * historicamente já foi publicado, então também enforça.
 */
export const ENFORCED_STATUSES: ReadonlySet<WorkflowStatus> = new Set([
  'published',
]);

/** Decisão mínima aceita para considerar entry "aprovada". */
export const APPROVED_DECISION: ReviewDecision = 'approved';

// ─────────────────────────────────────────────────────────────────
// Helpers públicos
// ─────────────────────────────────────────────────────────────────

/**
 * Indica se categoria do post exige pipeline YMYL completo
 * (médico + advogado). Espelho de `BlogCategory.requiresLegalReview`.
 */
export function isYmylCategory(category: BlogCategorySlug): boolean {
  const meta = getBlogCategory(category);
  return Boolean(meta?.requiresLegalReview);
}

/**
 * Retorna a última entry do reviewTrack ordenada por `reviewedAt`.
 * Em empate temporal, mantém ordem de inserção (último item array).
 */
export function getLastReviewer(post: WorkflowPost): ReviewTrackEntry | null {
  const track = post.reviewTrack;
  if (!track || track.length === 0) return null;
  // Cópia para não mutar input
  const sorted = [...track].sort((a, b) => {
    const ta = Date.parse(a.reviewedAt);
    const tb = Date.parse(b.reviewedAt);
    if (Number.isNaN(ta) || Number.isNaN(tb)) return 0;
    return ta - tb;
  });
  return sorted[sorted.length - 1] ?? null;
}

export interface WorkflowValidationResult {
  valid: boolean;
  reasons: string[];
}

/**
 * Valida se um post está pronto para `workflowStatus = published`
 * conforme NFR23.
 *
 * Regras:
 *   1. Se `workflowStatus !== 'published'` → válido (gate só dispara
 *      em published; demais status são parte normal do fluxo)
 *   2. Se YMYL → exige ≥1 entry role=medico aprovada E ≥1 role=advogado
 *      aprovada
 *   3. Se YMYL → exige ≥2 entries no total (sanity check duplo-revisor)
 *   4. Última entry temporal NÃO pode ter decision=rejected
 *      (publicar conteúdo rejeitado = bug ou bypass)
 *   5. Não-YMYL → published não exige reviewTrack (cadência operacional)
 *
 * @returns { valid, reasons } — `reasons` lista todas violações; vazio
 *   quando válido.
 */
export function validateWorkflowComplete(
  post: WorkflowPost,
): WorkflowValidationResult {
  const reasons: string[] = [];

  // Status fora de enforcement → sempre válido (não vai a produção)
  if (!ENFORCED_STATUSES.has(post.workflowStatus)) {
    return { valid: true, reasons };
  }

  const ymyl = isYmylCategory(post.category);
  const track = post.reviewTrack ?? [];

  if (ymyl) {
    if (track.length < 2) {
      reasons.push(
        `YMYL post precisa de ≥2 entries em reviewTrack (atual: ${track.length})`,
      );
    }

    const hasMedicoApproved = track.some(
      (e) => e.role === 'medico' && e.decision === APPROVED_DECISION,
    );
    if (!hasMedicoApproved) {
      reasons.push(
        'YMYL post precisa de revisão médica aprovada (role=medico, decision=approved)',
      );
    }

    const hasAdvogadoApproved = track.some(
      (e) => e.role === 'advogado' && e.decision === APPROVED_DECISION,
    );
    if (!hasAdvogadoApproved) {
      reasons.push(
        'YMYL post precisa de revisão jurídica aprovada (role=advogado, decision=approved)',
      );
    }
  }

  // Regra universal published: última decisão não pode ser rejected
  const last = getLastReviewer(post);
  if (last && last.decision === 'rejected') {
    reasons.push(
      `Última revisão foi rejected (role=${last.role}) — não pode publicar`,
    );
  }

  return { valid: reasons.length === 0, reasons };
}
