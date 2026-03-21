import type { IntersectionOptions } from "react-intersection-observer";
import type { Entries } from "type-fest";

import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import * as styles from "./observeInView.module.css";

/**
 * Props for the {@link ObserveInView} component.
 */
interface ObserveInViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether CSS animation classes should be applied when the element enters/leaves the viewport. */
  animate: boolean;
  children: React.ReactNode;
  className?: string;
  /** Additional CSS class names applied in response to intersection state changes. */
  dynamicClasses?: {
    /** Applied when `animate` is `true`. */
    animate?: string;
    /** Applied when the element is in the viewport. */
    inView?: string;
    /** Applied when out of view and scrolled below the viewport. */
    outBottom?: string;
    /** Applied when out of view and scrolled above the viewport. */
    outTop?: string;
  };
  /** Options forwarded to `react-intersection-observer`'s `useInView`. */
  observeOptions: IntersectionOptions;
  /** Callback fired whenever visibility state changes. */
  onViewChange?: (inView: boolean) => void;
}

export default function ObserveInView({
  animate,
  children,
  className,
  dynamicClasses,
  observeOptions,
  onViewChange,
  ...props
}: Readonly<ObserveInViewProps>) {
  const [rootRef, inView, rootEntry] = useInView(observeOptions);
  const [rootClasses, setRootClasses] = useState<Record<string, boolean>>();

  useEffect(() => {
    if (rootEntry) {
      const classNameProps = {
        [styles.animate]: animate,
        [styles.inView]: inView,
        [styles.outBottom]: !inView && rootEntry.boundingClientRect.top > 0,
        [styles.outTop]: !inView && rootEntry.boundingClientRect.top < 0,
      };
      if (dynamicClasses) {
        for (const [key, value] of Object.entries(dynamicClasses) as Entries<
          ObserveInViewProps["dynamicClasses"]
        >) {
          if (value === undefined) {
            continue;
          }
          classNameProps[value] = classNameProps[styles[key]];
        }
      }
      setRootClasses(classNameProps);
    }
  }, [inView, dynamicClasses, rootEntry, animate]);

  useEffect(() => {
    onViewChange?.(inView);
  }, [inView, onViewChange]);

  return (
    <div className={clsx(rootClasses, className)} ref={rootRef} {...props}>
      {children}
    </div>
  );
}
