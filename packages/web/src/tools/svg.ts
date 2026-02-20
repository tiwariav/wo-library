export function svgNodeToData(element: Node) {
  const serialized = new XMLSerializer().serializeToString(element);
  return `data:image/svg+xml;utf8,${encodeURIComponent(serialized)}`;
}

export function responseTextToData(response: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(response)}`;
}
