/**
 * Unit tests para audit-workflow-status.mjs (Story 6.10 — NFR23).
 *
 * Roda com: node --test scripts/__tests__/audit-workflow-status.test.mjs
 *
 * Foco: cenários de pipeline editorial publicado/draft,
 * agregação de violations, e edge cases temporais.
 *
 * 5+ cenários canônicos:
 *   1. 3 posts: 1 published OK + 1 published broken + 1 draft → 1 violation
 *   2. Post sem workflowStatus default = 'draft' → skipped
 *   3. Posts published múltiplos brokens → todas violations contadas
 *   4. Última entry temporal: ordenação por reviewedAt
 *   5. Post YMYL com 3 entries (médico+advogado+médico) → PASS
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { auditWorkflow } from '../audit-workflow-status.mjs';

const validMedico = {
  reviewer: 'revisor-medico',
  role: 'medico',
  reviewedAt: '2026-04-08T14:00:00.000Z',
  decision: 'approved',
};
const validAdvogado = {
  reviewer: 'revisor-juridico',
  role: 'advogado',
  reviewedAt: '2026-04-09T18:00:00.000Z',
  decision: 'approved',
};

describe('auditWorkflow — cenários integrados', () => {
  it('1. 3 posts (1 OK + 1 broken + 1 draft) → 1 violation', () => {
    const posts = [
      {
        _id: 'a',
        title: 'A',
        slug: 'a',
        category: 'carencias',
        workflowStatus: 'published',
        enabled: true,
        reviewTrack: [validMedico, validAdvogado],
      },
      {
        _id: 'b',
        title: 'B',
        slug: 'b',
        category: 'cobertura',
        workflowStatus: 'published',
        enabled: true,
        reviewTrack: [validMedico], // só 1 entry: insuficiente
      },
      {
        _id: 'c',
        title: 'C',
        slug: 'c',
        category: 'cancelamento',
        workflowStatus: 'draft',
        enabled: true,
        reviewTrack: [],
      },
    ];
    const r = auditWorkflow(posts);
    assert.equal(r.violations.length, 1);
    assert.equal(r.ok, 1);
    assert.equal(r.skipped, 1);
    assert.equal(r.violations[0].slug, 'b');
  });

  it('2. Post sem workflowStatus → tratado como draft → skipped', () => {
    const posts = [
      {
        _id: 'x',
        title: 'X',
        slug: 'x',
        category: 'carencias',
        enabled: true,
        // workflowStatus omitido
        reviewTrack: [],
      },
    ];
    const r = auditWorkflow(posts);
    assert.equal(r.skipped, 1);
    assert.equal(r.violations.length, 0);
  });

  it('3. Múltiplos posts published broken → todas violations contadas', () => {
    const posts = [
      {
        _id: 'a',
        title: 'A',
        slug: 'a',
        category: 'carencias',
        workflowStatus: 'published',
        enabled: true,
        reviewTrack: [], // YMYL_INSUFFICIENT_TRACK
      },
      {
        _id: 'b',
        title: 'B',
        slug: 'b',
        category: 'cobertura',
        workflowStatus: 'published',
        enabled: true,
        reviewTrack: [validAdvogado, validAdvogado], // YMYL_MISSING_MEDICO
      },
      {
        _id: 'c',
        title: 'C',
        slug: 'c',
        category: 'ans-regulamentacao',
        workflowStatus: 'published',
        enabled: true,
        reviewTrack: [validMedico, validMedico], // YMYL_MISSING_ADVOGADO
      },
    ];
    const r = auditWorkflow(posts);
    assert.equal(r.violations.length, 3);
    const codes = r.violations.map((v) => v.code).sort();
    assert.deepEqual(codes, [
      'YMYL_INSUFFICIENT_TRACK',
      'YMYL_MISSING_ADVOGADO',
      'YMYL_MISSING_MEDICO',
    ]);
  });

  it('4. Ordenação por reviewedAt: rejected entry colocada cronologicamente último → FAIL', () => {
    const posts = [
      {
        _id: 'x',
        title: 'X',
        slug: 'x',
        category: 'carencias',
        workflowStatus: 'published',
        enabled: true,
        reviewTrack: [
          validMedico, // 2026-04-08
          validAdvogado, // 2026-04-09
          {
            reviewer: 'revisor-juridico',
            role: 'advogado',
            reviewedAt: '2026-04-15T10:00:00.000Z',
            decision: 'rejected',
          },
        ],
      },
    ];
    const r = auditWorkflow(posts);
    assert.equal(r.violations.length, 1);
    assert.equal(r.violations[0].code, 'LAST_REVIEW_REJECTED');
  });

  it('5. Post YMYL com 3 entries (medico+advogado+medico approved) → PASS', () => {
    const posts = [
      {
        _id: 'x',
        title: 'X',
        slug: 'x',
        category: 'carencias',
        workflowStatus: 'published',
        enabled: true,
        reviewTrack: [
          validMedico,
          validAdvogado,
          {
            reviewer: 'revisor-medico',
            role: 'medico',
            reviewedAt: '2026-04-12T10:00:00.000Z',
            decision: 'approved',
          },
        ],
      },
    ];
    const r = auditWorkflow(posts);
    assert.equal(r.violations.length, 0);
    assert.equal(r.ok, 1);
  });

  it('6. archived (não enforced em v1) → skipped', () => {
    const posts = [
      {
        _id: 'x',
        title: 'X',
        slug: 'x',
        category: 'carencias',
        workflowStatus: 'archived',
        enabled: true,
        reviewTrack: [],
      },
    ];
    const r = auditWorkflow(posts);
    assert.equal(r.skipped, 1);
    assert.equal(r.violations.length, 0);
  });
});

describe('auditWorkflow — agregação totais', () => {
  it('totalPosts + skipped + ok + violations.length deve fechar', () => {
    const posts = [
      {
        _id: 'a',
        title: 'A',
        slug: 'a',
        category: 'carencias',
        workflowStatus: 'published',
        enabled: true,
        reviewTrack: [validMedico, validAdvogado],
      }, // ok
      {
        _id: 'b',
        title: 'B',
        slug: 'b',
        category: 'cobertura',
        workflowStatus: 'draft',
        enabled: true,
        reviewTrack: [],
      }, // skipped
      {
        _id: 'c',
        title: 'C',
        slug: 'c',
        category: 'cancelamento',
        workflowStatus: 'published',
        enabled: true,
        reviewTrack: [validMedico], // broken
      },
    ];
    const r = auditWorkflow(posts);
    assert.equal(r.ok + r.skipped + r.violations.length, posts.length);
  });
});
