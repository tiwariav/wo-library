import type { ComponentPropsWithoutRef } from "react";

import ContentLoader from "../../../vendors/ContentLoader.js";

const TEST_UNIQUE_KEY = process.env.JEST_WORKER_ID ? "test" : undefined;
const LINE_HEIGHT = 24;
const Y_MARGIN = 3;

interface TextLoaderProps
  extends ComponentPropsWithoutRef<typeof ContentLoader> {
  lines?: number;
}

export default function TextLoader({ lines = 1, ...props }: TextLoaderProps) {
  const height = LINE_HEIGHT * (lines || 1);

  return (
    <ContentLoader
      preserveAspectRatio="none"
      uniqueKey={TEST_UNIQUE_KEY}
      viewBox={`0 0 100 ${height}`}
      {...props}
    >
      {/* Only SVG shapes */}
      {Array.from({ length: lines }, (_item, index) => (
        <rect
          height="20"
          key={index}
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          width={index ? 100 - Math.pow(8, 3 - (lines - index)) : 100}
          x="0"
          y={index * LINE_HEIGHT + Y_MARGIN}
        />
      ))}
    </ContentLoader>
  );
}
