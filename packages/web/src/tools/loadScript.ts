/**
 * Creates a `<script>` element with the given source URL and optional attributes.
 * Automatically applies a CSP nonce if a `<meta property="csp-nonce">` tag is present.
 *
 * @param source - The script URL.
 * @param props - Additional HTML attributes to set on the script element.
 * @returns The created `HTMLScriptElement`.
 */
function createScriptElement(
  source: string,
  props: Record<string, string> = {},
) {
  const script = document.createElement("script");
  script.src = source;
  const nonceMeta: HTMLMetaElement | null = document.head.querySelector(
    "[property~=csp-nonce][content]",
  );
  if (nonceMeta) {
    script.setAttribute("nonce", nonceMeta.content);
  }
  for (const [key, value] of Object.entries(props)) {
    script.setAttribute(key, value);
  }
  return script;
}

/**
 * Dynamically loads an external script by appending a `<script>` tag to the
 * document body. If the script is already present, resolves immediately.
 *
 * Supports CSP nonce via a `<meta property="csp-nonce" content="...">` tag.
 *
 * @param source - The URL of the script to load.
 * @param props - Optional HTML attributes to set on the script element.
 * @returns A promise that resolves to `true` on success, `false` on error.
 *
 * @example
 * ```ts
 * const loaded = await loadScript("https://cdn.example.com/sdk.js");
 * if (!loaded) throw new Error("SDK failed to load");
 * ```
 */
export default function loadScript(
  source: string,
  props: Record<string, string> = {},
) {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      return;
    }
    const existingScript = document.querySelector(
      `script[src="${CSS.escape(source)}"]`,
    );
    if (existingScript) {
      resolve(true);
    } else {
      const script = createScriptElement(source, props);
      script.addEventListener("load", () => {
        resolve(true);
      });
      script.addEventListener("error", () => {
        resolve(false);
      });
      document.body.append(script);
    }
  });
}
