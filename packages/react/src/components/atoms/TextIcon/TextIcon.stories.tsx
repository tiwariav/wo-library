import type { Meta, StoryObj } from "@storybook/react";

import TextIcon from "./TextIcon.js";

const metadata: Meta<typeof TextIcon> = {
  component: TextIcon,
};

export default metadata;

type Story = StoryObj<typeof TextIcon>;

export const Basic: Story = {
  args: {
    children: "A",
  },
  render: (args) => <TextIcon {...args} />,
};
