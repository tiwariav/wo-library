import type { ILoremIpsumParams } from "lorem-ipsum";

import { defaultImport } from "default-import";
import _parse from "html-react-parser";
import { loremIpsum } from "lorem-ipsum";

const parse = defaultImport(_parse);

export function Lorem({
  format = "html",
  ...props
}: Readonly<ILoremIpsumParams>) {
  return <div>{parse(loremIpsum({ format, ...props }))}</div>;
}
