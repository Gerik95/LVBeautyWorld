import { homeServiceIds, type HomeServiceId } from "@/content/services";

export const GALLERY_IMAGE_SIZES = "(max-width: 56rem) 92vw, 38rem";

/** Radius that clears the far corner after the soft leading edge has passed. */
export const WAVE_COVER = "214%";

export const isHomeServiceId = (value: string | null | undefined): value is HomeServiceId =>
  !!value && (homeServiceIds as readonly string[]).includes(value);

/** Unknown or empty storage falls back to the first service. Never trusts array position alone. */
export const resolveStoredService = (value: string | null | undefined): HomeServiceId =>
  isHomeServiceId(value) ? value : homeServiceIds[0];

export const formatGalleryCount = (index: number, total: number) => {
  const current = String(index + 1).padStart(2, "0");
  const all = String(total).padStart(2, "0");
  return `${current} / ${all}`;
};

/**
 * A wave that is still open keeps its origin so a quick re-entry does not jump.
 * A closed wave starts at the new entry point.
 */
export const shouldResetWaveOrigin = (radiusPercent: number) =>
  !Number.isFinite(radiusPercent) || radiusPercent < 1;

/** Latest request wins. Completion of an older load must not change the visible service. */
export const isCurrentRequest = (token: number, current: number) => token === current;

export const readCssMs = (raw: string, fallback: number) => {
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
};
