import type { Meta, StoryObj } from "@storybook/react";

/**
 * ScrollContext wraps OverlayScrollbars and provides scroll state
 * management through split state/dispatch contexts.
 * Since it depends on the OverlayScrollbars component, this story
 * demonstrates the usage pattern.
 */
function ScrollContextDemo() {
  return (
    <div>
      <h4>ScrollContext</h4>
      <p>
        Provider that wraps <code>OverlayScrollbarsComponent</code> and exposes
        scroll state via React context. Uses the split state/method context
        pattern.
      </p>

      <h5>Exports</h5>
      <ul>
        <li>
          <code>ScrollProvider</code> — Context provider wrapping
          OverlayScrollbars
        </li>
        <li>
          <code>useScrollState()</code> — Access scroll state (overlayScrollbars
          ref)
        </li>
        <li>
          <code>useScrollMethods()</code> — Access dispatch methods
        </li>
      </ul>

      <h5>Usage</h5>
      <pre style={{ background: "#f5f5f5", borderRadius: 4, padding: "1rem" }}>
        {`import { ScrollProvider, useScrollState } from "@wo-library/react";

function App() {
  return (
    <ScrollProvider>
      <ScrollableContent />
    </ScrollProvider>
  );
}

function ScrollableContent() {
  const { overlayScrollbars } = useScrollState();
  // Access the OverlayScrollbars instance
}`}
      </pre>
    </div>
  );
}

const metadata: Meta = {
  component: ScrollContextDemo,
  parameters: {
    docs: {
      description: {
        component:
          "Scroll context provider wrapping OverlayScrollbars. Provides scroll state and method access through split contexts.",
      },
    },
  },
  title: "Contexts/ScrollContext",
};

export default metadata;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <ScrollContextDemo />,
};
