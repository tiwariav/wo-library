import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { ImageUpload } from "./image-upload.js";

const meta: Meta<typeof ImageUpload> = {
  component: ImageUpload,
  title: "registry/ui/ImageUpload",
};
export default meta;

type Story = StoryObj<typeof ImageUpload>;

export const Default: Story = {
  args: { onFile: fn() },
};

export const WithoutCompression: Story = {
  args: { compress: false, label: "Upload original", onFile: fn() },
};
