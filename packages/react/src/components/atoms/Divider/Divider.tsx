/* eslint css-modules/no-unused-class: [2, {camelCase: true, markAsUsed: [
  'space-none', 'space-small', 'space-large', 'space-medium'
]}] */

import type { ComponentPropsWithoutRef } from "react";

import { clsx } from "clsx";
import React from "react";

import { getDynamicClassName } from "../../../tools/utils.js";
import * as styles from "./divider.module.css";

const DIVIDER_SPACING_OPTIONS = ["none", "small", "medium", "large"] as const;

export interface DividerProps extends ComponentPropsWithoutRef<"div"> {
  spacing?: (typeof DIVIDER_SPACING_OPTIONS)[number];
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
