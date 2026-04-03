import type { ILoremIpsumParams } from "lorem-ipsum";

import { defaultImport } from "default-import";
import _parse, { Element } from "html-react-parser";
import { loremIpsum } from "lorem-ipsum";

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
          if (domNode instanceof Element) {
            if (!ALLOWED_TAGS.has(domNode.name)) {
              return null;
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
