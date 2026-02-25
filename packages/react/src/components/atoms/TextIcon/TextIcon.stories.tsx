import type { Meta, StoryObj } from "@storybook/react";

import TextIcon from "./TextIcon.js";

const metadata: Meta<typeof TextIcon> = {
  component: TextIcon,
  parameters: {
    docs: {
      description: {
        component:
          "Single-character circular badge for avatar-style initials or icon-text display. Commonly used as an avatar placeholder.",
      },
    },
  },
  title: "Atoms/TextIcon",
};

export default metadata;

type Story = StoryObj<typeof TextIcon>;

export const Basic: Story = {
  args: {
    children: "A",
  },
  render: (args) => <TextIcon {...args} />,
};
