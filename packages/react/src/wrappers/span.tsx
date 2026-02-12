import clsx from "clsx";

import generateCssWrapper from "./generateCssWrapper.js";
import * as styles from "./span.module.css";

export const IconSpan = generateCssWrapper(
  clsx(styles.base, styles.icon),
  "span",
);
export const FormIconSpan = generateCssWrapper(
  clsx(styles.base, styles.formIcon),
  "span",
);
