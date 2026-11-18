/* eslint-disable max-statements -- encode/decode loops match the published algorithm */

/**
 * Encoded polyline (precision 5), as used by common map APIs.
 * @see https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */

export interface LatLng {
  lat: number;
  lng: number;
}

const PRECISION = 1e5;
const ASCII_OFFSET = 63;
const CHUNK_MASK = 0x1f;
const CONTINUATION = 0x20;
const SHIFT = 5;

export function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  const nextDelta = (): number => {
    let result = 0;
    let shift = 0;
    let byte: number;
    do {
      byte = (encoded.codePointAt(index) ?? 0) - ASCII_OFFSET;
      index += 1;
      result |= (byte & CHUNK_MASK) << shift;
      shift += SHIFT;
    } while (byte >= CONTINUATION && index < encoded.length);
    return result & 1 ? ~(result >> 1) : result >> 1;
  };

  while (index < encoded.length) {
    lat += nextDelta();
    lng += nextDelta();
    points.push({ lat: lat / PRECISION, lng: lng / PRECISION });
  }
  return points;
}

function encodeSignedValue(value: number): string {
  let remaining = value < 0 ? ~(value << 1) : value << 1;
  let out = "";
  while (remaining >= CONTINUATION) {
    out += String.fromCodePoint(
      (CONTINUATION | (remaining & CHUNK_MASK)) + ASCII_OFFSET,
    );
    remaining >>= SHIFT;
  }
  return `${out}${String.fromCodePoint(remaining + ASCII_OFFSET)}`;
}

export function encodePolyline(points: LatLng[]): string {
  let lastLat = 0;
  let lastLng = 0;
  let out = "";
  for (const point of points) {
    const lat = Math.round(point.lat * PRECISION);
    const lng = Math.round(point.lng * PRECISION);
    out += encodeSignedValue(lat - lastLat);
    out += encodeSignedValue(lng - lastLng);
    lastLat = lat;
    lastLng = lng;
  }
  return out;
}
