import type { ComponentPropsWithoutRef } from "react";

import * as styles from "./doubleBounce.module.css";

export default function DoubleBounce(props: Readonly<ComponentPropsWithoutRef<"div">>) {
  return (
    <div className={styles.root} {...props}>
      <div className={styles.bounce1} />
      <div className={styles.bounce2} />
    </div>
  );
}
