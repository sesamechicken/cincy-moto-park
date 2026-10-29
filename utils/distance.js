// Great-circle distance between two lat/lng points, in miles.
export function distanceInMiles(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Beyond this the exact number isn't useful to someone looking for a spot
// downtown, so we show a capped label instead of e.g. "900.0 mi".
const MAX_DISPLAY_MILES = 25;

// Turns a mile value into something a person actually reads naturally,
// e.g. "450 ft" for short walks, "0.6 mi" once it's far enough to matter.
export function formatDistance(miles) {
  if (miles == null || !Number.isFinite(miles)) return null;
  if (miles > MAX_DISPLAY_MILES) return `${MAX_DISPLAY_MILES}+ mi`;
  if (miles < 0.1) {
    const feet = Math.round(miles * 5280);
    return `${feet} ft`;
  }
  return `${miles.toFixed(1)} mi`;
}

// True when latitude/longitude are real, in-range numbers and not the 0,0
// "null island" placeholder.
export function hasValidCoordinates(spot) {
  if (!spot) return false;
  const { latitude, longitude } = spot;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return false;
  if (latitude === 0 && longitude === 0) return false;
  return true;
}

// A spot is treated as "unavailable" if it is explicitly flagged
// (`unavailable: true`, or the older `construction: true`) or has no usable
// coordinates yet.
export function isSpotUnavailable(spot) {
  if (!spot) return true;
  return Boolean(spot.unavailable || spot.construction || !hasValidCoordinates(spot));
}
