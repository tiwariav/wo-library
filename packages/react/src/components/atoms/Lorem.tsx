import type { Element, DOMNode } from "html-react-parser";
import type { ILoremIpsumParams } from "lorem-ipsum";

import { createElement } from "react";
import { defaultImport } from "default-import";
import _parse, { domToReact } from "html-react-parser";
import { loremIpsum } from "lorem-ipsum";

const parse = defaultImport(_parse);

const allowedTags = new Set([
  "p",
  "br",
  "b",
  "i",
  "strong",
  "em",
  "div",
  "span",
]);

function replace(domNode: DOMNode) {
  if ("name" in domNode) {
    const element = domNode as Element;
    const tagName = element.name.toLowerCase();
    if (!allowedTags.has(tagName)) {
      return null;
    }
    return createElement(
      tagName,
      null,
      domToReact((element.children ?? []) as DOMNode[], { replace }),
    );
  }
}

export default function Lorem({
  format = "html",
  ...props
}: Readonly<ILoremIpsumParams>) {
  const content = loremIpsum({ format, ...props });
  return <div>{parse(content, { replace })}</div>;
}
