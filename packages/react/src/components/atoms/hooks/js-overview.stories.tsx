import type { Meta, StoryObj } from "@storybook/react";

function JsOverview() {
  return (
    <div>
      <h1>@wo-library/js</h1>
      <p>
        Pure JavaScript/TypeScript utility functions with zero browser
        dependencies.
      </p>

      <h2>Array Utilities</h2>
      <ul>
        <li>
          <strong>
            <code>range(start, end, step?)</code>
          </strong>{" "}
          — Generate a range of numbers
        </li>
        <li>
          <strong>
            <code>addOrUpdate(array, item, key)</code>
          </strong>{" "}
          — Add or update an item in an array by key
        </li>
      </ul>

      <h2>Color Utilities</h2>
      <ul>
        <li>
          <strong>
            <code>rgbToHex(r, g, b)</code>
          </strong>{" "}
          — Convert RGB values to hex string
        </li>
        <li>
          <strong>
            <code>hexToRgb(hex)</code>
          </strong>{" "}
          — Convert hex string to RGB object
        </li>
        <li>
          <strong>
            <code>randomGradientGenerator()</code>
          </strong>{" "}
          — Generate random CSS gradient strings
        </li>
      </ul>

      <h2>Number Formatting</h2>
      <ul>
        <li>
          <strong>
            <code>formatNumber(value, options?)</code>
          </strong>{" "}
          — Format numbers using Indian locale (en-IN)
        </li>
        <li>
          <strong>
            <code>formatNumberWithSuffix(value)</code>
          </strong>{" "}
          — Format with Lakhs/Crores suffixes
        </li>
        <li>
          <strong>
            <code>ordinalNumber(n)</code>
          </strong>{" "}
          — Convert number to ordinal string (1st, 2nd, etc.)
        </li>
        <li>
          <strong>
            <code>stringToNumber(str)</code>
          </strong>{" "}
          — Parse string to number
        </li>
      </ul>

      <h2>Object Utilities</h2>
      <ul>
        <li>
          <strong>
            <code>{"pushOrCreate({ data, key, value, index? })"}</code>
          </strong>{" "}
          — Push to array in object, creating if needed
        </li>
        <li>
          <strong>
            <code>getNestedValue(obj, path)</code>
          </strong>{" "}
          — Get deeply nested value by path
        </li>
      </ul>

      <h2>SVG Geometry</h2>
      <ul>
        <li>
          <strong>
            <code>polarToCartesian(cx, cy, r, angle)</code>
          </strong>{" "}
          — Convert polar to cartesian coordinates
        </li>
        <li>
          <strong>
            <code>describeArc(x, y, r, startAngle, endAngle)</code>
          </strong>{" "}
          — Generate SVG arc path data
        </li>
      </ul>

      <h2>Language &amp; Text</h2>
      <ul>
        <li>
          <strong>
            <code>plularize(count, singular, plural?)</code>
          </strong>{" "}
          — Simple pluralization helper
        </li>
      </ul>

      <h2>Path Utilities</h2>
      <ul>
        <li>
          <strong>
            <code>posixPath(path)</code>
          </strong>{" "}
          — Normalize file paths to POSIX format
        </li>
      </ul>

      <h2>Constants</h2>
      <ul>
        <li>
          <strong>
            <code>INPUT_DEBOUNCE</code>
          </strong>{" "}
          — Standard debounce delay for input fields
        </li>
      </ul>

      <h2>Async Utilities</h2>
      <ul>
        <li>
          <strong>
            <code>wait(ms)</code>
          </strong>{" "}
          — Promise-based delay function
        </li>
      </ul>

      <h2>General Utilities</h2>
      <ul>
        <li>
          <strong>
            <code>isEmpty(value)</code>
          </strong>{" "}
          — Check if value is empty
        </li>
        <li>
          <strong>
            <code>inSubArray(array, value)</code>
          </strong>{" "}
          — Check if value exists in any sub-array
        </li>
      </ul>
    </div>
  );
}

const metadata: Meta = {
  component: JsOverview,
  parameters: {
    docs: {
      description: {
        component:
          "Pure JS/TS utility functions for arrays, colors, numbers, objects, SVG geometry, and more.",
      },
    },
  },
  title: "@wo-library/js/Overview",
};

export default metadata;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <JsOverview />,
};
