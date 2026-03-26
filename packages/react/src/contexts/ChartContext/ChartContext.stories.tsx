import type { Meta, StoryObj } from "@storybook/react";

import {
  ChartProvider,
  useChartMethods,
  useChartState,
} from "../../contexts/ChartContext/index.js";

function ChartConsumer() {
  const { isLoading, symbolImages } = useChartState();
  const { dispatch } = useChartMethods();

  return (
    <div>
      <p>
        isLoading: <strong>{String(isLoading)}</strong>
      </p>
      <p>
        symbolImages: <code>{JSON.stringify(symbolImages)}</code>
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={() => dispatch.setLoading(!isLoading)} type="button">
          Toggle Loading
        </button>
      </div>
    </div>
  );
}

function ChartProviderDemo() {
  return (
    <ChartProvider>
      <ChartConsumer />
    </ChartProvider>
  );
}

const metadata: Meta = {
  component: ChartProviderDemo,
  parameters: {
    docs: {
      description: {
        component:
          "Chart context provider for managing chart loading state and symbol image mappings. Uses split state/method contexts.",
      },
    },
  },
  title: "Contexts/ChartContext",
};

export default metadata;

type Story = StoryObj;

export const Default: Story = {
  render: () => <ChartProviderDemo />,
};
