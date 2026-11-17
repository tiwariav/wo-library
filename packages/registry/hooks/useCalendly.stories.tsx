import type { Meta, StoryObj } from "@storybook/react";

/**
 * Demo placeholder for useCalendly hook.
 * The actual hook loads the Calendly SDK from an external CDN,
 * so this story shows the usage pattern without executing the SDK.
 */
function UseCalendlyDemo() {
  return (
    <div>
      <h4>useCalendly Hook</h4>
      <p>
        Loads the Calendly SDK on mount and returns a function to open the popup
        scheduling widget.
      </p>
      <pre
        style={{
          background: "#f5f5f5",
          borderRadius: 4,
          padding: "1rem",
        }}
      >
        {`const openCalendly = useCalendly({
  calendlyLink: "https://calendly.com/user/meeting",
  prefill: { name: "John", email: "john@example.com" },
});

return <button onClick={openCalendly}>Book a Meeting</button>;`}
      </pre>
      <p style={{ color: "gray", fontSize: "0.85em" }}>
        Note: This story does not load the external Calendly SDK. See the source
        code for integration details.
      </p>
    </div>
  );
}

const metadata: Meta = {
  component: UseCalendlyDemo,
  parameters: {
    docs: {
      description: {
        component:
          "Loads the Calendly SDK on mount and returns a function to open the popup scheduling widget. Requires a `calendlyLink` and optional `prefill` data.",
      },
    },
  },
  title: "Hooks/useCalendly",
};

export default metadata;

type Story = StoryObj;

export const Usage: Story = {
  render: () => <UseCalendlyDemo />,
};
