const ANGULAR_ORIGIN_SHIFT = 90;
const ANGLE_SEMI_CIRCLE = 180;

/**
 * Converts polar coordinates (angle and radius) to Cartesian (x, y) coordinates.
 * The angle is measured clockwise from the 12 o'clock position (top).
 *
 * @param center - The center point { x, y }
 * @param radius - The distance from the center
 * @param angleInDegrees - The angle in degrees (0° = top, 90° = right)
 * @returns The Cartesian { x, y } coordinates
 *
 * @example
 * ```typescript
 * polarToCartesian({ x: 50, y: 50 }, 40, 0);   // { x: 50, y: 10 }
 * polarToCartesian({ x: 50, y: 50 }, 40, 90);  // { x: 90, y: 50 }
 * ```
 */
export function polarToCartesian(
  center: { x: number; y: number },
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians =
    ((angleInDegrees - ANGULAR_ORIGIN_SHIFT) * Math.PI) / ANGLE_SEMI_CIRCLE;
  return {
    x: center.x + radius * Math.cos(angleInRadians),
    y: center.y + radius * Math.sin(angleInRadians),
  };
}

/**
 * Generates an SVG arc path string for use in `<path d="...">` elements.
 *
 * @param radius - The radius of the arc
 * @param arcAngle - Start and end angles in degrees
 * @param center - The center point of the arc
 * @returns An SVG path string describing the arc
 *
 * @example
 * ```typescript
 * describeArc(40, { start: 0, end: 90 }, { x: 50, y: 50 });
 * // "M 90 50 A 40 40 0 0 0 50 10"
 * ```
 */
export function describeArc(
  radius: number,
  arcAngle: { end: number; start: number },
  center: { x: number; y: number },
) {
  const start = polarToCartesian(center, radius, arcAngle.end);
  const end = polarToCartesian(center, radius, arcAngle.start);

  const largeArcFlag =
    arcAngle.end - arcAngle.start <= ANGLE_SEMI_CIRCLE ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}
