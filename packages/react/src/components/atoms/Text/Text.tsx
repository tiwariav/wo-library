import type { CSSProperties, ComponentPropsWithoutRef } from "react";

import { clsx } from "clsx";
import { memo } from "react";

import Spinner from "../Spinner/Spinner.js";
import TextLoader from "./TextLoader.js";
import * as styles from "./text.module.css";

export interface TextProps extends ComponentPropsWithoutRef<"div"> {
  inline?: boolean;
  isBusy?: boolean;
  isLoading?: boolean;
  lineHeight?: number;
  loaderStyles?: CSSProperties;
  maxLines?: number;
  minLines?: number;
}

function Text({
  children,
  className,
  inline,
  isBusy,
  isLoading,
  lineHeight = 1.5,
  loaderStyles,
  maxLines,
  minLines = 1,
  style,
  ...props
}: TextProps) {
  const textStyles: CSSProperties = {};
  if (maxLines) {
    textStyles.maxHeight = `${maxLines * lineHeight}em`;
    textStyles.WebkitLineClamp = maxLines;
  }
  if (minLines) {
    textStyles.minHeight = `${minLines * lineHeight}em`;
  }

  const Wrapper = inline ? "span" : "div";

  return (
    <Wrapper
      className={clsx(styles.text, { [styles.inline]: inline }, className)}
      style={{ ...textStyles, ...style }}
      {...props}
    >
      {isLoading ? (
        <TextLoader
          className={styles.loader}
          lines={minLines}
          style={{ height: textStyles.minHeight, ...loaderStyles }}
        />
      ) : (
        children
      )}
      {isBusy && <Spinner />}
    </Wrapper>
  );
}

export default memo(Text);
