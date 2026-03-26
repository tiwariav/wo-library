import type { Meta, StoryObj } from "@storybook/react";

import useMeasureInput from "../../../hooks/useMeasureInput.js";

function UseMeasureInputDemo() {
  const [labelRef, extraStyles] = useMeasureInput();

  return (
    <div style={{ maxWidth: 300 }}>
      <label
        ref={labelRef}
        htmlFor="measured-input"
        style={{ display: "block", marginBottom: "0.25rem" }}
      >
        This is a very long label that might wrap to multiple lines depending on
        the container width
      </label>
      <input
        id="measured-input"
        placeholder="Input with measured padding"
        style={{
          boxSizing: "border-box",
          width: "100%",
          ...extraStyles.input,
        }}
        type="text"
      />
      <p style={{ color: "gray", fontSize: "0.85em", marginTop: "0.5rem" }}>
        Extra styles applied:{" "}
        <code>{JSON.stringify(extraStyles.input ?? {})}</code>
      </p>
    </div>
  );
}

const metadata: Meta = {
  component: UseMeasureInputDemo,
  parameters: {
    docs: {
      description: {
        component:
          "Measures a label element's height and computes padding/height adjustments for its associated input when the label wraps to multiple lines.",
      },
    },
  },
  title: "Hooks/useMeasureInput",
};

export default metadata;

type Story = StoryObj;

export const Default: Story = {
  render: () => <UseMeasureInputDemo />,
};
