import type { IContentLoaderProps } from "react-content-loader";

import ContentLoader from "../../../vendors/ContentLoader.js";

const TEST_UNIQUE_KEY = process.env.JEST_WORKER_ID ? "test" : undefined;

export default function ImageLoader(props: IContentLoaderProps) {
  return (
    <ContentLoader
      preserveAspectRatio="xMidYMid slice"
      uniqueKey={TEST_UNIQUE_KEY}
      viewBox="0 0 10 10"
      {...props}
    >
      {/* Only SVG shapes */}
      <rect height="10" width="10" x="0" y="0" />
    </ContentLoader>
  );
}
