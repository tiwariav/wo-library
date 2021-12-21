export default function loadStylesheet(source) {
  return new Promise((resolve) => {
    const existingStyle = document.querySelector(`link[href="${source}"]`);
    if (!existingStyle) {
      const style = document.createElement("link");
      style.rel = "stylesheet";
      style.type = "text/css";
      style.href = source;
      const nonceMeta = document.head.querySelector(
        "[property~=csp-nonce][content]"
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
    } else {
      resolve(true);
    }
  });
}
