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

/** SVG path data for a map pin icon. */
export const svgPathPinData = {
  d: "m184.33 179.33c-2.233 0-4.0496 1.8167-4.0496 4.0496 0 0.92141 0.30195 1.7892 0.87322 2.5095 0.7397 0.93263 2.8908 3.147 2.982 3.2408l0.19445 0.20005 0.19449-0.20002c0.0913-0.0939 2.243-2.3088 2.9828-3.2417 0.57076-0.71973 0.87244-1.5872 0.87244-2.5086 0-2.233-1.8166-4.0496-4.0496-4.0496z",
  transform: "translate(-180.28 -179.33)",
};

/** SVG path data for a flag icon. */
export const svgPathFlagData = {
  d: "m9.2932 0.6741c-0.043497-0.017356-1.0842-0.4279-2.3174-0.4279-0.73581 0-1.3863 0.14721-1.9336 0.43754-0.4849 0.25734-1.1427 0.38762-1.9552 0.38762-1.1374 0-2.2589-0.2597-2.6585-0.36276v-0.49433c0-0.11849-0.09578-0.21427-0.21427-0.21427-0.1185 0-0.21427 0.09578-0.21427 0.21427v0.64282c0 0.002957 0.00154 0.005528 0.00167 0.008614 0 0.002571-0.00167 0.004757-0.00167 0.007328v8.9128c0 0.11841 0.09578 0.21419 0.21427 0.21419 0.1185 0 0.21427-0.09578 0.21427-0.21427v-2.2063c0.48704 0.12085 1.552 0.34862 2.6585 0.34862 0.88323 0 1.6085-0.14742 2.156-0.43755 0.4849-0.25734 1.0677-0.38783 1.7328-0.38783 1.1479 0 2.1485 0.3934 2.1584 0.39726 0.06621 0.026574 0.14078 0.018423 0.1997-0.021856 0.058715-0.03943 0.09407-0.10585 0.09407-0.17699v-6.4282c0-0.087642-0.053354-0.16627-0.13478-0.19885z",
};
