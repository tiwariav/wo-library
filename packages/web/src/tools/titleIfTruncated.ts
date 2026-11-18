/**
 * Tooltip helper for truncated table cells: on mouseover, set `title` when
 * `scrollWidth > clientWidth`.
 */

function onTruncationOver(event: MouseEvent): void {
  const el = (event.target as Element | null)?.closest<HTMLElement>("td, th");
  if (el && !el.title && el.scrollWidth > el.clientWidth) {
    el.title = el.textContent || "";
  }
}

export function attachTruncationTitles(root: HTMLElement): () => void {
  root.addEventListener("mouseover", onTruncationOver);
  return () => {
    root.removeEventListener("mouseover", onTruncationOver);
  };
}
