import type { ForwardedRef } from "react";

import { useEffect, useLayoutEffect } from "react";
import { useLockBodyScroll, useScrollbarWidth, useWindowSize } from "react-use";
import { cssVariable } from "wo-library/tools/css.js";

import {
  useLayoutMethods,
  useLayoutState,
} from "../../../contexts/LayoutContext/index.js";
import usePropRef from "../../../hooks/usePropRef.js";
import { BREAKPOINTS } from "../../../styles/media.js";

const CSS_VAR_OFFSET = "--ye-layout-side-nav-offset";
const CSS_VAR_TOGGLE_WIDTH = "--ye-layout-side-nav-toggle-width";
const TOGGLE_WIDTH_MULTIPLIER = 0.5;

function getNewProperties(
  sideNavElement: HTMLDivElement,
  topNavElement: HTMLDivElement | null,
  {
    scrollWidth,
    topNavOffset,
  }: {
    scrollWidth?: number;
    topNavOffset?: boolean;
  },
) {
  const newProperties: Record<string, string> = {};
  let finalScrollHeight = sideNavElement.scrollHeight;
  if (topNavOffset && topNavElement) {
    newProperties[CSS_VAR_OFFSET] = `${topNavElement.offsetHeight}px`;
    finalScrollHeight += topNavElement.offsetHeight;
  }
  if (finalScrollHeight > sideNavElement.clientHeight) {
    const toggleWidth = Number.parseInt(cssVariable(CSS_VAR_TOGGLE_WIDTH));
    if (toggleWidth) {
      newProperties[CSS_VAR_TOGGLE_WIDTH] = `${
        toggleWidth + (scrollWidth ?? 0) * TOGGLE_WIDTH_MULTIPLIER
      }px`;
    }
  }
  return newProperties;
}

export function useSideNavEffects(
  ref: ForwardedRef<HTMLDivElement>,
  {
    hasCompactMode = true,
    topNavOffset,
  }: { hasCompactMode?: boolean; topNavOffset?: boolean },
) {
  const layoutState = useLayoutState();
  const layoutDispatch = useLayoutMethods();
  const { innerRef, setInnerRef } = usePropRef([ref, layoutState.refs.sideNav]);
  const scrollWidth = useScrollbarWidth();
  const { width } = useWindowSize();
  const isMobile = width < BREAKPOINTS.sm;

  useLockBodyScroll(!!isMobile && !!layoutState.sideNav.isToggled);

  useLayoutEffect(() => {
    const sideNavElement = innerRef.current;
    if (!sideNavElement) {
      return;
    }
    const topNavRef = layoutState.refs.topNav;
    const newProperties = getNewProperties(sideNavElement, topNavRef.current, {
      topNavOffset,
    });
    for (const [key, value] of Object.entries(newProperties)) {
      sideNavElement.style.setProperty(key, value);
    }
  }, [innerRef, layoutState.refs.topNav, scrollWidth, topNavOffset, width]);

  useEffect(() => {
    layoutDispatch.dispatch.updateSideNav({ hasCompactMode });
  }, [hasCompactMode, layoutDispatch.dispatch]);

  return { setInnerRef };
}
