export default function loadScript(source: string) {
  return new Promise((resolve) => {
    const existingScript = document.querySelector(`script[src="${source}"]`);
    if (existingScript) {
      resolve(true);
    } else {
      const script = document.createElement("script");
      script.src = source;
      const nonceMeta: HTMLMetaElement = document.head.querySelector(
        "[property~=csp-nonce][content]",
      );
      if (nonceMeta) {
        script.setAttribute("nonce", nonceMeta.content);
      }
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
