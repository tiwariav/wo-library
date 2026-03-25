import type { ElementType, ReactElement } from "react";

import { clsx } from "clsx";

import type { AsElementProps } from "../../AsElement.js";

import { getDynamicClassName } from "../../../tools/utils.js";
import * as styles from "./title.module.css";

export const TITLE_ALIGN_OPTIONS = ["center"] as const;
export const TITLE_VARIANT_OPTIONS = ["tinyline", "tinyline-left"] as const;

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
}: Readonly<TitleProps<TElement>>): ReactElement {
  const Element = (as ?? "div") as ElementType;
  return (
    <Element
      className={clsx(
        styles.root,
        align && getDynamicClassName(styles, `align-${align as string}`),
        variant && getDynamicClassName(styles, `is-${variant as string}`),
        className,
      )}
      {...props}
    />
  );
}
