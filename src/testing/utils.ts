import { StoryContext, StoryObj } from "@storybook/react";
import { render } from "@testing-library/react";
import { isFunction } from "lodash-es";

export function storybookRender(
  story: StoryObj,
  args: object,
): ReturnType<typeof render> {
  if (!isFunction(story.render)) {
    throw new TypeError("Storybook story must have a render function");
  }
  return render(story.render(args, {} as StoryContext));
}
