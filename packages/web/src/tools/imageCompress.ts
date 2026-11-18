/* eslint-disable @typescript-eslint/no-magic-numbers -- size/quality thresholds */

/**
 * Shrink a photo before upload (two-pass WebP with JPEG fallback).
 */

import { isFunction } from "lodash-es";

/** Longest edge after the first shrink pass. */
export const MAX_EDGE = 1600;
/** Second pass when the first encode is still heavy. */
export const HARD_MAX_EDGE = 1280;
/** Below this size, re-encoding is skipped. */
export const SKIP_BELOW_BYTES = 350 * 1024;
/** After the first encode, try harder if still above this. */
export const TARGET_MAX_BYTES = Math.round(1.2 * 1024 * 1024);
const QUALITY = 0.72;
const HARD_QUALITY = 0.6;
const PREFERRED = new Set(["image/jpeg", "image/webp", "image/png"]);

interface EncodeOptions {
  ext: string;
  file: File;
  maxEdge: number;
  mime: "image/jpeg" | "image/webp";
  quality: number;
}

/** Fit within `max` on the longest edge without upsizing. */
export function fitWithin(width: number, height: number, max = MAX_EDGE) {
  const longest = Math.max(width, height);
  if (longest <= max) {
    return { height, width };
  }
  const scale = max / longest;
  return {
    height: Math.round(height * scale),
    width: Math.round(width * scale),
  };
}

/** Whether a file is worth shrinking. */
export function shouldCompress(file: Pick<File, "size" | "type">): boolean {
  if (file.size < SKIP_BELOW_BYTES) {
    return false;
  }
  if (PREFERRED.has(file.type)) {
    return true;
  }
  return file.type.startsWith("image/");
}

async function encodeToBlob({
  ext,
  file,
  maxEdge,
  mime,
  quality,
}: EncodeOptions): Promise<File | null> {
  if (!isFunction(createImageBitmap) || typeof document === "undefined") {
    return null;
  }
  let bitmap: ImageBitmap | undefined;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const { height, width } = fitWithin(bitmap.width, bitmap.height, maxEdge);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return null;
    }
    context.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, mime, quality);
    });
    if (!blob || blob.size >= file.size) {
      return null;
    }
    const name = file.name.replace(/\.\w+$/, "") + ext;
    return new File([blob], name, {
      lastModified: file.lastModified,
      type: mime,
    });
  } catch {
    return null;
  } finally {
    bitmap?.close();
  }
}

async function encodeImage(
  file: File,
  maxEdge: number,
  quality: number,
): Promise<File | null> {
  const webp = await encodeToBlob({
    ext: ".webp",
    file,
    maxEdge,
    mime: "image/webp",
    quality,
  });
  if (webp) {
    return webp;
  }
  return encodeToBlob({
    ext: ".jpg",
    file,
    maxEdge,
    mime: "image/jpeg",
    quality,
  });
}

/**
 * Return a smaller WebP/JPEG when helpful, otherwise the original file.
 * Read EXIF from the original before calling — redraw drops metadata.
 */
export async function compressImage(file: File): Promise<File> {
  if (!shouldCompress(file)) {
    return file;
  }
  const first = await encodeImage(file, MAX_EDGE, QUALITY);
  if (!first) {
    return file;
  }
  if (first.size <= TARGET_MAX_BYTES) {
    return first;
  }
  const second = await encodeImage(first, HARD_MAX_EDGE, HARD_QUALITY);
  return second && second.size < first.size ? second : first;
}
