import { expect } from "@storybook/jest";
import { screen, userEvent, within } from "@storybook/test";

export async function playFloatingBasic(
  canvasElement: HTMLElement,
  floatingText: string,
) {
  const canvas = within(canvasElement);
  // 👇 Simulate interactions with the component
  await userEvent.click(canvas.getByRole("button"));
  // 👇 Assert DOM structure
  const modalBody = screen.getByText(floatingText);
  await expect(modalBody).toBeInTheDocument();
  await userEvent.click(document.body);
  await expect(modalBody).not.toBeInTheDocument();
}
