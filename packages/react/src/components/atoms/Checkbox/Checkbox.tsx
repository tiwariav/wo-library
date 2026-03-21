import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { clsx } from "clsx";
import { forwardRef, useId } from "react";

import type { COMPONENT_SIZES } from "../../../tools/constants/props.js";

import { getDynamicClassName } from "../../../tools/utils.js";
import Label from "../Label.js";
import * as styles from "./checkbox.module.css";

/**
 * Props for the `Checkbox` component.
 *
 * @property label - Label text or node displayed next to the checkbox.
 * @property size - Size variant: `"small"` | `"large"`.
 * @property hasError - Applies error styling when `true`.
 * @property indeterminate - Sets the indeterminate state of the checkbox.
 */
export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  hasError?: boolean;
  indeterminate?: boolean;
  label?: ReactNode;
  size?: (typeof COMPONENT_SIZES)[number];
}

/**
 * A standard checkbox input component.
 *
 * Supports labels, error states, and indeterminate states.
 *
 * @example
 * ```tsx
 * <Checkbox label="Accept terms and conditions" onChange={handleChange} />
 * ```
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      hasError,
      id,
      indeterminate,
      label,
      size,
      style,
      ...props
    },
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
          ref={(node) => {
            if (node) {
              node.indeterminate = !!indeterminate;
            }
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          type="checkbox"
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
Checkbox.displayName = "Checkbox";

export default Checkbox;
