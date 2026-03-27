import type { ILoremIpsumParams } from "lorem-ipsum";

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
        replace: (domNode: any) => {
          // White-list only allowed tags
          const allowedTags = ["p", "br", "b", "i", "strong", "em", "div", "span"];

          if (domNode.type === "tag") {
            if (!allowedTags.includes(domNode.name.toLowerCase())) {
              return <React.Fragment />;
            }
            // Strip all attributes
            if (domNode.attribs && Object.keys(domNode.attribs).length > 0) {
              domNode.attribs = {};
            }
          } else if (domNode.type !== "text") {
            // Remove anything that is not a tag or text (scripts, styles, comments, etc.)
            return <React.Fragment />;
          }
        },
      })}
    </div>
  );
}
