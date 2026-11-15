/**
 * Window frost, generated once per visit. Feathery ice ferns grow inward from
 * the edges and corners, branching at about 60° like real dendrites; a fine
 * rime coats the glass, thickest at the rim; a few six-armed crystals and
 * glints sit in between. White on transparent, used as a CSS image.
 */

const rand = (min: number, max: number) => min + Math.random() * (max - min);

type Paths = { stem: Path2D; branch: Path2D; needle: Path2D };

const line = (path: Path2D, x1: number, y1: number, x2: number, y2: number) => {
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
};

/** One fern: a wandering stem with alternating side branches and needles on them. */
const fern = (paths: Paths, x: number, y: number, angle: number, length: number) => {
  const segments = Math.max(6, Math.round(length / 6));
  const step = length / segments;
  let a = angle;
  let px = x;
  let py = y;
  const bend = rand(-0.035, 0.035);
  for (let s = 0; s < segments; s += 1) {
    a += bend + rand(-0.12, 0.12);
    const nx = px + Math.cos(a) * step;
    const ny = py + Math.sin(a) * step;
    line(paths.stem, px, py, nx, ny);
    if (s > 0 && s % 2 === 0) {
      const t = s / segments;
      const sideLength = length * 0.36 * (1 - t) * rand(0.7, 1.1);
      for (const side of [-1, 1]) {
        if (Math.random() < 0.15) continue;
        const ba = a + side * (Math.PI / 3 + rand(-0.22, 0.18));
        const bsegments = Math.max(3, Math.round(sideLength / 5));
        const bstep = sideLength / bsegments;
        let bx = nx;
        let by = ny;
        let bAngle = ba;
        for (let b = 0; b < bsegments; b += 1) {
          bAngle += rand(-0.06, 0.06);
          const ex = bx + Math.cos(bAngle) * bstep;
          const ey = by + Math.sin(bAngle) * bstep;
          line(paths.branch, bx, by, ex, ey);
          if (b % 2 === 1) {
            const needle = bstep * (1.6 - b / bsegments) * rand(0.6, 1);
            for (const n of [-1, 1]) {
              const na = bAngle + n * (Math.PI / 3);
              line(paths.needle, ex, ey, ex + Math.cos(na) * needle, ey + Math.sin(na) * needle);
            }
          }
          bx = ex;
          by = ey;
        }
      }
    }
    px = nx;
    py = ny;
  }
};

const star = (paths: Paths, x: number, y: number, r: number) => {
  const turn = rand(0, Math.PI / 3);
  for (let k = 0; k < 6; k += 1) {
    const a = turn + (k * Math.PI) / 3;
    const ex = x + Math.cos(a) * r;
    const ey = y + Math.sin(a) * r;
    line(paths.branch, x, y, ex, ey);
    const mx = x + Math.cos(a) * r * 0.55;
    const my = y + Math.sin(a) * r * 0.55;
    for (const n of [-1, 1]) {
      const na = a + n * (Math.PI / 3);
      line(paths.needle, mx, my, mx + Math.cos(na) * r * 0.3, my + Math.sin(na) * r * 0.3);
    }
  }
};

/** Closeness to the nearest edge, 1 at the rim … 0 at the centre. */
const rim = (x: number, y: number, size: number) => {
  const d = Math.min(x, y, size - x, size - y);
  return 1 - Math.min(1, d / (size * 0.4));
};

