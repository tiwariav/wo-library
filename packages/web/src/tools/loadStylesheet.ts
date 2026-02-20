/**
 * Creates a `<link rel="stylesheet">` element for the given CSS URL.
 * Automatically applies a CSP nonce if a `<meta property="csp-nonce">` tag is present.
 *
 * @param source - The stylesheet URL.
 * @returns The created `HTMLLinkElement`.
 */
function createStyleElement(source: string) {
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.type = "text/css";
  style.href = source;
  const nonceMeta: HTMLMetaElement | null = document.head.querySelector(
    "[property~=csp-nonce][content]",
  );
  if (nonceMeta) {
    style.setAttribute("nonce", nonceMeta.content);
  }
  return style;
}

/**
 * Dynamically loads an external stylesheet by appending a `<link>` tag to the
 * document head. If the stylesheet is already present, resolves immediately.
 *
 * Supports CSP nonce via a `<meta property="csp-nonce" content="...">` tag.
 *
 * @param source - The URL of the stylesheet to load.
 * @returns A promise that resolves to `true` on success, `false` on error.
 *
 * @example
 * ```ts
 * const loaded = await loadStylesheet("https://cdn.example.com/styles.css");
 * ```
 */
export default function loadStylesheet(source: string) {
  return new Promise((resolve) => {
    const existingStyle = document.querySelector(`link[href="${source}"]`);
    if (existingStyle) {
      resolve(true);
    } else {
      const style = createStyleElement(source);
      style.addEventListener("load", () => {
        resolve(true);
      });
      style.addEventListener("error", () => {
        resolve(false);
      });
      document.head.append(style);
    }
  });
}
