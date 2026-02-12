import { clsx } from "clsx";

import * as styles from "./circleFadeDot.module.css";

export default function CircleFadeDot() {
  return (
    <div className={styles.root}>
      <div className={styles.skChild} />
      {/* jscpd:ignore-start */}
      <div className={clsx(styles.skCircle2, styles.skChild)} />
      <div className={clsx(styles.skCircle3, styles.skChild)} />
      <div className={clsx(styles.skCircle4, styles.skChild)} />
      <div className={clsx(styles.skCircle5, styles.skChild)} />
      <div className={clsx(styles.skCircle6, styles.skChild)} />
      <div className={clsx(styles.skCircle7, styles.skChild)} />
      <div className={clsx(styles.skCircle8, styles.skChild)} />
      <div className={clsx(styles.skCircle9, styles.skChild)} />
      <div className={clsx(styles.skCircle10, styles.skChild)} />
      <div className={clsx(styles.skCircle11, styles.skChild)} />
      <div className={clsx(styles.skCircle12, styles.skChild)} />
      {/* jscpd:ignore-end */}
    </div>
  );
}
