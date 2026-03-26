import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import {
  FORM_CONTROL_VARIANTS,
  FormButtonControl,
  FormInputControl,
} from "./FormControl.js";

const metadata: Meta<typeof FormInputControl> = {
  argTypes: {
    variant: {
      control: "select",
      options: FORM_CONTROL_VARIANTS,
    },
  },
  component: FormInputControl,
  parameters: {
    docs: {
      description: {
        component:
          "Styled form control primitives (`FormInputControl` and `FormButtonControl`) with variant support: basic, borderless, outlined, and dashed.",
      },
    },
  },
  title: "Atoms/FormControl",
};

export default metadata;

type InputStory = StoryObj<typeof FormInputControl>;
type ButtonStory = StoryObj<typeof FormButtonControl>;

export const BasicInput: InputStory = {
  args: {
    placeholder: "Basic input",
    variant: "basic",
  },
};

export const OutlinedInput: InputStory = {
  args: {
    placeholder: "Outlined input",
    variant: "outlined",
  },
};

export const BorderlessInput: InputStory = {
  args: {
    placeholder: "Borderless input",
    variant: "borderless",
  },
};

export const DashedInput: InputStory = {
  args: {
    placeholder: "Dashed input",
    variant: "dashed",
  },
};

export const BasicButton: ButtonStory = {
  args: {
    children: "Submit",
    variant: "basic",
  },
  render: (args: ComponentProps<typeof FormButtonControl>) => (
    <FormButtonControl {...args} />
  ),
};

export const OutlinedButton: ButtonStory = {
  args: {
    children: "Submit",
    variant: "outlined",
  },
  render: (args: ComponentProps<typeof FormButtonControl>) => (
    <FormButtonControl {...args} />
  ),
};
