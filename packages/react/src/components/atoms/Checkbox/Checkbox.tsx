import type { ReactNode } from "react";

import { forwardRef } from "react";

import type { SelectionControlPropsBase } from "../_shared/SelectionControlBase.js";
import { renderCheckableControl } from "../_shared/SelectionControlBase.js";
import * as styles from "./checkbox.module.css";

/**
 * Props for the `Checkbox` component.
 *
 * @property label - Label text or node displayed next to the checkbox.
 * @property size - Size variant: `"small"` | `"large"`.
 * @property hasError - Applies error styling when `true`.
 * @property indeterminate - Sets the indeterminate state of the checkbox.
 */
export interface CheckboxProps extends SelectionControlPropsBase {
  hasError?: boolean;
  indeterminate?: boolean;
  label?: ReactNode;
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
// eslint-disable-next-line @eslint-react/no-forward-ref
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, hasError, id, indeterminate, label, size, style, ...props },
    ref,
  ) =>
    renderCheckableControl({
      className,
      hasError,
      id,
      indeterminate,
      inputProps: props,
      inputRef: ref,
      inputType: "checkbox",
      label,
      size,
      style,
      styles,
    }),
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
