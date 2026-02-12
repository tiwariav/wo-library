/* eslint css-modules/no-unused-class: [2, {camelCase: true, markAsUsed: [
  'variant-basic', 'layout-horizontal', 'variant-borderless', 'view-thumb',
  'floating-highest', 'floating-high', 'floating-medium', 'floating-low', 'floating-lowest', 'floating-none',
  'flying-medium',
  'height-full'
]}] */

/* jscpd:ignore-start */
import type { ElementType, ReactNode, Ref } from "react";

import { clsx } from "clsx";
/* jscpd:ignore-end */

import type { COMPONENT_FLOAT } from "../../../tools/constants/props.js";
import type { AsElementProps } from "../../AsElement.js";

import {
  genericForwardRef,
  getDynamicClassName,
} from "../../../tools/utils.js";
import Spinner from "../Spinner/Spinner.js";
import * as styles from "./card.module.css";

export const CARD_LAYOUTS = ["horizontal"] as const;
export const CARD_VARIANTS = ["basic", "borderless"] as const;
export const CARD_VIEW_MODES = ["thumb"] as const;
export const CARD_HEIGHTS = ["full"] as const;
export const CARD_FLYING = ["medium"] as const;

export type CardProps<TElement extends ElementType = "div"> = {
  floating?: (typeof COMPONENT_FLOAT)[number];
  flying?: (typeof CARD_FLYING)[number];
  height?: (typeof CARD_HEIGHTS)[number];
  image?: ReactNode;
  innerClassNames?: {
    content?: string;
  };
  isBusy?: boolean;
  layout?: (typeof CARD_LAYOUTS)[number];
  variant?: (typeof CARD_VARIANTS)[number];
  viewMode?: (typeof CARD_VIEW_MODES)[number];
} & AsElementProps<TElement>;

const Card = genericForwardRef(
  <TElement extends ElementType>(
    {
      as,
      children,
      className,
      floating,
      flying,
      height,
      image,
      innerClassNames = {},
      isBusy,
      layout,
      variant = "basic",
      viewMode,
      ...props
    }: CardProps<TElement>,
    ref: Ref<HTMLDivElement>,
  ) => {
    const Element = as ?? "div";
    return (
      <Element
        className={clsx(
          styles.card,
          getDynamicClassName(styles, `variant-${variant}`),
          layout && getDynamicClassName(styles, `layout-${layout}`),
          viewMode && getDynamicClassName(styles, `view-${viewMode}`),
          floating && getDynamicClassName(styles, `floating-${floating}`),
          flying && getDynamicClassName(styles, `flying-${flying}`),
          height && getDynamicClassName(styles, `height-${height}`),
          className,
        )}
        ref={ref}
        {...props}
      >
        {!!image && <div className={styles.image}>{image}</div>}
        {!!children && (
          <div className={clsx([styles.content], innerClassNames.content)}>
            {children}
          </div>
        )}
        {isBusy && <Spinner />}
      </Element>
    );
  },
  "Card",
);

export default Card;
