/**
 * View Transitions helpers (no router coupling).
 */

/* eslint-disable @typescript-eslint/no-unnecessary-condition -- document/window APIs vary */

export type TransitionDirection = "fade" | "pop" | "push";

const PHONE = "(max-width: 767px)";
const REDUCED = "(prefers-reduced-motion: reduce)";

/** True when a slide should run: API present, phone width, motion allowed. */
export function canSlide(): boolean {
  if (
    typeof document === "undefined" ||
    typeof window === "undefined" ||
    !("startViewTransition" in document) ||
    !globalThis.matchMedia
  ) {
    return false;
  }
  return (
    globalThis.matchMedia(PHONE).matches &&
    !globalThis.matchMedia(REDUCED).matches
  );
}

/** True when a plain fade should run: API present and motion allowed. */
export function canFade(): boolean {
  if (
    typeof document === "undefined" ||
    typeof window === "undefined" ||
    !("startViewTransition" in document)
  ) {
    return false;
  }
  return !globalThis.matchMedia?.(REDUCED).matches;
}

/**
 * Runs `update` inside a view transition when supported; otherwise calls it
 * immediately. `update` should commit synchronously (e.g. via `flushSync`).
 */
export function runViewTransition(
  direction: TransitionDirection,
  update: () => void,
): void {
  if (direction === "fade" ? !canFade() : !canSlide()) {
    update();
    return;
  }
  type StartViewTransition = (cb: () => void) => { finished: Promise<unknown> };
  const root = document.documentElement;
  root.dataset.vt = direction;
  const start = (
    document as unknown as { startViewTransition: StartViewTransition }
  ).startViewTransition;
  const transition = start.call(document, update);
  const clear = () => {
    delete root.dataset.vt;
  };
  void transition.finished.then(clear).catch(clear);
}
