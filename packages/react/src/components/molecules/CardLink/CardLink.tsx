import type { ReactNode, RefObject } from "react";

import { useRef } from "react";
import { useEffectOnce } from "react-use";

import type { CardProps } from "../../atoms/Card/Card.js";

import { isBrowser } from "../../../tools/utils.js";
import { Card } from "../../atoms/index.js";

export interface CardLinkProps extends CardProps {
  children: ReactNode;
  linkRef: RefObject<HTMLAnchorElement | null>;
}

export default function CardLink({
  children,
  linkRef,
  ...props
}: Readonly<CardLinkProps>) {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (isBrowser) {
      return;
    }
    const noTextSelected = !globalThis.getSelection()?.toString();

    if (noTextSelected) {
      linkRef.current?.click();
    }
  };

  useEffectOnce(() => {
    if (ref.current) {
      for (const element of ref.current.querySelectorAll("a, button")) {
        element.addEventListener("click", (event) => {
          event.stopPropagation();
        });
      }
    }
  });

  return (
    <Card onClick={handleClick} ref={ref} {...props}>
      {children}
    </Card>
  );
}
