import { ComponentPropsWithoutRef, ElementType } from "react";

interface AsElementProps<TElement extends ElementType> {
  as?: TElement;
}

export default function AsElement<TElement extends ElementType = "div">({
  as,
  ...props
}: AsElementProps<TElement> & ComponentPropsWithoutRef<TElement>) {
  const Element = as ?? "div";
  return <Element {...props} />;
}
