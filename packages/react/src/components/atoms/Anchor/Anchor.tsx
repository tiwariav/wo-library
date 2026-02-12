/* eslint css-modules/no-unused-class: [2, {camelCase: true, markAsUsed: [
  size-small, size-large,
  variant-list-item, variant-nav-item, variant-outlined,
  variant-filled, variant-basic, variant-color,
  spacing-less, spacing-extra,
]}] */

import type { ElementType, ReactNode, Ref } from "react";

import { clsx } from "clsx";

import type {
  COMPONENT_SIZES,
  COMPONENT_SPACINGS,
} from "../../../tools/constants/props.js";
import type { AsElementProps } from "../../AsElement.js";

import {
  genericForwardRef,
  getDynamicClassName,
} from "../../../tools/utils.js";
import { IconSpan } from "../../../wrappers/span.js";
import * as styles from "./anchor.module.css";

export const ANCHOR_VARIANTS = [
  "color",
  "filled",
  "list-item",
  "nav-item",
  "outlined",
] as const;

export type AnchorProps<TElement extends ElementType = "a"> = {
  iconAfter?: ReactNode;
  iconBefore?: ReactNode;
  noVisited?: boolean;
  size?: (typeof COMPONENT_SIZES)[number];
  spacing?: (typeof COMPONENT_SPACINGS)[number];
  variant?: (typeof ANCHOR_VARIANTS)[number];
} & AsElementProps<TElement>;

/**
 * Primary UI component for user interaction
 */
const Anchor = genericForwardRef(
  <TElement extends ElementType>(
    {
      as,
      children,
      className,
      iconAfter,
      iconBefore,
      noVisited,
      size,
      spacing,
      variant,
      ...props
    }: AnchorProps<TElement>,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    /* jscpd:ignore-start */
    const Element = as ?? "a";
    return (
      <Element
        className={clsx(
          styles.anchor,
          {
            [styles.noVisited]: noVisited,
          },
          size && getDynamicClassName(styles, `size-${size}`),
          variant && getDynamicClassName(styles, `variant-${variant}`),
          spacing && getDynamicClassName(styles, `spacing-${spacing}`),
          className,
        )}
        ref={ref}
        {...props}
        /* jscpd:ignore-end */
      >
        {!!iconBefore && <IconSpan>{iconBefore}</IconSpan>}
        {children}
        {!!iconAfter && (
          <IconSpan className={styles.iconAfter}>{iconAfter}</IconSpan>
        )}
      </Element>
    );
  },
  "Anchor",
);

export default Anchor;
