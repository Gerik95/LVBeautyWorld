"use client";

import { useEffect, useState } from "react";
import { t } from "@/content/messages";
import { motionSupported, readShake, type Vector } from "@/lib/shake";
import type { Locale } from "@/lib/site";
import { readOptInSkin, requestGlobe, setOptInSkin } from "@/skins";

const TAPS = 3;
const TAP_WINDOW_MS = 900;
const SHAKE_HITS = 2;
const SHAKE_SPACING_MS = 80;
const SHAKE_WINDOW_MS = 700;
const SHAKE_COOLDOWN_MS = 2200;
const TOAST_MS = 4200;
const MOTION_EVENT = "lvbw:motion";

type MotionPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

const motionApi = () =>
  typeof DeviceMotionEvent === "undefined" ? null : (DeviceMotionEvent as unknown as MotionPermission);

const needsPermission = () => Boolean(motionApi()?.requestPermission);

/** iOS forgets the grant on every page load, so it is asked again once per load. */
let permission: "idle" | "asking" | "granted" | "denied" = "idle";

/**
 * iOS sends motion only after `requestPermission`, called straight from a
 * tap (`touchend` or `click`). A site the visitor already allowed gets
 * "granted" without a prompt. Elsewhere motion needs no permission.
 * Without a motion sensor, or outside HTTPS, nothing happens.
 */
export const askMotionPermission = () => {
  if (!motionSupported()) return;
  const api = motionApi();
  if (!api?.requestPermission) {
    window.dispatchEvent(new CustomEvent(MOTION_EVENT));
    return;
  }
  if (permission !== "idle") return;
  permission = "asking";
  api
    .requestPermission()
    .then((answer) => {
      permission = answer === "granted" ? "granted" : "denied";
      if (permission === "granted") window.dispatchEvent(new CustomEvent(MOTION_EVENT));
    })
    .catch(() => {
      // Not counted as a tap (for example the end of a scroll): try on the next one.
      permission = "idle";
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
 * the settings. Shake works only on touch devices with a motion sensor and
 * over HTTPS. On iOS the first tap after a page load, while winter is on,
 * asks for motion access, so shake can only shake the globe there.
 */
export const SkinEgg = ({ locale }: { locale: Locale }) => {
  const [toast, setToast] = useState(false);

  useEffect(() => {
    let taps: number[] = [];
    let hits: number[] = [];
    let lastShake = 0;
    let previousGravity: Vector | null = null;
    let toastTimer = 0;
    let attached = false;

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

    const onMotion = (event: DeviceMotionEvent) => {
      const now = performance.now();
      const sample = readShake(
        {
          acceleration: event.acceleration,
          accelerationIncludingGravity: event.accelerationIncludingGravity,
        },
        previousGravity,
      );
      previousGravity = sample.gravity;
      if (!sample.strong || now - lastShake < SHAKE_COOLDOWN_MS) return;
      if (hits.length && now - hits[hits.length - 1] < SHAKE_SPACING_MS) return;
      hits = hits.filter((stamp) => now - stamp < SHAKE_WINDOW_MS);
      hits.push(now);
      if (hits.length >= SHAKE_HITS) {
        hits = [];
        lastShake = now;
        trigger();
      }
    };

    // Removing first keeps a single listener when another grant arrives.
    const attach = () => {
      if (!motionSupported()) return;
      window.removeEventListener("devicemotion", onMotion);
      window.addEventListener("devicemotion", onMotion);
      attached = true;
    };

    const onGesture = () => {
      if (needsPermission() && readOptInSkin() === "winter") askMotionPermission();
    };

    if (!needsPermission()) attach();
    window.addEventListener(MOTION_EVENT, attach);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    // Safari does not always send a click to `window` for a tap on plain
    // text, so `touchend` carries the permission request too.
    window.addEventListener("touchend", onGesture, { passive: true });
    window.addEventListener("click", onGesture);
    return () => {
      window.clearTimeout(toastTimer);
      window.removeEventListener(MOTION_EVENT, attach);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("touchend", onGesture);
      window.removeEventListener("click", onGesture);
      if (attached) window.removeEventListener("devicemotion", onMotion);
    };
  }, []);

  return (
    <div className="skin-toast-wrap" role="status" aria-live="polite">
      {toast ? <p className="skin-toast">{t(locale).winterToast}</p> : null}
    </div>
  );
};
