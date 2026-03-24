import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";

import {
  COMPONENT_SIZES,
  COMPONENT_SPACINGS,
} from "../../../tools/constants/props.js";
import { storyIconControl, storyIconMap } from "../../../tools/storybook.js";
import Anchor, { ANCHOR_VARIANTS, type AnchorProps } from "./Anchor.js";

const metadata: Meta<typeof Anchor> = {
  args: {
    children: "Anchor",
  },
  argTypes: {
    as: { control: "text" },
    iconAfter: storyIconControl,
    iconBefore: storyIconControl,
    size: { control: "select", options: COMPONENT_SIZES },
    spacing: { control: "select", options: COMPONENT_SPACINGS },
    variant: { control: "select", options: ANCHOR_VARIANTS },
  },
  component: Anchor,
  parameters: {
    docs: {
      description: {
        component:
          "Polymorphic link component with icon slots and multiple visual variants. Renders as `<a>` by default; change with the `as` prop.",
      },
    },
  },
  render: (args) => <Anchor href="/" {...args} />,
  title: "Atoms/Anchor",
};
export default metadata;

type Story = StoryObj<AnchorProps>;

/* jscpd:ignore-start */
export const Basic: Story = {};

export const WithIcon: Story = {
  args: {
    ...Basic.args,
    iconAfter: storyIconMap.SquareRoundedChevronRightFilled,
    iconBefore: storyIconMap.SquareRoundedChevronLeftFilled,
  },
};
/* jscpd:ignore-end */

function OutlineAnchor(args: AnchorProps) {
  return (
    <div>
      <Anchor href="/" variant="outlined" {...args}>
        Anchor
      </Anchor>
    </div>
  );
}

export const Sizes: Story = {
  render: (args) => (
    <div className="story-list">
      <OutlineAnchor {...args} />
      {COMPONENT_SIZES.map((size) => (
        <div key={size}>
          <Anchor href="/" size={size} variant="outlined" {...args}>
            &apos;{size}&apos; anchor
          </Anchor>
        </div>
      ))}
    </div>
  ),
};

export const Spacings: Story = {
  render: (args) => (
    <div className="story-list">
      <OutlineAnchor />
      {COMPONENT_SPACINGS.map((spacing) => (
        <div key={spacing}>
          <Anchor href="/" spacing={spacing} variant="outlined" {...args}>
            &apos;{spacing}&apos; anchor
          </Anchor>
        </div>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="story-list">
      <div>
        <Anchor href="/" {...args}>
          Anchor
        </Anchor>
      </div>
      {ANCHOR_VARIANTS.map((variant) => (
        <div key={variant}>
          <Anchor href="/" variant={variant} {...args}>
            &apos;{variant}&apos; anchor
          </Anchor>
        </div>
      ))}
    </div>
  ),
};

export const NoVisited: Story = {
  args: {
    children: "Color anchor",
    noVisited: true,
    variant: "color",
  },
};

export const Interactive: Story = {
  args: {
    children: "Interactive Anchor",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Interactive Anchor" });
    await expect(link).toHaveAttribute("href", "/");
  },
};
