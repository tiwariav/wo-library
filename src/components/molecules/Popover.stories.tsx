import { StoryObj } from "@storybook/react";

import Popover from "./Popover.js";

const metadata = {
  component: Popover,
};
export default metadata;

type Story = StoryObj<typeof Popover>;

const Template = ({ ...args }) => {
  return (
    <Popover
      content={
        <div style={{ background: "#eee", padding: 16 }}>In popover</div>
      }
      {...args}
    >
      Click Me
    </Popover>
  );
};

export const Basic: Story = {
  render: (args) => <Template {...args} />,
};
