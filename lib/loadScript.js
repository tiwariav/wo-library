export default function loadScript(source) {
  return new Promise((resolve) => {
    const existingScript = document.querySelector(`script[src="${source}"]`);
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = source;
      const nonceMeta = document.head.querySelector(
        "[property~=csp-nonce][content]"
      );
      if (nonceMeta) {
        script.setAttribute("nonce", nonceMeta.content);
      }
      script.addEventListener('load', () => {
        resolve(true);
      });
      script.addEventListener('error', () => {
        resolve(false);
      });
      document.body.append(script);
    } else {
      resolve(true);
    }
  });
}
