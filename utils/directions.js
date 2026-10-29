import { hasValidCoordinates } from './distance.js';

// Pure helpers that build "open in a maps app" links. Nothing here touches
// React Native, so it can be unit-tested with plain Node.
//
// We hand navigation off to the rider's own maps app rather than building
// turn-by-turn into this app. See SPEC.md for the reasoning.

export const PROVIDER_LABELS = {
  apple: 'Apple Maps',
  google: 'Google Maps',
  waze: 'Waze',
  system: 'Other maps app',
};

// Waze only does driving. `system` is an Android `geo:` link that lets the OS
// pick or offer a maps app (it shows the spot rather than starting a route).
const PROVIDER_MODES = {
  apple: ['drive', 'walk'],
  google: ['drive', 'walk'],
  waze: ['drive'],
  system: ['drive', 'walk'],
};

// Which providers to offer on a platform. Android's Alert allows at most
// three buttons, so the Android lists never exceed three.
const PLATFORM_PROVIDERS = {
  ios: ['apple', 'google', 'waze'],
  android: ['google', 'waze', 'system'],
};

export function providersFor(platform, mode = 'drive') {
  const list = PLATFORM_PROVIDERS[platform] || PLATFORM_PROVIDERS.android;
  return list.filter((p) => PROVIDER_MODES[p].includes(mode));
}

// Returns a URL string, or null if the spot has no usable coordinates or the
// provider can't do that mode.
export function buildDirectionsUrl(provider, spot, mode = 'drive') {
  if (!hasValidCoordinates(spot)) return null;
  if (!PROVIDER_MODES[provider] || !PROVIDER_MODES[provider].includes(mode)) return null;

  const { latitude: lat, longitude: lng, name } = spot;
  const walking = mode === 'walk';

  switch (provider) {
    case 'apple':
      return `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=${walking ? 'w' : 'd'}`;
    case 'google':
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${
        walking ? 'walking' : 'driving'
      }`;
    case 'waze':
      return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    case 'system':
      return `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(name || 'Parking spot')})`;
    default:
      return null;
  }
}
