import { StoryObj } from "@storybook/react";

import Tooltip from "./Tooltip.js";

const metadata = {
  component: Tooltip,
};
export default metadata;

type Story = StoryObj<typeof Tooltip>;

const Template = ({ ...args }) => {
  return (
    <Tooltip style={{ display: "inline-block" }} title="In Tooltip" {...args}>
      Click Me
    </Tooltip>
  );
};

export const Basic: Story = {
  render: (args) => <Template {...args} />,
};
