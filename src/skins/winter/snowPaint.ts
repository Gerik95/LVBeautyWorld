/**
 * Painter for lying snow: caps on the mark, the 404 drift, the footer drift.
 * A snow mass is a top line and a foot line over the same x samples. It is
 * filled with a lit gradient, shaded lumps, fine ice grain and twinkling
 * glints, so it reads as powder rather than a flat white shape.
 */

const grainCache = new Map<string, HTMLCanvasElement>();

/** Fine speckle: cold shadow specks and bright crystals. Tiled as a pattern. */
const grainTile = (dark: boolean) => {
  const key = dark ? "dark" : "light";
  const cached = grainCache.get(key);
  if (cached) return cached;
  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    for (let i = 0; i < 900; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() < 0.85 ? 0.45 : 0.8;
      if (Math.random() < 0.45) {
        ctx.fillStyle = dark
          ? `rgba(120, 140, 178, ${0.06 + Math.random() * 0.14})`
          : `rgba(126, 146, 182, ${0.05 + Math.random() * 0.1})`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + Math.random() * 0.5})`;
      }
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  grainCache.set(key, canvas);
  return canvas;
};

/** Deterministic 0…1 from two numbers. Lumps and glints stay put between frames. */
const hash = (a: number, b: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Smooth 1D value noise, −1…1. No visible period, unlike a sum of sines. */
const noise = (x: number, seed: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return (hash(i, seed) * (1 - u) + hash(i + 1, seed) * u) * 2 - 1;
};

export type SnowMass = {
  xs: number[];
  top: number[];
  base: number[];
};

export type SnowPaintOptions = {
  dark: boolean;
  /**
   * Typical lump radius in px. Keep it fixed while a mass grows: lumps and
   * crest bumps are laid out along x by it, so a changing value would make
   * the surface slide sideways instead of rising.
   */
  lump: number;
  seed?: number;
};

export type GlintOptions = SnowPaintOptions & {
  /** Seconds; drives the twinkle. */
  time: number;
  /** Glints per 100 px of length. */
  glints?: number;
};

/** Fluffy silhouette: small bumps on the top line, scaled by local depth. */
const crestOf = (mass: SnowMass, lump: number, seed: number) =>
  mass.top.map((y, i) => {
    const depth = Math.max(0, mass.base[i] - y);
    if (depth < 0.6) return y;
    const x = mass.xs[i];
    const bump =
      noise(x / (lump * 2.6), seed) * 0.6 + noise(x / (lump * 0.9), seed + 9) * 0.3 + noise(x / (lump * 0.35), seed + 21) * 0.1;
    return y - bump * Math.min(depth * 0.2, lump * 0.4);
  });

/** The snow body: lit fill, lumps, grain, crest rim. Costly; cache the result. */
export const paintSnow = (ctx: CanvasRenderingContext2D, mass: SnowMass, options: SnowPaintOptions) => {
  const { xs, base } = mass;
  const n = xs.length;
  if (n < 2) return;
  const { dark, lump, seed = 1 } = options;
  const crest = crestOf(mass, lump, seed);

  let minTop = Infinity;
  let maxBase = -Infinity;
  let any = false;
  for (let i = 0; i < n; i += 1) {
    if (base[i] - crest[i] > 0.4) any = true;
    minTop = Math.min(minTop, crest[i]);
    maxBase = Math.max(maxBase, base[i]);
  }
  if (!any) return;

  const path = new Path2D();
  path.moveTo(xs[0], base[0]);
  for (let i = 0; i < n; i += 1) path.lineTo(xs[i], crest[i]);
  for (let i = n - 1; i >= 0; i -= 1) path.lineTo(xs[i], base[i]);
  path.closePath();

  ctx.save();
  // Body: bright crest, cool shade towards the foot.
  const body = ctx.createLinearGradient(0, minTop, 0, maxBase);
  if (dark) {
    body.addColorStop(0, "#ffffff");
    body.addColorStop(0.3, "#e9eff8");
    body.addColorStop(1, "#8e9fbb");
  } else {
    body.addColorStop(0, "#ffffff");
    body.addColorStop(0.35, "#f4f7fb");
    body.addColorStop(1, "#c9d4e5");
  }
  ctx.shadowColor = dark ? "rgba(180, 206, 255, 0.35)" : "rgba(40, 52, 80, 0.22)";
  ctx.shadowBlur = dark ? Math.min(8, lump * 1.2) : Math.min(4, lump * 0.6);
  ctx.shadowOffsetY = dark ? 0 : 1;
  ctx.fillStyle = body;
  ctx.fill(path);
  ctx.shadowColor = "transparent";

  ctx.clip(path);

  // Lumps: each a soft highlight up-left and a cold shade down-right.
  const span = xs[n - 1] - xs[0];
  const step = Math.max(1.5, lump * 0.9);
  let k = 0;
  for (let x = xs[0]; x <= xs[0] + span; x += step * (0.55 + hash(k, seed * 2) * 0.9)) {
    const t = (x - xs[0]) / (span || 1);
    const i = Math.min(n - 1, Math.round(t * (n - 1)));
    const depth = base[i] - crest[i];
    if (depth < 0.8) {
      k += 1;
      continue;
    }
    const r = Math.min(depth * 0.9, lump * (0.7 + hash(seed, k) * 0.8));
    const cx = x + (hash(k, seed) - 0.5) * step;
    const cy = crest[i] + r * (0.55 + hash(k * 3, seed) * 0.5);
    const shade = ctx.createRadialGradient(cx + r * 0.25, cy + r * 0.45, 0, cx + r * 0.25, cy + r * 0.45, r * 1.1);
    shade.addColorStop(0, dark ? "rgba(96, 116, 156, 0.32)" : "rgba(128, 148, 184, 0.22)");
    shade.addColorStop(1, "rgba(128, 148, 184, 0)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r * 1.5, cy - r * 1.5, r * 3, r * 3);
    const light = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.45, 0, cx - r * 0.3, cy - r * 0.45, r);
    light.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    light.addColorStop(0.55, "rgba(255, 255, 255, 0.35)");
    light.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = light;
    ctx.fillRect(cx - r * 1.5, cy - r * 1.5, r * 3, r * 3);
    k += 1;
  }

  // Ice grain.
  const pattern = ctx.createPattern(grainTile(dark), "repeat");
  if (pattern) {
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = pattern;
    ctx.fillRect(xs[0] - 2, minTop - 2, span + 4, maxBase - minTop + 4);
    ctx.globalAlpha = 1;
  }

  // A thin bright rim along the crest, where light grazes the surface.
  ctx.beginPath();
  for (let i = 0; i < n; i += 1) {
    if (i === 0) ctx.moveTo(xs[i], crest[i] + 0.6);
    else ctx.lineTo(xs[i], crest[i] + 0.6);
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
};

/** Crystals that catch the light for a moment. Cheap: draw every twinkle frame over a cached body. */
export const paintGlints = (ctx: CanvasRenderingContext2D, mass: SnowMass, options: GlintOptions) => {
  const { xs, base } = mass;
  const n = xs.length;
  if (n < 2) return;
  const { dark, lump, seed = 1, time, glints = 3 } = options;
  const crest = crestOf(mass, lump, seed);
  const span = xs[n - 1] - xs[0];
  const count = Math.max(1, Math.round((span / 100) * glints));
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = dark ? "rgba(255, 255, 255, 0.85)" : "rgba(170, 196, 236, 0.9)";
  ctx.lineWidth = 0.6;
  for (let g = 0; g < count; g += 1) {
    const phase = hash(g * 13, seed) * Math.PI * 2;
    const speed = 0.8 + hash(seed, g * 17) * 2.2;
    const glow = Math.max(0, Math.sin(time * speed + phase)) ** 6;
    if (glow < 0.04) continue;
    const i = Math.min(n - 1, Math.floor(hash(seed * 7 + g, 11.3) * n));
    const depth = base[i] - crest[i];
    if (depth < 1.2) continue;
    const x = xs[i];
    const y = crest[i] + depth * (0.08 + hash(g, seed * 5) * 0.45);
    ctx.globalAlpha = glow;
    ctx.beginPath();
    ctx.arc(x, y, 0.7 + glow * 0.5, 0, Math.PI * 2);
    ctx.fill();
    if (dark || glow > 0.6) {
      const arm = 1.5 + glow * Math.min(4, lump * 0.8);
      ctx.beginPath();
      ctx.moveTo(x - arm, y);
      ctx.lineTo(x + arm, y);
      ctx.moveTo(x, y - arm);
      ctx.lineTo(x, y + arm);
      ctx.stroke();
    }
  }
  ctx.restore();
};

/**
 * Offscreen layer for snow bodies. Repaint it only when the snow changed;
 * every frame just copies it and adds glints and falling bits on top.
 */
export class SnowLayer {
  readonly canvas = document.createElement("canvas");
  readonly ctx: CanvasRenderingContext2D | null = this.canvas.getContext("2d");
  private width = 0;
  private height = 0;

  resize(width: number, height: number, dpr: number) {
    this.width = width;
    this.height = height;
    this.canvas.width = Math.max(1, Math.round(width * dpr));
    this.canvas.height = Math.max(1, Math.round(height * dpr));
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  clear() {
    this.ctx?.clearRect(0, 0, this.width, this.height);
  }

  drawTo(target: CanvasRenderingContext2D) {
    target.drawImage(this.canvas, 0, 0, this.width, this.height);
  }
}

/** Smooths a share array in place so knocked-off edges slope instead of breaking. */
export const relax = (values: Float32Array, from: number, to: number, passes = 2, strength = 0.35) => {
  const lo = Math.max(1, from);
  const hi = Math.min(values.length - 2, to);
  for (let p = 0; p < passes; p += 1) {
    for (let i = lo; i <= hi; i += 1) {
      const mean = (values[i - 1] + values[i + 1]) * 0.5;
      if (mean < values[i]) values[i] += (mean - values[i]) * strength;
    }
  }
};
