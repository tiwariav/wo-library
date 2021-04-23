export function redirectToLogout({
  path = "logout",
  message,
  includeFrom = true,
} = {}) {
  const url = new URL(`${window.location.origin}/${path}`);
  const search = new URLSearchParams();
  if (message) {
    search.append("message", message);
  }
  if (includeFrom) {
    search.append("from", window.location.pathname);
  }
  url.search = search;
  window.location.href = url;
}
