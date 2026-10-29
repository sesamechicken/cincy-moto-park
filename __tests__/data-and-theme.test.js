import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { colors } from '../theme.js';
import { hasValidCoordinates, isSpotUnavailable } from '../utils/distance.js';

const data = JSON.parse(readFileSync(new URL('../assets/data.json', import.meta.url), 'utf8'));

test('spot data: unique ids, required fields, valid coords unless unavailable', () => {
  const ids = data.spots.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate ids');
  for (const s of data.spots) {
    assert.ok(s.id && s.name, `spot missing id/name: ${JSON.stringify(s)}`);
    assert.equal(typeof s.parkOnSidewalk, 'boolean', s.id);
    assert.equal(typeof s.policeBlock, 'boolean', s.id);
    if (!s.unavailable) {
      assert.ok(hasValidCoordinates(s), `${s.id} has bad coordinates`);
    }
    assert.equal(isSpotUnavailable(s), !hasValidCoordinates(s) || Boolean(s.unavailable));
  }
});

// WCAG relative luminance / contrast
function lum(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test('theme: text/background pairs meet WCAG AA (4.5:1)', () => {
  const pairs = [
    ['textOnPrimary', 'accent'],
    ['textOnPrimary', 'success'],
    ['textOnPrimary', 'disabled'],
    ['textOnPrimary', 'primary'],
    ['primaryLight', 'primary'],
    ['success', 'successBg'],
    ['warning', 'warningBg'],
    ['danger', 'dangerBg'],
    ['textMuted', 'disabledBg'],
    ['textSecondary', 'surface'],
    ['textPrimary', 'surface'],
    ['primary', 'surface'],
  ];
  for (const [fg, bg] of pairs) {
    const ratio = contrast(colors[fg], colors[bg]);
    assert.ok(ratio >= 4.5, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
  }
});
