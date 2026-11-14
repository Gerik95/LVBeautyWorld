"use client";

import { useEffect, type RefObject } from "react";
import { glidePoint, heroPointerAction, type HeroPointer } from "@/lib/spotlightTrack";
import { motion, resolveEffects, returnEase, spotlight } from "@/skins";

type Point = { x: number; y: number };

const angleOf = (point: Point) => Math.atan2(point.y, point.x);

export const HeroSpotlight = ({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) => {
  useEffect(() => {
    const hero = heroRef.current;
    const beam = hero?.querySelector<HTMLElement>("[data-beam]") ?? null;
    if (!hero || !beam) return;
    if (!resolveEffects().spotlight) return;
    if (document.documentElement.dataset.theme !== "dark") return;

    beam.style.setProperty("--spot-length", spotlight.length);
    beam.style.setProperty("--spot-thickness", spotlight.thickness);
    beam.style.setProperty("--spot-blur", spotlight.blur);
    beam.style.setProperty("--spot-alpha", spotlight.alpha);
    beam.style.setProperty("--spot-alpha-mid", spotlight.alphaMid);

    const home: Point = { ...spotlight.home };
    const current: Point = { ...home };
    let latest: Point | null = null;
    let lastClient: { x: number; y: number } | null = null;
    let inside = false;
    let frame = 0;
    let returnFrame = 0;
    let lastStamp = 0;
    let disposed = false;

    const button = () => hero.querySelector<HTMLElement>("[data-beam-target]");

    const paintHit = (aim: Point) => {
      const target = button();
      if (!target) return;
      const rect = hero.getBoundingClientRect();
      const originX = rect.left;
      const originY = rect.top;
      const aimX = rect.left + aim.x * rect.width;
      const aimY = rect.top + aim.y * rect.height;
      const box = target.getBoundingClientRect();
      const corners = [
        [box.left, box.top],
        [box.right, box.top],
        [box.left, box.bottom],
        [box.right, box.bottom],
      ];
      let minAngle = Infinity;
      let maxAngle = -Infinity;
      for (const [x, y] of corners) {
        const angle = Math.atan2(y - originY, x - originX);
        minAngle = Math.min(minAngle, angle);
        maxAngle = Math.max(maxAngle, angle);
      }
      const beamAngle = Math.atan2(aimY - originY, aimX - originX);
      const half = spotlight.halfAngle;
      const overlaps = beamAngle + half >= minAngle && beamAngle - half <= maxAngle;
      const pointerInside =
        aimX >= box.left && aimX <= box.right && aimY >= box.top && aimY <= box.bottom;
      let hit = 0;
      if (pointerInside) hit = 1;
      else if (overlaps) {
        const mid = (minAngle + maxAngle) / 2;
        const span = (maxAngle - minAngle) / 2 + half;
        hit = 1 - Math.min(1, Math.abs(beamAngle - mid) / (span || 1));
      }
      target.style.setProperty("--beam-hit", hit.toFixed(3));
    };

    const paint = () => {
      beam.style.transform = `rotate(${angleOf(current) * (180 / Math.PI)}deg)`;
      paintHit(current);
    };

    const stopReturn = () => {
      if (returnFrame) window.cancelAnimationFrame(returnFrame);
      returnFrame = 0;
    };

    const stopChase = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastStamp = 0;
    };

    const chase = (now: number) => {
      frame = 0;
      if (disposed || !inside || !latest) return;
      const dt = Math.min(48, lastStamp ? now - lastStamp : 16);
      lastStamp = now;
      const next = glidePoint(current, latest, dt, spotlight.glide);
      current.x = next.x;
      current.y = next.y;
      paint();
      const dx = latest.x - current.x;
      const dy = latest.y - current.y;
      if (dx * dx + dy * dy > 0.0000004) {
        frame = window.requestAnimationFrame(chase);
        return;
      }
      current.x = latest.x;
      current.y = latest.y;
      paint();
      lastStamp = 0;
    };

    const schedule = () => {
      if (frame || disposed) return;
      frame = window.requestAnimationFrame(chase);
    };

    const beginReturn = () => {
      if (disposed || !inside) return;
      inside = false;
      latest = null;
      stopReturn();
      stopChase();
      const from = { ...current };
      const started = performance.now();
      const step = (now: number) => {
        if (disposed || inside) return;
        const progress = Math.min(1, (now - started) / motion.spotlightReturnMs);
        const eased = returnEase(progress);
        current.x = from.x + (home.x - from.x) * eased;
        current.y = from.y + (home.y - from.y) * eased;
        paint();
        if (progress < 1) returnFrame = window.requestAnimationFrame(step);
        else {
          current.x = home.x;
          current.y = home.y;
          paint();
          returnFrame = 0;
        }
      };
      returnFrame = window.requestAnimationFrame(step);
    };

    const pointFromClient = (clientX: number, clientY: number) => {
      const rect = hero.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      return {
        x: (clientX - rect.left) / rect.width,
        y: (clientY - rect.top) / rect.height,
      };
    };

    const trackable =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    paint();

    const phone =
      window.matchMedia("(hover: none)").matches || window.matchMedia("(pointer: coarse)").matches;

    if (!trackable) {
      if (!phone) {
        return () => {
          disposed = true;
          button()?.style.removeProperty("--beam-hit");
        };
      }

      let scrollFrame = 0;
      let parked = false;
      const paintScroll = () => {
        scrollFrame = 0;
        if (disposed) return;
        const root = document.documentElement;
        const target = button();
        if (root.dataset.theme !== "dark" || root.dataset.lamp !== "steady") {
          parked = false;
          beam.style.removeProperty("opacity");
          target?.style.removeProperty("--beam-hit");
          return;
        }
        const rect = hero.getBoundingClientRect();
        if (rect.bottom <= 0) {
          if (parked) return;
          parked = true;
          beam.style.opacity = "0";
          target?.style.setProperty("--beam-hit", "0");
          return;
        }
        parked = false;
        const span = rect.height || 1;
        const visible = Math.min(1, Math.max(0, rect.bottom / span));
        if (visible > 0.98) beam.style.removeProperty("opacity");
        else beam.style.opacity = visible.toFixed(3);
        const hit = visible > 0.98 ? 0 : Math.sin(visible * Math.PI) * 0.72;
        target?.style.setProperty("--beam-hit", hit.toFixed(3));
      };
      const onScroll = () => {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(paintScroll);
      };
      paintScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        disposed = true;
        if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
        window.removeEventListener("scroll", onScroll);
        beam.style.removeProperty("opacity");
        button()?.style.removeProperty("--beam-hit");
      };
    }

    const handlePointer = (kind: HeroPointer) => (event: PointerEvent) => {
      const action = heroPointerAction(kind, event.pointerType, inside);
      if (action === "ignore") return;
      if (action === "return") {
        beginReturn();
        return;
      }
      inside = true;
      stopReturn();
      lastClient = { x: event.clientX, y: event.clientY };
      const point = pointFromClient(event.clientX, event.clientY);
      if (!point) return;
      latest = point;
      schedule();
    };

    const handleEnter = handlePointer("enter");
    const handleMove = handlePointer("move");
    const handleLeave = handlePointer("leave");

    const handleScroll = () => {
      if (!inside || !lastClient) return;
      const rect = hero.getBoundingClientRect();
      const outside =
        lastClient.x < rect.left ||
        lastClient.x > rect.right ||
        lastClient.y < rect.top ||
        lastClient.y > rect.bottom;
      if (outside) {
        beginReturn();
        return;
      }
      const point = pointFromClient(lastClient.x, lastClient.y);
      if (!point) return;
      latest = point;
      schedule();
    };

    hero.addEventListener("pointerenter", handleEnter);
    hero.addEventListener("pointermove", handleMove);
    hero.addEventListener("pointerleave", handleLeave);
    hero.addEventListener("pointercancel", handleLeave);
    window.addEventListener("blur", beginReturn);
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      stopReturn();
      button()?.style.removeProperty("--beam-hit");
      hero.removeEventListener("pointerenter", handleEnter);
      hero.removeEventListener("pointermove", handleMove);
      hero.removeEventListener("pointerleave", handleLeave);
      hero.removeEventListener("pointercancel", handleLeave);
      window.removeEventListener("blur", beginReturn);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [heroRef]);

  return null;
};
