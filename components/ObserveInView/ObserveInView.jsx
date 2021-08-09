import clsx from "clsx";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import styles from "./observeInView.module.css";

export default function ObserveInView({
  className,
  dynamicClasses,
  observeOptions,
  ...props
}) {
  const [rootRef, inView, rootEntry] = useInView(observeOptions);
  const [rootClasses, setRootClasses] = useState();

  useEffect(() => {
    if (rootEntry) {
      const classNameProps = {
        [styles["in-view"]]: inView,
        [styles["out-bottom"]]: rootEntry.boundingClientRect.top > 0,
        [styles["out-top"]]: rootEntry.boundingClientRect.top < 0,
      };
      if (dynamicClasses && typeof dynamicClasses === "object") {
        Object.entries(dynamicClasses).forEach(([key, value]) => {
          classNameProps[value] = classNameProps[styles[key]];
        });
      }
      setRootClasses(classNameProps);
    }
  }, [inView, dynamicClasses, rootEntry]);

  return (
    <div ref={rootRef}>
      <div className={clsx(styles.root, rootClasses)} {...props} />
    </div>
  );
}
