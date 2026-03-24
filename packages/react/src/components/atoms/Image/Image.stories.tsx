import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import Image, { IMAGE_VARIANT_OPTIONS } from "./Image.js";

type TemplateProps = { width?: number } & ComponentProps<typeof Image>;

export function Template({ width, ...args }: TemplateProps) {
  return (
    <div style={{ width }}>
      <Image {...args} />
    </div>
  );
}

const metadata: Meta<TemplateProps> = {
  argTypes: {
    variant: { control: "select", options: IMAGE_VARIANT_OPTIONS },
  },
  component: Image,
  excludeStories: /.*Template$/,
  parameters: {
    docs: {
      description: {
        component:
          "Image component with built-in loading skeleton state, circular and rectangular variants, and configurable dimensions.",
      },
    },
  },
  render: Template,
  title: "Atoms/Image",
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
