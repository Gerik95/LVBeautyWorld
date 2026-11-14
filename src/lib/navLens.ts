export const DRAG_THRESHOLD_PX = 8;

export type LensRect = { left: number; width: number };

export const nearestItemIndex = (pointerX: number, rects: LensRect[]) => {
  if (!rects.length) return -1;
  let best = 0;
  let bestDistance = Infinity;
  rects.forEach((rect, index) => {
    const center = rect.left + rect.width / 2;
    const distance = Math.abs(pointerX - center);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  });
  return best;
};

/** Slide only when the active item actually changes. The first measure and a repeat click stay put. */
export const shouldSlideLens = (previousIndex: number | null, nextIndex: number, reduced: boolean) =>
  previousIndex !== null && previousIndex !== nextIndex && nextIndex >= 0 && !reduced;

export const clampLensLeft = (
  pointerX: number,
  dockLeft: number,
  lensWidth: number,
  minLeft: number,
  maxLeft: number,
) => {
  const raw = pointerX - dockLeft - lensWidth / 2;
  return Math.min(maxLeft, Math.max(minLeft, raw));
};

/**
 * Drop resolution for the glass lens.
 * A short press does not navigate. Cancel returns to the active route.
 * A completed drag navigates once, and only when the nearest item is a different route.
 */
export const resolveLensDrop = ({
  moved,
  cancelled,
  pointerX,
  rects,
  activeIndex,
}: {
  moved: boolean;
  cancelled: boolean;
  pointerX: number;
  rects: LensRect[];
  activeIndex: number;
}) => {
  const stay = activeIndex >= 0 ? activeIndex : 0;
  if (cancelled || !moved) return { index: stay, navigate: false };
  const index = nearestItemIndex(pointerX, rects);
  if (index < 0) return { index: stay, navigate: false };
  return { index, navigate: index !== activeIndex };
};
