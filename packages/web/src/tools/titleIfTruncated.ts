/**
 * Tooltip helper for truncated table cells: on mouseover, set `title` when
 * `scrollWidth > clientWidth`.
 */

export function attachTruncationTitles(root: HTMLElement): () => void {
  const onOver = (event: MouseEvent) => {
    const el = (event.target as Element | null)?.closest<HTMLElement>("td, th");
    if (el && !el.title && el.scrollWidth > el.clientWidth) {
      el.title = el.textContent || "";
    }
  };
  root.addEventListener("mouseover", onOver);
  return () => {
    root.removeEventListener("mouseover", onOver);
  };
}
