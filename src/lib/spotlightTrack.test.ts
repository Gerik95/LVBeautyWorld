import { describe, expect, it } from "vitest";
import { glidePoint, heroPointerAction } from "@/lib/spotlightTrack";

describe("hero pointer tracking", () => {
  it("follows the first move even when pointerenter was missed", () => {
    expect(heroPointerAction("move", "mouse", false)).toBe("track");
    expect(heroPointerAction("enter", "mouse", false)).toBe("track");
  });

  it("glides toward a far pointer and arrives when the step covers the gap", () => {
    const home = { x: 0.58, y: 0.4 };
    const stepped = glidePoint(home, { x: 0.58, y: 0.9 }, 100, 1.35);
    expect(stepped.x).toBeCloseTo(0.58);
    expect(stepped.y).toBeCloseTo(0.535);
    expect(glidePoint(stepped, { x: 0.58, y: 0.54 }, 100, 1.35)).toEqual({ x: 0.58, y: 0.54 });
    expect(glidePoint(home, { x: 0.9, y: 0.8 }, 0, 1.35)).toEqual(home);
  });

  it("returns home when the pointer leaves and ignores touch", () => {
    expect(heroPointerAction("leave", "mouse", true)).toBe("return");
    expect(heroPointerAction("leave", "mouse", false)).toBe("ignore");
    expect(heroPointerAction("move", "touch", false)).toBe("ignore");
    expect(heroPointerAction("cancel", "mouse", true)).toBe("return");
  });
});
