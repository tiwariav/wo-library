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

/**
 * Redirects the browser to a logout path, optionally preserving the current
 * URL as a `from` query parameter for post-login redirects.
 *
 * Reloads the window to clear session storage and any in-memory data.
 *
 * @param options - Configuration for the redirect.
 * @param options.hashNavigation - Whether the app uses hash-based routing. Defaults to `true`.
 * @param options.includeFrom - Whether to append a `from` param with the current path. Defaults to `true`.
 * @param options.logoutPath - The path segment to redirect to. Defaults to `"logout"`.
 * @param options.message - An optional message to pass as a query parameter.
 *
 * @example
 * ```ts
 * redirectToLogout({ message: "Session expired" });
 * ```
 */
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
