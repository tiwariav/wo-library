import type { Meta, StoryObj } from "@storybook/react";

import InputWrapper from "./InputWrapper.js";

const metadata: Meta<typeof InputWrapper> = {
  argTypes: {
    size: {
      control: "select",
      options: ["small", "large"],
    },
  },
  component: InputWrapper,
  parameters: {
    docs: {
      description: {
        component:
          "Polymorphic container that wraps input elements with size-aware styling. Renders as `<div>` by default; use the `as` prop to change.",
      },
    },
  },
  title: "Atoms/InputWrapper",
};

export default metadata;

type Story = StoryObj<typeof InputWrapper>;

export const Default: Story = {
  args: {
    children: "Default wrapper content",
  },
};

export const Small: Story = {
  args: {
    children: "Small wrapper",
    size: "small",
  },
};

export const Large: Story = {
  args: {
    children: "Large wrapper",
    size: "large",
  },
};

export const AsLabel: Story = {
  args: {
    as: "label",
    children: "Rendered as a label element",
    size: "small",
  },
};
