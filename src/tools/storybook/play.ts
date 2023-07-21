import { expect } from "@storybook/jest";
import { screen, userEvent, within } from "@storybook/testing-library";

export async function playFloatingBasic(
  canvasElement: HTMLElement,
  floatingText: string,
) {
  const canvas = within(canvasElement);
  // 👇 Simulate interactions with the component
  await userEvent.click(canvas.getByRole("button"));
  // 👇 Assert DOM structure
  const modalBody = screen.getByText(floatingText);
  expect(modalBody).toBeInTheDocument();
  await userEvent.click(document.body);
  expect(modalBody).not.toBeInTheDocument();
}
