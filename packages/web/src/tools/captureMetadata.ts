/* eslint-disable @typescript-eslint/no-magic-numbers, @typescript-eslint/no-unnecessary-condition, max-statements, lodash/prefer-lodash-typecheck -- browser API variance */
/**
 * Capture/upload provenance metadata for photo fields (no product coupling).
 */

import {
  exifTakenAtToIso,
  readExifFromFile,
  type ExifCapture,
} from "./exif.js";

export type CaptureSource = "camera" | "upload";

export type CaptureVia = "camera" | "canvas" | "picker" | "upload-instead";

export interface CaptureMetadata {
  captureSource: CaptureSource;
  capturedAt: string;
  exifTakenAt?: string;
  latitude?: number;
  longitude?: number;
  locationSource?: "device" | "exif";
  captureReason?: string;
}

/** Captures older than this are treated as uploads, not live camera shots. */
export const CAMERA_FRESHNESS_MS = 10 * 60 * 1000;

/** Max length for an optional "why upload instead" reason. */
export const CAPTURE_REASON_MAX = 200;

export interface ClassifyCaptureInput {
  via: CaptureVia;
  coarsePointer: boolean;
  now: number;
  lastModified?: number;
  exifTakenAtMs?: number;
}

export function classifyCaptureSource(
  input: ClassifyCaptureInput,
): CaptureSource {
  if (input.via === "canvas") {
    return "camera";
  }
  if (input.via === "upload-instead" || !input.coarsePointer) {
    return "upload";
  }

  const fresh = (at: number | undefined) =>
    at !== undefined &&
    Number.isFinite(at) &&
    Math.abs(input.now - at) <= CAMERA_FRESHNESS_MS;

  if (input.exifTakenAtMs !== undefined && !fresh(input.exifTakenAtMs)) {
    return "upload";
  }
  if (!fresh(input.lastModified)) {
    return "upload";
  }
  return "camera";
}

export interface BuildCaptureMetadataInput {
  via: CaptureVia;
  reason?: string;
  now: number;
  lastModified?: number;
  exif?: ExifCapture | null;
  coarsePointer: boolean;
  position?: { latitude: number; longitude: number } | null;
}

export function buildCaptureMetadata(
  input: BuildCaptureMetadataInput,
): CaptureMetadata {
  const exifTakenAt = exifTakenAtToIso(input.exif);
  const captureSource = classifyCaptureSource({
    coarsePointer: input.coarsePointer,
    exifTakenAtMs: exifTakenAt ? Date.parse(exifTakenAt) : undefined,
    lastModified: input.lastModified,
    now: input.now,
    via: input.via,
  });

  const meta: CaptureMetadata = {
    capturedAt: new Date(input.now).toISOString(),
    captureSource,
  };
  if (exifTakenAt) {
    meta.exifTakenAt = exifTakenAt;
  }

  if (
    input.exif?.latitude !== undefined &&
    input.exif.longitude !== undefined
  ) {
    meta.latitude = input.exif.latitude;
    meta.longitude = input.exif.longitude;
    meta.locationSource = "exif";
  } else if (captureSource === "camera" && input.position) {
    meta.latitude = input.position.latitude;
    meta.longitude = input.position.longitude;
    meta.locationSource = "device";
  }

  const reason = input.reason?.trim().slice(0, CAPTURE_REASON_MAX);
  if (reason) {
    meta.captureReason = reason;
  }

  return meta;
}

/** Flat string fields for multipart / JSON bodies. */
export function captureMetadataFields(
  meta: CaptureMetadata,
): Record<string, string> {
  const fields: Record<string, string> = {
    capturedAt: meta.capturedAt,
    captureSource: meta.captureSource,
  };
  if (meta.exifTakenAt) {
    fields.exifTakenAt = meta.exifTakenAt;
  }
  if (meta.latitude !== undefined && meta.longitude !== undefined) {
    fields.captureLatitude = String(meta.latitude);
    fields.captureLongitude = String(meta.longitude);
  }
  if (meta.locationSource) {
    fields.captureLocationSource = meta.locationSource;
  }
  if (meta.captureReason) {
    fields.captureReason = meta.captureReason;
  }
  return fields;
}

const IMAGE_URL = /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|webp)(\?|#|$)/i;

export function looksLikeImageUrl(url: string): boolean {
  return (
    url.startsWith("blob:") ||
    url.startsWith("data:image/") ||
    IMAGE_URL.test(url)
  );
}

export function partitionImageUrls(urls: readonly string[]): {
  files: string[];
  images: string[];
} {
  const images: string[] = [];
  const files: string[] = [];
  for (const url of urls) {
    (looksLikeImageUrl(url) ? images : files).push(url);
  }
  return { files, images };
}

export function isCoarsePointer(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      typeof globalThis.matchMedia === "function" &&
      globalThis.matchMedia("(pointer: coarse)").matches
    );
  } catch {
    return false;
  }
}

/** Position only when already granted — never prompts. */
export async function readGrantedPosition(
  timeoutMs = 2000,
): Promise<{ latitude: number; longitude: number } | undefined> {
  try {
    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation ||
      !navigator.permissions
    ) {
      return undefined;
    }
    const status = await navigator.permissions.query({
      name: "geolocation",
    });
    if (status.state !== "granted") {
      return undefined;
    }
    return await new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve();
      }, timeoutMs);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timer);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          clearTimeout(timer);
          resolve();
        },
        {
          enableHighAccuracy: false,
          maximumAge: 5 * 60 * 1000,
          timeout: timeoutMs,
        },
      );
    });
  } catch {
    return undefined;
  }
}

export async function collectCaptureMetadata(
  file: File,
  options: { reason?: string; via?: CaptureVia } = {},
): Promise<CaptureMetadata> {
  const now = Date.now();
  const [exif, position] = await Promise.all([
    readExifFromFile(file),
    readGrantedPosition(),
  ]);
  return buildCaptureMetadata({
    coarsePointer: isCoarsePointer(),
    exif,
    lastModified: file.lastModified,
    now,
    position,
    reason: options.reason,
    via: options.via ?? "picker",
  });
}
