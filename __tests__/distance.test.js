import test from 'node:test';
import assert from 'node:assert/strict';

import {
  distanceInMiles,
  formatDistance,
  hasValidCoordinates,
  isSpotUnavailable,
} from '../utils/distance.js';

test('distanceInMiles: same point is 0', () => {
  assert.equal(distanceInMiles(39.1, -84.5, 39.1, -84.5), 0);
});

test('distanceInMiles: Cincinnati to Columbus is roughly 100 miles', () => {
  const miles = distanceInMiles(39.1031, -84.512, 39.9612, -82.9988);
  assert.ok(miles > 95 && miles < 110, `got ${miles}`);
});

test('formatDistance', () => {
  assert.equal(formatDistance(null), null);
  assert.equal(formatDistance(NaN), null);
  assert.equal(formatDistance(0.05), '264 ft');
  assert.equal(formatDistance(0.6), '0.6 mi');
  assert.equal(formatDistance(900), '25+ mi');
});

test('hasValidCoordinates', () => {
  assert.equal(hasValidCoordinates({ latitude: 39.1, longitude: -84.5 }), true);
  assert.equal(hasValidCoordinates({ latitude: 0, longitude: 0 }), false);
  assert.equal(hasValidCoordinates({ latitude: 'x', longitude: -84.5 }), false);
  assert.equal(hasValidCoordinates({ latitude: 95, longitude: 10 }), false);
  assert.equal(hasValidCoordinates(null), false);
});

test('isSpotUnavailable', () => {
  const ok = { latitude: 39.1, longitude: -84.5 };
  assert.equal(isSpotUnavailable(ok), false);
  assert.equal(isSpotUnavailable({ ...ok, unavailable: true }), true);
  assert.equal(isSpotUnavailable({ ...ok, construction: true }), true);
  assert.equal(isSpotUnavailable({ latitude: 0, longitude: 0 }), true);
  assert.equal(isSpotUnavailable(undefined), true);
});
