import type { ReactNode } from "react";

import { clsx } from "clsx";

import type { SideNavItemProps } from "./SideNavItem.js";

import SideNavItem from "./SideNavItem.js";
import * as styles from "./sideNavGroup.module.css";

export function SideNavTitle(props: SideNavItemProps) {
  return <SideNavItem className={clsx(styles.title)} {...props} />;
}

interface SideNavGroupProps {
  children: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
}
export default function SideNavGroup({
  children,
  icon,
  title,
  ...props
}: SideNavGroupProps) {
  return (
    <div className={clsx(styles.root)} {...props}>
      {!!title && <SideNavTitle icon={icon}>{title}</SideNavTitle>}
      {children}
    </div>
  );
}
