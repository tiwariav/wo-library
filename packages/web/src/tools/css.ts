/**
 * Reads a CSS custom property (variable) value from a DOM element.
 *
 * @param name - The CSS variable name (e.g., `"--my-color"`).
 * @param node - The element to read from. Defaults to `document.body`.
 * @returns The computed value of the CSS variable.
 *
 * @example
 * ```ts
 * const primaryColor = cssVariable("--primary-color");
 * ```
 */
export function cssVariable(
  name: string,
  node: HTMLElement | SVGSVGElement = document.body,
) {
  return getComputedStyle(node).getPropertyValue(name);
}

/**
 * Sets a CSS custom property on a DOM element.
 *
 * @param name - The CSS variable name (e.g., `"--my-color"`).
 * @param value - The value to set. If `undefined`, the property is not changed.
 * @param node - The target element. Defaults to `document.body`.
 *
 * @example
 * ```ts
 * overrideStyleProperty("--primary-color", "#ff0000");
 * ```
 */
export function overrideStyleProperty(
  name: string,
  value?: string,
  node = document.body,
) {
  if (value) {
    node.style.setProperty(name, value);
  }
}
