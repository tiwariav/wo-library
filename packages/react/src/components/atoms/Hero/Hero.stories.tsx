import type { Meta, StoryObj } from "@storybook/react";

import Hero from "./Hero.js";

const metadata: Meta<typeof Hero> = {
  component: Hero,
  parameters: {
    docs: {
      description: {
        component:
          "Full-width hero section with an optional cover image/gradient, title, and configurable mid/bottom content slots for page headers.",
      },
    },
  },
  title: "Atoms/Hero",
};

export default metadata;

type Story = StoryObj<typeof Hero>;

export const Basic: Story = {
  args: {
    midContent: <p>Hero content</p>,
    title: "Hero Title",
  },
  render: (args) => <Hero {...args} />,
};
