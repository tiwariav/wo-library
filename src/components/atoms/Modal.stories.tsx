import { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

import { playFloatingBasic } from "../../tools/storybook/play.js";
import Modal from "./Modal.js";

const metadata: Meta<typeof Modal> = {
  component: Modal,
  parameters: {
    docs: { story: { inline: false } },
  },
};
export default metadata;

type Story = StoryObj<typeof Modal>;

const MODAL_TEXT = "Content inside Modal!";

const Template = ({ isOpen = false, modalContent = "", ...args }) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <div>
      <button id="showButton" onClick={() => setOpen(true)}>
        Show Modal
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} {...args}>
        <div className="story-box">{modalContent || MODAL_TEXT}</div>
      </Modal>
    </div>
  );
};

export const Basic: Story = {
  play: async ({ canvasElement }) => {
    await playFloatingBasic(canvasElement, MODAL_TEXT);
  },

  render: (args) => <Template {...args} />,
};

export const Open: Story = {
  args: {
    isOpen: true,
  },
  render: Basic.render,
};

export const OnClose: Story = {
  args: {
    onClose: () => alert("Modal closed!"),
  },
  render: Basic.render,
};
