import type { Meta, StoryObj } from "@storybook/react";

import ProgressBar from "./ProgressBar.js";

const meta: Meta<typeof ProgressBar> = {
  argTypes: {
    progress: {
      control: { max: 100, min: 0, type: "range" },
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    variant: {
      control: "select",
      options: ["primary", "filled"],
    },
  },
  component: ProgressBar,
  parameters: {
    docs: {
      description: {
        component: "A horizontal progress bar component.",
      },
    },
  },
  title: "Atoms/ProgressBar",
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    progress: 45,
  },
};

export const Filled: Story = {
  args: {
    progress: 75,
    variant: "filled",
  },
};
