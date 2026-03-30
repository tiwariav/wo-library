import type { Element, DOMNode } from "html-react-parser";
import type { ILoremIpsumParams } from "lorem-ipsum";

import { defaultImport } from "default-import";
import _parse from "html-react-parser";
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

export default function Lorem({
  format = "html",
  ...props
}: Readonly<ILoremIpsumParams>) {
  const content = loremIpsum({ format, ...props });
  return (
    <div>
      {parse(content, {
        replace: (domNode: DOMNode) => {
          if ("name" in domNode) {
            const element = domNode as Element;
            if (!allowedTags.has(element.name.toLowerCase())) {
              return null;
            }
            // Strip all attributes, then let html-react-parser render the sanitized element
            element.attribs = {};
            // returning undefined tells html-react-parser to keep the (now mutated) element
            return;
          }

          if ("data" in domNode) {
            // Text nodes pass through unchanged
            return;
          }

          return null;
        },
      })}
    </div>
  );
}
