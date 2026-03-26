import type {
  ComponentPropsWithoutRef,
  ElementType,
  HTMLAttributes,
  ReactElement,
} from "react";

export type AsElementProps<TElement extends ElementType = "div"> = {
  as?: TElement;
} & ComponentPropsWithoutRef<TElement> &
  HTMLAttributes<unknown>;

export default function AsElement<TElement extends ElementType>({
  as,
  ...props
}: Readonly<AsElementProps<TElement>>): ReactElement {
  const Element = (as ?? "div") as ElementType;
  return <Element {...props} />;
}
