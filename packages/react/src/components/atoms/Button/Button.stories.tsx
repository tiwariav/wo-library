import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";

import { COMPONENT_SIZES } from "../../../tools/constants/props.js";
import { storyIconMap } from "../../../tools/storybook.js";
import Button, {
  BUTTON_EFFECTS,
  BUTTON_SPACINGS,
  BUTTON_VARIANTS,
  type ButtonProps,
} from "./Button.js";

const metadata: Meta<typeof Button> = {
  args: {
    children: "Button",
  },
  argTypes: {
    iconAfter: {
      mapping: storyIconMap,
      options: Object.keys(storyIconMap),
    },
    iconBefore: {
      mapping: storyIconMap,
      options: Object.keys(storyIconMap),
    },
    size: { control: "select", options: COMPONENT_SIZES },
    spacing: { control: "select", options: BUTTON_SPACINGS },
    variant: { control: "select", options: BUTTON_VARIANTS },
  },
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Versatile button with variants (primary, outlined, ghost, borderless), sizes, icon slots (before/after), loading/busy states, and visual effects. Accepts an `as` prop to render as any element.",
      },
    },
  },
  render: (args) => <Button {...args} />,
  title: "Atoms/Button",
};

export default metadata;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {};

export const WithIcon: Story = {
  args: {
    ...Basic.args,
    iconAfter: "IconSquareRoundedChevronLeftFilled",
    iconBefore: "IconSquareRoundedChevronRightFilled",
  },
};

function FirstButtonTemplate({ children, ...args }: ButtonProps) {
  return (
    <div className="story-list">
      <Button {...args}>Button</Button>
      {children}
    </div>
  );
}

export const Effects: Story = {
  render: (args) => (
    <FirstButtonTemplate {...args}>
      {BUTTON_EFFECTS.map((effect) => (
        <div key={effect}>
          <Button effects={[effect]} {...args}>
            &apos;{effect}&apos; Button
          </Button>
        </div>
      ))}
      <div>
        <Button effects={[...BUTTON_EFFECTS]} {...args}>
          All effects Button
        </Button>
      </div>
    </FirstButtonTemplate>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <FirstButtonTemplate {...args}>
      {COMPONENT_SIZES.map((size) => (
        <div key={size}>
          <Button size={size} variant="outlined" {...args}>
            &apos;{size}&apos; Button
          </Button>
        </div>
      ))}
    </FirstButtonTemplate>
  ),
};

export const Spacings: Story = {
  render: (args) => (
    <FirstButtonTemplate {...args}>
      {BUTTON_SPACINGS.map((spacing) => (
        <div key={spacing}>
          <Button spacing={spacing} variant="outlined" {...args}>
            &apos;{spacing}&apos; Button
          </Button>
        </div>
      ))}
    </FirstButtonTemplate>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="story-list">
      {BUTTON_VARIANTS.map((variant) => (
        <div key={variant}>
          <Button variant={variant} {...args}>
            &apos;{variant}&apos; button
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    children: "Interactive Button",
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Interactive Button" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
