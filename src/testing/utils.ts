import { StoryContext, StoryObj } from "@storybook/react";
import { render } from "@testing-library/react";

export function storybookRender(
  story: StoryObj,
  args: unknown[]
): ReturnType<typeof render> {
  return render(story.render(args, {} as StoryContext));
}
