import type { Meta, StoryObj } from "@storybook/react";

import FormGroup from "./FormGroup.js";

const metadata: Meta<typeof FormGroup> = {
  component: FormGroup,
  parameters: {
    docs: {
      description: {
        component:
          "Labeled wrapper for form fields that displays a label, helper text, and field-level error messages. Wrap any input as a child.",
      },
    },
  },
  title: "Atoms/FormGroup",
};

export default metadata;

type Story = StoryObj<typeof FormGroup>;

export const Basic: Story = {
  args: {
    label: "Form Group Label",
  },
  render: (args) => <FormGroup {...args} />,
};
