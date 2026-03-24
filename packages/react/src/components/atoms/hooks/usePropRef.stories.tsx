import type { Meta, StoryObj } from "@storybook/react";

import { forwardRef, useRef } from "react";

import usePropRef from "../../../hooks/usePropRef.js";

const DemoInput = forwardRef<HTMLInputElement>((props, ref) => {
  const { innerRef, setInnerRef } = usePropRef(ref);

  return (
    <div>
      <input ref={setInnerRef} type="text" {...props} />
      <p>
        innerRef attached:{" "}
        <strong>{innerRef.current ? "Yes" : "Waiting…"}</strong>
      </p>
    </div>
  );
});
DemoInput.displayName = "DemoInput";

function UsePropRefDemo() {
  const externalRef = useRef<HTMLInputElement>(null);

  function focusInput() {
    externalRef.current?.focus();
  }

  return (
    <div>
      <DemoInput placeholder="Type here..." ref={externalRef} />
      <button onClick={focusInput} type="button">
        Focus via external ref
      </button>
    </div>
  );
}

const metadata: Meta = {
  component: UsePropRefDemo,
  parameters: {
    docs: {
      description: {
        component:
          "Merges one or more forwarded refs into a single internal ref. Useful when a component needs its own ref while also forwarding refs from the parent.",
      },
    },
  },
  title: "Hooks/usePropRef",
};

export default metadata;

type Story = StoryObj;

export const Default: Story = {
  render: () => <UsePropRefDemo />,
};
