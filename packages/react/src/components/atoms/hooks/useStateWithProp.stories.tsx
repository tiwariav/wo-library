import type { Meta, StoryObj } from "@storybook/react";

import useStateWithProp from "../../../hooks/useStateWithProp.js";

function UseStateWithPropDemo({ value }: Readonly<{ value: string }>) {
  const [localValue, setLocalValue] = useStateWithProp(value);

  return (
    <div>
      <p>
        Prop value: <strong>{value}</strong>
      </p>
      <p>
        Local value: <strong>{localValue}</strong>
      </p>
      <input
        onChange={(event) => setLocalValue(event.target.value)}
        placeholder="Edit local value..."
        type="text"
        value={localValue}
      />
      <p style={{ color: "gray", fontSize: "0.85em" }}>
        Local state stays synced with the prop. Edit the &quot;value&quot; arg
        in controls to see it update.
      </p>
    </div>
  );
}

const metadata: Meta<typeof UseStateWithPropDemo> = {
  argTypes: {
    value: { control: "text" },
  },
  component: UseStateWithPropDemo,
  parameters: {
    docs: {
      description: {
        component:
          "Keeps local state in sync with a prop value. Creates a `useState` that automatically updates when the incoming prop changes (skipping the initial render).",
      },
    },
  },
  title: "Hooks/useStateWithProp",
};

export default metadata;

type Story = StoryObj<typeof UseStateWithPropDemo>;

export const Default: Story = {
  args: {
    value: "Hello from prop",
  },
};
