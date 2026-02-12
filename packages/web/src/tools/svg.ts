export function svgNodeToData(element: Node) {
  const serialized = new XMLSerializer().serializeToString(element);
  return `data:image/svg+xml;utf8,${encodeURIComponent(serialized)}`;
}
