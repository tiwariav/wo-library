import type { ILoremIpsumParams } from "lorem-ipsum";

import { defaultImport } from "default-import";
import _parse from "html-react-parser";
import { loremIpsum } from "lorem-ipsum";

const parse = defaultImport(_parse);

export default function Lorem({
  format = "html",
  ...props
}: ILoremIpsumParams) {
  return parse(loremIpsum({ format, ...props }));
}
