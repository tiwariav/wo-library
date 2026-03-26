import type { Meta, StoryObj } from "@storybook/react";

function WebOverview() {
  return (
    <div>
      <h1>@wo-library/web</h1>
      <p>Browser and DOM utility functions for web applications.</p>

      <h2>CSS Utilities</h2>
      <ul>
        <li>
          <strong>
            <code>cssVariable(name, element?)</code>
          </strong>{" "}
          — Read a CSS custom property value from the DOM
        </li>
        <li>
          <strong>
            <code>overrideStyleProperty(element, property, value)</code>
          </strong>{" "}
          — Set an inline style override
        </li>
      </ul>

      <h2>Script Loading</h2>
      <ul>
        <li>
          <strong>
            <code>loadScript(src)</code>
          </strong>{" "}
          — Dynamically load an external JavaScript file, returning a promise
        </li>
        <li>
          <strong>
            <code>loadStylesheet(href)</code>
          </strong>{" "}
          — Dynamically load an external CSS stylesheet
        </li>
      </ul>

      <h2>Error Classes</h2>
      <ul>
        <li>
          <strong>
            <code>WoLoadScriptError</code>
          </strong>{" "}
          — Custom error for script loading failures
        </li>
      </ul>

      <h2>
        Fetch Utilities (<code>fetch</code> namespace)
      </h2>
      <p>HTTP request helpers for common fetch patterns.</p>

      <h2>
        Storage Utilities (<code>storage</code> namespace)
      </h2>
      <p>
        Wrappers around <code>localStorage</code> and{" "}
        <code>sessionStorage</code> with JSON serialization.
      </p>

      <h2>
        SVG Utilities (<code>svg</code> namespace)
      </h2>
      <ul>
        <li>
          <strong>
            <code>svgNodeToData(node)</code>
          </strong>{" "}
          — Convert an SVG DOM node to a data URI
        </li>
        <li>
          <strong>
            <code>responseTextToData(text)</code>
          </strong>{" "}
          — Convert SVG response text to a data URI
        </li>
      </ul>

      <h2>
        Browser Utilities (<code>others</code> namespace)
      </h2>
      <p>Miscellaneous browser helpers and detection utilities.</p>
    </div>
  );
}

const metadata: Meta = {
  component: WebOverview,
  parameters: {
    docs: {
      description: {
        component:
          "Browser and DOM utility functions for CSS variables, script loading, fetch helpers, storage, and SVG manipulation.",
      },
    },
  },
  title: "@wo-library/web/Overview",
};

export default metadata;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <WebOverview />,
};
