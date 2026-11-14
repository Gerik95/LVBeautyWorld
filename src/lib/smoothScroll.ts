/** Ease-in-out used by the services anchor. `t` is 0…1. */
export const scrollEase = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
};

const interruptKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

/** One animated scroll to a document offset. Wheel, touch, or those keys cancel it. */
export const smoothScrollTo = (destinationY: number, durationMs: number) => {
  const start = window.scrollY;
  const delta = destinationY - start;
  if (Math.abs(delta) < 1) return;

  let frame = 0;
  let stopped = false;
  const started = performance.now();
  const capture: AddEventListenerOptions = { capture: true, passive: true };

  const stop = () => {
    if (stopped) return;
    stopped = true;
    if (frame) window.cancelAnimationFrame(frame);
    window.removeEventListener("wheel", stop, capture);
    window.removeEventListener("touchstart", stop, capture);
    window.removeEventListener("keydown", onKey, capture);
  };

  const onKey = (event: KeyboardEvent) => {
    if (interruptKeys.has(event.key)) stop();
  };

  window.addEventListener("wheel", stop, capture);
  window.addEventListener("touchstart", stop, capture);
  window.addEventListener("keydown", onKey, capture);

  const step = (now: number) => {
    if (stopped) return;
    const progress = Math.min(1, (now - started) / durationMs);
    window.scrollTo(0, start + delta * scrollEase(progress));
    if (progress < 1) frame = window.requestAnimationFrame(step);
    else stop();
  };

  frame = window.requestAnimationFrame(step);
};

/** One animated scroll. Wheel, touch, or those keys cancel it and leave native scrolling alone. */
export const smoothScrollToElement = (target: HTMLElement, durationMs: number) => {
  const start = window.scrollY;
  const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  smoothScrollTo(target.getBoundingClientRect().top + start - margin, durationMs);
};
