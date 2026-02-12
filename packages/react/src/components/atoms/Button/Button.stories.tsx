import type { Meta, StoryObj } from "@storybook/react";

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
  },
  component: Button,
  render: (args) => <Button {...args} />,
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
    <div className="story-grid">
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
    <div className="story-grid">
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
