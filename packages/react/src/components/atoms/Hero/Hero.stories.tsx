import type { Meta, StoryObj } from "@storybook/react";

import Hero from "./Hero.js";

const metadata: Meta<typeof Hero> = {
  component: Hero,
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
