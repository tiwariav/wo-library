import type { Meta } from "@storybook/react";

import { storyIconControl } from "../../../tools/storybook.js";
import Tag from "./Tag.js";

const metadata: Meta<typeof Tag> = {
  argTypes: {
    iconAfter: storyIconControl,
    iconBefore: storyIconControl,
  },
  component: Tag,
  render: (args) => <Tag {...args} />,
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
