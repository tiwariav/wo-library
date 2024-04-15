import type { HTMLProps } from "react";

function createScriptElement(
  source: string,
  props: HTMLProps<HTMLScriptElement>,
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
    script.setAttribute(key, value as string);
  }
  return script;
}

export default function loadScript(
  source: string,
  props: HTMLProps<HTMLScriptElement> = {},
) {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      return;
    }
    const existingScript = document.querySelector(`script[src="${source}"]`);
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
