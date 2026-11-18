/**
 * Boot-time capture of the browser's install signals.
 *
 * Chromium fires `beforeinstallprompt` once per page load, early. Capture it
 * before React mounts so SPA routes that load later still see the deferred event.
 */

/* eslint-disable @typescript-eslint/no-unnecessary-condition -- window/matchMedia vary */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export interface PwaInstallState {
  deferred: BeforeInstallPromptEvent | null;
  installed: boolean;
}

const isStandaloneDisplay = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  const iosStandalone =
    (globalThis.navigator as { standalone?: boolean }).standalone === true;
  const displayMode = globalThis.matchMedia?.(
    "(display-mode: standalone)",
  ).matches;
  const twa =
    typeof document !== "undefined" &&
    document.referrer.startsWith("android-app://");
  return iosStandalone || displayMode || twa;
};

let state: PwaInstallState = {
  deferred: null,
  installed: isStandaloneDisplay(),
};
const listeners = new Set<() => void>();
let initialised = false;

const setState = (next: Partial<PwaInstallState>) => {
  const merged = { ...state, ...next };
  if (
    merged.deferred === state.deferred &&
    merged.installed === state.installed
  ) {
    return;
  }
  state = merged;
  for (const listener of listeners) {
    listener();
  }
};

/** Attach window listeners. Idempotent. */
export function initPwaInstallCapture(): void {
  if (initialised || typeof window === "undefined") {
    return;
  }
  initialised = true;

  globalThis.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    setState({ deferred: event as BeforeInstallPromptEvent });
  });
  globalThis.addEventListener("appinstalled", () => {
    setState({ deferred: null, installed: true });
  });
  globalThis
    .matchMedia?.("(display-mode: standalone)")
    .addEventListener?.("change", () => {
      setState({ installed: isStandaloneDisplay() });
    });
}

export const subscribePwaInstall = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getPwaInstallState = (): PwaInstallState => state;

export const clearDeferredPrompt = (): void => {
  setState({ deferred: null });
};

/** Test seam: reset module state. */
export const resetPwaInstallStoreForTests = (): void => {
  state = { deferred: null, installed: isStandaloneDisplay() };
  listeners.clear();
  initialised = false;
};
