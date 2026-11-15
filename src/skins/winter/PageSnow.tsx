"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { winterShared } from "./shared";
import { drawFlake, makeSprites, spawnFlake, stepFlake, windAt, wrapX, type Flake } from "./snowfall";

type PageFlake = Flake & { fade: number };

const REDUCE = "(prefers-reduced-motion: reduce)";
const COARSE = "(hover: none), (pointer: coarse)";
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Snow over the whole home page, behind the content: it keeps falling past
 * the hero and lands on the footer drift. Flakes live in page space, so they
 * move with the page when it scrolls. Off under reduced motion.
 */
const PageSnowCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const root = document.documentElement;
    const reduceQuery = window.matchMedia(REDUCE);
    const coarse = window.matchMedia(COARSE).matches;

    let width = 0;
    let height = 0;
    let dark = root.dataset.theme === "dark";
    let sprites = makeSprites(dark);
    const flakes: PageFlake[] = [];
    let frame = 0;
    let last = 0;
    let lastScroll = window.scrollY;
    let disposed = false;
    // Document positions, measured on resize and now and then, never per frame.
    let heroBottomDoc = 0;
    let footerTopDoc = Infinity;
    let measureAt = 0;
    const measure = () => {
      const scroll = window.scrollY;
      const hero = document.querySelector(".hero");
      const footer = document.querySelector(".site-footer");
      heroBottomDoc = hero ? hero.getBoundingClientRect().bottom + scroll : 0;
      footerTopDoc = footer ? footer.getBoundingClientRect().top + scroll : Infinity;
      measureAt = performance.now();
    };

    const spawn = (anywhere: boolean): PageFlake => ({ ...spawnFlake(width, height, anywhere), fade: anywhere ? 0 : 1 });

    const count = () => {
      const area = width * height;
      return Math.round(Math.min(dark ? 140 : 100, Math.max(30, area / (dark ? 14000 : 20000))) * (coarse ? 0.6 : 1));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = count();
      while (flakes.length < target) flakes.push(spawn(true));
      flakes.length = target;
      measure();
    };

    const step = (now: number) => {
      frame = 0;
      if (disposed) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const t = now / 1000;
      const scroll = window.scrollY;
      const scrolled = scroll - lastScroll;
      lastScroll = scroll;

      if (now - measureAt > 1500) measure();
      const heroBottom = heroBottomDoc - scroll;
      const floor = footerTopDoc - scroll - winterShared.driftPx * 0.55;
      const bottom = Math.min(height + 30, floor);

      const wind = windAt(t);
      ctx.clearRect(0, 0, width, height);
      for (const flake of flakes) {
        stepFlake(flake, dt, t, wind, 1);
        // Page space: the page carries the flakes when it scrolls.
        flake.y -= scrolled * (0.55 + 0.45 * flake.z);
        if (flake.fade < 1) flake.fade = Math.min(1, flake.fade + dt * 1.5);
        if (flake.y > bottom) Object.assign(flake, spawn(false));
        else if (flake.y < -90) Object.assign(flake, spawn(true), { y: rand(height * 0.3, Math.max(height * 0.35, Math.min(height, floor) - 10)) });
        wrapX(flake, width);
        if (flake.y < heroBottom) continue;
        const nearFloor = floor - flake.y < 14 ? Math.max(0, (floor - flake.y) / 14) : 1;
        drawFlake(ctx, sprites, flake, flake.alpha * (dark ? 0.75 : 0.9) * flake.fade * nearFloor);
      }
      ctx.globalAlpha = 1;
      frame = window.requestAnimationFrame(step);
    };

    const start = () => {
      if (frame || disposed || reduceQuery.matches || document.hidden) return;
      last = 0;
      lastScroll = window.scrollY;
      frame = window.requestAnimationFrame(step);
    };
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    start();

    const onTheme = () => {
      const next = root.dataset.theme === "dark";
      if (next === dark) return;
      dark = next;
      sprites = makeSprites(dark);
      resize();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onReduce = () => {
      if (reduceQuery.matches) {
        stop();
        ctx.clearRect(0, 0, width, height);
      } else start();
    };
    const themeObserver = new MutationObserver(onTheme);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    reduceQuery.addEventListener("change", onReduce);

    return () => {
      disposed = true;
      stop();
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceQuery.removeEventListener("change", onReduce);
    };
  }, []);

  return <canvas ref={canvasRef} className="winter-page-snow" aria-hidden="true" />;
};

export const PageSnow = () => createPortal(<PageSnowCanvas />, document.body);
