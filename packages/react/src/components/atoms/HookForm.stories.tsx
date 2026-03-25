import type { FieldValues } from "react-hook-form";

import type { HookFormProps } from "./HookForm.js";

import HookForm from "./HookForm.js";
import { HookFormInputWrapper } from "./index.js";

const meta = {
  component: HookForm,
  parameters: {
    docs: {
      description: {
        component:
          "Thin wrapper around `react-hook-form`'s `FormProvider`. Accepts `errors` to display field-level validation messages. Wrap form fields as children.",
      },
    },
  },
  title: "Atoms/HookForm",
};

export default meta;

function Template<TFeildValue extends FieldValues>(
  args: Readonly<HookFormProps<TFeildValue>>,
) {
  return (
    <HookForm {...args}>
      <HookFormInputWrapper name="input">
        <input type="text" />
      </HookFormInputWrapper>
    </HookForm>
  );
}
export const Default = {
  args: {},
  render: Template,
};

export const WithErrors = {
  args: {
    errors: {
      input: "This is an error",
    },
  },
  render: Template,
};
