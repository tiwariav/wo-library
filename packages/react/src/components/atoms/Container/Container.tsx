/* eslint css-modules/no-unused-class: [2, {camelCase: true, markAsUsed: [
  variant-secondary,
  align-center,
  width-xsmall, width-small,
  height-readable, height-full,
  spacing-none, spacing-small, spacing-large, spacing-horizontal
]}] */

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
}: ContainerProps) {
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
