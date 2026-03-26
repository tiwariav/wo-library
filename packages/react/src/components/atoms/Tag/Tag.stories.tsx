import type { Meta } from "@storybook/react";

import { storyIconControl } from "../../../tools/storybook.js";
import Tag from "./Tag.js";

const metadata: Meta<typeof Tag> = {
  argTypes: {
    iconAfter: storyIconControl,
    iconBefore: storyIconControl,
  },
  component: Tag,
  parameters: {
    docs: {
      description: {
        component:
          "Inline label/badge with icon slots and loading state. Used for categories, status indicators, and metadata chips.",
      },
    },
  },
  render: (args) => <Tag {...args} />,
  title: "Atoms/Tag",
};

export default metadata;

export const Basic = {
  args: {
    children: "Some Text",
    iconAfter: "AiFillRightCircle",
    iconBefore: "AiFillLeftCircle",
  },
};

export const Loading = {
  args: {
    ...Basic.args,
    loading: true,
  },
};
