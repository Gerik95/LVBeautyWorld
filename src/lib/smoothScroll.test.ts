import { describe, expect, it } from "vitest";
import { scrollEase } from "@/lib/smoothScroll";

describe("scroll ease", () => {
  it("starts and ends flat", () => {
    expect(scrollEase(0)).toBe(0);
    expect(scrollEase(1)).toBe(1);
    expect(scrollEase(0.5)).toBeCloseTo(0.5, 5);
  });

  it("accelerates then decelerates", () => {
    const early = scrollEase(0.2);
    const late = 1 - scrollEase(0.8);
    expect(early).toBeLessThan(0.2);
    expect(late).toBeLessThan(0.2);
    expect(early).toBeCloseTo(late, 5);
  });
});
