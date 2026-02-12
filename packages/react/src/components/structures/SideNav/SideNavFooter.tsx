import type { ComponentPropsWithoutRef } from "react";

import { clsx } from "clsx";

import * as styles from "./sideNavFooter.module.css";

interface SideNavFooterProps extends ComponentPropsWithoutRef<"div"> {
  hasSeparator?: boolean;
}

export default function SideNavFooter({
  children,
  hasSeparator,
  ...props
}: SideNavFooterProps) {
  return (
    <div
      className={clsx(styles.root, {
        [styles.hasSeparator]: hasSeparator,
      })}
      {...props}
    >
      {children}
    </div>
  );
}
