/**
 * Recover from stale-deploy dynamic-import failures with one guarded reload.
 */

import { isError, isNil, isString, noop } from "lodash-es";

const RELOAD_FLAG_PREFIX = "chunk-reload:";
const RELOAD_WINDOW_MS = 10_000;

function errorMessage(error: unknown): string {
  if (isError(error)) {
    return `${error.name}: ${error.message}`;
  }
  if (isNil(error)) {
    return "";
  }
  if (isString(error)) {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return "";
  }
}

export function isChunkLoadError(error: unknown): boolean {
  const msg = errorMessage(error);
  return (
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    /import\(\) module script failed/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /ChunkLoadError/i.test(msg) ||
    /is not a valid JavaScript MIME type/i.test(msg) ||
    /Unexpected token '<'/i.test(msg)
  );
}

/**
 * Force exactly one hard reload for a stale chunk failure.
 * Returns `true` if reload was triggered, `false` if suppressed.
 */
export function reloadOnceForChunkError(key: string, error?: unknown): boolean {
  const flagKey = `${RELOAD_FLAG_PREFIX}${key}`;
  let last = 0;
  try {
    last = Number(sessionStorage.getItem(flagKey) ?? 0);
  } catch {
    /* private mode */
  }

  const now = Date.now();
  if (now - last < RELOAD_WINDOW_MS) {
    return false;
  }

  try {
    sessionStorage.setItem(flagKey, String(now));
  } catch {
    /* ignore */
  }

  const reload = () => {
    const url = new URL(globalThis.location.href);
    url.searchParams.set("v", String(now));
    globalThis.location.assign(url.toString());
  };

  let detail = "";
  if (isError(error)) {
    detail = error.message;
  } else if (!isNil(error)) {
    detail = errorMessage(error);
  }
  const match = /(https?:\/\/[^\s"']+)/.exec(detail);
  const url = match?.[1];
  if (url) {
    void fetch(url, { cache: "reload" }).catch(noop).finally(reload);
  } else {
    reload();
  }
  return true;
}

export async function importWithRetry<T>(
  factory: () => Promise<T>,
  key: string,
): Promise<T> {
  try {
    const module = await factory();
    if (isNil(module)) {
      throw new Error(
        "Failed to fetch dynamically imported module (empty result)",
      );
    }
    return module;
  } catch (error: unknown) {
    if (!isChunkLoadError(error) || !reloadOnceForChunkError(key, error)) {
      throw error;
    }
    return await new Promise<T>(noop);
  }
}

/** Listen for Vite preload / unhandledrejection chunk failures. */
export function installChunkReloadHandlers(): void {
  globalThis.addEventListener("vite:preloadError", () => {
    reloadOnceForChunkError("preload");
  });
  globalThis.addEventListener("unhandledrejection", (event) => {
    if (!isChunkLoadError(event.reason)) {
      return;
    }

    reloadOnceForChunkError("preload");
    event.preventDefault();
  });
}
