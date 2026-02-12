import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { clsx } from "clsx";

import { IconSpan } from "../../../wrappers/span.js";
import Spinner from "../Spinner/Spinner.js";
import TagLoader from "./TagLoader.js";
import * as styles from "./tag.module.css";

interface TagProps extends ComponentPropsWithoutRef<"span"> {
  iconAfter?: ReactNode;
  iconBefore?: ReactNode;
  isBusy?: boolean;
  isLoading?: boolean;
}

function Tag({
  children,
  className,
  iconAfter,
  iconBefore,
  isBusy,
  isLoading,
  ...props
}: TagProps) {
  return (
    <span className={clsx(styles.container, className)} {...props}>
      {isLoading ? (
        <TagLoader iconAfter={!!iconAfter} iconBefore={!!iconBefore} />
      ) : (
        <>
          {!!iconBefore && <IconSpan>{iconBefore}</IconSpan>}
          {children}
          {!!iconAfter && (
            <IconSpan className={styles.isAfter}>{iconAfter}</IconSpan>
          )}
        </>
      )}
      {isBusy && <Spinner />}
    </span>
  );
}

export default Tag;
