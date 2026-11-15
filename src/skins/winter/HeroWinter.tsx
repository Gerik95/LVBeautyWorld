"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { spotlight } from "../motion";
import { GLOBE_EVENT, takePendingGlobe } from "../runtime";
import { Fireworks } from "./fireworks";
import { beamWeight, parseRotate, silvesterPhase, type SilvesterPhase } from "./geometry";
import { LogoSnow } from "./LogoSnow";
import { drawFlake, makeSprites, spawnFlake, stepFlake, windAt, wrapX, type Flake } from "./snowfall";

const REDUCE = "(prefers-reduced-motion: reduce)";
const COARSE = "(hover: none), (pointer: coarse)";

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** `?silvester` previews the show, `?silvester=finale` the midnight finale. */
const previewPhase = (): SilvesterPhase | null => {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("silvester")) return null;
  return params.get("silvester") === "finale" ? "finale" : "show";
};

export default function HeroWinter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireRef = useRef<HTMLCanvasElement>(null);
  const [logoHost, setLogoHost] = useState<HTMLElement | null>(null);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fireCanvas = fireRef.current;
    const hero = canvas?.closest<HTMLElement>(".hero");
    if (!canvas || !fireCanvas || !hero) return;
    setLogoHost(hero.querySelector<HTMLElement>("[data-logo]"));
    setLost(hero.classList.contains("lost-hero"));

    const ctx = canvas.getContext("2d");
    const fireCtx = fireCanvas.getContext("2d");
    if (!ctx || !fireCtx) return;

    const root = document.documentElement;
    const reduceQuery = window.matchMedia(REDUCE);
    const coarse = window.matchMedia(COARSE).matches;
    const preview = previewPhase();

    let width = 0;
    let height = 0;
    let dark = root.dataset.theme === "dark";
    let sprites = makeSprites(dark);
    let flakes: Flake[] = [];
    let frame = 0;
    let last = 0;
    let visible = true;
    let beamLevel = 0;
    let beamCheck = 0;
    let phase: SilvesterPhase = preview ?? silvesterPhase(new Date());
    let phaseCheck = 0;
    let nextLaunch = 400;
    let avoidCheck = 0;
    let disposed = false;
    const fireworks = new Fireworks(fireCtx, dark, coarse ? 1100 : 2000);

    const beam = () => hero.querySelector<HTMLElement>("[data-beam]");

    const targetCount = () => {
      const area = width * height;
      const base = dark ? area / 6500 : area / 12000;
      return Math.round(Math.min(dark ? 240 : 130, Math.max(40, base)) * (coarse ? 0.6 : 1));
    };

    const fill = () => {
      const count = targetCount();
      const base = flakes.filter((flake) => !flake.extra);
      while (base.length < count) base.push(spawnFlake(width, height, true));
      base.length = Math.min(base.length, count);
      flakes = [...base, ...flakes.filter((flake) => flake.extra)];
    };

    const sizeCanvas = (node: HTMLCanvasElement, context: CanvasRenderingContext2D, cap: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, cap);
      node.width = Math.round(width * dpr);
      node.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      sizeCanvas(canvas, ctx, coarse ? 1.25 : 1.5);
      sizeCanvas(fireCanvas, fireCtx, coarse ? 1 : 1.5);
      fireworks.setSize(width, height);
      fill();
    };

    const readBeam = () => {
      const node = beam();
      if (!dark || !node) {
        beamLevel = 0;
        return;
      }
      const style = getComputedStyle(node);
      beamLevel = style.display === "none" ? 0 : Number(style.opacity) || 0;
    };

    const readAvoid = () => {
      const copy = hero.querySelector<HTMLElement>(".hero-copy");
      if (!copy) {
        fireworks.setAvoid(null);
        return;
      }
      const base = canvas.getBoundingClientRect();
      const rect = copy.getBoundingClientRect();
      const pad = 18;
      fireworks.setAvoid({
        left: rect.left - base.left - pad,
        top: rect.top - base.top - pad,
        right: rect.right - base.left + pad,
        bottom: rect.bottom - base.top + pad,
      });
    };

    const logoBox = () => {
      const logo = hero.querySelector<HTMLElement>("[data-logo]");
      const heroRect = canvas.getBoundingClientRect();
      if (!logo) return { x: width * 0.5, y: height * 0.35, w: width * 0.3, h: height * 0.3 };
      const rect = logo.getBoundingClientRect();
      return { x: rect.left - heroRect.left, y: rect.top - heroRect.top, w: rect.width, h: rect.height };
    };

    const drawSnow = () => {
      ctx.clearRect(0, 0, width, height);
      const angle = parseRotate(beam()?.style.transform, spotlight.homeAngle);
      const lit = dark && beamLevel > 0.01;
      for (const flake of flakes) {
        let alpha = flake.alpha;
        let scale = 1;
        if (lit) {
          const weight = beamWeight(flake.x, flake.y, width, height, angle) * beamLevel;
          // Outside the beam only a ghost of the snow is left; inside it sparkles.
          alpha = flake.alpha * (0.14 + 0.1 * flake.z) + weight * (flake.kind === 2 ? 0.5 : 1);
          scale = 1 + weight * 0.35;
        } else if (dark) {
          alpha = flake.alpha * 0.6;
        }
        drawFlake(ctx, sprites, flake, alpha, scale);
      }
      ctx.globalAlpha = 1;
    };

    const step = (now: number) => {
      frame = 0;
      if (disposed || !visible) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const t = now / 1000;

      beamCheck -= 1;
      if (beamCheck <= 0) {
        readBeam();
        beamCheck = 10;
      }

      const wind = windAt(t);
      const decay = Math.exp(-dt * 1.5);
      const kept: Flake[] = [];
      for (const flake of flakes) {
        stepFlake(flake, dt, t, wind, decay);
        if (flake.y > height + 30) {
          if (flake.extra) continue;
          Object.assign(flake, spawnFlake(width, height, false));
        }
        wrapX(flake, width);
        kept.push(flake);
      }
      flakes = kept;
      drawSnow();

      phaseCheck -= dt;
      if (phaseCheck <= 0) {
        phase = preview ?? silvesterPhase(new Date());
        phaseCheck = 2;
      }
      if (phase !== "off") {
        avoidCheck -= dt;
        if (avoidCheck <= 0) {
          readAvoid();
          avoidCheck = 1;
        }
        nextLaunch -= dt * 1000;
        if (nextLaunch <= 0) {
          const salvo = phase === "finale" ? Math.round(rand(2, 4)) : Math.random() < 0.3 ? 2 : 1;
          for (let i = 0; i < salvo; i += 1) fireworks.launch();
          nextLaunch = phase === "finale" ? rand(380, 820) : rand(900, 1900);
        }
      }
      if (phase !== "off" || fireworks.busy) {
        fireworks.update(dt);
        fireworks.draw(dt);
      }

      frame = window.requestAnimationFrame(step);
    };

    const start = () => {
      if (frame || disposed || reduceQuery.matches || !visible || document.hidden) return;
      last = 0;
      frame = window.requestAnimationFrame(step);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const still = () => {
      readBeam();
      drawSnow();
    };

    const shakeGlobe = () => {
      if (reduceQuery.matches) return;
      const slot = hero.querySelector<HTMLElement>(".logo-slot");
      if (slot) {
        slot.classList.remove("winter-globe");
        void slot.offsetWidth;
        slot.classList.add("winter-globe");
      }
      for (const flake of flakes) {
        flake.ex += rand(-1, 1) * 280 * (0.5 + flake.z);
        flake.ey -= rand(160, 440) * (0.5 + flake.z);
      }
      const box = logoBox();
      for (let i = 0; i < 110; i += 1) {
        const flake = spawnFlake(width, height, false);
        flake.extra = true;
        flake.x = box.x + rand(0, 1) * box.w;
        flake.y = box.y + box.h * rand(0.5, 1.1);
        flake.ex = rand(-1, 1) * 240;
        flake.ey = -rand(260, 560);
        flakes.push(flake);
      }
      start();
    };

    resize();
    readBeam();
    if (reduceQuery.matches) still();
    else start();
    if (takePendingGlobe()) window.setTimeout(shakeGlobe, 120);

    const handleTheme = () => {
      const next = root.dataset.theme === "dark";
      if (next === dark) return;
      dark = next;
      sprites = makeSprites(dark);
      fireworks.setDark(dark);
      fireworks.clear();
      fill();
      readBeam();
      if (reduceQuery.matches) still();
    };

    const handleReduce = () => {
      if (reduceQuery.matches) {
        stop();
        fireworks.clear();
        flakes = flakes.filter((flake) => !flake.extra);
        still();
      } else start();
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceQuery.matches) still();
    });
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) start();
      else stop();
    });
    intersection.observe(hero);

    const themeObserver = new MutationObserver(handleTheme);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    window.addEventListener(GLOBE_EVENT, shakeGlobe);
    document.addEventListener("visibilitychange", handleVisibility);
    reduceQuery.addEventListener("change", handleReduce);

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      window.removeEventListener(GLOBE_EVENT, shakeGlobe);
      document.removeEventListener("visibilitychange", handleVisibility);
      reduceQuery.removeEventListener("change", handleReduce);
      hero.querySelector(".logo-slot")?.classList.remove("winter-globe");
    };
  }, []);

  return (
    <>
      <canvas ref={fireRef} className="winter-fireworks" />
      <canvas ref={canvasRef} className="winter-snow" />
      {logoHost ? createPortal(<LogoSnow host={logoHost} drift={lost} />, logoHost) : null}
    </>
  );
}
