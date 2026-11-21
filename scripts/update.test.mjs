import { test } from 'node:test';
import assert from 'node:assert/strict';
import { merge } from './update.mjs';

const r = (version, date) => ({ version, tag: 'v' + version, date, url: 'u', major: false, breaking: false });
test('merge keeps versions that dropped out of the upstream window and tools removed upstream', () => {
  const prev = { tools: [{ slug: 'a', releases: [r('1.0.0', '2026-01-01'), r('1.1.0', '2026-02-01')] }, { slug: 'z', releases: [r('9', '2026-01-01')] }] };
  const next = { generated: 'g', page: 'p', tools: [{ slug: 'a', releases: [r('1.2.0', '2026-03-01'), r('1.1.0', '2026-02-01')] }] };
  const m = merge(prev, next);
  assert.deepEqual(m.tools.map((t) => t.slug), ['a', 'z']);
  assert.deepEqual(m.tools[0].releases.map((x) => x.version), ['1.2.0', '1.1.0', '1.0.0']);
});
