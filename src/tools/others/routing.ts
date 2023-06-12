export function redirectToLogout({
  hashNavigation = true,
  includeFrom = true,
  logoutPath = "logout",
  message = "",
} = {}) {
  const { hash, pathname, search } = window.location;
  const considerHash = hash && hashNavigation;
  const isAlreadyThere =
    pathname.split("/").includes(logoutPath) ||
    (considerHash && hash.split("/").includes(logoutPath));
  if (isAlreadyThere) {
    // already on logout path
    return;
  }
  const currentPath = pathname + search + hash;
  const redirectPath = `${considerHash && "/#"}/${logoutPath}`;
  const newSearch = new URLSearchParams();
  if (message) {
    newSearch.append("message", message);
  }
  if (includeFrom) {
    newSearch.append("from", currentPath);
  }
  const url = new URL(`${window.location.origin}${redirectPath}`);
  url.search = newSearch.toString();
  // reload the window to automatically clear session storage and any other data in memory.
  window.location.href = url.href;
}
