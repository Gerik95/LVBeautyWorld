"use client";

import { useEffect, useRef } from "react";
import { GLOBE_EVENT } from "../runtime";
import { capProfile, findCaps, meetTransform, parseViewBox, type Cap } from "./geometry";
import { paintGlints, paintSnow, relax, SnowLayer } from "./snowPaint";

type CapState = {
  cap: Cap;
  /** Full depth per column, in grid cells. */
  depth: number[];
  /** Current share of that depth, 0…1. */
  amount: Float32Array;
  /** Timestamp before which a column does not regrow. */
  hold: Float64Array;
  /** Lump size from the full depth, so the cap rises in place as it grows. */
  lump: number;
};

/** A falling clump breaks into powder; powder hangs in the air and fades. */
type Bit = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  max: number;
  clump: boolean;
  breakAt: number;
};

type Drift = {
  xs: number[];
  heights: number[];
  amount: Float32Array;
  hold: Float64Array;
  /** Foot of the artwork in logo px: the drift lies on it. */
  base: number;
};

const REDUCE = "(prefers-reduced-motion: reduce)";
const FIRST_SETTLE_S = 6;
const REGROW_S = 14;
const DRIFT_REGROW_S = 16;
/** Slow regrowth repaints the cached snow at most this often. */
const LAYER_MS = 90;
/** A sweep repaints at most this often: smooth enough, half the raster work. */
const LAYER_URGENT_MS = 30;
const HOLD_MS = 1500;
const TWINKLE_MS = 110;
const MAX_BITS = 420;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/** Distance from point P to segment AB. */
const segmentDistance = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const dx = bx - ax;
  const dy = by - ay;
  const len = dx * dx + dy * dy;
  const t = len ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len)) : 0;
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
};

/**
 * Snow on the upward edges of the mark, found from the artwork's own pixels
 * so it fits the real L and V. The BEAUTY WORLD lettering stays clear. A
 * pointer sweeps snow off in clumps and powder, in the direction it moved;
 * the cap slumps at the edges and settles back. On the 404 stage a drift
 * lies at the foot of the digits and melts under the pointer.
 */
