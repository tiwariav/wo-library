import { forwardRef } from "react";

import {
  renderCheckableControl,
  type SelectionControlPropsBase,
} from "../_shared/SelectionControlBase.js";
import * as styles from "../Checkbox/checkbox.module.css";

/**
 * Props for the `Radio` component.
 *
 * @property label - Label text or node displayed next to the radio button.
 * @property size - Size variant: `"small"` | `"large"`.
 * @property hasError - Applies error styling when `true`.
 */
export type RadioProps = SelectionControlPropsBase;

/**
 * A standard radio input component.
 *
 * @example
 * ```tsx
 * <Radio name="option" value="1" label="Option 1" />
 * <Radio name="option" value="2" label="Option 2" />
 * ```
 */
// eslint-disable-next-line @eslint-react/no-forward-ref
const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, hasError, id, label, size, style, ...props }, ref) =>
    renderCheckableControl({
      className,
      hasError,
      id,
      inputProps: props,
      inputRef: ref,
      inputType: "radio",
      label,
      size,
      style,
      styles,
    }),
);
Radio.displayName = "Radio";

export default Radio;
