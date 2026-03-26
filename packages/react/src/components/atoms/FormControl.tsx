/* eslint css-modules/no-unused-class: [2, {camelCase: true, markAsUsed:
  ['variant-borderless', 'variant-outlined', 'variant-dashed', 'variant-basic']
}] */

import type { ComponentPropsWithoutRef, Ref } from "react";

import clsx from "clsx";
import { forwardRef } from "react";

import { getDynamicClassName } from "../../tools/utils.js";
import * as styles from "./formControl.module.css";

export const FORM_CONTROL_VARIANTS = [
  "basic",
  "borderless",
  "outlined",
  "dashed",
] as const;

interface FormControlProps {
  className?: string;
  variant?: (typeof FORM_CONTROL_VARIANTS)[number];
}

function formControlProps<TElement>(
  { className, variant, ...props }: FormControlProps,
  ref: Ref<TElement>,
) {
  return {
    className: clsx(
      styles.root,
      className,
      variant && getDynamicClassName(styles, `variant-${variant}`),
    ),
    ref,
    ...props,
  };
}

export const FormInputControl = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input"> & FormControlProps
>((props, ref) => {
  return <input {...formControlProps(props, ref)} />;
});
FormInputControl.displayName = "FormInputControl";

export const FormButtonControl = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button"> & FormControlProps
>((props, ref) => {
  return <button {...formControlProps(props, ref)} />;
});
FormButtonControl.displayName = "FormButtonControl";
