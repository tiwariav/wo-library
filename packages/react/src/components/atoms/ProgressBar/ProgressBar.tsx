import { clsx } from "clsx";

import type { COMPONENT_SIZES } from "../../../tools/constants/props.js";

import { getDynamicClassName } from "../../../tools/utils.js";
import * as styles from "./progressBar.module.css";

/**
 * Props for the `ProgressBar` component.
 *
 * @property progress - Progress value between 0 and 100.
 * @property size - Size variant: `"small"` | `"large"`.
 * @property variant - Visual style: `"primary"` | `"filled"`.
 */
export interface ProgressBarProps {
  className?: string;
  progress: number;
  size?: (typeof COMPONENT_SIZES)[number];
  variant?: "primary" | "filled";
}

/**
 * A horizontal progress bar component.
 *
 * @example
 * ```tsx
 * <ProgressBar progress={45} variant="primary" />
 * ```
 */
export default function ProgressBar({
  className,
  progress,
  size,
  variant = "primary",
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div
      className={clsx(
        styles.root,
        size && getDynamicClassName(styles, `size-${size}`),
        getDynamicClassName(styles, `variant-${variant}`),
        className,
      )}
    >
      <div
        className={styles.fill}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
}
