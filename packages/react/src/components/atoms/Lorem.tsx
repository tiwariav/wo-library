import type { ILoremIpsumParams } from "lorem-ipsum";

import { defaultImport } from "default-import";
import _parse from "html-react-parser";
import { loremIpsum } from "lorem-ipsum";
import { Fragment, createElement } from "react";

const parse = defaultImport(_parse);

const ALLOWED_TAGS = new Set(["p", "br", "strong", "em", "b", "i"]);

export default function Lorem({
  format = "html",
  ...props
}: Readonly<ILoremIpsumParams>) {
  const content = loremIpsum({ format, ...props });
  return (
    <div>
      {parse(content, {
        replace: (domNode) => {
          if ("attribs" in domNode) {
            if (!ALLOWED_TAGS.has(domNode.name)) {
              return createElement(Fragment, null);
            }
            // Strip all attributes to prevent XSS
            domNode.attribs = {};
          }
          return domNode;
        },
      })}
    </div>
  );
}
