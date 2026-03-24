import type { Meta, StoryObj } from "@storybook/react";

import type { DividerProps } from "./Divider.js";

import Divider, { DIVIDER_SPACING_OPTIONS } from "./Divider.js";

const metadata: Meta<typeof Divider> = {
  argTypes: {
    color: { control: "color" },
    spacing: { control: "select", options: DIVIDER_SPACING_OPTIONS },
  },
  component: Divider,
  parameters: {
    docs: {
      description: {
        component:
          "Horizontal or vertical rule for visually separating content sections. Supports custom color, spacing, and label text.",
      },
    },
  },
  title: "Atoms/Divider",
};

export default metadata;

type Story = StoryObj<typeof Divider>;

function Template({ vertical, ...props }: DividerProps) {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: vertical ? "row" : "column",
        gap: "1rem",
        justifyContent: "center",
      }}
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus aperiam
      quod et explicabo exercitationem quibusdam? Harum doloribus voluptatem
      aspernatur molestiae similique libero, dolores iusto dolorem, voluptates
      ipsa laudantium. Cupiditate, nesciunt?
      <Divider vertical={vertical} {...props} />
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae expedita
      cupiditate tempora minus debitis. Similique, labore ipsa iure dolorum
      minus aliquid, necessitatibus harum commodi consectetur esse modi eius
      culpa fuga?
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Template {...args} />,
};

export const Vertical: Story = {
  render: (args) => <Template {...args} vertical />,
};
