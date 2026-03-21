import type { Meta, StoryObj } from "@storybook/react";

import Switch from "./Switch.js";

const meta: Meta<typeof Switch> = {
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
  },
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: "An accessible switch (toggle) component.",
      },
    },
  },
  title: "Atoms/Switch",
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: "Toggle Switch",
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    label: "Checked Switch",
  },
};
