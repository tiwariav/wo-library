import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { expect, within } from "storybook/test";

import { TEXT_LONG } from "./__testData.js";
import Text from "./Text.js";

const metadata: Meta<typeof Text> = {
  component: Text,
  parameters: {
    docs: {
      description: {
        component:
          "Text display with line clamping (`maxLines`/`minLines`), block/inline rendering, and skeleton loading state via `isLoading`.",
      },
    },
  },
  title: "Atoms/Text",
};

export default metadata;

type TemplateProps = { width: number } & ComponentProps<typeof Text>;
type Story = StoryObj<TemplateProps>;

function Template({ width, ...args }: TemplateProps) {
  return (
    <div style={{ border: "1px solid var(--ye-color-dark-10)", width }}>
      <Text {...args} />
    </div>
  );
}

export const Basic: Story = {
  args: {
    children: TEXT_LONG,
    isLoading: true,
    minLines: 5,
    width: 800,
  },
  render: (args) => <Template {...args} />,
};

export const FixedLines: Story = {
  args: {
    ...Basic.args,
    maxLines: 5,
    minLines: 3,
  },
  render: (args) => <Template {...args} />,
};

export const Loading: Story = {
  args: {
    ...FixedLines.args,
    isLoading: true,
  },
  render: (args) => <Template {...args} />,
};

export const Interactive: Story = {
  args: {
    children: "Interactive Text",
    isLoading: false,
    width: 400,
  },
  render: (args) => <Template {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Interactive Text")).toBeInTheDocument();
  },
};
