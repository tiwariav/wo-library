/** Great-circle (haversine) distance helpers. */

const EARTH_RADIUS_M = 6_371_000;
const HALF_CIRCLE_DEG = 180;
const FULL_CIRCLE_DEG = 360;
const DEG_TO_RAD = Math.PI / HALF_CIRCLE_DEG;

export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Great-circle distance in metres between two WGS84 points. */
export function metresBetween(a: GeoPoint, b: GeoPoint): number {
  const dLat = (b.lat - a.lat) * DEG_TO_RAD;
  const dLng = (b.lng - a.lng) * DEG_TO_RAD;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * DEG_TO_RAD) *
      Math.cos(b.lat * DEG_TO_RAD) *
      Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Alias kept for call sites that prefer an explicit "points" name. */
export function metresBetweenPoints(a: GeoPoint, b: GeoPoint): number {
  return metresBetween(a, b);
}

/**
 * Initial bearing from `a` to `b` in degrees `[0, 360)`.
 */
export function bearingDegrees(a: GeoPoint, b: GeoPoint): number {
  const φ1 = a.lat * DEG_TO_RAD;
  const φ2 = b.lat * DEG_TO_RAD;
  const Δλ = (b.lng - a.lng) * DEG_TO_RAD;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return ((θ * HALF_CIRCLE_DEG) / Math.PI + FULL_CIRCLE_DEG) % FULL_CIRCLE_DEG;
}
