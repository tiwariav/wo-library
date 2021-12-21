export function redirectToLogout({
  path = "logout",
  message,
  includeFrom = true,
} = {}) {
  if (window.location.pathname.split("/").includes(path)) {
    return;
  }
  const url = new URL(`${window.location.origin}/${path}`);
  const search = new URLSearchParams();
  if (message) {
    search.append("message", message);
  }
  if (includeFrom) {
    const from = window.location.pathname + window.location.hash;
    if (/\w/g.test(from)) {
      search.append("from", window.location.pathname + window.location.hash);
    }
  }
  url.search = search;
  window.location.href = url;
}
