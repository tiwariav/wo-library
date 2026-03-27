import type { ILoremIpsumParams } from "lorem-ipsum";
import type { Element, DOMNode } from "html-react-parser";

import { defaultImport } from "default-import";
import _parse from "html-react-parser";
import { loremIpsum } from "lorem-ipsum";
import React from "react";

const parse = defaultImport(_parse);

export default function Lorem({
  format = "html",
  ...props
}: Readonly<ILoremIpsumParams>) {
  const content = loremIpsum({ format, ...props });
  return (
    <div>
      {parse(content, {
        replace: (domNode: DOMNode) => {
          const allowedTags = [
            "p",
            "br",
            "b",
            "i",
            "strong",
            "em",
            "div",
            "span",
          ];

          if ("name" in domNode) {
            const element = domNode as Element;
            if (!allowedTags.includes(element.name.toLowerCase())) {
              return null;
            }
            // Strip all attributes
            element.attribs = {};
            return undefined;
          }

          if ("data" in domNode) {
            return undefined;
          }

          return null;
        },
      })}
    </div>
  );
}
