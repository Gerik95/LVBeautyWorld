"use client";

import { useEffect, useState } from "react";
import { t } from "@/content/messages";
import type { Locale } from "@/lib/site";
import { readOptInSkin, requestGlobe, setOptInSkin } from "@/skins";

const TAPS = 3;
const TAP_WINDOW_MS = 900;
const SHAKE_ACCEL = 14;
const SHAKE_DELTA = 16;
const SHAKE_HITS = 3;
const SHAKE_SPACING_MS = 90;
const SHAKE_WINDOW_MS = 1000;
const SHAKE_COOLDOWN_MS = 2200;
const TOAST_MS = 4200;
const MOTION_EVENT = "lvbw:motion";

type MotionPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

const motionApi = () =>
  typeof DeviceMotionEvent === "undefined" ? null : (DeviceMotionEvent as unknown as MotionPermission);

/**
 * iOS gives motion data only after the visitor allows it, and only from a
 * tap. Call this inside a click handler. Elsewhere it resolves at once.
 * Every browser sends motion only on HTTPS (or localhost).
 */
export const askMotionPermission = () => {
  const api = motionApi();
  if (!api?.requestPermission) return;
  api
    .requestPermission()
    .then((answer) => {
      if (answer === "granted") window.dispatchEvent(new CustomEvent(MOTION_EVENT));
    })
    .catch(() => {
      /* dismissed */
    });
};

const insideLogo = (x: number, y: number) =>
  [...document.querySelectorAll<HTMLElement>("[data-logo]")].some((logo) => {
    const rect = logo.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  });

/**
 * Easter egg of the winter skin. Three quick taps on the brand mark, or a
 * shake of the phone, switch winter on and shake the snow globe. When winter
 * is already on the same gesture only shakes the globe; switching off is in
 * the settings. On iOS the third tap also asks for motion access, so the
 * phone can be shaken afterwards.
 */
export const SkinEgg = ({ locale }: { locale: Locale }) => {
  const [toast, setToast] = useState(false);

  useEffect(() => {
    let taps: number[] = [];
    let clicks: number[] = [];
    let hits: number[] = [];
    let lastShake = 0;
    let previous: { x: number; y: number; z: number } | null = null;
    let toastTimer = 0;
    let listening = false;

    const trigger = () => {
      if (readOptInSkin() !== "winter") {
        setOptInSkin("winter");
        setToast(true);
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => setToast(false), TOAST_MS);
      }
      window.setTimeout(requestGlobe, 60);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (!insideLogo(event.clientX, event.clientY)) {
        taps = [];
        return;
      }
      const now = performance.now();
      taps = taps.filter((stamp) => now - stamp < TAP_WINDOW_MS);
      taps.push(now);
      if (taps.length >= TAPS) {
        taps = [];
        trigger();
      }
    };

    // The permission prompt needs a click, not a pointerdown.
    const onClick = (event: MouseEvent) => {
      if (!motionApi()?.requestPermission || !insideLogo(event.clientX, event.clientY)) return;
      const now = performance.now();
      clicks = clicks.filter((stamp) => now - stamp < TAP_WINDOW_MS);
      clicks.push(now);
      if (clicks.length >= TAPS) {
        clicks = [];
        askMotionPermission();
      }
    };

    const onMotion = (event: DeviceMotionEvent) => {
      const now = performance.now();
      let strong = false;
      const a = event.acceleration;
      if (a && a.x !== null && a.y !== null && a.z !== null) {
        strong = Math.hypot(a.x, a.y, a.z) > SHAKE_ACCEL;
      } else {
        const g = event.accelerationIncludingGravity;
        if (!g || g.x === null || g.y === null || g.z === null) return;
        const current = { x: g.x, y: g.y, z: g.z };
        if (previous) {
          strong =
            Math.abs(current.x - previous.x) + Math.abs(current.y - previous.y) + Math.abs(current.z - previous.z) >
            SHAKE_DELTA;
        }
        previous = current;
      }
      if (!strong || now - lastShake < SHAKE_COOLDOWN_MS) return;
      if (hits.length && now - hits[hits.length - 1] < SHAKE_SPACING_MS) return;
      hits = hits.filter((stamp) => now - stamp < SHAKE_WINDOW_MS);
      hits.push(now);
      if (hits.length >= SHAKE_HITS) {
        hits = [];
        lastShake = now;
        trigger();
      }
    };

    const listen = () => {
      if (listening || typeof DeviceMotionEvent === "undefined") return;
      listening = true;
      window.addEventListener("devicemotion", onMotion);
    };

    // Without a permission API (Android, desktop) motion flows right away.
    if (!motionApi()?.requestPermission) listen();
    window.addEventListener(MOTION_EVENT, listen);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("click", onClick);
    return () => {
      window.clearTimeout(toastTimer);
      window.removeEventListener(MOTION_EVENT, listen);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("click", onClick);
      if (listening) window.removeEventListener("devicemotion", onMotion);
    };
  }, []);

  return (
    <div className="skin-toast-wrap" role="status" aria-live="polite">
      {toast ? <p className="skin-toast">{t(locale).winterToast}</p> : null}
    </div>
  );
};
