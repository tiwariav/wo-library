import { Meta, StoryObj } from "@storybook/react";
import { loremIpsum } from "lorem-ipsum";
import { ReactNode, useEffect, useState } from "react";

import { playFloatingBasic } from "../../tools/storybook/play.js";
import Modal, { ModalProps } from "./Modal.js";

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
      <div
        dangerouslySetInnerHTML={{
          __html: loremIpsum({
            count: 16,
            format: "html",
            units: "paragraphs",
          }),
        }}
      />
      <Modal isOpen={open} onClose={() => setOpen(false)} {...args}>
        <div className="story-box">{modalContent || MODAL_TEXT}</div>
      </Modal>
    </div>
  );
};

const metadata: Meta<typeof Modal> = {
  component: Modal,
  parameters: {
    docs: { story: { inline: false } },
  },
  render: (args) => <Template {...args} />,
};
export default metadata;

type Story = StoryObj<ModalProps & { modalContent: ReactNode }>;

const MODAL_TEXT = "Content inside Modal!";

export const Basic: Story = {
  play: async ({ canvasElement }) => {
    await playFloatingBasic(canvasElement, MODAL_TEXT);
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
  },
};

export const OnClose: Story = {
  args: {
    onClose: () => alert("Modal closed!"),
  },
};

export const MaxWidth: Story = {
  args: {
    modalContent: (
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html: loremIpsum({
              count: 16,
              format: "html",
              units: "paragraphs",
            }),
          }}
        />
        <input placeholder="Placeholder" />
      </div>
    ),
  },
};
