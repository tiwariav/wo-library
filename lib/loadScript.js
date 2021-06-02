export default function loadScript(src) {
  return new Promise((resolve) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = src;
      const nonceMeta = document.head.querySelector(
        "[property~=csp-nonce][content]"
      );
      if (nonceMeta) {
        script.nonce = nonceMeta.content;
      }
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    } else {
      resolve(true);
    }
  });
}
