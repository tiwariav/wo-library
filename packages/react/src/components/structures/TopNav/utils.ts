import type {
  CSSProperties,
  ForwardedRef,
  MutableRefObject,
  RefObject,
} from "react";

import clsx from "clsx";
import { isObject } from "lodash-es";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useWindowSize } from "react-use";
import { useScrollDirection } from "wo-library/hooks/index.js";

import {
  useLayoutMethods,
  useLayoutState,
} from "../../../contexts/LayoutContext/index.js";
import usePropRef from "../../../hooks/usePropRef.js";
import { BREAKPOINTS } from "../../../styles/media.js";
import { getDynamicClassName } from "../../../tools/utils.js";
import * as styles from "./utils.module.css";

export const TOPNAV_VARIANTS = ["transparent", "flat", "underlined"] as const;

export type TopNavVariant =
  | (typeof TOPNAV_VARIANTS)[number]
  | {
      expanded?: (typeof TOPNAV_VARIANTS)[number];
      normal?: (typeof TOPNAV_VARIANTS)[number];
    };

const HIDE_ON_SCROLL_OFFSET = 16;

function useVariantClassName({
  topNavExpanded,
  variant,
}: {
  topNavExpanded?: boolean;
  variant?: TopNavVariant;
}) {
  return useMemo(() => {
    if (isObject(variant)) {
      if (topNavExpanded && variant.expanded) {
        return getDynamicClassName(styles, `variant-${variant.expanded}`);
      }
      if (variant.normal) {
        return getDynamicClassName(styles, `variant-${variant.normal}`);
      }
      return "";
    }
    return variant && getDynamicClassName(styles, `variant-${variant}`);
  }, [topNavExpanded, variant]);
}

export interface StickyOptions {
  hideOffset?: number;
  hideOnScroll?: "contentLeft" | boolean;
  shrinkOffset?: number;
}

interface ScrollUpdateOptions {
  containerRef?: RefObject<HTMLDivElement>;
  contentLeftRef?: RefObject<HTMLDivElement>;
  sticky?: StickyOptions | boolean;
}

function useScrollUpdates({
  containerRef,
  contentLeftRef,
  rootRef,
  sticky,
}: {
  rootRef: MutableRefObject<HTMLDivElement | null>;
} & ScrollUpdateOptions) {
  const layoutState = useLayoutState();
  const { direction, y: scrollY } = useScrollDirection(containerRef);

  const topNavMaxHeight = useRef<number>(0);

  const {
    hideOffset = 0,
    hideOnScroll,
    shrinkOffset = 0,
  } = useMemo(() => (isObject(sticky) ? sticky : {}), [sticky]);
  const transform = useMemo(() => {
    if (
      !hideOnScroll ||
      direction !== "down" ||
      !!layoutState.topNav.isDrawerToggled ||
      !rootRef.current ||
      scrollY + hideOffset < rootRef.current.offsetHeight
    ) {
      return 0;
    }
    if (hideOnScroll === "contentLeft" && contentLeftRef?.current) {
      return `${contentLeftRef.current.offsetHeight + HIDE_ON_SCROLL_OFFSET}px`;
    }
    return `-${rootRef.current.scrollHeight}px`;
  }, [
    hideOnScroll,
    direction,
    layoutState.topNav.isDrawerToggled,
    rootRef,
    scrollY,
    hideOffset,
    contentLeftRef,
  ]);

  const topNavExpanded = useMemo(() => {
    const currentHeight = rootRef.current?.offsetHeight ?? 0;
    topNavMaxHeight.current = Math.max(topNavMaxHeight.current, currentHeight);
    const diff = topNavMaxHeight.current - currentHeight;
    return scrollY + diff < shrinkOffset;
  }, [scrollY, rootRef, shrinkOffset]);

  return { direction, shrinkOffset, topNavExpanded, transform };
}

function useTopNavEffects(transform: number | string) {
  const layoutDispatch = useLayoutMethods();
  const [smallerWidth, setSmallerWidth] = useState<boolean>();
  const { width } = useWindowSize();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    layoutDispatch.dispatch.updateTopNav({
      isHidden: !!transform,
    });
  }, [layoutDispatch.dispatch, transform]);

  useLayoutEffect(() => {
    setSmallerWidth(width <= BREAKPOINTS.lg);
  }, [width]);

  useLayoutEffect(() => {
    setIsReady(true);
  }, []);

  return { isReady, smallerWidth };
}

export interface TopNavInnerClassNames {
  container?: string;
  contentMenu?: string;
  isExpanded?: string;
}

export interface UseTopNavPropsOptions extends ScrollUpdateOptions {
  className?: string;
  innerClassNames?: TopNavInnerClassNames;
  style?: CSSProperties;
  variant?: TopNavVariant;
}

export function useTopNavProps(
  {
    className,
    containerRef,
    contentLeftRef,
    innerClassNames,
    sticky,
    style,
    variant,
  }: UseTopNavPropsOptions,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const layoutState = useLayoutState();
  const { innerRef, setInnerRef } = usePropRef(ref ?? layoutState.refs.topNav);
  const { direction, shrinkOffset, topNavExpanded, transform } =
    useScrollUpdates({
      containerRef,
      contentLeftRef,
      rootRef: innerRef,
      sticky,
    });
  const { isReady, smallerWidth } = useTopNavEffects(transform);
  const variantClassName = useVariantClassName({ topNavExpanded, variant });

  return {
    containerClassName: styles.container,
    props: {
      className: clsx(
        styles.root,
        variantClassName,
        {
          [styles.isScrolled]: direction,
          [styles.isSticky]: sticky && isReady,
        },
        ((shrinkOffset > 0 && typeof window === "undefined") ||
          (topNavExpanded && isReady)) && [
          styles.isExpanded,
          innerClassNames?.isExpanded,
        ],
        className,
      ),
      ref: setInnerRef,
      style: {
        transform: isReady ? `translateY(${transform})` : "none",
        ...style,
      },
    },
    smallerWidth,
  };
}
