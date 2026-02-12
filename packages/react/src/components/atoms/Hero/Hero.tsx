import { clsx } from "clsx";

import * as styles from "./hero.module.css";

interface HeroProps {
  children?: React.ReactNode;
  midContent?: React.ReactNode;
  title?: React.ReactNode;
}

export default function Hero({ children, midContent, title }: HeroProps) {
  return (
    <div className={clsx(styles.hero)}>
      <div className={clsx(styles.content)}>
        {!!title && <h1 className={clsx(styles.title)}>{title}</h1>}
        {!!midContent && <div className={styles.contentMid}>{midContent}</div>}
        {children}
      </div>
    </div>
  );
}
