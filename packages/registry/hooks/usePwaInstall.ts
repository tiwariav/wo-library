/* eslint-disable @typescript-eslint/no-magic-numbers -- dismiss TTL calendar maths */
/* eslint-disable max-statements -- platform detection branches */

import { useCallback, useState, useSyncExternalStore } from "react";

import {
  clearDeferredPrompt,
  getPwaInstallState,
  initPwaInstallCapture,
  subscribePwaInstall,
} from "./pwaInstallStore.js";

export type PwaInstallPlatform = "ios" | "prompt" | "unavailable";

export type PwaInstallGuide = "chromium" | "generic" | "ios" | "safari-desktop";

export interface UsePwaInstallResult {
  platform: PwaInstallPlatform;
  canOffer: boolean;
  installed: boolean;
  guide: PwaInstallGuide;
  install: () => Promise<"accepted" | "dismissed" | "unavailable">;
  dismiss: () => void;
}

/** How long a dismissal lasts (14 days). */
export const PWA_DISMISS_TTL_MS = 14 * 24 * 60 * 60 * 1000;

const DEFAULT_STORAGE_KEY = "app.pwa.install.dismissed";

const isIos = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1)
  );
};

const isIosSafari = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }
  return (
    isIos() &&
    navigator.userAgent.includes("Safari") &&
    !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent)
  );
};

export const detectPwaInstallGuide = (): PwaInstallGuide => {
  if (typeof navigator === "undefined") {
    return "generic";
  }
  const ua = navigator.userAgent;
  if (isIos()) {
    return ua.includes("FxiOS") ? "generic" : "ios";
  }
  if (/Chrome|Chromium|Edg\//.test(ua)) {
    return "chromium";
  }
  if (ua.includes("Safari")) {
    return "safari-desktop";
  }
  return "generic";
};

const readDismissedAt = (storageKey: string): boolean => {
  try {
    const at = Number(localStorage.getItem(storageKey));
    return Number.isFinite(at) && Date.now() - at < PWA_DISMISS_TTL_MS;
  } catch {
    return false;
  }
};

/**
 * Offer the browser "install this app" prompt when available.
 * Call `initPwaInstallCapture()` from the app entry before React renders.
 */
export function usePwaInstall(
  storageKey = DEFAULT_STORAGE_KEY,
): UsePwaInstallResult {
  initPwaInstallCapture();
  const { deferred, installed } = useSyncExternalStore(
    subscribePwaInstall,
    getPwaInstallState,
    getPwaInstallState,
  );
  const [dismissed, setDismissed] = useState(() => readDismissedAt(storageKey));

  const install = useCallback(async (): Promise<
    "accepted" | "dismissed" | "unavailable"
  > => {
    if (!deferred) {
      return "unavailable";
    }
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    clearDeferredPrompt();
    return outcome;
  }, [deferred]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(storageKey, String(Date.now()));
    } catch {
      /* session-only hide already applied */
    }
  }, [storageKey]);

  let platform: PwaInstallPlatform = "unavailable";
  if (!installed) {
    if (deferred) {
      platform = "prompt";
    } else if (isIosSafari()) {
      platform = "ios";
    }
  }

  return {
    canOffer: !dismissed && platform !== "unavailable",
    dismiss,
    guide: detectPwaInstallGuide(),
    install,
    installed,
    platform,
  };
}
