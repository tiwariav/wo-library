import type { Meta, StoryObj } from "@storybook/react";

import Spinkit from "./Spinkit/index.js";

const metadata: Meta<typeof Spinkit> = {
  argTypes: {
    name: {
      control: "select",
      options: ["bounce", "chase", "circle-fade-dot", "double-bounce"],
    },
  },
  component: Spinkit,
  parameters: {
    docs: {
      description: {
        component:
          "CSS-only loading spinners from SpinKit. Choose between bounce, chase, circle-fade-dot, and double-bounce variants.",
      },
    },
  },
  title: "Atoms/Spinkit",
};

export default metadata;

type Story = StoryObj<typeof Spinkit>;

export const Bounce: Story = {
  args: {
    name: "bounce",
  },
};

export const Chase: Story = {
  args: {
    name: "chase",
  },
};

export const CircleFadeDot: Story = {
  args: {
    name: "circle-fade-dot",
  },
};

export const DoubleBounce: Story = {
  args: {
    name: "double-bounce",
  },
};
