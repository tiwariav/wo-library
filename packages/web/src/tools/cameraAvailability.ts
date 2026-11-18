/**
 * Probe whether a camera input device is present (does not treat permission
 * denial as "unavailable" — `capture` file inputs often bypass getUserMedia).
 */

export type CameraStatus = "none" | "ok";

export type CameraUnavailable = "failed" | "none";

export interface CameraNavigator {
  mediaDevices?: { enumerateDevices?: () => Promise<{ kind: string }[]> };
}

export const CAMERA_UNAVAILABLE_REASON =
  "Camera could not be opened on this device";

/** Human + machine reason string (`[camera_none]` / `[camera_failed]`). */
export function cameraSkipReason(why: CameraUnavailable): string {
  return `${CAMERA_UNAVAILABLE_REASON} [camera_${why}]`;
}

export async function probeCamera(
  nav: CameraNavigator | undefined = typeof navigator === "undefined"
    ? undefined
    : navigator,
): Promise<CameraStatus> {
  if (!nav) {
    return "ok";
  }
  try {
    const devices = await nav.mediaDevices?.enumerateDevices?.();
    if (devices?.every((device) => device.kind !== "videoinput")) {
      return "none";
    }
  } catch {
    /* unknown → treat as available */
  }
  return "ok";
}
