"use client";

import { useEffect, useRef } from "react";
import { winterShared } from "./shared";
import { paintGlints, paintSnow, SnowLayer } from "./snowPaint";

const REDUCE = "(prefers-reduced-motion: reduce)";
const MIN_PX = 7;
const MAX_PX = 38;
const TWINKLE_MS = 120;
/** Fixed lump size: the drift rises in place instead of sliding sideways. */
const LUMP = MAX_PX * 0.3;
/** Share of the gap to the target depth closed per second. */
const GROW_RATE = 1.1;

/**
 * Snow drift on the footer ledge. It deepens as the visitor scrolls down,
 * as if the snow falling over the page piled up there.
 */
export const FooterDrift = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const root = document.documentElement;
    const reduceQuery = window.matchMedia(REDUCE);

    let width = 0;
    let height = 0;
    let depth = MIN_PX;
    let target = MIN_PX;
    let frame = 0;
    let timer = 0;
    let visible = false;
    let last = 0;
    const layer = new SnowLayer();
    let layerDepth = -1;
    let layerDark: boolean | null = null;
    let layerAt = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layer.resize(width, height, dpr);
      layerDepth = -1;
    };

    const readTarget = () => {
      const scrollable = root.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 1;
      target = MIN_PX + (MAX_PX - MIN_PX) * progress;
      if (reduceQuery.matches) depth = target;
    };

    const mass = () => {
      const xs: number[] = [];
      const top: number[] = [];
      const base: number[] = [];
      for (let x = -4; x <= width + 4; x += 3) {
        const shape =
          0.6 +
          0.18 * Math.sin(x * 0.0061 + 1) +
          0.11 * Math.sin(x * 0.0173 + 2.4) * Math.sin(x * 0.0041) +
          0.06 * Math.sin(x * 0.0437 + 0.7) +
          0.03 * Math.sin(x * 0.113);
        xs.push(x);
        top.push(height - depth * shape);
        base.push(height + 1);
      }
      return { xs, top, base };
    };

    const draw = () => {
      const dark = root.dataset.theme === "dark";
      const snow = mass();
      const now = performance.now();
      const settled = Math.abs(target - depth) <= 0.15;
      const stale = Math.abs(depth - layerDepth) > 0.3 && (settled || now - layerAt > 70);
      if (stale || layerDark !== dark) {
        layer.clear();
        if (layer.ctx) paintSnow(layer.ctx, snow, { dark, lump: LUMP, seed: 31 });
        layerDepth = depth;
        layerDark = dark;
        layerAt = now;
      }
      ctx.clearRect(0, 0, width, height);
      layer.drawTo(ctx);
      paintGlints(ctx, snow, { dark, lump: LUMP, seed: 31, time: performance.now() / 1000, glints: 1.4 });
      winterShared.driftPx = depth;
    };

    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      depth += (target - depth) * Math.min(1, dt * GROW_RATE);
      draw();
      if (Math.abs(target - depth) > 0.15) frame = window.requestAnimationFrame(tick);
      else twinkle();
    };

    const twinkle = () => {
      window.clearTimeout(timer);
      if (!visible || reduceQuery.matches || document.hidden) return;
      timer = window.setTimeout(() => {
        if (!frame) draw();
        twinkle();
      }, TWINKLE_MS);
    };

    const wake = () => {
      if (frame) return;
      if (reduceQuery.matches) {
        draw();
        return;
      }
      last = 0;
      frame = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      readTarget();
      wake();
    };

    resize();
    readTarget();
    depth = target;
    draw();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) twinkle();
    });
    intersection.observe(canvas);
    const themeObserver = new MutationObserver(draw);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      winterShared.driftPx = 0;
    };
  }, []);

  return <canvas ref={canvasRef} className="winter-footer-drift" aria-hidden="true" />;
};
