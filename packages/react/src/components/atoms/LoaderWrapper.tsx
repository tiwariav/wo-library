import type { ComponentPropsWithoutRef } from "react";

import * as styles from "./loaderWrapper.module.css";

/**
 * Minimal `<div>` wrapper styled to fill its container during a loading state.
 * Typically used as a slot-level placeholder while content or sub-components load.
 *
 * @example
 * {isLoading ? <LoaderWrapper /> : <MyContent />}
 */
export default function LoaderWrapper(props: ComponentPropsWithoutRef<"div">) {
  return <div className={styles.root} {...props} />;
}
