/**
 * Falling snow shared by the hero and the home page. Three depth layers:
 * far flakes are small and sharp, middle ones soft, a few near ones are big
 * out-of-focus discs that drift past quickly. Wind breathes and gusts; every
 * flake tumbles on its own two-frequency flutter.
 */

export type Flake = {
  x: number;
  y: number;
  /** Depth 0 far … 1 near. */
  z: number;
  kind: 0 | 1 | 2;
  size: number;
  alpha: number;
  vy: number;
  phase: number;
  phase2: number;
  hz: number;
  hz2: number;
  sway: number;
  /** Extra velocity (snow globe), decays to calm fall. */
  ex: number;
  ey: number;
  extra: boolean;
};

export type Sprites = [HTMLCanvasElement, HTMLCanvasElement, HTMLCanvasElement];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const sprite = (stops: [number, string][]) => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  stops.forEach(([at, color]) => grad.addColorStop(at, color));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return canvas;
};

/** Sharp, soft and bokeh sprites. On light paper a cold halo gives white flakes a body. */
export const makeSprites = (dark: boolean): Sprites =>
  dark
    ? [
        sprite([
          [0, "rgba(255,255,255,1)"],
          [0.32, "rgba(255,255,255,0.95)"],
          [0.5, "rgba(230,240,255,0.3)"],
          [1, "rgba(230,240,255,0)"],
        ]),
        sprite([
          [0, "rgba(255,255,255,0.95)"],
          [0.4, "rgba(240,246,255,0.55)"],
          [1, "rgba(240,246,255,0)"],
        ]),
        sprite([
          [0, "rgba(255,255,255,0.5)"],
          [0.62, "rgba(244,248,255,0.42)"],
          [0.8, "rgba(244,248,255,0.16)"],
          [1, "rgba(244,248,255,0)"],
        ]),
      ]
    : [
        sprite([
          [0, "rgba(255,255,255,1)"],
          [0.22, "rgba(255,255,255,1)"],
          [0.36, "rgba(200,210,228,0.9)"],
          [0.62, "rgba(140,154,184,0.22)"],
          [1, "rgba(140,154,184,0)"],
        ]),
        sprite([
          [0, "rgba(255,255,255,1)"],
          [0.3, "rgba(236,241,250,0.95)"],
          [0.6, "rgba(150,164,194,0.25)"],
          [1, "rgba(150,164,194,0)"],
        ]),
        sprite([
          [0, "rgba(255,255,255,0.75)"],
          [0.6, "rgba(232,238,248,0.6)"],
          [0.82, "rgba(150,164,194,0.18)"],
          [1, "rgba(150,164,194,0)"],
        ]),
      ];

export const spawnFlake = (width: number, height: number, anywhere: boolean): Flake => {
  const z = Math.random() ** 1.7;
  const kind: Flake["kind"] = z > 0.94 ? 2 : z > 0.55 ? 1 : 0;
  const size = kind === 2 ? rand(12, 26) : kind === 1 ? rand(4, 7.5) : rand(1.6, 3.6);
  return {
    x: rand(-0.05, 1.05) * width,
    y: anywhere ? rand(-0.05, 1) * height : rand(-60, -8),
    z,
    kind,
    size,
    alpha: kind === 2 ? rand(0.22, 0.36) : kind === 1 ? rand(0.7, 0.9) : rand(0.45, 0.85),
    vy: 16 + z * 58 + (kind === 2 ? 40 : 0) + rand(0, 8),
    phase: rand(0, Math.PI * 2),
    phase2: rand(0, Math.PI * 2),
    hz: rand(0.12, 0.35),
    hz2: rand(0.6, 1.4),
    sway: 5 + z * 18,
    ex: 0,
    ey: 0,
    extra: false,
  };
};

/** Wind in px/s at time `t` seconds: a slow breath plus occasional gusts. */
export const windAt = (t: number) => {
  const breath = 5 + 9 * Math.sin(t * 0.13) * (0.5 + 0.5 * Math.sin(t * 0.047 + 1));
  const gust = Math.max(0, Math.sin(t * 0.29) * Math.sin(t * 0.071 + 2)) ** 2 * 34;
  return breath + gust;
};

export const stepFlake = (flake: Flake, dt: number, t: number, wind: number, decay: number) => {
  flake.ex *= decay;
  flake.ey *= decay;
  const flutter =
    Math.sin(t * flake.hz * Math.PI * 2 + flake.phase) * flake.sway +
    Math.sin(t * flake.hz2 * Math.PI * 2 + flake.phase2) * flake.sway * 0.35;
  const lift = 0.86 + 0.14 * Math.sin(t * flake.hz2 * Math.PI + flake.phase);
  flake.x += (wind * (0.3 + flake.z * 0.95) + flutter + flake.ex) * dt;
  flake.y += (flake.vy * lift + flake.ey) * dt;
};

export const drawFlake = (
  ctx: CanvasRenderingContext2D,
  sprites: Sprites,
  flake: Flake,
  alpha: number,
  scale = 1,
) => {
  if (alpha < 0.015) return;
  const size = flake.size * scale * (flake.kind === 0 ? 2.4 : flake.kind === 1 ? 1.8 : 1.15);
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.drawImage(sprites[flake.kind], flake.x - size / 2, flake.y - size / 2, size, size);
};

/** Keeps a flake inside a band slightly wider than the canvas. */
export const wrapX = (flake: Flake, width: number) => {
  if (flake.x < -0.08 * width) flake.x += width * 1.16;
  else if (flake.x > 1.08 * width) flake.x -= width * 1.16;
};
