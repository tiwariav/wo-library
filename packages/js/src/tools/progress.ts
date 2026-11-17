const MAX_PERCENT = 100;
const MAX_ROTATION = 180;
const ROTATION_OFFSET = 90;
const DEFAULT_SLICE_ANGLE = 7.5;
const ARC_START_OFFSET = -90;

/** Full semicircle arc angle used by arc progress indicators. */
export const ARC_ANGLE = 180;

/** Maximum progress percentage (100). */
export const MAX_PROGRESS = 100;

/**
 * CSS class key for circle-progress styling based on completion percentage.
 *
 * @param percentage - Completion between 0 and 100.
 * @returns `'progressNone'`, `'progressPartial'`, or `'progressFull'`.
 */
export function getProgressClass(
  percentage: number,
): "progressFull" | "progressNone" | "progressPartial" {
  if (percentage <= 0) {
    return "progressNone";
  }
  if (percentage < MAX_PERCENT) {
    return "progressPartial";
  }
  return "progressFull";
}

/**
 * Stroke-dash geometry for an SVG circle progress ring.
 *
 * @param radius - Circle radius in SVG units.
 * @param arcRotation - Starting rotation in degrees. @default 0
 * @param completion - Completion percentage 0–100. @default 0
 */
export function getCircleStyles(
  radius: number,
  arcRotation = 0,
  completion = 0,
): {
  rotationOffset: number;
  strokeDasharray: number;
  strokeDashoffset: number;
} {
  const strokeDasharray = 2 * radius * Math.PI;
  const rotationOffset =
    (2 * radius * (arcRotation - ROTATION_OFFSET) * Math.PI) / MAX_ROTATION;
  const strokeDashoffset =
    rotationOffset +
    ((strokeDasharray - rotationOffset) * (MAX_PERCENT - completion)) /
      MAX_PERCENT;
  return { rotationOffset, strokeDasharray, strokeDashoffset };
}

/**
 * Label text for a progress indicator.
 *
 * @param text - `"parts"`, `"percent"`, `"value"`, or a custom suffix after the
 *   current value.
 * @param progress - `[current, total]` tuple.
 * @param percentage - Precomputed percentage.
 */
export function getProgressTextContent(
  text: string,
  progress: [number, number],
  percentage: number,
): string {
  switch (text) {
    case "parts": {
      return (progress[0] / progress[1]).toString();
    }
    case "percent": {
      return `${percentage}%`;
    }
    case "value": {
      return progress[0].toString();
    }
    default: {
      return `${progress[0]} ${text}`;
    }
  }
}

/**
 * Start/end angle pairs for a segmented semicircle arc.
 *
 * @param segments - Number of discrete segments. @default 1
 * @param sliceGap - Degrees removed between segments. @default 7.5
 * @returns Array of `[startAngle, endAngle]` pairs in degrees.
 */
export function getArcSegmentAngles(
  segments: number,
  sliceGap = DEFAULT_SLICE_ANGLE,
): [number, number][] {
  const value: [number, number][] = [];
  const parts = Array.from<number>({ length: segments }).fill(
    MAX_PROGRESS / segments,
  );
  let startAngle = ARC_START_OFFSET;
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    const nextAngle = startAngle + (ARC_ANGLE * part) / MAX_PROGRESS;
    const endAngle =
      index === parts.length - 1 ? nextAngle : nextAngle - sliceGap;
    value.push([startAngle, endAngle]);
    startAngle = nextAngle;
  }
  return value;
}
