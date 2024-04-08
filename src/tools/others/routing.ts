function getNewUrl({
  currentPath,
  includeFrom,
  message,
  redirectPath,
}: {
  currentPath: string;
  includeFrom: boolean;
  message: string;
  redirectPath: string;
}) {
  const newSearch = new URLSearchParams();
  if (message) {
    newSearch.append("message", message);
  }
  if (includeFrom) {
    newSearch.append("from", currentPath);
  }
  const url = new URL(`${window.location.origin}${redirectPath}`);
  url.search = newSearch.toString();
  return url;
}

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
  const redirectPath = `${considerHash ? "/#" : ""}/${logoutPath}`;
  const url = getNewUrl({ currentPath, includeFrom, message, redirectPath });
  // reload the window to automatically clear session storage and any other data in memory.
  window.location.href = url.href;
}
