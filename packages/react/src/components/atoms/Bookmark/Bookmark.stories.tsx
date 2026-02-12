import type { Meta, StoryObj } from "@storybook/react";

import Bookmark from "./Bookmark.js";

const metadata: Meta<typeof Bookmark> = {
  component: Bookmark,
};

export default metadata;

type Story = StoryObj<typeof Bookmark>;

export const Basic: Story = {
  args: {
    children: ["Home", "Some Page", "Some Inner Page"],
  },
  render: (args) => <Bookmark {...args} />,
};
