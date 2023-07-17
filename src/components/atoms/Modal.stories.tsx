import { StoryObj } from "@storybook/react";
import { useState } from "react";

import Modal from "./Modal.js";

const metadata = {
  component: Modal,
};
export default metadata;

type Story = StoryObj<typeof Modal>;

const Template = ({ open = false, ...args }) => {
  const [show, setShow] = useState(open);

  return (
    <div>
      <button onClick={() => setShow(true)}>Show Modal</button>
      <Modal onClose={() => setShow(false)} open={show} {...args}>
        <div>Click Me</div>
      </Modal>
    </div>
  );
};

export const Basic: Story = {
  render: (args) => <Template {...args} />,
};

export const Open: Story = {
  args: {
    open: true,
  },
  render: (args) => <Template {...args} />,
};
