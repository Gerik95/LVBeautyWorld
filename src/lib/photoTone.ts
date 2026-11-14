export type ToneBox = {
  top: number;
  bottom: number;
  height: number;
};

/** Middle band of the viewport where a touch photo may turn to color. */
const BAND_START = 0.22;
const BAND_END = 0.78;

/**
 * The photo closest to the vertical middle, among those that cross the middle band.
 * Photos outside that band stay out, so a frame leaving the screen loses color.
 */
export const pickCenterPhoto = <T extends ToneBox>(items: readonly T[], viewportHeight: number): T | null => {
  if (viewportHeight <= 0) return null;
  const mid = viewportHeight / 2;
  const bandTop = viewportHeight * BAND_START;
  const bandBottom = viewportHeight * BAND_END;
  let best: T | null = null;
  let bestDist = Infinity;
  for (const item of items) {
    if (item.height < 8) continue;
    if (item.bottom <= bandTop || item.top >= bandBottom) continue;
    const dist = Math.abs(item.top + item.height / 2 - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = item;
    }
  }
  return best;
};
