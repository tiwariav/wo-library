import type { Meta, StoryObj } from "@storybook/react";

import useScrollDirection from "../../../hooks/useScrollDirection.js";

function UseScrollDirectionDemo() {
  const { bodyHeight, direction, x, y } = useScrollDirection();

  return (
    <div>
      <div
        style={{
          background: "var(--ye-color-surface, #f5f5f5)",
          borderRadius: 8,
          left: 0,
          padding: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <p>
          Direction: <strong>{direction || "(idle)"}</strong>
        </p>
        <p>
          Scroll X: {x} | Scroll Y: {y}
        </p>
        <p>Body Height: {bodyHeight}</p>
      </div>
      <div style={{ height: 2000, paddingTop: "1rem" }}>
        <p>↓ Scroll down to see the direction change ↓</p>
        {Array.from({ length: 20 }).map((_, index) => (
          <p key={`item-${String(index)}`} style={{ padding: "1rem 0" }}>
            Scroll content block {index + 1}
          </p>
        ))}
      </div>
    </div>
  );
}

const metadata: Meta = {
  component: UseScrollDirectionDemo,
  parameters: {
    docs: {
      description: {
        component:
          'Tracks scroll direction (`"up"` or `"down"`) on the window or a specific scrollable element. Uses `requestAnimationFrame`-throttled updates.',
      },
    },
  },
  title: "Hooks/useScrollDirection",
};

export default metadata;

type Story = StoryObj;

export const Default: Story = {
  render: () => <UseScrollDirectionDemo />,
};
