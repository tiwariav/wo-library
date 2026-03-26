import { forwardRef, type ForwardedRef } from "react";

import type { SelectionControlPropsBase } from "../_shared/SelectionControlBase.js";
import { renderCheckableControl } from "../_shared/SelectionControlBase.js";
import * as styles from "./switch.module.css";

/**
 * Props for the `Switch` component.
 *
 * @property label - Label text or node displayed next to the switch.
 * @property size - Size variant: `"small"` | `"large"`.
 * @property hasError - Applies error styling when `true`.
 */
export type SwitchProps = SelectionControlPropsBase;

const renderSwitchControl = (
  { className, hasError, id, label, size, style, ...props }: SwitchProps,
  ref: ForwardedRef<HTMLInputElement>,
) =>
  renderCheckableControl({
    className,
    hasError,
    id,
    inputProps: props,
    inputRef: ref,
    inputRole: "switch",
    inputType: "checkbox",
    inputWrapperClassName: styles.switchWrapper,
    label,
    size,
    style,
    styles,
    trailingVisual: <span className={styles.slider} />,
  });

/**
 * An accessible switch (toggle) component.
 *
 * @example
 * ```tsx
 * <Switch label="Enable notifications" onChange={handleToggle} />
 * ```
 */
// eslint-disable-next-line @eslint-react/no-forward-ref
const Switch = forwardRef<HTMLInputElement, SwitchProps>(renderSwitchControl);
Switch.displayName = "Switch";

export default Switch;
