import type { Preview } from "@storybook/react";

import "../src/styles.css";

const preview: Preview = {
  parameters: {
    controls: {
      sort: "requiredFirst",
    },
    options: {
      storySort: {
        order: ["Introduction", "registry", "Hooks", "@wo-library", "*"],
      },
    },
  },
};

export default preview;
