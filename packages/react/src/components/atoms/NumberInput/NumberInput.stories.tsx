import type { Meta, StoryObj } from "@storybook/react";

import { useState } from "react";

import type { NumberInputProps } from "./NumberInput.js";

import { iconArgTypes } from "../../../tools/storybook.js";
import { InputTemplate } from "../../__stories/InputTemplates.js";
import Button from "../Button/Button.js";
import NumberInput from "./NumberInput.js";

const metadata: Meta<typeof NumberInput> = {
  argTypes: iconArgTypes,
  component: NumberInput,
};

export default metadata;

type Story = StoryObj<typeof NumberInput>;

function Template(args: NumberInputProps) {
  return <InputTemplate as={NumberInput} {...args} />;
}

export const Basic: Story = {
  args: {
    width: 240,
  },
  render: (args) => <Template {...args} />,
};

export const Formatted: Story = {
  args: {
    format: {},
    parse: true,
    placeholder: "Enter your text",
  },
};

const INITIAL_PARSED_NUMBER = 2000.01;
const PARSED_NUMBER_INCREMENT = 0.01;

function PresetValueTemplate(args: NumberInputProps) {
  const [value, setValue] = useState(INITIAL_PARSED_NUMBER);
  return (
    <div>
      <Button
        onClick={() => {
          setValue(value + PARSED_NUMBER_INCREMENT);
        }}
      >
        Update Preset Value
      </Button>
      <Template value={value} {...args} />
    </div>
  );
}

export const PresetValue: Story = {
  args: {
    format: true,
  },
  render: (args) => <PresetValueTemplate {...args} />,
};

function ManageStateWithPasedValueTemplate(args: NumberInputProps) {
  const [value, setValue] = useState("");
  return (
    <div>
      <Template
        onChange={(event) => {
          setValue(event.target.value);
        }}
        value={value}
        {...args}
      />
    </div>
  );
}

export const StateManagedWithParsedValue: Story = {
  args: {
    format: true,
    parse: true,
  },
  render: (args) => <ManageStateWithPasedValueTemplate {...args} />,
};
