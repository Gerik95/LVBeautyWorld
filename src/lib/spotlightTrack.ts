export type HeroPointer = "enter" | "move" | "leave" | "cancel";

export type AimPoint = { x: number; y: number };

/**
 * Step `current` toward `target` at `speed` hero-widths per second.
 * Gaps smaller than one step arrive immediately, so a resting beam does not teleport
 * across the hero when the pointer enters far from home.
 */
export const glidePoint = (current: AimPoint, target: AimPoint, dt: number, speed: number): AimPoint => {
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  const distance = Math.hypot(dx, dy);
  if (distance === 0 || dt <= 0 || speed <= 0) return { x: current.x, y: current.y };
  const step = speed * (dt / 1000);
  if (distance <= step) return { x: target.x, y: target.y };
  const scale = step / distance;
  return { x: current.x + dx * scale, y: current.y + dy * scale };
};

/**
 * A move or enter over the hero starts tracking.
 * pointerenter is often missed when the hero is mounted under a cursor that is already inside it.
 */
export const heroPointerAction = (
  kind: HeroPointer,
  pointerType: string,
  inside: boolean,
): "track" | "return" | "ignore" => {
  if (pointerType && pointerType !== "mouse") return "ignore";
  if (kind === "leave" || kind === "cancel") return inside ? "return" : "ignore";
  return "track";
};
