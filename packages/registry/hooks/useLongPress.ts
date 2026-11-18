import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { isElement } from "lodash-es";

const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, [data-sel], [role="button"]';

const DEFAULT_THRESHOLD_MS = 500;
const DEFAULT_MOVE_TOLERANCE_PX = 10;
const VIBRATE_MS = 12;

export interface UseLongPressOptions {
  /** Hold duration before the long-press fires. Defaults to 500ms. */
  thresholdMs?: number;
  /** Pointer travel (px) that cancels the pending press. Defaults to 10. */
  moveTolerancePx?: number;
  /** When false the gesture is inert. */
  enabled?: boolean;
  /** Skip presses that start on a link/button/field. Defaults to true. */
  ignoreInteractive?: boolean;
}

export interface UseLongPressResult {
  handlers: {
    onPointerCancel: (event: ReactPointerEvent) => void;
    onPointerDown: (event: ReactPointerEvent) => void;
    onPointerMove: (event: ReactPointerEvent) => void;
    onPointerUp: (event: ReactPointerEvent) => void;
  };
  /** Call from `onClickCapture` to swallow the trailing click after a fire. */
  consumeClick: () => boolean;
}

/**
 * Touch long-press gesture. Mouse pointers are ignored.
 */
export function useLongPress(
  onLongPress: () => void,
  opts: UseLongPressOptions = {},
): UseLongPressResult {
  const {
    enabled = true,
    ignoreInteractive = true,
    moveTolerancePx = DEFAULT_MOVE_TOLERANCE_PX,
    thresholdMs = DEFAULT_THRESHOLD_MS,
  } = opts;

  const timerRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const startRef = useRef<null | { x: number; y: number }>(null);
  const firedRef = useRef(false);
  const onLongPressRef = useRef(onLongPress);

  useEffect(() => {
    onLongPressRef.current = onLongPress;
  }, [onLongPress]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = null;
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (!enabled || event.pointerType === "mouse") {
        return;
      }
      const { target } = event;
      if (
        ignoreInteractive &&
        isElement(target) &&
        (target as Element).closest(INTERACTIVE_SELECTOR)
      ) {
        return;
      }

      clearTimer();
      startRef.current = { x: event.clientX, y: event.clientY };
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        firedRef.current = true;
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(VIBRATE_MS);
        }
        onLongPressRef.current();
      }, thresholdMs);
    },
    [clearTimer, enabled, ignoreInteractive, thresholdMs],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      const start = startRef.current;
      if (!start) {
        return;
      }
      if (
        Math.abs(event.clientX - start.x) > moveTolerancePx ||
        Math.abs(event.clientY - start.y) > moveTolerancePx
      ) {
        clearTimer();
      }
    },
    [clearTimer, moveTolerancePx],
  );

  const onPointerUp = useCallback(() => {
    clearTimer();
  }, [clearTimer]);
  const onPointerCancel = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  const consumeClick = useCallback(() => {
    if (!firedRef.current) {
      return false;
    }
    firedRef.current = false;
    return true;
  }, []);

  return {
    consumeClick,
    handlers: { onPointerCancel, onPointerDown, onPointerMove, onPointerUp },
  };
}
