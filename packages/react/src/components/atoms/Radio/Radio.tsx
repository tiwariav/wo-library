import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { clsx } from "clsx";
import { forwardRef, useId } from "react";

import type { COMPONENT_SIZES } from "../../../tools/constants/props.js";

import { getDynamicClassName } from "../../../tools/utils.js";
import Label from "../Label.js";
import * as styles from "./radio.module.css";

/**
 * Props for the `Radio` component.
 *
 * @property label - Label text or node displayed next to the radio button.
 * @property size - Size variant: `"small"` | `"large"`.
 * @property hasError - Applies error styling when `true`.
 */
export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  hasError?: boolean;
  label?: ReactNode;
  size?: (typeof COMPONENT_SIZES)[number];
}

/**
 * A standard radio input component.
 *
 * @example
 * ```tsx
 * <Radio name="option" value="1" label="Option 1" />
 * <Radio name="option" value="2" label="Option 2" />
 * ```
 */
const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
        <input
          className={styles.input}
          id={inputId}
          ref={ref}
          type="radio"
          {...props}
        />
        {label && (
          <Label className={styles.label} htmlFor={inputId}>
            {label}
          </Label>
        )}
      </div>
    );
  },
);
Radio.displayName = "Radio";

export default Radio;
