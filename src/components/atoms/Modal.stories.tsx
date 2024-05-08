import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

import { noop } from "lodash-es";

import type { ModalProps } from "./Modal.js";

import useStateWithProp from "../../hooks/useStateWithProp.js";
import { playFloatingBasic } from "../../tools/storybook/play.js";
import Lorem from "./Lorem.js";
import Modal from "./Modal.js";

const MODAL_TEXT = "Content inside Modal!";

type TemplateProps = { modalContent: ReactNode } & ModalProps;

function Template({ isOpen, modalContent, onClose, ...args }: TemplateProps) {
  const [open, setOpen] = useStateWithProp(isOpen);

  return (
    <div>
      <button
        id="showButton"
        onClick={() => {
          setOpen(true);
        }}
      >
        Show Modal
      </button>
      <Lorem count={16} units="paragraphs" />
      <Modal
        isOpen={isOpen ?? open}
        onClose={() => {
          setOpen(false);
          onClose?.();
        }}
        {...args}
      >
        <div className="story-box">{modalContent ?? MODAL_TEXT}</div>
      </Modal>
    </div>
  );
}

const metadata: Meta<TemplateProps> = {
  component: Modal,
  parameters: {
    docs: { story: { inline: false } },
  },
  render: (args) => <Template {...args} />,
};
export default metadata;

type Story = StoryObj<TemplateProps>;

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
    onClose: noop,
  },
};

export const MaxWidth: Story = {
  args: {
    modalContent: (
      <div>
        <Lorem count={16} units="paragraphs" />
        <input placeholder="Placeholder" />
      </div>
    ),
  },
};
