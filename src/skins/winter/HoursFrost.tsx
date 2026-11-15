"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { salonSchedule } from "@/content/schedule";
import { readHours } from "@/lib/hours";
import { frostLevel } from "./frostLevel";

const CYCLE_S = 18;

/**
 * Preview: `?frost=0.4` holds a level, `?frost=cycle` runs closed → thaw →
 * open → freeze in 18 s.
 */
const previewMode = () => {
  const value = new URLSearchParams(window.location.search).get("frost");
  if (value === null) return null;
  if (value === "cycle") return "cycle" as const;
  const level = Number(value);
  return Number.isFinite(level) ? Math.min(1, Math.max(0, level)) : null;
};

const cycleAt = (seconds: number) => {
  const t = seconds % CYCLE_S;
  if (t < 3) return { level: 1, open: false };
  if (t < 8) return { level: 1 - (t - 3) / 5, open: true };
  if (t < 12) return { level: 0, open: true };
  if (t < 17) return { level: (t - 12) / 5, open: true };
  return { level: 1, open: false };
};

/**
 * Frost on the opening-hours glass. Frozen while the salon is closed, it
 * thaws from the middle after opening, as if the room warmed up, and frosts
 * over from the edges before closing. The hours stay readable throughout.
 */
export const HoursFrost = () => {
  const [state, setState] = useState({ level: 1, open: false, live: false });

  useEffect(() => {
    const preview = previewMode();
    if (preview === "cycle") {
      let frame = 0;
      const startAt = performance.now();
      const loop = (now: number) => {
        setState({ ...cycleAt((now - startAt) / 1000), live: true });
        frame = window.requestAnimationFrame(loop);
      };
      frame = window.requestAnimationFrame(loop);
      return () => window.cancelAnimationFrame(frame);
    }
    if (typeof preview === "number") {
      setState({ level: preview, open: preview < 1, live: false });
      return;
    }
    const read = () => {
      const now = new Date();
      const status = readHours(salonSchedule, now).status;
      setState({
        level: frostLevel(salonSchedule, now),
        open: status === "open" || status === "closingSoon",
        live: false,
      });
    };
    read();
    const timer = window.setInterval(read, 15_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="winter-hours-frost"
      data-live={state.live ? "" : undefined}
      style={{ "--frost": state.level.toFixed(3), "--open": state.open ? 1 : 0 } as CSSProperties}
      aria-hidden="true"
    >
      <div className="winter-hours-warm" />
      <div className="winter-hours-ice">
        <div className="winter-hours-haze" />
        <div className="winter-hours-crystals" />
      </div>
    </div>
  );
};
