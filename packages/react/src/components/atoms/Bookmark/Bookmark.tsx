import type { ComponentPropsWithoutRef } from "react";

import { IconCircleChevronRight } from "@tabler/icons-react";
import { Children } from "react";

import * as styles from "./bookmark.module.css";

export default function Bookmark({
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={styles.bookmark} {...props}>
      {Children.map(children, (child, index) => (
        <span className={styles.item}>
          <span className={styles.text}>{child}</span>
          {index < Children.count(children) - 1 && (
            <span className={styles.separator}>
              <IconCircleChevronRight />
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
