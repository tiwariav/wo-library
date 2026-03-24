import type { Meta, StoryObj } from "@storybook/react";

function UiOverview() {
  return (
    <div>
      <h1>@wo-library/ui</h1>
      <p>CSS styles, design tokens, and SVG assets.</p>

      <h2>Breakpoints</h2>
      <p>
        Responsive breakpoint constants (kept in sync with CSS media queries):
      </p>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["xs", "360px"],
            ["sm", "600px"],
            ["md", "960px"],
            ["lg", "1200px"],
            ["xl", "1440px"],
            ["xxl", "1920px"],
          ].map(([token, value]) => (
            <tr key={token}>
              <td>
                <code>{token}</code>
              </td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <pre style={{ background: "#f5f5f5", borderRadius: 4, padding: "1rem" }}>
        {`import { BREAKPOINTS } from "@wo-library/ui";
// BREAKPOINTS.md → 960`}
      </pre>

      <h2>SVG Path Data</h2>
      <p>Pre-defined SVG path data for icon shapes:</p>
      <ul>
        <li>
          <strong>
            <code>SVGPathFlagData</code>
          </strong>{" "}
          — Flag-shaped SVG path
        </li>
        <li>
          <strong>
            <code>SVGPathPinData</code>
          </strong>{" "}
          — Map pin-shaped SVG path with transform
        </li>
      </ul>
      <pre style={{ background: "#f5f5f5", borderRadius: 4, padding: "1rem" }}>
        {`import { SVGPathFlagData, SVGPathPinData } from "@wo-library/ui";`}
      </pre>

      <h2>CSS Design Tokens</h2>
      <p>
        The package provides CSS custom properties (variables) prefixed with{" "}
        <code>--ye-</code> for:
      </p>
      <ul>
        <li>
          Colors (<code>--ye-color-primary</code>,{" "}
          <code>--ye-color-surface</code>, etc.)
        </li>
        <li>
          Typography (<code>--ye-font-family</code>,{" "}
          <code>--ye-line-height</code>, etc.)
        </li>
        <li>Spacing and sizing</li>
        <li>Shadows and borders</li>
      </ul>
      <p>
        Import the base styles in your application entry point to use these
        tokens.
      </p>
    </div>
  );
}

const metadata: Meta = {
  component: UiOverview,
  parameters: {
    docs: {
      description: {
        component:
          "CSS styles, design tokens, breakpoints, and SVG path assets used across the design system.",
      },
    },
  },
  title: "@wo-library/ui/Overview",
};

export default metadata;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <UiOverview />,
};
