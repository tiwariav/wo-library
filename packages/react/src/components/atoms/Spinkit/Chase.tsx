import type { ComponentPropsWithoutRef } from "react";

import * as styles from "./chase.module.css";

export default function Chase(props: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={styles.root} {...props}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div className={styles.dot} key={index} />
      ))}
    </div>
  );
}
