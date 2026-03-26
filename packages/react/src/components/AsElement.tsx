import type {
  ComponentPropsWithoutRef,
  ElementType,
  HTMLAttributes,
} from "react";

export type AsElementProps<TElement extends ElementType = "div"> = {
  as?: TElement;
} & ComponentPropsWithoutRef<TElement> &
  HTMLAttributes<unknown>;

export default function AsElement<TElement extends ElementType>({
  as,
  ...props
}: AsElementProps<TElement>) {
  const Element = as ?? "div";
  return <Element {...props} />;
}
