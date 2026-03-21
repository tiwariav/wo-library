import type { ComponentPropsWithoutRef, ReactElement } from "react";

import * as styles from "./textIcon.module.css";

/**
 * Inline `<span>` that lays out text and an adjacent icon with consistent spacing.
 * Typically used to pair a label with a Tabler icon.
 *
 * @example
 * <TextIcon>
 *   <IconStar size={16} />
 *   Featured
 * </TextIcon>
 */
export default function Text({
  children,
  ...props
}: Readonly<ComponentPropsWithoutRef<"span">>): ReactElement {
  return (
    <span className={styles.container} {...props}>
      {children}
    </span>
  );
}
