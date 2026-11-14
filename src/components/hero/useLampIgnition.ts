"use client";

import { useEffect, type RefObject } from "react";
import { lampGate } from "@/lib/lampGate";
import {
  logoIgnitionProfile,
  logoLightGain,
  motion,
  resolveEffects,
  sampleIgnition,
  spotlightIgnitionProfile,
} from "@/skins";
import {
  abortUnpaintedLamp,
  beginLamp,
  lampElapsed,
  lampHasPainted,
  lampState,
  markLampPainted,
  resetLampSession,
} from "./lampSession";

const paint = (hero: HTMLElement, elapsed: number, dark: boolean) => {
  const logo = hero.querySelector<HTMLElement>("[data-logo]");
  const edge = hero.querySelector<HTMLElement>(".logo-glow.is-edge");
  const halo = hero.querySelector<HTMLElement>(".logo-glow.is-halo");
  const beam = hero.querySelector<HTMLElement>("[data-beam]");
  const level = sampleIgnition(logoIgnitionProfile, elapsed) * (dark ? 1 : logoLightGain);
  const haloLevel = Math.min(0.55, level * 0.55);
  if (logo) {
    logo.style.setProperty("--logo-edge", level.toFixed(3));
    logo.style.setProperty("--logo-halo", haloLevel.toFixed(3));
  }
  if (edge) edge.style.opacity = level.toFixed(3);
  if (halo) halo.style.opacity = haloLevel.toFixed(3);
  if (!beam) return;
  if (!dark) {
    beam.style.removeProperty("--spot-level");
    beam.style.removeProperty("opacity");
    return;
  }
  const spot = sampleIgnition(spotlightIgnitionProfile, elapsed);
  beam.style.setProperty("--spot-level", spot.toFixed(3));
  beam.style.opacity = spot.toFixed(3);
};

const clearPaint = (hero: HTMLElement | null) => {
  if (!hero) return;
  hero.querySelector<HTMLElement>("[data-logo]")?.style.removeProperty("--logo-edge");
  hero.querySelector<HTMLElement>("[data-logo]")?.style.removeProperty("--logo-halo");
  hero.querySelector<HTMLElement>(".logo-glow.is-edge")?.style.removeProperty("opacity");
  hero.querySelector<HTMLElement>(".logo-glow.is-halo")?.style.removeProperty("opacity");
  const beam = hero.querySelector<HTMLElement>("[data-beam]");
  beam?.style.removeProperty("--spot-level");
  beam?.style.removeProperty("opacity");
};

const heroVisible = (hero: HTMLElement) => {
  const rect = hero.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
};

/** The contour is a shadow of the artwork. Wait until that image can actually paint. */
const logoArtworkReady = (hero: HTMLElement) =>
  new Promise<void>((resolve) => {
    const image = hero.querySelector(".logo-body image");
    if (!image) {
      resolve();
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
    const href = image.getAttribute("href") || image.getAttribute("xlink:href");
    if (!href) {
      finish();
      return;
    }
    const probe = new Image();
    probe.onload = finish;
    probe.onerror = finish;
    probe.src = href;
    if (probe.complete && probe.naturalWidth > 0) finish();
  });

const nextFrame = () => new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));

/** One clock per visit to the home hero. Leaving and coming back starts again. */
export const useLampIgnition = (heroRef: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    resetLampSession();
    const root = document.documentElement;
    const effects = resolveEffects();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let looping = false;
    let starting = false;
    let alive = true;

    const darkTheme = () => root.dataset.theme === "dark";
    const lampAllowed = () => (darkTheme() ? effects.lampIgnition || effects.spotlight : effects.lampIgnition);

    const settle = () => {
      root.dataset.lamp = "steady";
      clearPaint(heroRef.current);
    };

    const tick = () => {
      if (!alive) return;
      frame = 0;
      const hero = heroRef.current;
      const elapsed = lampElapsed();
      if (hero && lampAllowed()) {
        paint(hero, elapsed, darkTheme());
        markLampPainted();
      } else clearPaint(hero);
      if (elapsed >= motion.lampMs) {
        looping = false;
        settle();
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const play = () => {
      if (!alive || looping || starting) return;
      const gate = lampGate({
        lamp: effects.lampIgnition,
        spotlight: effects.spotlight,
        reduced: reduce,
        phase: lampState(),
        themeDark: darkTheme(),
      });
      if (gate === "steady") {
        settle();
        return;
      }
      if (gate === "wait") {
        clearPaint(heroRef.current);
        if (root.dataset.lamp === "ignite") root.dataset.lamp = "arm";
        return;
      }
      const hero = heroRef.current;
      if (!hero || !heroVisible(hero)) return;
      starting = true;
      void logoArtworkReady(hero).then(async () => {
        starting = false;
        if (!alive || looping) return;
        if (lampState() === "done") {
          settle();
          return;
        }
        const current = heroRef.current;
        if (!current || !lampAllowed() || !heroVisible(current)) return;
        await nextFrame();
        await nextFrame();
        if (!alive || looping) return;
        const visible = heroRef.current;
        if (!visible || !lampAllowed() || !heroVisible(visible)) return;
        try {
          beginLamp();
          root.dataset.lamp = "ignite";
          looping = true;
          frame = window.requestAnimationFrame(tick);
        } catch {
          settle();
        }
      });
    };

    play();

    const hero = heroRef.current;
    const visibility = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) play();
    });
    if (hero) visibility.observe(hero);

    const themeObserver = new MutationObserver(() => {
      if (!alive) return;
      if (lampState() === "done") {
        settle();
        return;
      }
      looping = false;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      play();
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      alive = false;
      if (frame) window.cancelAnimationFrame(frame);
      visibility.disconnect();
      themeObserver.disconnect();
      if (!lampHasPainted()) {
        abortUnpaintedLamp();
        if (root.dataset.lamp === "ignite") root.dataset.lamp = "arm";
      }
    };
  }, [heroRef]);
};
