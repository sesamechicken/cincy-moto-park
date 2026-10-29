import test from 'node:test';
import assert from 'node:assert/strict';

import { formatElapsed } from '../utils/time.js';

const MIN = 60000;

test('formatElapsed', () => {
  assert.equal(formatElapsed(-5000), '0 min'); // clock skew never goes negative
  assert.equal(formatElapsed(5 * MIN), '5 min');
  assert.equal(formatElapsed(130 * MIN), '2 hr 10 min');
  assert.equal(formatElapsed((24 * 60 + 3 * 60) * MIN), '1 d 3 hr');
});
