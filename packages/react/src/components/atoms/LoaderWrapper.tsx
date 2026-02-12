import type { ComponentPropsWithoutRef } from "react";

import * as styles from "./loaderWrapper.module.css";

export default function LoaderWrapper(props: ComponentPropsWithoutRef<"div">) {
  return <div className={styles.root} {...props} />;
}
