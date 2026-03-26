import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

import { noop } from "lodash-es";
import { expect, screen, userEvent, within } from "storybook/test";

import type { ModalProps } from "./Modal.js";

import useStateWithProp from "../../hooks/useStateWithProp.js";
import Lorem from "./Lorem.js";
import Modal from "./Modal.js";

const MODAL_TEXT = "Content inside Modal!";

async function playFloatingBasic(
  canvasElement: HTMLElement,
  floatingText: string,
) {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button"));
  const modalBody = screen.getByText(floatingText);
  await expect(modalBody).toBeInTheDocument();
  await userEvent.click(document.body);
  await expect(modalBody).not.toBeInTheDocument();
}

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
  title: "Atoms/Modal",
  parameters: {
    docs: {
      description: {
        component:
          "Dialog overlay with optional header/footer slots, backdrop click-to-close, and focus trapping. Controlled via `isOpen`/`onClose` props.",
      },
      story: { inline: false },
    },
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
