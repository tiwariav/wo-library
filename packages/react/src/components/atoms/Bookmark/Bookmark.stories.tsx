import type { Meta, StoryObj } from "@storybook/react";

import Bookmark from "./Bookmark.js";

const metadata: Meta<typeof Bookmark> = {
  component: Bookmark,
  parameters: {
    docs: {
      description: {
        component:
          "Breadcrumb-style navigation trail. Accepts an array of strings or nodes as `children` to render the current path hierarchy.",
      },
    },
  },
  title: "Atoms/Bookmark",
};

export default metadata;

type Story = StoryObj<typeof Bookmark>;

export const Basic: Story = {
  args: {
    children: ["Home", "Some Page", "Some Inner Page"],
  },
  render: (args) => <Bookmark {...args} />,
};
