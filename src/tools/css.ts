export function cssVariable(name: string, node = document.body) {
  return getComputedStyle(node).getPropertyValue(name);
}

export function overrideStyleProperty(
  name: string,
  value?: string,
  node = document.body,
) {
  if (value) {
    node.style.setProperty(name, value);
  }
}
