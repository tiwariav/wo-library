import type {
  ComponentPropsWithoutRef,
  ComponentType,
  ElementType,
} from "react";

import { clsx } from "clsx";
import { forwardRef } from "react";

export default function generateCssWrapper<
  TComponent extends ElementType,
  TProps extends ComponentPropsWithoutRef<TComponent>,
>(rootClassName: string, as?: TComponent, defaultProps?: Partial<TProps>) {
  const CssWrapper = forwardRef<TProps["ref"], { className: string } & TProps>(
    ({ className, ...props }, ref) => {
      const Component = as ?? "div";
      return (
        <Component
          className={clsx(rootClassName, className)}
          ref={ref}
          {...defaultProps}
          {...props}
        />
      );
    },
  ) as ComponentType<TProps>;
  CssWrapper.displayName = `CssWrapper(${rootClassName})`;
  return CssWrapper;
}
