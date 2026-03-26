import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ForwardedRef,
  ReactNode,
} from "react";

import { clsx } from "clsx";
import { isFunction } from "lodash-es";
import { useId } from "react";

import type { COMPONENT_SIZES } from "../../../tools/constants/props.js";

import { getDynamicClassName } from "../../../tools/utils.js";
import Label from "../Label.js";

interface SelectionControlStyles {
  hasError?: string;
  label?: string;
  root: string;
  [key: string]: unknown;
}

export interface SelectionControlPropsBase extends Omit<
  ComponentPropsWithoutRef<"input">,
  "size"
> {
  hasError?: boolean;
  label?: ReactNode;
  size?: (typeof COMPONENT_SIZES)[number];
}

interface SelectionControlRootProps {
  children: (inputId: string) => ReactNode;
  className?: string;
  hasError?: boolean;
  id?: string;
  label?: ReactNode;
  size?: (typeof COMPONENT_SIZES)[number];
  style?: CSSProperties;
  styles: SelectionControlStyles;
}

interface RenderCheckableControlParams {
  className?: string;
  hasError?: boolean;
  id?: string;
  indeterminate?: boolean;
  inputProps: ComponentPropsWithoutRef<"input">;
  inputRef: ForwardedRef<HTMLInputElement>;
  inputRole?: string;
  inputType: "checkbox" | "radio";
  inputWrapperClassName?: string;
  label?: ReactNode;
  size?: (typeof COMPONENT_SIZES)[number];
  style?: CSSProperties;
  styles: SelectionControlStyles;
  trailingVisual?: ReactNode;
}

export const SelectionControlRoot = ({
  children,
  className,
  hasError,
  id,
  label,
  size,
  style,
  styles,
}: SelectionControlRootProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div
      className={clsx(
        styles.root,
        size &&
          getDynamicClassName(styles as Record<string, string>, `size-${size}`),
        hasError && styles.hasError,
        className,
      )}
      style={style}
    >
      {children(inputId)}
      {label && (
        <Label className={styles.label} htmlFor={inputId}>
          {label}
        </Label>
      )}
    </div>
  );
};

export const renderCheckableControl = ({
  className,
  hasError,
  id,
  indeterminate,
  inputProps,
  inputRef,
  inputRole,
  inputType,
  inputWrapperClassName,
  label,
  size,
  style,
  styles,
  trailingVisual,
}: RenderCheckableControlParams) => {
  const inputElement = (inputId: string) => (
    <>
      <input
        className={styles.input as string | undefined}
        id={inputId}
        ref={(node) => {
          if (node) {
            node.indeterminate = !!indeterminate;
          }
          if (isFunction(inputRef)) {
            inputRef(node);
          } else if (inputRef) {
            inputRef.current = node;
          }
        }}
        role={inputRole}
        type={inputType}
        {...inputProps}
      />
      {trailingVisual}
    </>
  );

  return (
    <SelectionControlRoot
      className={className}
      hasError={hasError}
      id={id}
      label={label}
      size={size}
      style={style}
      styles={styles}
    >
      {(inputId) =>
        inputWrapperClassName ? (
          <div className={inputWrapperClassName}>{inputElement(inputId)}</div>
        ) : (
          inputElement(inputId)
        )
      }
    </SelectionControlRoot>
  );
};
