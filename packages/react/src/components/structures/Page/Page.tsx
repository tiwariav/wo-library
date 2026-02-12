import type { ReactElement, ReactNode } from "react";

import { clsx } from "clsx";
import { isObject } from "lodash-es";
import React, { useMemo } from "react";

import type { SideNavProps } from "../SideNav/SideNav.js";
import type { TopNavProps } from "../TopNav/TopNav.js";

import { LayoutProvider } from "../../../contexts/LayoutContext/index.js";
import { SideNavToggle } from "../SideNav/SideNav.js";
import * as styles from "./page.module.css";

const variantTsc = "[T][SC]";
const variantStc = "[S][TC]";
const variantOptions = [variantTsc, variantStc] as const;

interface PageProps {
  children?: ReactNode;
  className?: string;
  hero?: ReactNode;
  innerClassNames?: {
    container?: string;
    content?: string;
    hero?: string;
  };
  isCentered?: boolean;
  sideNav?: ReactElement;
  topNav?: ReactElement;
  variant?: (typeof variantOptions)[number];
}

function PageInner({
  children,
  className,
  hero,
  innerClassNames,
  isCentered,
  sideNav,
  topNav,
  variant = variantTsc,
}: PageProps) {
  const topNavMemo = useMemo(() => {
    if (!topNav) {
      return null;
    }
    const topNavProps = { ...topNav.props } as TopNavProps;
    if (sideNav && topNavProps.sticky) {
      topNavProps.leftNavIcon = <SideNavToggle />;
    }
    return React.cloneElement(topNav, topNavProps);
  }, [topNav, sideNav]);

  const sideNavMemo = useMemo(() => {
    if (!sideNav) {
      return null;
    }
    const topNavProps = (topNav?.props || {}) as TopNavProps;
    const sideNavProps = { ...sideNav.props } as SideNavProps;
    if (
      variant === variantTsc &&
      sideNavProps.sticky &&
      topNavProps.sticky &&
      (!isObject(topNavProps.sticky) ||
        !topNavProps.sticky.hideOnScroll ||
        topNavProps.variant !== "transparent")
    ) {
      if (sideNavProps.sticky === true) {
        sideNavProps.sticky = { topNavOffset: true };
      } else {
        sideNavProps.sticky.topNavOffset = true;
      }
    }
    return React.cloneElement(sideNav, sideNavProps);
  }, [sideNav, topNav?.props, variant]);

  return (
    <div
      className={clsx(
        styles.root,
        {
          [styles.variantStc]: variant === variantStc,
        },
        className,
      )}
    >
      {variant === variantTsc ? topNavMemo : sideNavMemo}
      <main
        className={clsx(styles.main, {
          [styles.isCentered]: isCentered,
        })}
      >
        {variant === variantStc && topNavMemo}
        {hero}
        <div className={clsx(styles.container, innerClassNames?.container)}>
          {variant === variantTsc && sideNavMemo}
          <div className={clsx(styles.content, innerClassNames?.content)}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function Page({ ...props }: PageProps) {
  return (
    <LayoutProvider>
      <PageInner {...props} />
    </LayoutProvider>
  );
}

export default Page;
