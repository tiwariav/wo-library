import type { ComponentPropsWithoutRef } from "react";

import { clsx } from "clsx";
import { isString } from "lodash-es";
import { forwardRef } from "react";

import * as styles from "./label.module.css";

interface LabelProps extends ComponentPropsWithoutRef<"label"> {
  className?: string;
  required?: boolean | string;
  withFocus?: boolean;
  withValue?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, required, withFocus, withValue, ...props }, ref) => {
    const requiredText = isString(required) && required;
    return (
      children && (
        <label
          className={clsx(
            styles.root,
            {
              [styles.required]: required && !requiredText,
              [styles.withFocus]: withFocus,
              [styles.withValue]: withValue,
            },
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
          {!!requiredText && ` ( ${requiredText} )`}
        </label>
      )
    );
  },
);
Label.displayName = "Label";

export default Label;
