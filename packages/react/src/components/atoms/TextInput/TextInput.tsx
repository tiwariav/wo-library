import type {
  ComponentPropsWithoutRef,
  FocusEventHandler,
  ReactNode,
} from "react";

import { clsx } from "clsx";
import { isEmpty } from "lodash-es";
import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";

import type { COMPONENT_SIZES } from "../../../tools/constants/props.js";

import { inSubArray } from "@wo-library/js";
import { useMeasureInput } from "../../../hooks/index.js";
import { getDynamicClassName } from "../../../tools/utils.js";
import ContentLoader from "../../../vendors/ContentLoader.js";
import { FormIconSpan } from "../../../wrappers/span.js";
import { FORM_CONTROL_VARIANTS, FormInputControl } from "../FormControl.js";
import InputWrapper from "../InputWrapper.js";
import Label from "../Label.js";
import Spinner from "../Spinner/Spinner.js";
import * as styles from "./textInput.module.css";

export const TEXT_INPUT_VARIANTS = [
  ...FORM_CONTROL_VARIANTS,
  "material",
] as const;

export type InputDomValue = number | string | undefined;
export type InputFormValue = InputDomValue | null;

/**
 * Props for the `TextInput` component.
 *
 * @property hasError - Applies error styling when `true`.
 * @property iconAfter - Icon node rendered after the input.
 * @property iconBefore - Icon node rendered before the input.
 * @property innerClassNames - Class name overrides for internal elements.
 * @property isBusy - Shows a Spinner while a background operation is in progress.
 * @property isLoading - Shows a skeleton content loader.
 * @property label - Label text or node displayed above/inside the input.
 * @property size - Size variant: `"small"` | `"large"`.
 * @property variant - Visual style: `"outlined"` | `"material"` | `"basic"` | `"dashed"` | `"borderless"`.
 */
export interface TextInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "size"
> {
  hasError?: boolean;
  iconAfter?: ReactNode;
  iconBefore?: ReactNode;
  innerClassNames?: {
    iconAfter?: string;
    iconBefore?: string;
    input?: string;
    label?: string;
  };
  isBusy?: boolean;
  isLoading?: boolean;
  label?: ReactNode;
  required?: boolean;
  size?: (typeof COMPONENT_SIZES)[number];
  value?: InputDomValue;
  variant?: (typeof TEXT_INPUT_VARIANTS)[number];
}

const TextInput = forwardRef<HTMLInputElement, Readonly<TextInputProps>>(
  (
    {
      className,
      defaultValue,
      hasError,
      iconAfter,
      iconBefore,
      id = "",
      innerClassNames = {},
      isBusy,
      isLoading,
      label,
      onBlur,
      required,
      size,
      style,
      value,
      variant = "basic",
      ...props
    },
    ref,
  ) => {
    const [internalHasValue, setInternalHasValue] = useState(() =>
      !isEmpty(defaultValue),
    );
    const hasValue = useMemo(() => {
      if (value === undefined) {
        return internalHasValue;
      }
      return !isEmpty(value);
    }, [internalHasValue, value]);
    const inputId = useId();

    const [labelRef, { input }] = useMeasureInput();

    const handleBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
      (event) => {
        setInternalHasValue(!isEmpty(event.target.value));
        onBlur?.(event);
      },
      [onBlur],
    );

    const inputStyle = useMemo(() => {
      const originalStyle = style ?? {};
      return input && variant === "material"
        ? {
            paddingTop: `calc(${input.paddingTop}px + var(--ye-input-padding-top))`,
            ...originalStyle,
          }
        : originalStyle;
    }, [input, style, variant]);


    return (
      <InputWrapper
        className={clsx(
          styles.root,
          {
            [styles.paddedLeft]: iconBefore,
            [styles.paddedRight]: iconAfter,
          },
          getDynamicClassName(styles, `variant-${variant}`),
          hasError && styles.hasError,
          hasValue && styles.hasValue,
          className,
        )}
        size={size}
      >
        <Label
          className={clsx(
            styles.label,
            {
              [styles.paddedLeft]: iconBefore,
              [styles.paddedRight]: iconAfter,
            },
            innerClassNames.label,
          )}
          htmlFor={id || inputId}
          ref={labelRef}
          required={required}
        >
          {label}
        </Label>
        <div className={styles.inputWrapper}>
          {!!iconBefore && (
            <FormIconSpan
              className={clsx(styles.icon, innerClassNames.iconBefore)}
            >
              {iconBefore}
            </FormIconSpan>
          )}
          <FormInputControl
            className={clsx(styles.textInput, innerClassNames.input)}
            id={id || inputId}
            onBlur={handleBlur}
            ref={ref}
            required={required}
            style={inputStyle}
            type="text"
            value={value}
            variant={
              inSubArray(
                FORM_CONTROL_VARIANTS,
                variant,
              ) as (typeof FORM_CONTROL_VARIANTS)[number]
            }
            {...props}
          />
          {!!iconAfter && (
            <FormIconSpan
              className={clsx(
                styles.icon,
                styles.iconRight,
                innerClassNames.iconAfter,
              )}
            >
              {iconAfter}
            </FormIconSpan>
          )}
          {isLoading && (
            <ContentLoader
              className={styles.loader}
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <rect height={100} width={100} x="0" y="0" />
            </ContentLoader>
          )}
          {isBusy && <Spinner className={styles.spinner} />}
        </div>
      </InputWrapper>
    );
  },
);
TextInput.displayName = "TextInput";

export default TextInput;
