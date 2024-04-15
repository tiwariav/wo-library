import { Meta, StoryObj } from "@storybook/react";
import { loremIpsum } from "lorem-ipsum";
import { ReactNode } from "react";

import useStateWithProp from "../../hooks/useStateWithProp.js";
import { playFloatingBasic } from "../../tools/storybook/play.js";
import Modal, { ModalProps } from "./Modal.js";

type TemplateProps = ModalProps & { modalContent: ReactNode };

const Template = ({
  isOpen,
  modalContent = "",
  onClose,
  ...args
}: TemplateProps) => {
  const [open, setOpen] = useStateWithProp(isOpen);

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
      <Modal
        isOpen={isOpen || open}
        onClose={() => {
          setOpen(false);
          onClose?.();
        }}
        {...args}
      >
        <div className="story-box">{modalContent || MODAL_TEXT}</div>
      </Modal>
    </div>
  );
};

const metadata: Meta<TemplateProps> = {
  component: Modal,
  parameters: {
    docs: { story: { inline: false } },
  },
  render: (args) => <Template {...args} />,
};
export default metadata;

type Story = StoryObj<TemplateProps>;

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
