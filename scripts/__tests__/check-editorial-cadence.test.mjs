/**
 * Unit tests para check-editorial-cadence.mjs (Story 6.11.e — AC2, AC8).
 *
 * Cobre:
 *   - computeSeverity: ok / warning / critical / no-data
 *   - postsInWindow: contagem em janela
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSeverity,
  postsInWindow,
} from '../check-editorial-cadence.mjs';

describe('computeSeverity', () => {
  const now = new Date('2026-04-30T12:00:00Z');

  it('< 14 dias → ok', () => {
    const last = new Date('2026-04-25T00:00:00Z');
    const r = computeSeverity(now, last, 14, 30);
    assert.equal(r.severity, 'ok');
    assert.equal(r.daysSince, 5);
  });

  it('exatamente 14 dias → warning', () => {
    const last = new Date('2026-04-16T12:00:00Z');
    const r = computeSeverity(now, last, 14, 30);
    assert.equal(r.severity, 'warning');
    assert.equal(r.daysSince, 14);
  });

  it('20 dias → warning', () => {
    const last = new Date('2026-04-10T12:00:00Z');
    const r = computeSeverity(now, last, 14, 30);
    assert.equal(r.severity, 'warning');
  });

  it('30 dias → critical', () => {
    const last = new Date('2026-03-31T12:00:00Z');
    const r = computeSeverity(now, last, 14, 30);
    assert.equal(r.severity, 'critical');
  });

  it('45 dias → critical', () => {
    const last = new Date('2026-03-16T00:00:00Z');
    const r = computeSeverity(now, last, 14, 30);
    assert.equal(r.severity, 'critical');
  });

  it('null → no-data', () => {
    const r = computeSeverity(now, null, 14, 30);
    assert.equal(r.severity, 'no-data');
    assert.equal(r.daysSince, null);
  });
});

describe('postsInWindow', () => {
  const now = new Date('2026-04-30T12:00:00Z');
  const posts = [
    { publishedAt: '2026-04-25T00:00:00Z' }, // 5 dias
    { publishedAt: '2026-04-15T00:00:00Z' }, // 15 dias
    { publishedAt: '2026-04-01T00:00:00Z' }, // 29 dias
    { publishedAt: '2026-03-15T00:00:00Z' }, // 46 dias
  ];

  it('janela 14d → 1 post', () => {
    assert.equal(postsInWindow(posts, now, 14), 1);
  });

  it('janela 30d → 3 posts', () => {
    assert.equal(postsInWindow(posts, now, 30), 3);
  });

  it('janela 60d → todos os 4 posts', () => {
    assert.equal(postsInWindow(posts, now, 60), 4);
  });

  it('array vazio → 0', () => {
    assert.equal(postsInWindow([], now, 30), 0);
  });
});
