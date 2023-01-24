import { clsx } from "clsx";
import { isObject } from "lodash-es";
import { useEffect, useState } from "react";
import { IntersectionOptions, useInView } from "react-intersection-observer";
import styles from "./observeInView.module.css";

type ObserveInViewProps = {
  animate: boolean;
  className?: string;
  dynamicClasses?: Record<string, string>;
  observeOptions: IntersectionOptions;
  onViewChange: (boolean) => void;
};

export default function ObserveInView({
  animate,
  className,
  dynamicClasses,
  observeOptions,
  onViewChange,
  ...props
}: ObserveInViewProps) {
  const [rootRef, inView, rootEntry] = useInView(observeOptions);
  const [rootClasses, setRootClasses] = useState<Record<string, any>>();

  useEffect(() => {
    if (rootEntry) {
      const classNameProps = {
        [styles.animate]: animate,
        [styles["in-view"]]: inView,
        [styles["out-bottom"]]: !inView && rootEntry.boundingClientRect.top > 0,
        [styles["out-top"]]: !inView && rootEntry.boundingClientRect.top < 0,
      };
      if (dynamicClasses && isObject(dynamicClasses)) {
        for (const [key, value] of Object.entries(dynamicClasses)) {
          classNameProps[value] = classNameProps[styles[key]];
        }
      }
      setRootClasses(classNameProps);
    }
  }, [inView, dynamicClasses, rootEntry, animate]);

  useEffect(() => {
    if (onViewChange) {
      onViewChange(inView);
    }
  }, [inView, onViewChange]);

  return (
    <div ref={rootRef} className={clsx(rootClasses, className)} {...props} />
  );
}
