import type { Meta, StoryObj } from "@storybook/react";

import Symbol from "./Symbol/Symbol.js";

const metadata: Meta<typeof Symbol> = {
  argTypes: {
    variant: {
      control: "select",
      options: ["circle", "flag", "pin", "triangle"],
    },
  },
  component: Symbol,
  parameters: {
    docs: {
      description: {
        component:
          "SVG symbol with shaped mask variants (circle, flag, pin, triangle). Supports a fill colour and optional image rendered inside the mask.",
      },
    },
  },
  title: "Atoms/Symbol",
};

export default metadata;

type Story = StoryObj<typeof Symbol>;

export const Circle: Story = {
  args: {
    fill: "#0066cc",
    style: { height: 64, width: 64 },
    variant: "circle",
  },
};

export const Flag: Story = {
  args: {
    fill: "#cc3300",
    style: { height: 64, width: 64 },
    variant: "flag",
  },
};

export const Pin: Story = {
  args: {
    fill: "#009933",
    style: { height: 64, width: 64 },
    variant: "pin",
  },
};

export const Triangle: Story = {
  args: {
    fill: "#ff9900",
    style: { height: 64, width: 64 },
    variant: "triangle",
  },
};

export const WithImage: Story = {
  args: {
    fill: "#0066cc",
    imageSrc: "https://picsum.photos/100",
    style: { height: 96, width: 96 },
    variant: "circle",
  },
};
