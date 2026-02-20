import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import Spinner from "./Spinner.js";

const metadata: Meta<typeof Spinner> = {
  argTypes: {
    color: { control: "color" },
  },
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component:
          "Animated SVG loading spinner. Place inside a `position: relative` container. Automatically used by `isBusy` on parent components.",
      },
    },
  },
  title: "Atoms/Spinner",
};

export default metadata;

type TemplateProps = {
  color: string;
  height: number;
  width: number;
} & ComponentProps<typeof Spinner>;

type Story = StoryObj<TemplateProps>;

function Template({ color, height, width, ...args }: TemplateProps) {
  return (
    <div style={{ position: "relative" }}>
      <Spinner style={{ color, height, width }} {...args} />
    </div>
  );
}

export const Basic: Story = {
  args: {
    color: "var(--ye-color-primary)",
    height: 48,
    width: 48,
  },
  render: (args) => <Template {...args} />,
};
