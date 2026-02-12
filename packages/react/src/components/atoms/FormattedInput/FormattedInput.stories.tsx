import type { StoryObj } from "@storybook/react";

import { isString } from "lodash-es";
import { useState } from "react";

import type { InputFormValue } from "../TextInput/TextInput.js";
import type { FormattedInputProps } from "./FormattedInput.js";

import { iconArgTypes } from "../../../tools/storybook.js";
import { InputTemplate } from "../../__stories/InputTemplates.js";
import Button from "../Button/Button.js";
import FormattedInput from "./FormattedInput.js";

const metadata = {
  argTypes: iconArgTypes,
  component: FormattedInput,
};

export default metadata;

type Story = StoryObj<typeof FormattedInput>;

function addHyphens(value: InputFormValue) {
  return isString(value)
    ? [...value].filter((item) => item !== "-").join("-")
    : String(value);
}

function removeHyphens(
  value: number | string | undefined,
  emptyValue: InputFormValue,
) {
  return isString(value) ? value.replaceAll("-", "") : emptyValue;
}

function Template(args: FormattedInputProps) {
  return <InputTemplate as={FormattedInput} {...args} />;
}

export const Basic: Story = {
  args: {
    format: addHyphens,
    parse: removeHyphens,
  },
  render: (args) => <Template {...args} />,
};

export const FormatOnly: Story = {
  args: {
    format: addHyphens,
  },
  render: (args) => <Template {...args} />,
};
export const ParseOnly: Story = {
  args: {
    parse: addHyphens,
  },
  render: (args) => <Template {...args} />,
};

function PresetValueTemplate(args: FormattedInputProps) {
  const [value, setValue] = useState("Apples");
  return (
    <div>
      <Button
        onClick={() => {
          setValue(value + "a");
        }}
      >
        Update
      </Button>
      <Template {...args} value={value} />
    </div>
  );
}

export const PresetValue: Story = {
  args: {
    ...Basic.args,
  },
  render: (args) => <PresetValueTemplate {...args} />,
};
