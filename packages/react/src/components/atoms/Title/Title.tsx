/* eslint css-modules/no-unused-class: [2, {camelCase: true, markAsUsed: [
  is-tinyline, is-tinyline-left,
  align-center
]}] */

import type { ElementType } from "react";

import { clsx } from "clsx";

import type { AsElementProps } from "../../AsElement.js";

import { getDynamicClassName } from "../../../tools/utils.js";
import * as styles from "./title.module.css";

const TITLE_ALIGN_OPTIONS = ["center"] as const;
const TITLE_VARIANT_OPTIONS = ["tinyline", "tinyline-left"] as const;

type TitleProps<TElement extends ElementType = "div"> = {
  align?: (typeof TITLE_ALIGN_OPTIONS)[number];
  variant?: (typeof TITLE_VARIANT_OPTIONS)[number];
} & AsElementProps<TElement>;

export default function Title<TElement extends ElementType>({
  align,
  as,
  className,
  variant,
  ...props
}: TitleProps<TElement>) {
  const Element = as ?? "div";
  return (
    <Element
      className={clsx(
        styles.root,
        align && getDynamicClassName(styles, `align-${align}`),
        variant && getDynamicClassName(styles, `is-${variant}`),
        className,
      )}
      {...props}
    />
  );
}
