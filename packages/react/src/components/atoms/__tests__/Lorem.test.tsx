import { describe, expect, it, jest } from "@jest/globals";

const mockLoremIpsum = jest.fn<() => string>();

await jest.unstable_mockModule("lorem-ipsum", () => ({
  loremIpsum: mockLoremIpsum,
}));

const { render } = await import("@testing-library/react");
const { default: Lorem } = await import("../Lorem.js");

describe("Lorem", () => {
  it("renders safe tags from loremIpsum", () => {
    mockLoremIpsum.mockReturnValue(
      "<p>Safe text <strong>bold</strong> <em>italic</em></p>",
    );
    const { container } = render(<Lorem />);
    expect(container.innerHTML).toContain(
      "<div><p>Safe text <strong>bold</strong> <em>italic</em></p></div>",
    );
  });

  it("removes unsafe tags", () => {
    mockLoremIpsum.mockReturnValue(
      "<p>Safe</p><script>alert('xss')</script><iframe></iframe>",
    );
    const { container } = render(<Lorem />);
    expect(container.innerHTML).toContain("<div><p>Safe</p></div>");
    expect(container.innerHTML).not.toContain("<script>");
    expect(container.innerHTML).not.toContain("<iframe>");
  });

  it("strips attributes from allowed tags", () => {
    mockLoremIpsum.mockReturnValue(
      '<p class="danger" onclick="alert(1)">Safe but dirty</p>',
    );
    const { container } = render(<Lorem />);
    expect(container.innerHTML).toContain("<div><p>Safe but dirty</p></div>");
    expect(container.innerHTML).not.toContain('class="danger"');
    expect(container.innerHTML).not.toContain('onclick="alert(1)"');
  });

  it("allows br tags", () => {
    mockLoremIpsum.mockReturnValue("Line 1<br>Line 2");
    const { container } = render(<Lorem />);
    expect(container.innerHTML).toContain("<div>Line 1<br>Line 2</div>");
  });
});
