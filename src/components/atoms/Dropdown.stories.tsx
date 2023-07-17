import { StoryObj } from "@storybook/react";

import Dropdown from "./Dropdown.js";

const metadata = {
  component: Dropdown,
};
export default metadata;

type Story = StoryObj<typeof Dropdown>;

const Template = ({ ...args }) => {
  return (
    <Dropdown label="In Dropdown" {...args}>
      Click Me
    </Dropdown>
  );
};

export const Basic: Story = {
  render: (args) => <Template {...args} />,
};
