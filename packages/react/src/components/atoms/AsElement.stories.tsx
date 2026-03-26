import type { Meta, StoryObj } from "@storybook/react";

import AsElement from "./AsElement.js";

const metadata: Meta<typeof AsElement> = {
  component: AsElement,
  parameters: {
    docs: {
      description: {
        component:
          "Polymorphic wrapper component that renders as any HTML element via the `as` prop. Defaults to `<div>`.",
      },
    },
  },
  title: "Atoms/AsElement",
};

export default metadata;

type Story = StoryObj<typeof AsElement>;

export const Default: Story = {
  args: {
    children: "Rendered as a div (default)",
  },
};

export const AsSpan: Story = {
  args: {
    as: "span",
    children: "Rendered as a span",
  },
};

export const AsSection: Story = {
  args: {
    as: "section",
    children: "Rendered as a section",
    style: { border: "1px dashed gray", padding: "1rem" },
  },
};

export const AsAnchor: Story = {
  args: {
    as: "a",
    children: "Rendered as an anchor",
    href: "#",
  },
};
