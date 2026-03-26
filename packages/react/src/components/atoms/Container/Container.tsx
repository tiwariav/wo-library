import type { ComponentPropsWithoutRef } from "react";

import { clsx } from "clsx";

import { getDynamicClassName } from "../../../tools/utils.js";
import * as styles from "./container.module.css";

export const CONTAINER_SPACINGS = [
  "none",
  "small",
  "large",
  "horizontal",
] as const;
export const CONTAINER_HEIGHTS = ["readable", "full"] as const;
export const CONTAINER_WIDTHS = ["small", "xsmall"] as const;

/**
 * Props for the `Container` layout component.
 *
 * @property align - `"center"` horizontally centres the container.
 * @property height - `"readable"` caps height for readability; `"full"` fills available height.
 * @property spacing - Internal padding: `"none"` | `"small"` | `"large"` | `"horizontal"`.
 * @property variant - `"secondary"` applies alternate background styling.
 * @property width - Constrains max-width: `"small"` | `"xsmall"`.
 */
export interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  align?: "center";
  height?: (typeof CONTAINER_HEIGHTS)[number];
  spacing?: (typeof CONTAINER_SPACINGS)[number];
  variant?: "secondary";
  width?: (typeof CONTAINER_WIDTHS)[number];
}

export default function Container({
  align,
  children,
  className,
  height,
  spacing,
  variant,
  width,
  ...props
}: Readonly<ContainerProps>) {
  return (
    <div
      className={clsx(
        styles.container,
        spacing && getDynamicClassName(styles, `spacing-${spacing}`),
        variant && getDynamicClassName(styles, `variant-${variant}`),
        height && getDynamicClassName(styles, `height-${height}`),
        align && getDynamicClassName(styles, `align-${align}`),
        width && getDynamicClassName(styles, `width-${width}`),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
