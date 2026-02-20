/**
 * Serialises a DOM node (typically an SVG element) to a `data:image/svg+xml`
 * URI string.
 *
 * @param element - The DOM node to serialise.
 * @returns A data URI containing the URL-encoded SVG markup.
 *
 * @example
 * ```ts
 * const svgEl = document.querySelector("svg")!;
 * const dataUri = svgNodeToData(svgEl);
 * img.src = dataUri;
 * ```
 */
export function svgNodeToData(element: Node) {
  const serialized = new XMLSerializer().serializeToString(element);
  return `data:image/svg+xml;utf8,${encodeURIComponent(serialized)}`;
}

/**
 * Converts raw SVG markup (e.g., from a fetch response) into a
 * `data:image/svg+xml` URI string.
 *
 * @param response - The SVG markup string.
 * @returns A data URI containing the URL-encoded SVG.
 *
 * @example
 * ```ts
 * const svg = await fetch("/icon.svg").then((r) => r.text());
 * const dataUri = responseTextToData(svg);
 * ```
 */
export function responseTextToData(response: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(response)}`;
}
