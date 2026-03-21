import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { clsx } from "clsx";
import { forwardRef, useId } from "react";

import type { COMPONENT_SIZES } from "../../../tools/constants/props.js";

import { getDynamicClassName } from "../../../tools/utils.js";
import Label from "../Label.js";
import * as styles from "./switch.module.css";

/**
 * Props for the `Switch` component.
 *
 * @property label - Label text or node displayed next to the switch.
 * @property size - Size variant: `"small"` | `"large"`.
 * @property hasError - Applies error styling when `true`.
 */
export interface SwitchProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  hasError?: boolean;
  label?: ReactNode;
  size?: (typeof COMPONENT_SIZES)[number];
}

/**
 * An accessible switch (toggle) component.
 *
 * @example
 * ```tsx
 * <Switch label="Enable notifications" onChange={handleToggle} />
 * ```
 */
const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    { className, hasError, id, label, size, style, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div
        className={clsx(
          styles.root,
          size && getDynamicClassName(styles, `size-${size}`),
          hasError && styles.hasError,
          className,
        )}
        style={style}
      >
        <div className={styles.switchWrapper}>
          <input
            className={styles.input}
            id={inputId}
            ref={ref}
            role="switch"
            type="checkbox"
            {...props}
          />
          <span className={styles.slider} />
        </div>
        {label && (
          <Label className={styles.label} htmlFor={inputId}>
            {label}
          </Label>
        )}
      </div>
    );
  },
);
Switch.displayName = "Switch";

export default Switch;
