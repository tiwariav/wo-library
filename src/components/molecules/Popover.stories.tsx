import { StoryObj } from "@storybook/react";
import { useState } from "react";

import Popover, { PopoverProps } from "./Popover.js";

const metadata = {
  component: Popover,
};
export default metadata;

type Story = StoryObj<typeof Popover>;

const Template = ({ ...args }) => {
  return (
    <Popover content="Content in popover" {...args}>
      Click Me
    </Popover>
  );
};

export const Basic: Story = {
  render: (args) => <Template {...args} />,
};

const NestedButtonTemplate = (args: PopoverProps) => {
  const [open, setIsOpen] = useState(false);

  return (
    <>
      <Popover
        content={
          <div>
            Content in Popover!
            <button
              onClick={() => setIsOpen(false)}
              style={{ marginLeft: "auto" }}
            >
              Close
            </button>
          </div>
        }
        isOpen={open}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(true);
        }}
        onClose={() => setIsOpen(false)}
      >
        <span>
          <button
            className="a button"
            onClick={(event) => {
              event.stopPropagation();
              setIsOpen(true);
            }}
          >
            Click Me
          </button>
        </span>
      </Popover>
    </>
  );
};

export const WithNestedButton: Story = {
  args: {
    isPopover: true,
  },
  render: NestedButtonTemplate,
};
