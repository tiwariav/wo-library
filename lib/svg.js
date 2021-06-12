export function svgNodeToData(element) {
  const serialized = new XMLSerializer().serializeToString(element);
  return `data:image/svg+xml;utf8,${encodeURIComponent(serialized)}`;
}

export async function svgResponseToData(response) {
  const text = await response.text();
  return `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;
}
