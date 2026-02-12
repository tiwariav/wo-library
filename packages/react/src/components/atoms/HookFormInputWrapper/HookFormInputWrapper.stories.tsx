import type { StoryObj } from "@storybook/react";
import type { SetRequired } from "type-fest";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { JSONTree } from "react-json-tree";

import type { NumberInputProps } from "../NumberInput/NumberInput.js";

import HookForm from "../HookForm.js";
import NumberInput from "../NumberInput/NumberInput.js";
import PhoneNumberInput from "../PhoneNumberInput/PhoneNumberInput.js";
import { Button } from "../index.js";
import HookFormInputWrapper from "./HookFormInputWrapper.js";

const metadata = {
  component: HookFormInputWrapper,
};

export default metadata;

type Story = StoryObj<typeof HookFormInputWrapper>;

function InputWrapper({
  name,
  ...props
}: SetRequired<NumberInputProps, "name">) {
  return (
    <HookFormInputWrapper name={name}>
      <NumberInput label={name} size="small" variant="material" {...props} />
    </HookFormInputWrapper>
  );
}

const INITIAL_VALUE = 2000.001;
const VALUE_INCREMENT = 0.01;

function FormContent() {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const [updateValue, setUpdateValue] = useState(INITIAL_VALUE);
  const watchAll = watch();
  return (
    <div>
      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <InputWrapper name="NumberInput" />
        <InputWrapper format name="NumberInput (format)" />
        <InputWrapper
          format={{ maximumFractionDigits: 4 }}
          name="NumberInput (format with default)"
        />
        <InputWrapper
          emptyValue={null}
          format
          name="NumberInput (format and empty value)"
        />
        <InputWrapper format name="NumberInput (format & parse)" parse />
        <HookFormInputWrapper name="Phone number">
          <PhoneNumberInput
            label="Phone number"
            size="small"
            variant="material"
          />
        </HookFormInputWrapper>
        <div>
          <label htmlFor="input">Input</label>:{" "}
          <HookFormInputWrapper name="input">
            <input id="input" />
          </HookFormInputWrapper>
        </div>
        <div>
          <Button
            onClick={() => {
              setValue(
                "NumberInput (format with default)",
                (updateValue + VALUE_INCREMENT).toString(),
              );
              setUpdateValue(updateValue + VALUE_INCREMENT);
            }}
          >
            Update Value
          </Button>
        </div>
      </div>
      <div style={{ fontSize: ".75rem", fontWeight: 500, marginTop: "1rem" }}>
        <div>Errors:</div>
        <JSONTree data={errors} />
        <div>Values:</div>
        <JSONTree data={watchAll} />
      </div>
    </div>
  );
}

function Template() {
  return (
    <HookForm
      defaultValues={{
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "NumberInput (format with default)": "1234.1003",
      }}
      mode="onChange"
      resolver={async (values) =>
        await new Promise((resolve) => {
          const errors: Record<string, { message: string; type: string }> = {};
          for (const key of Object.keys(values)) {
            errors[key] = {
              message: "This field will always fail",
              type: "manual",
            };
          }
          resolve({
            errors,
            values: {},
          });
        })
      }
    >
      <FormContent />
    </HookForm>
  );
}

export const Basic: Story = {
  render: () => <Template />,
};
