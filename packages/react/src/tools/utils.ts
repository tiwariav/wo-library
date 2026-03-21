import { camelCase, isUndefined } from "lodash-es";
import { forwardRef } from "react";

export const isBrowser =
  !isUndefined(globalThis.window) && !isUndefined(globalThis.document);

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
  // @ts-expect-error 2322 because generic mismatch
  const component = forwardRef(render);
  component.displayName = name;
  return component as (
    props: React.RefAttributes<TRef> & TProps,
  ) => React.ReactNode;
}
