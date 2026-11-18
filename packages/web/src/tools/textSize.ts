/**
 * Text-size preference helpers (CSS via `html[data-text-size]`).
 */

export type TextSize = "compact" | "default" | "large" | "xlarge";

export const TEXT_SIZES: readonly TextSize[] = [
  "compact",
  "default",
  "large",
  "xlarge",
];
export const DEFAULT_TEXT_SIZE: TextSize = "default";

export function normalizeTextSize(size: null | string | undefined): TextSize {
  return size && (TEXT_SIZES as readonly string[]).includes(size)
    ? (size as TextSize)
    : DEFAULT_TEXT_SIZE;
}

/** Stamp the size on `<html>` for CSS. */
export function applyTextSizeToDom(size: TextSize): void {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.dataset.textSize = size;
}

/** Local storage key for a given app prefix. */
export function textSizeStorageKey(prefix = "app"): string {
  return `${prefix}_text_size`;
}

interface ReadableStorage {
  getItem: (key: string) => null | string;
}

/**
 * Read stored size: optional preference path in a `user` JSON blob, then the
 * local key, then default.
 */
export function readStoredTextSize(
  storage: null | ReadableStorage = typeof localStorage === "undefined"
    ? null
    : localStorage,
  key: string = textSizeStorageKey(),
  userPreferencePath?: (parsed: unknown) => string | undefined,
): TextSize {
  if (!storage) {
    return DEFAULT_TEXT_SIZE;
  }
  if (userPreferencePath) {
    try {
      const rawUser = storage.getItem("user");
      if (rawUser) {
        const fromUser = userPreferencePath(JSON.parse(rawUser));
        if (fromUser && (TEXT_SIZES as readonly string[]).includes(fromUser)) {
          return fromUser as TextSize;
        }
      }
    } catch {
      /* fall through */
    }
  }
  try {
    return normalizeTextSize(storage.getItem(key));
  } catch {
    return DEFAULT_TEXT_SIZE;
  }
}

export function saveTextSize(
  size: TextSize,
  storage: null | {
    setItem: (key: string, value: string) => void;
  } = typeof localStorage === "undefined" ? null : localStorage,
  key: string = textSizeStorageKey(),
): void {
  try {
    storage?.setItem(key, size);
  } catch {
    /* quota / private mode */
  }
}
