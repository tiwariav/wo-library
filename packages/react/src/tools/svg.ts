const ANGULAR_ORIGIN_SHIFT = 90;
const ANGLE_SEMI_CIRCLE = 180;

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

export function svgNodeToData(element: Node) {
  const serialized = new XMLSerializer().serializeToString(element);
  return `data:image/svg+xml;utf8,${encodeURIComponent(serialized)}`;
}

export function responseTextToData(response: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(response)}`;
}
