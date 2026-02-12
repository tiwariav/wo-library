import type { ElementType, ReactNode } from "react";

import clsx from "clsx";

import type { AsElementProps } from "../../AsElement.js";

import { useLayoutState } from "../../../contexts/LayoutContext/index.js";
import * as styles from "./sideNavItem.module.css";

export type SideNavItemProps<TElement extends ElementType = "div"> = {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  innerClassNames?: {
    icon?: string;
    text?: string;
  };
} & AsElementProps<TElement>;

export default function SideNavItem<TElement extends ElementType>({
  as,
  children,
  className,
  icon,
  innerClassNames,
  ...props
}: SideNavItemProps<TElement>) {
  const layoutState = useLayoutState();
  const Element = as ?? "div";

  return (
    <Element
      className={clsx(styles.root, className, {
        [styles.hasCompact]: layoutState.sideNav.hasCompactMode,
        [styles.isToggled]:
          layoutState.sideNav.isToggled && layoutState.sideNav.hasCompactMode,
      })}
      {...props}
    >
      {!!icon && (
        <span className={clsx(styles.icon, innerClassNames?.icon)}>{icon}</span>
      )}
      {!!children && (
        <span className={clsx(styles.text, innerClassNames?.text)}>
          {children}
        </span>
      )}
    </Element>
  );
}
