import type { Meta, StoryObj } from "@storybook/react";

import Checkbox from "./Checkbox.js";

const meta: Meta<typeof Checkbox> = {
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
  },
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          "A standard checkbox input component with support for labels and indeterminate states.",
      },
    },
  },
  title: "Atoms/Checkbox",
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Default Checkbox",
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    label: "Checked Checkbox",
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: "Indeterminate Checkbox",
  },
};

export const ErrorState: Story = {
  args: {
    hasError: true,
    label: "Error Checkbox",
  },
};

export const Small: Story = {
  args: {
    label: "Small Checkbox",
    size: "small",
  },
};

export const Large: Story = {
  args: {
    label: "Large Checkbox",
    size: "large",
  },
};
