import type { ILoremIpsumParams } from "lorem-ipsum";

import { loremIpsum } from "lorem-ipsum";

export default function Lorem({
  format = "html",
  ...props
}: ILoremIpsumParams) {
  const content = loremIpsum({ format, ...props });
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
