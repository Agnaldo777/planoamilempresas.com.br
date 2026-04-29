/**
 * Unit tests para audit-author-ymyl.mjs (Story 6.11.e — AC4, AC8).
 *
 * Roda com: node --test scripts/__tests__/audit-author-ymyl.test.mjs
 *
 * Cobre matriz NFR22:
 *   1. Post não-YMYL com author válido → ok
 *   2. Post não-YMYL sem reviewedBy → ok (não exigido)
 *   3. Post YMYL sem reviewedBy → fail
 *   4. Post YMYL com reviewer não credenciado → fail
 *   5. Post sem author → fail
 *   6. Post com authorId organização (beneficiorh) em YMYL → fail
 *      (precisa Person com SUSEP/CRM/OAB)
 *   7. Post enabled=false → ignorado
 *   8. Post YMYL completo → ok
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { auditPosts, YMYL_CATEGORIES } from '../audit-author-ymyl.mjs';

const validAuthor = 'agnaldo-silva';
const validReviewer = 'revisor-juridico';

function mkPost(overrides = {}) {
  return {
    _id: 'p1',
    title: 'Post X',
    slug: 'post-x',
    category: 'reembolso',
    authorId: validAuthor,
    enabled: true,
    ...overrides,
  };
}

describe('YMYL_CATEGORIES', () => {
  it('inclui carencias, coparticipacao, ans-regulamentacao, cobertura, cancelamento', () => {
    assert.equal(YMYL_CATEGORIES.has('carencias'), true);
    assert.equal(YMYL_CATEGORIES.has('coparticipacao'), true);
    assert.equal(YMYL_CATEGORIES.has('ans-regulamentacao'), true);
    assert.equal(YMYL_CATEGORIES.has('cobertura'), true);
    assert.equal(YMYL_CATEGORIES.has('cancelamento'), true);
  });
  it('NÃO inclui categorias não-YMYL (rede-credenciada, reembolso, adesao-mei-pme)', () => {
    assert.equal(YMYL_CATEGORIES.has('rede-credenciada'), false);
    assert.equal(YMYL_CATEGORIES.has('reembolso'), false);
    assert.equal(YMYL_CATEGORIES.has('adesao-mei-pme'), false);
  });
});

describe('auditPosts — paths felizes', () => {
  it('post não-YMYL com author válido (sem reviewer) → ok', () => {
    const r = auditPosts([mkPost({ category: 'reembolso' })]);
    assert.equal(r.violations.length, 0);
    assert.equal(r.ok, 1);
    assert.equal(r.ymyl, 0);
  });

  it('post YMYL completo (author + reviewer) → ok', () => {
    const r = auditPosts([
      mkPost({
        category: 'carencias',
        reviewedById: validReviewer,
      }),
    ]);
    assert.equal(r.violations.length, 0);
    assert.equal(r.ok, 1);
    assert.equal(r.ymyl, 1);
  });

  it('post enabled=false é ignorado', () => {
    const r = auditPosts([
      mkPost({ category: 'carencias', enabled: false, authorId: undefined }),
    ]);
    assert.equal(r.violations.length, 0);
    assert.equal(r.ok, 0);
  });
});

describe('auditPosts — falhas YMYL', () => {
  it('post YMYL sem reviewedBy → fail (YMYL_MISSING_REVIEWER)', () => {
    const r = auditPosts([mkPost({ category: 'cobertura' })]);
    assert.equal(r.violations.length, 1);
    assert.equal(r.violations[0].code, 'YMYL_MISSING_REVIEWER');
  });

  it('post YMYL com reviewer não credenciado → fail (YMYL_UNQUALIFIED_REVIEWER)', () => {
    const r = auditPosts([
      mkPost({ category: 'coparticipacao', reviewedById: 'beneficiorh' }),
    ]);
    assert.equal(r.violations.length, 1);
    assert.equal(r.violations[0].code, 'YMYL_UNQUALIFIED_REVIEWER');
  });

  it('post YMYL com author = organização → fail (UNQUALIFIED_AUTHOR)', () => {
    const r = auditPosts([
      mkPost({
        category: 'cancelamento',
        authorId: 'beneficiorh',
        reviewedById: validReviewer,
      }),
    ]);
    assert.equal(r.violations.length, 1);
    assert.equal(r.violations[0].code, 'UNQUALIFIED_AUTHOR');
  });

  it('post sem author → fail (MISSING_AUTHOR)', () => {
    const r = auditPosts([mkPost({ authorId: undefined })]);
    assert.equal(r.violations.length, 1);
    assert.equal(r.violations[0].code, 'MISSING_AUTHOR');
  });
});

describe('auditPosts — agregação', () => {
  it('mistura passa/falha conta corretamente', () => {
    const r = auditPosts([
      mkPost({ _id: 'a', slug: 'a', category: 'reembolso' }),
      mkPost({
        _id: 'b',
        slug: 'b',
        category: 'carencias',
        reviewedById: validReviewer,
      }),
      mkPost({ _id: 'c', slug: 'c', category: 'cobertura' }),
      mkPost({
        _id: 'd',
        slug: 'd',
        category: 'ans-regulamentacao',
        authorId: undefined,
      }),
    ]);
    assert.equal(r.ok, 2);
    assert.equal(r.violations.length, 2);
    assert.equal(r.ymyl, 3); // b, c, d
    const codes = r.violations.map((v) => v.code).sort();
    assert.deepEqual(codes, ['MISSING_AUTHOR', 'YMYL_MISSING_REVIEWER']);
  });
});
