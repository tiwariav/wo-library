/* eslint-disable sonarjs/prefer-read-only-props -- props interfaces are already immutable shapes */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "../lib/cn.js";

const DEFAULT_HOLD_MS = 1200;

export interface HoldButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> {
  /** Runs once the button has been held for `holdMs`. */
  onConfirm: () => void;
  /** How long to hold, in ms. */
  holdMs?: number;
  children?: ReactNode;
}

/**
 * Press-and-hold confirm control. Assistive clicks (`detail === 0`) confirm at once.
 */
export function HoldButton({
  children,
  className,
  disabled,
  holdMs = DEFAULT_HOLD_MS,
  onConfirm,
  ...buttonProps
}: HoldButtonProps) {
  const [holding, setHolding] = useState(false);
  const timerRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const latestConfirmRef = useRef(onConfirm);

  useEffect(() => {
    latestConfirmRef.current = onConfirm;
  }, [onConfirm]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = null;
    setHolding(false);
  }, []);

  const start = useCallback(() => {
    if (disabled || timerRef.current) {
      return;
    }
    setHolding(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setHolding(false);
      latestConfirmRef.current();
    }, holdMs);
  }, [disabled, holdMs]);

  useEffect(() => cancel, [cancel]);

  return (
    <button
      {...buttonProps}
      className={cn(
        "relative overflow-hidden rounded-md bg-primary px-4 py-2 text-light",
        holding && "opacity-90",
        className,
      )}
      disabled={disabled}
      onBlur={cancel}
      onClick={(event) => {
        if (event.detail === 0 && !disabled) {
          latestConfirmRef.current();
        }
      }}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
      onKeyDown={(event) => {
        if (!(event.key === " " || event.key === "Enter") || event.repeat) {
          return;
        }

        event.preventDefault();
        start();
      }}
      onKeyUp={cancel}
      onPointerCancel={cancel}
      onPointerDown={start}
      onPointerLeave={cancel}
      onPointerUp={cancel}
      style={{ "--hold-ms": `${holdMs}ms` } as CSSProperties}
      title="Press and hold to confirm"
      type="button"
    >
      {children}
    </button>
  );
}
