import type { RefObject } from "react";

import { useEffect } from "react";
import { useRafState } from "react-use";
import { isBrowser, off, on } from "react-use/esm/misc/util.js";

/** Internal state tracked by {@link useScrollDirection}. */
interface DirectionState {
  bodyHeight: number;
  direction: "" | "down" | "up";
  x: number;
  y: number;
}

function setScrollDirectionState(
  previousState: DirectionState,
  element?: HTMLElement | null,
) {
  let x = 0,
    y = 0;
  if (element) {
    x = element.scrollLeft;
    y = element.scrollTop;
  } else {
    x = window.scrollX;
    y = window.scrollY;
  }
  const bodyHeight = (element ?? document.body).clientHeight;
  const diff = y - previousState.y;
  const direction =
    bodyHeight !== previousState.bodyHeight || diff === 0
      ? previousState.direction
      : diff > 0
        ? "down"
        : "up";
  return { bodyHeight, direction, x, y };
}

/**
 * Tracks scroll direction (`"up"` or `"down"`) on the window or a specific
 * scrollable element.
 *
 * Uses `requestAnimationFrame`-throttled state updates for performance.
 *
 * @param ref - Optional ref to a scrollable element. Defaults to `window`.
 * @returns An object with `{ direction, x, y, bodyHeight }` scroll state.
 *
 * @example
 * ```tsx
 * function Header() {
 *   const { direction } = useScrollDirection();
 *   return <header className={direction === "down" ? "hidden" : "visible"} />;
 * }
 * ```
 */
export default function useScrollDirection(ref?: RefObject<HTMLElement>) {
  const [state, setState] = useRafState<DirectionState>({
    bodyHeight: 0,
    direction: "",
    x: isBrowser && !ref ? window.scrollX : 0,
    y: isBrowser && !ref ? window.scrollY : 0,
  });

  useEffect(() => {
    const current = ref?.current;
    const handler = () => {
      setState((previousState) =>
        setScrollDirectionState(previousState, current),
      );
    };

    //We have to update window scroll at mount, before subscription.
    //Window scroll may be changed between render and effect handler.
    handler();

    on(current ?? globalThis, "scroll", handler, {
      capture: false,
      passive: true,
    });

    return () => {
      off(current ?? globalThis, "scroll", handler);
    };
  }, [ref, setState]);

  return state;
}
