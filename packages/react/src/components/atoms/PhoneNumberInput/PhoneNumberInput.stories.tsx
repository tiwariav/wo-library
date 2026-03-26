import type { Meta } from "@storybook/react";

import type { FormattedInputProps } from "../FormattedInput/FormattedInput.js";

import { InputTemplate } from "../../__stories/InputTemplates.js";
import PhoneNumberInput from "./PhoneNumberInput.js";

function Template(args: FormattedInputProps) {
  return <InputTemplate as={PhoneNumberInput} {...args} />;
}

const metadata: Meta<typeof PhoneNumberInput> = {
  args: {
    label: "Phone Number",
  },
  component: PhoneNumberInput,
  parameters: {
    docs: {
      description: {
        component:
          "Phone number input built on `FormattedInput` with automatic country-code prefix formatting.",
      },
    },
  },
  title: "Atoms/PhoneNumberInput",
  render: (args) => <Template {...args} />,
};

export default metadata;

export const Basic = {
  args: {
    width: 240,
  },
};