export const LogoSnow = ({ host, drift = false }: { host: HTMLElement; drift?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const body = host.querySelector<SVGSVGElement>("svg.logo-body");
    const image = body?.querySelector("image");
    const viewBox = parseViewBox(body?.getAttribute("viewBox"));
    const href = image?.getAttribute("href");
    const wordsHref = host.querySelector("svg.logo-words image")?.getAttribute("href") ?? null;
    if (!canvas || !ctx || !body || !image || !viewBox || !href) return;

    const root = document.documentElement;
    const reduceQuery = window.matchMedia(REDUCE);
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const artWidth = Number(image.getAttribute("width")) || viewBox.width;
    const artHeight = Number(image.getAttribute("height")) || viewBox.height;

    let caps: CapState[] = [];
    let bits: Bit[] = [];
    let driftState: Drift | null = null;
    let cell = 2;
    let padLeft = 0;
    let padTop = 0;
    let logoW = 0;
    let logoH = 0;
    let canvasW = 0;
    let canvasH = 0;
    let settling = true;
    let started = false;
    let frame = 0;
    let twinkleTimer = 0;
    let last = 0;
    let visible = true;
    let disposed = false;
    let art: HTMLImageElement | null = null;
    let words: HTMLImageElement | null = null;
    let analyseTimer = 0;
    let startTimer = 0;
    let pointer: { x: number; y: number; t: number } | null = null;
    const layer = new SnowLayer();
    let layerDirty = true;
    let layerUrgent = true;
    let layerAt = 0;
    let driftLump = 4;
    /** Snow changed: repaint the cache now (urgent) or on the next slow slot. */
    const touch = (urgent: boolean, now = false) => {
      layerDirty = true;
      if (urgent) layerUrgent = true;
      if (now) layerAt = 0;
    };

    const sizeCanvas = () => {
      const hostRect = host.getBoundingClientRect();
      const rect = canvas.getBoundingClientRect();
      logoW = hostRect.width;
      logoH = hostRect.height;
      padLeft = hostRect.left - rect.left;
      padTop = hostRect.top - rect.top;
      canvasW = rect.width;
      canvasH = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
      canvas.width = Math.max(1, Math.round(canvasW * dpr));
      canvas.height = Math.max(1, Math.round(canvasH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layer.resize(canvasW, canvasH, dpr);
      touch(true, true);
    };

    const coverage = (img: HTMLImageElement, cols: number, rows: number) => {
      const grid = document.createElement("canvas");
      grid.width = cols;
      grid.height = rows;
      const g = grid.getContext("2d", { willReadFrequently: true });
      if (!g) return null;
      const fit = meetTransform({ width: cols, height: rows }, viewBox);
      g.drawImage(img, fit.offsetX, fit.offsetY, artWidth * fit.scale, artHeight * fit.scale);
      try {
        return g.getImageData(0, 0, cols, rows).data;
      } catch {
        return null;
      }
    };

    const analyse = () => {
      if (!art || logoW < 20 || logoH < 20) return;
      cell = Math.max(1.25, logoW / 300);
      const cols = Math.ceil(logoW / cell);
      const rows = Math.ceil(logoH / cell);
      const data = coverage(art, cols, rows);
      if (!data) return;
      const solid = new Uint8Array(cols * rows);
      for (let i = 0; i < solid.length; i += 1) solid[i] = data[i * 4 + 3] > 110 ? 1 : 0;

      // The salon name keeps clear of snow: drop its outlines and a small halo.
      const wordData = words ? coverage(words, cols, rows) : null;
      if (wordData) {
        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            if (wordData[(y * cols + x) * 4 + 3] < 24) continue;
            for (let dy = -4; dy <= 3; dy += 1) {
              for (let dx = -3; dx <= 3; dx += 1) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) solid[ny * cols + nx] = 0;
              }
            }
          }
        }
      }

      const depthCells = Math.min(16, Math.max(2.5, (logoH * 0.03) / cell));
      const previous = caps;
      caps = findCaps(solid, cols, rows, { minLength: 5 }).map((cap, index) => {
        const depth = capProfile(cap, depthCells, 2.4, index + 1);
        const amount = new Float32Array(cap.length);
        const before = previous[index];
        amount.fill(before ? Math.max(...before.amount) : reduceQuery.matches ? 1 : 0);
        const lump = Math.max(1.5, Math.max(...depth) * cell * 0.5);
        return { cap, depth, amount, hold: new Float64Array(cap.length), lump };
      });

      if (drift) {
        let lowest = 0;
        for (let i = solid.length - 1; i >= 0; i -= 1) {
          if (solid[i]) {
            lowest = Math.floor(i / cols);
            break;
          }
        }
        const fitPx = meetTransform({ width: logoW, height: logoH }, viewBox);
        const left = fitPx.offsetX + viewBox.x * fitPx.scale;
        const drawnW = viewBox.width * fitPx.scale;
        const drawnH = viewBox.height * fitPx.scale;
        const top = fitPx.offsetY + viewBox.y * fitPx.scale;
        const stepPx = Math.max(2, drawnW / 260);
        const from = left - drawnW * 0.06;
        const to = left + drawnW * 1.06;
        const xs: number[] = [];
        const heights: number[] = [];
        for (let x = from; x <= to; x += stepPx) {
          const u = (x - from) / (to - from);
          const edge = Math.min(1, Math.sin(Math.PI * u) * 1.6);
          const wave =
            0.2 + 0.05 * Math.sin(x * 0.018 + 1) + 0.03 * Math.sin(x * 0.051 + 2.1) + 0.015 * Math.sin(x * 0.13);
          xs.push(x);
          heights.push(drawnH * wave * Math.max(0, edge) ** 0.8);
        }
        const amount = new Float32Array(xs.length);
        amount.fill(driftState ? 1 : reduceQuery.matches ? 1 : 0);
        driftState = {
          xs,
          heights,
          amount,
          hold: new Float64Array(xs.length),
          base: lowest ? (lowest + 1) * cell : top + drawnH * 0.94,
        };
        driftLump = Math.max(3, logoH * 0.045);
      }
      touch(true, true);
      draw();
      wake();
    };

    const capMass = (state: CapState) => {
      const xs: number[] = [];
      const top: number[] = [];
      const base: number[] = [];
      state.cap.forEach((ledge, i) => {
        xs.push(padLeft + (ledge.x + 0.5) * cell);
        top.push(padTop + (ledge.y + 0.4 - state.depth[i] * state.amount[i]) * cell);
        base.push(padTop + (ledge.y + 0.5) * cell);
      });
      return { xs, top, base };
    };

    const driftMass = (state: Drift) => ({
      xs: state.xs.map((x) => padLeft + x),
      top: state.heights.map((h, i) => padTop + state.base - h * state.amount[i]),
      base: state.xs.map(() => padTop + state.base + 1),
    });

    const visibleCap = (state: CapState) => {
      for (let i = 0; i < state.amount.length; i += 1) if (state.depth[i] * state.amount[i] * cell >= 0.6) return true;
      return false;
    };

    const paintLayer = (dark: boolean) => {
      const target = layer.ctx;
      if (!target) return;
      layer.clear();
      caps.forEach((state, index) => {
        if (visibleCap(state)) paintSnow(target, capMass(state), { dark, lump: state.lump, seed: index + 1 });
      });
      if (driftState) paintSnow(target, driftMass(driftState), { dark, lump: driftLump, seed: 77 });
      layerDirty = false;
      layerUrgent = false;
      layerAt = performance.now();
    };

    const draw = () => {
      const dark = root.dataset.theme === "dark";
      const now = performance.now();
      if (layerDirty && now - layerAt >= (layerUrgent ? LAYER_URGENT_MS : LAYER_MS)) paintLayer(dark);
      ctx.clearRect(0, 0, canvasW, canvasH);
      layer.drawTo(ctx);

      const time = now / 1000;
      caps.forEach((state, index) => {
        if (visibleCap(state)) paintGlints(ctx, capMass(state), { dark, lump: state.lump, seed: index + 1, time, glints: 2.4 });
      });
      if (driftState) paintGlints(ctx, driftMass(driftState), { dark, lump: driftLump, seed: 77, time, glints: 3 });

      if (!bits.length) return;
      const clumpShade = dark ? "#9fb0cb" : "#c7d2e3";
      for (const bit of bits) {
        const fade = Math.min(1, (bit.life / bit.max) * 2.5);
        if (bit.clump) {
          ctx.globalAlpha = fade;
          ctx.fillStyle = clumpShade;
          ctx.beginPath();
          ctx.arc(bit.x, bit.y, bit.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(bit.x - bit.r * 0.25, bit.y - bit.r * 0.3, bit.r * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // Powder in one path: hundreds of specks, one fill per alpha band.
      ctx.fillStyle = "#ffffff";
      for (const band of [0.25, 0.5, 0.75]) {
        ctx.globalAlpha = band;
        ctx.beginPath();
        for (const bit of bits) {
          if (bit.clump) continue;
          const fade = Math.min(1, (bit.life / bit.max) * 2.5) * 0.75;
          if (fade <= band - 0.25 || fade > band) continue;
          ctx.moveTo(bit.x + bit.r, bit.y);
          ctx.arc(bit.x, bit.y, bit.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const powder = (x: number, y: number, vx: number, vy: number, count: number) => {
      for (let i = 0; i < count && bits.length < MAX_BITS; i += 1) {
        const max = rand(0.7, 1.5);
        bits.push({
          x: x + rand(-1.5, 1.5),
          y: y + rand(-1.5, 1.5),
          vx: vx * 0.25 + rand(-35, 35),
          vy: vy * 0.15 + rand(-55, 5),
          r: rand(0.4, 1.1),
          life: max,
          max,
          clump: false,
          breakAt: -1,
        });
      }
    };

    const clump = (x: number, y: number, vx: number, vy: number, size: number) => {
      if (bits.length >= MAX_BITS) return;
      const max = 2.2;
      bits.push({
        x,
        y,
        vx: vx * 0.35 + rand(-40, 40),
        vy: vy * 0.25 - rand(20, 110),
        r: Math.max(0.9, Math.min(4.2, size * rand(0.3, 0.55))),
        life: max,
        max,
        clump: true,
        breakAt: max - rand(0.25, 0.7),
      });
    };

    const tick = (now: number) => {
      frame = 0;
      if (disposed) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      let busy = false;
      const wall = performance.now();
      if (started) {
        const rate = settling ? 1 / FIRST_SETTLE_S : 1 / REGROW_S;
        for (const state of caps) {
          for (let i = 0; i < state.amount.length; i += 1) {
            if (state.amount[i] >= 1) continue;
            busy = true;
            if (wall < state.hold[i]) continue;
            state.amount[i] = Math.min(1, state.amount[i] + dt * rate);
            layerDirty = true;
          }
        }
        if (driftState) {
          const { amount, hold } = driftState;
          const driftRate = settling ? 1 / FIRST_SETTLE_S : 1 / DRIFT_REGROW_S;
          for (let i = 0; i < amount.length; i += 1) {
            if (amount[i] >= 1) continue;
            busy = true;
            if (wall < hold[i]) continue;
            amount[i] = Math.min(1, amount[i] + dt * driftRate);
            layerDirty = true;
          }
        }
        if (!busy && settling) settling = false;
      }
      if (bits.length) {
        busy = true;
        const next: Bit[] = [];
        for (const bit of bits) {
          bit.life -= dt;
          if (bit.clump) {
            bit.vx *= Math.exp(-0.6 * dt);
            bit.vy += 1300 * dt;
            if (bit.life <= bit.breakAt) {
              powder(bit.x, bit.y, bit.vx, bit.vy * 0.4, 3);
              continue;
            }
          } else {
            const air = Math.exp(-3.4 * dt);
            bit.vx *= air;
            bit.vy = bit.vy * air + 170 * dt;
          }
          bit.x += bit.vx * dt;
          bit.y += bit.vy * dt;
          if (bit.life > 0 && bit.y < canvasH + 6) next.push(bit);
        }
        bits = next;
      }
      if (!busy && layerDirty) touch(true, true);
      draw();
      if (busy) frame = window.requestAnimationFrame(tick);
      else scheduleTwinkle();
    };

    /** Between animations the glints still twinkle, at a calm frame rate. */
    const scheduleTwinkle = () => {
      window.clearTimeout(twinkleTimer);
      if (disposed || reduceQuery.matches || !visible || document.hidden) return;
      twinkleTimer = window.setTimeout(() => {
        if (frame) return;
        draw();
        scheduleTwinkle();
      }, TWINKLE_MS);
    };

    const wake = () => {
      if (frame || disposed || reduceQuery.matches) return;
      window.clearTimeout(twinkleTimer);
      last = 0;
      frame = window.requestAnimationFrame(tick);
    };

    /** A pointer stroke from A to B in canvas px with velocity (vx, vy). */
    const sweep = (ax: number, ay: number, bx: number, by: number, vx: number, vy: number) => {
      if (!started) return;
      const reach = Math.max(16, logoW * 0.045);
      const force = Math.max(0.45, Math.min(1.2, Math.hypot(vx, vy) / 700));
      const until = performance.now() + HOLD_MS;
      let hit = false;
      for (const state of caps) {
        let lo = Infinity;
        let hi = -Infinity;
        state.cap.forEach((ledge, i) => {
          const share = state.amount[i];
          if (share < 0.04) return;
          const depthPx = state.depth[i] * share * cell;
          const x = padLeft + (ledge.x + 0.5) * cell;
          const y = padTop + (ledge.y + 0.4) * cell - depthPx * 0.5;
          const d = segmentDistance(x, y, ax, ay, bx, by);
          if (d > reach) return;
          const take = Math.min(share, (1 - d / reach) ** 1.6 * force * 0.95);
          if (take <= 0.01) return;
          state.amount[i] = share - take;
          state.hold[i] = until;
          lo = Math.min(lo, i);
          hi = Math.max(hi, i);
          const lost = take * state.depth[i] * cell;
          if (Math.random() < take * 0.55) clump(x, y, vx, vy, lost + 1.5);
          powder(x, y, vx, vy, Math.round(take * 2.2));
          hit = true;
        });
        if (hi >= lo) {
          // The cap slumps into the gap instead of keeping a cliff.
          relax(state.amount, lo - 8, hi + 8, 4, 0.4);
          for (let i = Math.max(0, lo - 8); i <= Math.min(state.amount.length - 1, hi + 8); i += 1) {
            state.hold[i] = Math.max(state.hold[i], until - 400);
          }
        }
      }
      if (driftState) {
        const { xs, heights, amount, hold, base } = driftState;
        const melt = reach * 1.8;
        let lo = Infinity;
        let hi = -Infinity;
        xs.forEach((x, i) => {
          const px = x + padLeft;
          const top = padTop + base - heights[i] * amount[i];
          const d = segmentDistance(px, top, ax, ay, bx, by);
          const inside = Math.min(ax, bx) - melt < px && px < Math.max(ax, bx) + melt && Math.max(ay, by) > top - melt;
          if (!inside || d > melt * 1.4) return;
          const strength = 0.22 * (1 - Math.min(1, d / (melt * 1.4)));
          amount[i] = Math.max(0.06, amount[i] - strength);
          hold[i] = until + 800;
          lo = Math.min(lo, i);
          hi = Math.max(hi, i);
          hit = true;
        });
        if (hi >= lo) relax(amount, lo - 6, hi + 6, 3, 0.3);
      }
      if (hit) {
        touch(true);
        wake();
      }
    };

    const handlePointer = (event: PointerEvent) => {
      if (reduceQuery.matches) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const now = performance.now();
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      const prev = pointer && now - pointer.t < 90 ? pointer : null;
      pointer = inside ? { x, y, t: now } : null;
      if (!inside) return;
      const dtp = prev ? Math.max(8, now - prev.t) / 1000 : 0.016;
      const vx = prev ? (x - prev.x) / dtp : 0;
      const vy = prev ? (y - prev.y) / dtp : 0;
      if (event.type === "pointerdown") sweep(x, y - 4, x, y + 4, 0, 120);
      else sweep(prev?.x ?? x, prev?.y ?? y, x, y, vx, vy);
    };

    const handleGlobe = () => {
      if (reduceQuery.matches || !started) return;
      const until = performance.now() + HOLD_MS * 1.3;
      for (const state of caps) {
        state.cap.forEach((ledge, i) => {
          const share = state.amount[i];
          if (share > 0.2) {
            const x = padLeft + (ledge.x + 0.5) * cell;
            const y = padTop + (ledge.y - state.depth[i] * share * 0.5) * cell;
            const lift = rand(-1, 1) * 220;
            if (i % 3 === 0) clump(x, y, lift, -rand(380, 700), state.depth[i] * cell);
            if (i % 2 === 0) powder(x, y, lift, -rand(200, 400), 1);
          }
          state.amount[i] = 0;
          state.hold[i] = until + rand(0, 500);
        });
      }
      touch(true);
      wake();
    };

    const begin = () => {
      if (started || disposed) return;
      started = true;
      if (reduceQuery.matches) {
        caps.forEach((state) => state.amount.fill(1));
        driftState?.amount.fill(1);
        touch(true);
        draw();
      } else wake();
    };

    const watchLamp = () => {
      if (root.dataset.lamp !== "arm") begin();
    };

    const scheduleAnalyse = () => {
      window.clearTimeout(analyseTimer);
      analyseTimer = window.setTimeout(() => {
        sizeCanvas();
        analyse();
      }, 120);
    };

    const handleReduce = () => {
      if (!reduceQuery.matches) {
        scheduleTwinkle();
        return;
      }
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      window.clearTimeout(twinkleTimer);
      bits = [];
      caps.forEach((state) => state.amount.fill(1));
      driftState?.amount.fill(1);
      touch(true);
      draw();
    };

    Promise.all([loadImage(href), wordsHref ? loadImage(wordsHref).catch(() => null) : Promise.resolve(null)])
      .then(([bodyArt, wordmark]) => {
        if (disposed) return;
        art = bodyArt;
        words = wordmark;
        sizeCanvas();
        analyse();
      })
      .catch(() => {
        /* no artwork, no snow */
      });

    const resizeObserver = new ResizeObserver(scheduleAnalyse);
    resizeObserver.observe(host);
    const lampObserver = new MutationObserver(() => {
      watchLamp();
      touch(true, true);
      draw();
    });
    lampObserver.observe(root, { attributes: true, attributeFilter: ["data-lamp", "data-theme"] });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) scheduleTwinkle();
    });
    intersection.observe(host);
    watchLamp();
    startTimer = window.setTimeout(begin, 4200);

    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerdown", handlePointer, { passive: true });
    window.addEventListener(GLOBE_EVENT, handleGlobe);
    reduceQuery.addEventListener("change", handleReduce);

    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(twinkleTimer);
      window.clearTimeout(analyseTimer);
      window.clearTimeout(startTimer);
      resizeObserver.disconnect();
      lampObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener(GLOBE_EVENT, handleGlobe);
      reduceQuery.removeEventListener("change", handleReduce);
    };
  }, [host, drift]);

  return <canvas ref={canvasRef} className="winter-logo-snow" aria-hidden="true" />;
};
