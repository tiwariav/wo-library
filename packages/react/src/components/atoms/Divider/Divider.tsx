/* eslint css-modules/no-unused-class: [2, {camelCase: true, markAsUsed: [
  'space-none', 'space-small', 'space-large', 'space-medium'
]}] */

import type { ComponentPropsWithoutRef } from "react";

import { clsx } from "clsx";
import React from "react";

import { getDynamicClassName } from "../../../tools/utils.js";
import * as styles from "./divider.module.css";

export const DIVIDER_SPACING_OPTIONS = [
  "none",
  "small",
  "medium",
  "large",
] as const;

/**
 * Props for the {@link Divider} component.
 */
export interface DividerProps extends ComponentPropsWithoutRef<"div"> {
  /** Controls the margin size around the divider. @default 'medium' */
  spacing?: (typeof DIVIDER_SPACING_OPTIONS)[number];
  /** Renders a vertical divider (`<div>`) instead of horizontal (`<hr>`). */
  vertical?: boolean;
}

export default function Divider({
  className,
  spacing = "medium",
  vertical,
  ...props
}: DividerProps) {
  return React.createElement(
    vertical ? "div" : "hr",
    {
      className: clsx(
        styles.root,
        !vertical && styles.isHorizontal,
        vertical && styles.isVertical,
        getDynamicClassName(styles, `space-${spacing}`),
        className,
      ),
      role: "separator",
      ...props,
    },
    null,
  );
}
