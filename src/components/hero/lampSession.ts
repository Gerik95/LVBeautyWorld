import { motion } from "@/skins/motion";

type Memory = {
  startedAt: number;
  painted: boolean;
};

const memory: Memory = { startedAt: 0, painted: false };

/** `done` — this visit finished. `playing` — this visit is running. `fresh` — not started. */
export const lampState = (now = performance.now()): "done" | "playing" | "fresh" => {
  if (!memory.startedAt) return "fresh";
  return now - memory.startedAt >= motion.lampMs ? "done" : "playing";
};

/** Starts the clock. Does not persist, so a cancelled mount can still play. */
export const beginLamp = (now = performance.now()) => {
  if (!memory.startedAt) memory.startedAt = now;
  return memory.startedAt;
};

/** Marks that this visit has painted a frame, so a Strict Mode cleanup can resume it. */
export const markLampPainted = () => {
  memory.painted = true;
};

export const lampHasPainted = () => memory.painted;

/** Strict Mode cleanup before the first frame must not block the next mount. */
export const abortUnpaintedLamp = () => {
  if (memory.painted) return;
  memory.startedAt = 0;
};

export const lampElapsed = (now = performance.now()) => (memory.startedAt ? now - memory.startedAt : 0);

/** A new visit to the home hero. Does not touch language, theme, or other storage. */
export const resetLampSession = () => {
  memory.startedAt = 0;
  memory.painted = false;
};
