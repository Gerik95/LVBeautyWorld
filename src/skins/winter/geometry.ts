/** Pure helpers of the winter skin. No DOM, so they are unit-tested. */

import { berlinParts } from "@/lib/hours";

export type Box = { x: number; y: number; width: number; height: number };

/** Where an SVG with `preserveAspectRatio="xMidYMid meet"` draws its viewBox inside a box. */
export const meetTransform = (box: { width: number; height: number }, viewBox: Box) => {
  const scale = Math.min(box.width / viewBox.width, box.height / viewBox.height);
  return {
    scale,
    offsetX: (box.width - viewBox.width * scale) / 2 - viewBox.x * scale,
    offsetY: (box.height - viewBox.height * scale) / 2 - viewBox.y * scale,
  };
};

export const parseViewBox = (value: string | null | undefined): Box | null => {
  const parts = (value ?? "").trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
  const [x, y, width, height] = parts;
  if (width <= 0 || height <= 0) return null;
  return { x, y, width, height };
};

/** One column of a ledge snow can rest on. `y` is the first solid cell from above. */
export type Ledge = { x: number; y: number; slope: number };

/** A run of neighbouring ledge columns: one snow cap. */
export type Cap = Ledge[];

/**
 * Finds upward-facing edges in a coverage grid (`solid[y * cols + x]`).
 * A cell is a ledge if it is solid and the cell above is empty. Columns are
 * joined into caps while the edge stays within `maxStep` cells; steep walls
 * (slope above `maxSlope`) carry no snow.
 */
export const findCaps = (
  solid: ArrayLike<number>,
  cols: number,
  rows: number,
  { maxStep = 2, maxSlope = 2.4, minLength = 3 } = {},
): Cap[] => {
  const at = (x: number, y: number) => (x >= 0 && y >= 0 && x < cols && y < rows ? solid[y * cols + x] : 0);
  const ledgesByColumn: number[][] = [];
  for (let x = 0; x < cols; x += 1) {
    const list: number[] = [];
    for (let y = 0; y < rows; y += 1) {
      if (at(x, y) && !at(x, y - 1) && !at(x, y - 2)) list.push(y);
    }
    ledgesByColumn.push(list);
  }

  const used = ledgesByColumn.map((list) => list.map(() => false));
  const caps: Cap[] = [];

  for (let x = 0; x < cols; x += 1) {
    ledgesByColumn[x].forEach((startY, startIndex) => {
      if (used[x][startIndex]) return;
      used[x][startIndex] = true;
      const run: { x: number; y: number }[] = [{ x, y: startY }];
      let cx = x;
      let cy = startY;
      while (cx + 1 < cols) {
        const next = ledgesByColumn[cx + 1];
        let best = -1;
        let bestDist = Infinity;
        next.forEach((ny, index) => {
          const dist = Math.abs(ny - cy);
          if (!used[cx + 1][index] && dist <= maxStep && dist < bestDist) {
            best = index;
            bestDist = dist;
          }
        });
        if (best < 0) break;
        used[cx + 1][best] = true;
        cx += 1;
        cy = next[best];
        run.push({ x: cx, y: cy });
      }
      if (run.length < minLength) return;
      const cap: Cap = run.map((point, index) => {
        const a = run[Math.max(0, index - 2)];
        const b = run[Math.min(run.length - 1, index + 2)];
        const slope = Math.abs(b.y - a.y) / Math.max(1, b.x - a.x);
        return { x: point.x, y: point.y, slope };
      });
      let segment: Cap = [];
      for (const ledge of cap) {
        if (ledge.slope <= maxSlope) segment.push(ledge);
        else {
          if (segment.length >= minLength) caps.push(segment);
          segment = [];
        }
      }
      if (segment.length >= minLength) caps.push(segment);
    });
  }
  return caps;
};

/**
 * Target snow depth along a cap, in cells. Flat ledges carry the most,
 * steep ones little; the ends round off so caps do not look cut.
 */
export const capProfile = (cap: Cap, depth: number, maxSlope = 2.4, seed = 1) => {
  const n = cap.length;
  const raw = cap.map((ledge, index) => {
    const flat = Math.max(0, 1 - ledge.slope / maxSlope);
    const wobble = 0.9 + 0.1 * Math.sin(seed * 12.9898 + index * 0.23) * Math.cos(index * 0.071 + seed);
    const fromEnd = Math.min(index, n - 1 - index);
    const round = Math.min(1, Math.sqrt(fromEnd / Math.max(1, Math.min(depth * 1.6, n / 2))));
    return depth * (0.25 + 0.75 * flat) * wobble * round;
  });
  return raw.map((_, index) => {
    let sum = 0;
    let count = 0;
    for (let k = -2; k <= 2; k += 1) {
      const value = raw[index + k];
      if (value !== undefined) {
        sum += value;
        count += 1;
      }
    }
    return sum / count;
  });
};

/**
 * How brightly a flake at (x, y) sits in the spotlight. The lamp is the
 * top-left corner of the hero; the band follows `angleDeg`, is `thickness`
 * of the hero height wide and fades along its length like the CSS gradient.
 */
export const beamWeight = (
  x: number,
  y: number,
  width: number,
  height: number,
  angleDeg: number,
  thickness = 0.48,
) => {
  const angle = (angleDeg * Math.PI) / 180;
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const along = x * ux + y * uy;
  if (along <= 0) return 0;
  const across = Math.abs(-x * uy + y * ux);
  const sigma = Math.max(1, height * thickness * 0.24);
  const band = Math.exp(-((across / sigma) ** 2));
  const reach = Math.max(1, width * 1.32 * 0.7);
  const fade = Math.max(0, 1 - along / reach);
  return band * (0.3 + 0.7 * fade);
};

/** Reads `rotate(…deg)` that `HeroSpotlight` writes on the beam. */
export const parseRotate = (transform: string | null | undefined, fallback: number) => {
  const match = /rotate\((-?[\d.]+)deg\)/.exec(transform ?? "");
  const value = match ? Number(match[1]) : NaN;
  return Number.isFinite(value) ? value : fallback;
};

/** Silvester in Berlin: from 31 Dec 23:59 until 1 Jan 00:30. */
export const isSilvester = (now: Date) => {
  const { month, day, hour, minute } = berlinParts(now);
  if (month === 12 && day === 31) return hour === 23 && minute >= 59;
  if (month === 1 && day === 1) return hour === 0 && minute < 30;
  return false;
};

export type SilvesterPhase = "off" | "show" | "finale";

/** Show from 23:59; the first two minutes of the new year are the finale. */
export const silvesterPhase = (now: Date): SilvesterPhase => {
  if (!isSilvester(now)) return "off";
  const { month, minute } = berlinParts(now);
  return month === 1 && minute < 2 ? "finale" : "show";
};