export const makeFrostTexture = (size = 720) => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Rime haze: thick at the rim, thin in the middle, with patches.
  const haze = ctx.createRadialGradient(size / 2, size / 2, size * 0.12, size / 2, size / 2, size * 0.74);
  haze.addColorStop(0, "rgba(255,255,255,0.05)");
  haze.addColorStop(0.6, "rgba(255,255,255,0.22)");
  haze.addColorStop(1, "rgba(255,255,255,0.58)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 46; i += 1) {
    const x = rand(0, size);
    const y = rand(0, size);
    const r = rand(size * 0.05, size * 0.16);
    const blob = ctx.createRadialGradient(x, y, 0, x, y, r);
    blob.addColorStop(0, `rgba(255,255,255,${0.04 + rim(x, y, size) * 0.12})`);
    blob.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = blob;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Fine rime grain.
  for (let i = 0; i < 9000; i += 1) {
    const x = rand(0, size);
    const y = rand(0, size);
    const edge = rim(x, y, size);
    if (Math.random() > 0.2 + edge * 0.8) continue;
    ctx.fillStyle = `rgba(255,255,255,${rand(0.12, 0.5) * (0.4 + edge * 0.6)})`;
    ctx.fillRect(x, y, rand(0.6, 1.4), rand(0.6, 1.4));
  }

  // Ferns from the four edges, extra ones in the corners.
  const paths: Paths = { stem: new Path2D(), branch: new Path2D(), needle: new Path2D() };

  // Rime crust: a dense band of tiny dendrites hugging every edge.
  for (let edge = 0; edge < 4; edge += 1) {
    for (let i = 0; i < 150; i += 1) {
      const along = rand(0, size);
      const inset = rand(0, size * 0.05) ** 1.2;
      const [x, y, inward] =
        edge === 0
          ? [along, inset, Math.PI / 2]
          : edge === 1
            ? [size - inset, along, Math.PI]
            : edge === 2
              ? [along, size - inset, -Math.PI / 2]
              : [inset, along, 0];
      fern(paths, x, y, inward + rand(-1.3, 1.3), size * rand(0.015, 0.06));
    }
  }

  const perEdge = 10;
  for (let edge = 0; edge < 4; edge += 1) {
    for (let i = 0; i < perEdge; i += 1) {
      const t = (i + rand(0.1, 0.9)) / perEdge;
      const along = t * size;
      const inset = rand(-4, 10);
      const [x, y, inward] =
        edge === 0
          ? [along, inset, Math.PI / 2]
          : edge === 1
            ? [size - inset, along, Math.PI]
            : edge === 2
              ? [along, size - inset, -Math.PI / 2]
              : [inset, along, 0];
      fern(paths, x, y, inward + rand(-0.85, 0.85), size * rand(0.07, 0.22));
    }
  }
  for (const [cx, cy, a] of [
    [0, 0, Math.PI / 4],
    [size, 0, (3 * Math.PI) / 4],
    [size, size, (-3 * Math.PI) / 4],
    [0, size, -Math.PI / 4],
  ] as const) {
    for (let k = 0; k < 6; k += 1) fern(paths, cx, cy, a + rand(-0.7, 0.7), size * rand(0.12, 0.32));
  }
  for (let i = 0; i < 18; i += 1) {
    const x = rand(0.08, 0.92) * size;
    const y = rand(0.08, 0.92) * size;
    if (Math.random() > 0.2 + rim(x, y, size) * 0.8) continue;
    star(paths, x, y, rand(2, 4.5));
  }

  ctx.lineCap = "round";
  // Ice scatters light: a blurred bloom under the crisp crystals.
  const canBlur = "filter" in ctx;
  if (canBlur) ctx.filter = "blur(2px)";
  ctx.strokeStyle = canBlur ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)";
  ctx.lineWidth = canBlur ? 2 : 3.4;
  ctx.stroke(paths.stem);
  ctx.stroke(paths.branch);
  ctx.lineWidth = canBlur ? 1.2 : 2;
  ctx.stroke(paths.needle);
  if (canBlur) ctx.filter = "none";
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1.05;
  ctx.stroke(paths.stem);
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 0.75;
  ctx.stroke(paths.branch);
  ctx.strokeStyle = "rgba(255,255,255,0.42)";
  ctx.lineWidth = 0.55;
  ctx.stroke(paths.needle);

  // Glints.
  for (let i = 0; i < 140; i += 1) {
    const x = rand(0, size);
    const y = rand(0, size);
    if (Math.random() > 0.25 + rim(x, y, size) * 0.75) continue;
    ctx.fillStyle = `rgba(255,255,255,${rand(0.6, 1)})`;
    ctx.beginPath();
    ctx.arc(x, y, rand(0.6, 1.3), 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
};

const CACHE_KEY = "lvbw-frost-texture";

const blobUrl = (canvas: HTMLCanvasElement) =>
  new Promise<string | null>((resolve) => {
    if (!canvas.toBlob) {
      resolve(null);
      return;
    }
    canvas.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : null), "image/png");
  });

/**
 * URL of the frost texture. Generated once per tab session and kept in
 * sessionStorage, so full page loads (the 404 is one) skip the generation.
 */
export const frostTextureUrl = async (): Promise<string | null> => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      // A short blob: URL in CSS, not a long data: URL inherited by every element.
      const blob = await (await fetch(cached)).blob();
      return URL.createObjectURL(blob);
    }
  } catch {
    /* storage off or unreadable: generate */
  }
  const canvas = makeFrostTexture(600);
  try {
    sessionStorage.setItem(CACHE_KEY, canvas.toDataURL("image/png"));
  } catch {
    /* over quota: just use it for this page */
  }
  return blobUrl(canvas);
};
