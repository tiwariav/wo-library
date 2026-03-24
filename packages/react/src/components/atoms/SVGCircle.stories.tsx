import type { Meta, StoryObj } from "@storybook/react";

import SvgCircle from "./icons/Circle.js";

const metadata: Meta<typeof SvgCircle> = {
  component: SvgCircle,
  parameters: {
    docs: {
      description: {
        component:
          "Simple SVG circle icon. Renders a filled circle within a 10×10 viewBox. Accepts all standard SVG element props.",
      },
    },
  },
  title: "Atoms/SVGCircle",
};

export default metadata;

type Story = StoryObj<typeof SvgCircle>;

export const Default: Story = {
  args: {
    height: 48,
    width: 48,
  },
};

export const Colored: Story = {
  args: {
    fill: "var(--ye-color-primary, #0066cc)",
    height: 48,
    width: 48,
  },
};

export const Small: Story = {
  args: {
    fill: "tomato",
    height: 16,
    width: 16,
  },
};

export const Large: Story = {
  args: {
    fill: "seagreen",
    height: 96,
    width: 96,
  },
};
