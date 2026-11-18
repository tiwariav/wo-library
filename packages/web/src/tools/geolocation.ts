/**
 * Request the device position (may prompt for permission).
 */

/* eslint-disable @typescript-eslint/no-unnecessary-condition -- navigator varies by environment */

export type PositionError =
  "denied" | "timeout" | "unavailable" | "unsupported";

export type PositionResult =
  | { accuracyM: number; latitude: number; longitude: number; ok: true }
  | { error: PositionError; ok: false };

const ERROR_BY_CODE: Record<number, PositionError> = {
  1: "denied",
  2: "unavailable",
  3: "timeout",
};

const GUARD_SLACK_MS = 500;

export function requestPosition({
  timeoutMs = 10_000,
}: { timeoutMs?: number } = {}): Promise<PositionResult> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve({ error: "unsupported", ok: false });
  }
  return new Promise((resolve) => {
    const guard = setTimeout(() => {
      resolve({ error: "timeout", ok: false });
    }, timeoutMs + GUARD_SLACK_MS);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(guard);
        resolve({
          accuracyM: position.coords.accuracy,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          ok: true,
        });
      },
      (error) => {
        clearTimeout(guard);
        resolve({
          error: ERROR_BY_CODE[error.code] ?? "unavailable",
          ok: false,
        });
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: timeoutMs },
    );
  });
}
