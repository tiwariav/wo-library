import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import Image from "./Image.js";

type TemplateProps = { width?: number } & ComponentProps<typeof Image>;

export function Template({ width, ...args }: TemplateProps) {
  return (
    <div style={{ width }}>
      <Image {...args} />
    </div>
  );
}

const metadata: Meta<TemplateProps> = {
  component: Image,
  excludeStories: /.*Template$/,
  render: Template,
};

export default metadata;

type Story = StoryObj<TemplateProps>;

export const Basic: Story = {
  args: {
    src: `${process.env.STORYBOOK_IMAGE_SRC}/160`,
    width: 160,
  },
};

export const Circular: Story = {
  args: {
    ...Basic.args,
    variant: "circular",
  },
};

export const CustomRatio: Story = {
  args: {
    ...Basic.args,
    aspectRatio: "16/9",
  },
};

export const Loading: Story = {
  args: {
    ...Basic.args,
    isLoading: true,
  },
};

export const Busy: Story = {
  args: {
    ...Basic.args,
    isBusy: true,
  },
};
