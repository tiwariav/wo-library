export default function loadStylesheet(source: string) {
  return new Promise((resolve) => {
    const existingStyle = document.querySelector(`link[href="${source}"]`);
    if (existingStyle) {
      resolve(true);
    } else {
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
