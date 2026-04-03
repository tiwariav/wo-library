import { render } from "@testing-library/react";
import Lorem from "../Lorem.js";
import { expect, describe, it, jest } from "@jest/globals";
import React from "react";
import { loremIpsum } from "lorem-ipsum";

jest.mock("lorem-ipsum", () => ({
  loremIpsum: jest.fn(),
}));

describe("Lorem", () => {
  it("renders safe tags from loremIpsum", () => {
    (loremIpsum as jest.Mock).mockReturnValue(
      "<p>Safe text <strong>bold</strong> <em>italic</em></p>",
    );
    const { container } = render(<Lorem />);
    expect(container.innerHTML).toContain(
      "<div><p>Safe text <strong>bold</strong> <em>italic</em></p></div>",
    );
  });

  it("removes unsafe tags", () => {
    (loremIpsum as jest.Mock).mockReturnValue(
      "<p>Safe</p><script>alert('xss')</script><iframe></iframe>",
    );
    const { container } = render(<Lorem />);
    expect(container.innerHTML).toContain("<div><p>Safe</p></div>");
    expect(container.innerHTML).not.toContain("<script>");
    expect(container.innerHTML).not.toContain("<iframe>");
  });

  it("strips attributes from allowed tags", () => {
    (loremIpsum as jest.Mock).mockReturnValue(
      '<p class="danger" onclick="alert(1)">Safe but dirty</p>',
    );
    const { container } = render(<Lorem />);
    expect(container.innerHTML).toContain("<div><p>Safe but dirty</p></div>");
    expect(container.innerHTML).not.toContain('class="danger"');
    expect(container.innerHTML).not.toContain('onclick="alert(1)"');
  });

  it("allows br tags", () => {
    (loremIpsum as jest.Mock).mockReturnValue("Line 1<br>Line 2");
    const { container } = render(<Lorem />);
    expect(container.innerHTML).toContain("<div>Line 1<br>Line 2</div>");
  });
});
