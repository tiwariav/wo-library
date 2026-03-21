import { clsx } from "clsx";

import * as styles from "./hero.module.css";

/**
 * Props for the {@link Hero} component.
 */
interface HeroProps {
  /** Additional content rendered below `midContent` inside the hero body. */
  children?: React.ReactNode;
  /** Secondary content area rendered between the title and children. */
  midContent?: React.ReactNode;
  /** Primary heading rendered as an `<h1>` inside the hero. */
  title?: React.ReactNode;
}

/**
 * Full-width hero section with an optional title, mid-content area, and body content.
 *
 * @example
 * <Hero title="Welcome" midContent={<SearchBar />}>
 *   <CallToAction />
 * </Hero>
 */
export default function Hero({ children, midContent, title }: Readonly<HeroProps>) {
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
