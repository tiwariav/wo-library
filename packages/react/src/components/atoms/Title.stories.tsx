import type { Meta, StoryObj } from "@storybook/react";

import Title from "./Title/Title.js";

const metadata: Meta<typeof Title> = {
  argTypes: {
    align: {
      control: "select",
      options: ["center"],
    },
    variant: {
      control: "select",
      options: ["tinyline", "tinyline-left"],
    },
  },
  component: Title,
  parameters: {
    docs: {
      description: {
        component:
          "Polymorphic title component with alignment and variant styling. Renders as `<div>` by default; use the `as` prop for semantic headings.",
      },
    },
  },
  title: "Atoms/Title",
};

export default metadata;

type Story = StoryObj<typeof Title>;

export const Default: Story = {
  args: {
    children: "Default Title",
  },
};

export const Centered: Story = {
  args: {
    align: "center",
    children: "Centered Title",
  },
};

export const Tinyline: Story = {
  args: {
    children: "Tinyline Variant",
    variant: "tinyline",
  },
};

export const TinylineLeft: Story = {
  args: {
    children: "Tinyline Left Variant",
    variant: "tinyline-left",
  },
};

export const AsHeading: Story = {
  args: {
    as: "h2",
    children: "Rendered as H2",
    variant: "tinyline",
  },
};
