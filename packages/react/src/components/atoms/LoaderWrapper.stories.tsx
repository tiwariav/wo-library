import type { Meta, StoryObj } from "@storybook/react";

import LoaderWrapper from "./LoaderWrapper.js";

const metadata: Meta<typeof LoaderWrapper> = {
  component: LoaderWrapper,
  parameters: {
    docs: {
      description: {
        component:
          "Minimal `<div>` wrapper styled to fill its container during a loading state. Used as a slot-level placeholder while content loads.",
      },
    },
  },
  title: "Atoms/LoaderWrapper",
};

export default metadata;

type Story = StoryObj<typeof LoaderWrapper>;

export const Default: Story = {
  args: {
    style: { height: 100, width: 200 },
  },
};

export const WithChildren: Story = {
  args: {
    children: "Loading content...",
    style: { height: 100, width: 200 },
  },
};
