import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  ReactElement,
} from "react";

import { clsx } from "clsx";
import { memo } from "react";

import Spinner from "../Spinner/Spinner.js";
import TextLoader from "./TextLoader.js";
import * as styles from "./text.module.css";

/**
 * Props for the `Text` component.
 *
 * @property inline - Renders as `<span>` instead of `<div>` when `true`.
 * @property isBusy - Shows a spinner alongside the text.
 * @property isLoading - Shows a skeleton content loader.
 * @property lineHeight - Line-height multiplier used to compute `minHeight`/`maxHeight`.
 * @property maxLines - Clamps text to this many visible lines.
 * @property minLines - Reserves vertical space for at least this many lines.
 */
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
}: Readonly<TextProps>): ReactElement {
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
