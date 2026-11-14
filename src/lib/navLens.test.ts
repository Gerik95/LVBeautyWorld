import { describe, expect, it } from "vitest";
import { nearestItemIndex, resolveLensDrop, shouldSlideLens } from "@/lib/navLens";

const rects = [
  { left: 10, width: 40 },
  { left: 80, width: 120 },
  { left: 230, width: 36 },
];

describe("lens drop", () => {
  it("measures item centers instead of a fixed slot width", () => {
    expect(nearestItemIndex(30, rects)).toBe(0);
    expect(nearestItemIndex(140, rects)).toBe(1);
    expect(nearestItemIndex(248, rects)).toBe(2);
  });

  it("does not navigate on a short press or a cancelled gesture", () => {
    expect(
      resolveLensDrop({ moved: false, cancelled: false, pointerX: 140, rects, activeIndex: 0 }),
    ).toEqual({ index: 0, navigate: false });
    expect(
      resolveLensDrop({ moved: true, cancelled: true, pointerX: 248, rects, activeIndex: 0 }),
    ).toEqual({ index: 0, navigate: false });
  });

  it("slides only between different items", () => {
    expect(shouldSlideLens(null, 0, false)).toBe(false);
    expect(shouldSlideLens(0, 0, false)).toBe(false);
    expect(shouldSlideLens(0, 4, true)).toBe(false);
    expect(shouldSlideLens(0, 4, false)).toBe(true);
  });

  it("navigates once, only when the nearest item is a different route", () => {
    expect(
      resolveLensDrop({ moved: true, cancelled: false, pointerX: 140, rects, activeIndex: 0 }),
    ).toEqual({ index: 1, navigate: true });
    expect(
      resolveLensDrop({ moved: true, cancelled: false, pointerX: 30, rects, activeIndex: 0 }),
    ).toEqual({ index: 0, navigate: false });
  });
});
