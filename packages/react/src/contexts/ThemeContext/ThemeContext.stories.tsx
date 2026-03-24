import type { Meta, StoryObj } from "@storybook/react";

import {
  ThemeProvider,
  useThemeMethods,
  useThemeState,
} from "../../contexts/ThemeContext/index.js";

function ThemeConsumer() {
  const { activeThemeName, activeThemeClassName } = useThemeState();
  const { dispatch } = useThemeMethods();

  return (
    <div>
      <p>
        Active theme: <strong>{activeThemeName}</strong>
      </p>
      <p>
        Active class: <code>{activeThemeClassName ?? "(none)"}</code>
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={() => dispatch.setThemeName("fresh")} type="button">
          Switch to Fresh
        </button>
        <button onClick={() => dispatch.setThemeName("trusty")} type="button">
          Switch to Trusty
        </button>
        <button onClick={() => dispatch.setThemeName("base")} type="button">
          Reset to Base
        </button>
      </div>
    </div>
  );
}

function ThemeProviderDemo() {
  return (
    <ThemeProvider
      themeVariants={{
        base: "theme-base",
        fresh: "theme-fresh",
        trusty: "theme-trusty",
      }}
    >
      <ThemeConsumer />
    </ThemeProvider>
  );
}

const metadata: Meta = {
  component: ThemeProviderDemo,
  parameters: {
    docs: {
      description: {
        component:
          "Theme context provider that manages active theme name and class name mappings. Uses split state/method contexts to prevent unnecessary re-renders.",
      },
    },
  },
  title: "Contexts/ThemeContext",
};

export default metadata;

type Story = StoryObj;

export const Default: Story = {
  render: () => <ThemeProviderDemo />,
};
