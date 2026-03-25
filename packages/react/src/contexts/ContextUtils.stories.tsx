import type { Meta, StoryObj } from "@storybook/react";

/**
 * Context utility documentation story.
 * The utilities are building blocks for creating split state/dispatch contexts.
 */
function ContextUtilitiesDemo() {
  return (
    <div>
      <h4>Context Utilities</h4>

      <section style={{ marginBottom: "1.5rem" }}>
        <h5>createAndUseContext</h5>
        <p>
          Creates a split-context pair (state + dispatch) and returns typed
          hooks. Following the recommended pattern of splitting state and
          dispatch into separate contexts to prevent unnecessary re-renders.
        </p>
        <pre
          style={{ background: "#f5f5f5", borderRadius: 4, padding: "1rem" }}
        >
          {`const { StateContext, MethodContext, useContextState, useContextMethods } =
  createAndUseContext<MyState, ContextDispatch<MyMethods>>();`}
        </pre>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h5>getUpdateStateMethod</h5>
        <p>
          Helper that produces an Immer-based state updater function for use
          inside <code>useMethods</code> action records.
        </p>
        <pre
          style={{ background: "#f5f5f5", borderRadius: 4, padding: "1rem" }}
        >
          {`const createMethods = (state: MyState) => ({
  updateState: getUpdateStateMethod(state),
  // ...other methods
});`}
        </pre>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h5>useSimpleProvider</h5>
        <p>
          Renders a simple two-provider tree (state + dispatch) wrapping
          children. Used internally by context providers.
        </p>
        <pre
          style={{ background: "#f5f5f5", borderRadius: 4, padding: "1rem" }}
        >
          {`return useSimpleProvider(StateContext, MethodContext, {
  children,
  dispatch,
  state,
});`}
        </pre>
      </section>

      <section>
        <h5>dispatchLoading</h5>
        <p>
          Dispatches a loading state before and after calling a method on a
          context dispatch.
        </p>
      </section>
    </div>
  );
}

const metadata: Meta = {
  component: ContextUtilitiesDemo,
  parameters: {
    docs: {
      description: {
        component:
          "Utility functions for building split state/dispatch React contexts: `createAndUseContext`, `getUpdateStateMethod`, `useSimpleProvider`, and `dispatchLoading`.",
      },
    },
  },
  title: "Contexts/Utilities",
};

export default metadata;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <ContextUtilitiesDemo />,
};
