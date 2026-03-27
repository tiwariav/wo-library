import type { ILoremIpsumParams } from "lorem-ipsum";
import type { Element, Text } from "html-react-parser";

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
        replace: (domNode) => {
          const element = domNode as Element;
          // White-list only allowed tags
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

          if (element.type === "tag") {
            const name = element.name.toLowerCase();
            if (!allowedTags.includes(name)) {
              return <React.Fragment />;
            }
            // Strip all attributes
            element.attribs = {};
          } else if ((domNode as Text).type !== "text") {
            // Remove anything that is not a tag or text (scripts, styles, comments, etc.)
            return <React.Fragment />;
          }
        },
      })}
    </div>
  );
}
