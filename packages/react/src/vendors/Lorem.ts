import type { ILoremIpsumParams } from "lorem-ipsum";
import type { ReactNode } from "react";

import { defaultImport } from "default-import";
import _parse from "html-react-parser";
import { loremIpsum } from "lorem-ipsum";

const parse = defaultImport(_parse);

// eslint-disable-next-line sonarjs/function-return-type
export default function Lorem({
  format = "html",
  ...props
}: ILoremIpsumParams): ReactNode {
  const content: ReactNode = parse(
    loremIpsum({ format, ...props }),
  ) as ReactNode;
  return content;
}
