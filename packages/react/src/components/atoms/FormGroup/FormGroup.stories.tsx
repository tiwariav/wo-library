import type { Meta, StoryObj } from "@storybook/react";

import FormGroup from "./FormGroup.js";

const metadata: Meta<typeof FormGroup> = {
  component: FormGroup,
};

export default metadata;

type Story = StoryObj<typeof FormGroup>;

export const Basic: Story = {
  args: {
    label: "Form Group Label",
  },
  render: (args) => <FormGroup {...args} />,
};
