import { camelCase, isNil } from "lodash-es";
import { forwardRef } from "react";

export function isEmpty<TValue>(value: TValue) {
  return isNil(value) || value === "";
}

export function inSubArray<TArray extends [], TValue = TArray[number]>(
  array: readonly unknown[],
  value: unknown,
) {
  const typedValue = value as TValue;
  return array.includes(typedValue) ? typedValue : undefined;
}

export const isBrowser = typeof window !== "undefined" && !!window.document;

export const getDynamicClassName = (styles: unknown, name: string) => {
  /**
   * As a temporary workaround for
   * https://www.npmjs.com/package/typescript-plugin-css-modules#importing-css
   */
  return (styles as Record<string, string>)[camelCase(name)];
};

export function genericForwardRef<TRef, TProps = object>(
  render: (props: TProps, ref: React.Ref<TRef>) => React.ReactNode,
  name: string,
): (props: React.RefAttributes<TRef> & TProps) => React.ReactNode {
  const component = forwardRef(render);
  component.displayName = name;
  // @ts-expect-error 2322 because generic mismatch
  return component as unknown;
}
