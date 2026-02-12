import clsx from "clsx";

import * as styles from "./div.module.css";
import generateCssWrapper from "./generateCssWrapper.js";

export const FlexColDiv = generateCssWrapper(
  clsx(styles.flex, styles.flexColumn),
);
export const FlexAlignCenterDiv = generateCssWrapper(
  clsx(styles.flex, styles.flexAlignCenter),
);
export const ContentMenuIcon = generateCssWrapper(styles.contentMenuIcon);
