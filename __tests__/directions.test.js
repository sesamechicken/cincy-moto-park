import test from 'node:test';
import assert from 'node:assert/strict';

import { buildDirectionsUrl, providersFor } from '../utils/directions.js';

const spot = { name: 'SYCAMORE ST', latitude: 39.101526, longitude: -84.507995 };

test('buildDirectionsUrl: each provider, drive', () => {
  assert.equal(
    buildDirectionsUrl('apple', spot),
    'https://maps.apple.com/?daddr=39.101526,-84.507995&dirflg=d'
  );
  assert.equal(
    buildDirectionsUrl('google', spot),
    'https://www.google.com/maps/dir/?api=1&destination=39.101526,-84.507995&travelmode=driving'
  );
  assert.equal(
    buildDirectionsUrl('waze', spot),
    'https://waze.com/ul?ll=39.101526,-84.507995&navigate=yes'
  );
  assert.equal(
    buildDirectionsUrl('system', spot),
    'geo:39.101526,-84.507995?q=39.101526,-84.507995(SYCAMORE%20ST)'
  );
});

test('buildDirectionsUrl: walking, and Waze has no walking mode', () => {
  assert.match(buildDirectionsUrl('apple', spot, 'walk'), /dirflg=w$/);
  assert.match(buildDirectionsUrl('google', spot, 'walk'), /travelmode=walking$/);
  assert.equal(buildDirectionsUrl('waze', spot, 'walk'), null);
});

test('buildDirectionsUrl: refuses spots without real coordinates or unknown providers', () => {
  assert.equal(buildDirectionsUrl('google', { name: 'X', latitude: 0, longitude: 0 }), null);
  assert.equal(buildDirectionsUrl('google', null), null);
  assert.equal(buildDirectionsUrl('bing', spot), null);
});

test('providersFor: platform lists, Android capped at 3, no Waze for walking', () => {
  assert.deepEqual(providersFor('ios', 'drive'), ['apple', 'google', 'waze']);
  assert.deepEqual(providersFor('android', 'drive'), ['google', 'waze', 'system']);
  assert.deepEqual(providersFor('ios', 'walk'), ['apple', 'google']);
  assert.deepEqual(providersFor('android', 'walk'), ['google', 'system']);
  assert.ok(providersFor('android', 'drive').length <= 3);
});
