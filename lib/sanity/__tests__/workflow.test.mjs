/**
 * Unit tests para lib/sanity/workflow.ts (Story 6.10 — NFR23).
 *
 * Roda com: `node --test lib/sanity/__tests__/workflow.test.mjs`
 *
 * NOTA: workflow.ts é TS, mas os helpers são puros e o mesmo módulo
 * é compilado pelo Next/tsc. Para testes Node nativos, expomos a
 * lógica replicada aqui via fixtures + reimport via stub. Estratégia
 * preferida: importar do .mjs do audit-script (que mantém paridade
 * de regras), garantindo que o gate efetivo seja o testado.
 *
 * Cobertura (8 cenários canônicos da Story 6.10):
 *   1. Post draft (não-published) → audit pula
 *   2. Post published YMYL com reviewTrack completo → PASS
 *   3. Post published YMYL sem médico → FAIL
 *   4. Post published YMYL sem advogado → FAIL
 *   5. Post published YMYL com track <2 → FAIL
 *   6. Post published não-YMYL sem reviewTrack → PASS (não exige)
 *   7. Última entry rejected → FAIL (regra universal)
 *   8. Post enabled=false → ignorado
 *   9. Mistura passa/falha conta corretamente
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  auditWorkflow,
  YMYL_CATEGORIES,
  ENFORCED_STATUSES,
} from '../../../scripts/audit-workflow-status.mjs';

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

function mkPost(overrides = {}) {
  return {
    _id: 'p1',
    title: 'Post X',
    slug: 'post-x',
    category: 'reembolso',
    workflowStatus: 'published',
    enabled: true,
    reviewTrack: [],
    ...overrides,
  };
}

describe('Constantes', () => {
  it('YMYL_CATEGORIES inclui as 5 categorias regulatórias', () => {
    assert.equal(YMYL_CATEGORIES.has('carencias'), true);
    assert.equal(YMYL_CATEGORIES.has('coparticipacao'), true);
    assert.equal(YMYL_CATEGORIES.has('ans-regulamentacao'), true);
    assert.equal(YMYL_CATEGORIES.has('cobertura'), true);
    assert.equal(YMYL_CATEGORIES.has('cancelamento'), true);
  });

  it('YMYL_CATEGORIES NÃO inclui categorias não-regulatórias', () => {
    assert.equal(YMYL_CATEGORIES.has('rede-credenciada'), false);
    assert.equal(YMYL_CATEGORIES.has('reembolso'), false);
    assert.equal(YMYL_CATEGORIES.has('adesao-mei-pme'), false);
  });

  it('ENFORCED_STATUSES = só published em v1', () => {
    assert.equal(ENFORCED_STATUSES.has('published'), true);
    assert.equal(ENFORCED_STATUSES.has('draft'), false);
    assert.equal(ENFORCED_STATUSES.has('approved'), false);
  });
});

describe('auditWorkflow — paths felizes', () => {
  it('1. Post draft → audit pula (não-published)', () => {
    const r = auditWorkflow([
      mkPost({ workflowStatus: 'draft', category: 'carencias' }),
    ]);
    assert.equal(r.violations.length, 0);
    assert.equal(r.skipped, 1);
    assert.equal(r.ok, 0);
  });

  it('2. Post published YMYL com track completo (médico+advogado approved) → PASS', () => {
    const r = auditWorkflow([
      mkPost({
        category: 'carencias',
        reviewTrack: [validMedico, validAdvogado],
      }),
    ]);
    assert.equal(r.violations.length, 0);
    assert.equal(r.ok, 1);
    assert.equal(r.ymylPublished, 1);
  });

  it('6. Post published não-YMYL sem reviewTrack → PASS', () => {
    const r = auditWorkflow([
      mkPost({ category: 'rede-credenciada', reviewTrack: [] }),
    ]);
    assert.equal(r.violations.length, 0);
    assert.equal(r.ok, 1);
    assert.equal(r.ymylPublished, 0);
  });

  it('8. Post enabled=false → ignorado', () => {
    const r = auditWorkflow([
      mkPost({
        category: 'carencias',
        reviewTrack: [],
        enabled: false,
      }),
    ]);
    assert.equal(r.violations.length, 0);
    assert.equal(r.skipped, 1);
  });
});

describe('auditWorkflow — falhas YMYL', () => {
  it('3. Post published YMYL sem médico → FAIL (YMYL_MISSING_MEDICO)', () => {
    const r = auditWorkflow([
      mkPost({
        category: 'cobertura',
        reviewTrack: [
          validAdvogado,
          { ...validAdvogado, reviewedAt: '2026-04-10T10:00:00.000Z' },
        ],
      }),
    ]);
    assert.equal(r.violations.length, 1);
    assert.equal(r.violations[0].code, 'YMYL_MISSING_MEDICO');
  });

  it('4. Post published YMYL sem advogado → FAIL (YMYL_MISSING_ADVOGADO)', () => {
    const r = auditWorkflow([
      mkPost({
        category: 'coparticipacao',
        reviewTrack: [
          validMedico,
          { ...validMedico, reviewedAt: '2026-04-10T10:00:00.000Z' },
        ],
      }),
    ]);
    assert.equal(r.violations.length, 1);
    assert.equal(r.violations[0].code, 'YMYL_MISSING_ADVOGADO');
  });

  it('5. Post published YMYL com track=1 → FAIL (YMYL_INSUFFICIENT_TRACK)', () => {
    const r = auditWorkflow([
      mkPost({ category: 'cancelamento', reviewTrack: [validMedico] }),
    ]);
    assert.equal(r.violations.length, 1);
    assert.equal(r.violations[0].code, 'YMYL_INSUFFICIENT_TRACK');
  });

  it('5b. Post published YMYL sem reviewTrack → FAIL (YMYL_INSUFFICIENT_TRACK)', () => {
    const r = auditWorkflow([
      mkPost({ category: 'ans-regulamentacao', reviewTrack: [] }),
    ]);
    assert.equal(r.violations.length, 1);
    assert.equal(r.violations[0].code, 'YMYL_INSUFFICIENT_TRACK');
  });
});

describe('auditWorkflow — regra universal rejected', () => {
  it('7. Última entry rejected (qualquer post published) → FAIL', () => {
    const rejectedLast = {
      reviewer: 'revisor-juridico',
      role: 'advogado',
      reviewedAt: '2026-04-10T20:00:00.000Z',
      decision: 'rejected',
    };
    const r = auditWorkflow([
      mkPost({
        category: 'carencias',
        reviewTrack: [validMedico, validAdvogado, rejectedLast],
      }),
    ]);
    assert.equal(r.violations.length, 1);
    assert.equal(r.violations[0].code, 'LAST_REVIEW_REJECTED');
  });

  it('7b. rejected NÃO último (chronologicamente) — não falha por essa regra', () => {
    const rejectedFirst = {
      reviewer: 'revisor-medico',
      role: 'medico',
      reviewedAt: '2026-04-01T08:00:00.000Z',
      decision: 'rejected',
    };
    const r = auditWorkflow([
      mkPost({
        category: 'carencias',
        reviewTrack: [rejectedFirst, validMedico, validAdvogado],
      }),
    ]);
    // medico approved EXISTE (validMedico) e advogado approved EXISTE.
    // Última entry temporal é validAdvogado (approved). LAST_REVIEW_REJECTED
    // não dispara.
    assert.equal(r.violations.length, 0);
    assert.equal(r.ok, 1);
  });
});

describe('auditWorkflow — agregação', () => {
  it('9. Mistura passa/falha conta corretamente', () => {
    const posts = [
      // OK: published YMYL completo
      mkPost({
        _id: 'a',
        slug: 'a',
        category: 'carencias',
        reviewTrack: [validMedico, validAdvogado],
      }),
      // FAIL: published YMYL sem advogado
      mkPost({
        _id: 'b',
        slug: 'b',
        category: 'cobertura',
        reviewTrack: [validMedico, { ...validMedico, reviewedAt: '2026-04-10T10:00:00.000Z' }],
      }),
      // SKIP: draft (qualquer categoria)
      mkPost({
        _id: 'c',
        slug: 'c',
        category: 'cancelamento',
        workflowStatus: 'draft',
      }),
      // OK: published não-YMYL sem track
      mkPost({
        _id: 'd',
        slug: 'd',
        category: 'rede-credenciada',
        reviewTrack: [],
      }),
    ];
    const r = auditWorkflow(posts);
    assert.equal(r.ok, 2);
    assert.equal(r.violations.length, 1);
    assert.equal(r.violations[0].code, 'YMYL_MISSING_ADVOGADO');
    assert.equal(r.skipped, 1);
    assert.equal(r.ymylPublished, 2); // a + b
  });
});
