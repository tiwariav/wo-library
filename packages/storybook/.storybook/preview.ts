import type { Preview } from "@storybook/react";

import "../src/styles.css";

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ["Introduction", "registry", "Hooks", "@wo-library", "*"],
      },
    },
    controls: {
      sort: "requiredFirst",
    },
  },
};

export default preview;
