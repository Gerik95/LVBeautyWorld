/** Motion numbers shared by the hero lamps. CSS comments point here. */

export type IgnitionStop = { t: number; level: number };

/**
 * Logo lamp. Level 0 is a black mark on a black field.
 * Two ignition attempts, then a few weak dips, then a steady contour.
 * Times are seconds. Not random.
 */
export const logoIgnitionProfile: readonly IgnitionStop[] = [
  { t: 0, level: 0 },
  { t: 0.35, level: 0.02 },
  { t: 0.75, level: 0.46 },
  { t: 1.15, level: 0.05 },
  { t: 1.4, level: 0.04 },
  { t: 1.95, level: 0.9 },
  { t: 2.35, level: 0.5 },
  { t: 2.6, level: 0.74 },
  { t: 2.85, level: 0.56 },
  { t: 3.1, level: 0.82 },
  { t: 3.3, level: 0.85 },
];

/**
 * Light-theme logo lamp. Same flicker as `logoIgnitionProfile`, scaled so the
 * xenon rim stays quieter than the white contour on black.
 * Last stop × gain is the edge the CSS rests on (0.85 × 0.88 = 0.75).
 */
export const logoLightGain = 0.88;

/**
 * Spotlight lamp. Same session clock, different flashes and a later start.
 * Ends in a steady beam. Not random.
 */
export const spotlightIgnitionProfile: readonly IgnitionStop[] = [
  { t: 0, level: 0 },
  { t: 0.55, level: 0 },
  { t: 0.95, level: 0.18 },
  { t: 1.4, level: 0.72 },
  { t: 1.85, level: 0.08 },
  { t: 2.15, level: 0.1 },
  { t: 2.6, level: 0.84 },
  { t: 2.95, level: 0.42 },
  { t: 3.2, level: 0.7 },
  { t: 3.45, level: 1 },
];

const profileEnd = (stops: readonly IgnitionStop[]) => stops[stops.length - 1]?.t ?? 0;

/**
 * Beam shape. A soft band from the top-left corner.
 * Thickness is about a third wider than the previous 36% band.
 * The CSS mask keeps the edges soft; this is not a full-hero wash.
 */
export const spotlight = {
  length: "132%",
  thickness: "48%",
  blur: "14px",
  alpha: "0.62",
  alphaMid: "0.15",
  home: { x: 0.58, y: 0.4 },
  /** Resting angle of `home`, degrees. Keep the CSS fallback in sync. */
  homeAngle: 34.59,
  returnMs: 1050,
  /** Aim travel in hero-widths per second. A far entry glides; a small move keeps up. */
  glide: 1.35,
  /** Half-angle of the gathered beam, radians. About a third wider than 0.11. */
  halfAngle: 0.146,
} as const;

export const motion = {
  lampMs: Math.round(Math.max(profileEnd(logoIgnitionProfile), profileEnd(spotlightIgnitionProfile)) * 1000),
  spotlightReturnMs: spotlight.returnMs,
  /** Discover-link scroll. Native smooth scroll is not used, so this duration is real. */
  scrollMs: 780,
  /** Glass lens travel between nav items. */
  lensMs: 440,
  /** Top bar edges between the hero width and an inner page. */
  topbarMs: 640,
  hoverMs: 200,
  hoverScale: 1.01,
  photoMs: 520,
  revealMs: 620,
  revealRisePx: 20,
  revealStaggerMs: 80,
} as const;

/**
 * Home service gallery. CSS variables in `globals.css` and `defaultSkin.tokens`
 * repeat these numbers so a seasonal skin can override them without editing the gallery.
 */
export const galleryMotion = {
  panelMs: 360,
  photoMs: 450,
  waveInMs: 1500,
  waveOutMs: 1050,
  gleamMs: 680,
  revealMs: 420,
  revealStaggerMs: 60,
  revealShiftPx: 14,
} as const;

export const sampleIgnition = (stops: readonly IgnitionStop[], elapsedMs: number) => {
  const first = stops[0];
  const last = stops[stops.length - 1];
  if (!first || !last) return 0;
  const t = Math.max(elapsedMs, 0) / 1000;
  if (t <= first.t) return first.level;
  if (t >= last.t) return last.level;
  let index = 1;
  while (index < stops.length && stops[index].t < t) index += 1;
  const from = stops[index - 1];
  const to = stops[index];
  const span = to.t - from.t || 1;
  const progress = (t - from.t) / span;
  return from.level + (to.level - from.level) * progress;
};

/** Ease-out used when the beam returns home. `t` is 0…1. */
export const returnEase = (t: number) => 1 - (1 - Math.min(1, Math.max(0, t))) ** 3;
