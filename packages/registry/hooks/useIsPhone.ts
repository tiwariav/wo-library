import { constant, isFunction, noop } from "lodash-es";
import { useCallback, useSyncExternalStore } from "react";

const DEFAULT_QUERY = "(max-width: 767px)";

function mediaSupported(): boolean {
  return typeof window !== "undefined" && isFunction(globalThis.matchMedia);
}

/**
 * True on a phone-width viewport (default split at 767px), following rotation.
 * Server / SSR snapshot is always `false`.
 */
export function useIsPhone(query = DEFAULT_QUERY): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!mediaSupported()) {
        return noop;
      }
      const mql = globalThis.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => {
        mql.removeEventListener("change", onChange);
      };
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => mediaSupported() && globalThis.matchMedia(query).matches,
    constant(false),
  );
}
