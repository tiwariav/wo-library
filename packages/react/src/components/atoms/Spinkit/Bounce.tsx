import { clsx } from "clsx";

import * as styles from "./bounce.module.css";

export default function Bounce() {
  return (
    <div className={styles.root}>
      <div className={clsx(styles.bounce)} />
      <div className={clsx(styles.bounce, styles.bounce1)} />
      <div className={clsx(styles.bounce, styles.bounce2)} />
    </div>
  );
}
