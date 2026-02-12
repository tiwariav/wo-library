import type { Meta, StoryObj } from "@storybook/react";

import { storyIconControl, storyIconMap } from "../../../tools/storybook.js";
import TextInput, { TEXT_INPUT_VARIANTS } from "./TextInput.js";

const metadata: Meta<typeof TextInput> = {
  argTypes: {
    iconAfter: storyIconControl,
    iconBefore: storyIconControl,
  },
  component: TextInput,
  render: (args) => (
    <div style={{ width: 240 }}>
      <TextInput {...args} />
    </div>
  ),
};

export default metadata;

type Story = StoryObj<typeof TextInput>;

export const Basic = {
  args: {
    placeholder: "Enter your text",
    width: 240,
  },
  parameters: {
    jest: ["TextInput.test.js"],
  },
};

export const WithIcon = {
  args: {
    ...Basic.args,
    iconAfter: storyIconMap.Search,
    iconBefore: storyIconMap.DogBowl,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="story-grid">
      {TEXT_INPUT_VARIANTS.map((variant) => (
        <div key={variant}>
          <TextInput
            iconAfter={storyIconMap.Search}
            iconBefore={storyIconMap.DogBowl}
            label={`'${variant}' Text Input`}
            placeholder="Enter your text"
            variant={variant}
            {...args}
          />
        </div>
      ))}
    </div>
  ),
};
