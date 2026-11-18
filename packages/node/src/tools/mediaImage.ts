/**
 * Canonical + thumb key helpers for a WebP media pipeline.
 */

export const THUMB_MAX_EDGE = 480;
export const THUMB_WEBP_QUALITY = 72;
export const CANONICAL_MAX_EDGE = 1600;
export const CANONICAL_WEBP_QUALITY = 72;
export const CORPUS_MAX_EDGE = 2048;
export const CORPUS_WEBP_QUALITY = 80;

const IMAGE_EXT = /\.(gif|heic|jpe?g|png|webp)$/i;

export function isThumbKey(key: string): boolean {
  const base = key.split("/").pop() ?? key;
  return /^thumb-/i.test(base);
}

/** `path/abc.jpg` → `path/abc.webp` */
export function toWebpKey(key: string): string {
  if (key.toLowerCase().endsWith(".webp")) {
    return key;
  }
  const index = key.lastIndexOf(".");
  if (index === -1) {
    return `${key}.webp`;
  }
  return `${key.slice(0, index)}.webp`;
}

export function stemFromKey(key: string): string {
  const base = key.split("/").pop() ?? key;
  return base.replace(/\.[^.]+$/, "");
}

/** `path/abc.jpg` → `path/thumb-abc.webp` */
export function thumbKeyFromCanonicalKey(key: string): null | string {
  if (!key || isThumbKey(key)) {
    return null;
  }
  const slash = key.lastIndexOf("/");
  const dir = slash === -1 ? "" : key.slice(0, slash + 1);
  const stem = stemFromKey(key);
  if (!stem || stem.startsWith("thumb-")) {
    return null;
  }
  return `${dir}thumb-${stem}.webp`;
}

export function isConvertibleImageKey(key: string): boolean {
  if (isThumbKey(key)) {
    return false;
  }
  return IMAGE_EXT.test(key);
}
