import type { IntersectionOptions } from "react-intersection-observer";
import type { Entries } from "type-fest";

import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import styles from "./observeInView.module.css";

interface ObserveInViewProps {
  animate: boolean;
  className?: string;
  dynamicClasses?: {
    animate?: string;
    inView?: string;
    outBottom?: string;
    outTop?: string;
  };
  observeOptions: IntersectionOptions;
  onViewChange?: (inView: boolean) => void;
}

export default function ObserveInView({
  animate,
  className,
  dynamicClasses,
  observeOptions,
  onViewChange,
  ...props
}: ObserveInViewProps) {
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
    <div className={clsx(rootClasses, className)} ref={rootRef} {...props} />
  );
}
