import { describe, expect, it } from "vitest";
import { pickCenterPhoto, type ToneBox } from "@/lib/photoTone";

const box = (top: number, height: number): ToneBox => ({ top, height, bottom: top + height });

describe("pickCenterPhoto", () => {
  const height = 800;

  it("returns nothing when every photo sits outside the middle band", () => {
    expect(pickCenterPhoto([box(-400, 160), box(760, 200)], height)).toBeNull();
  });

  it("picks the photo whose center is nearest the middle of the screen", () => {
    const above = box(180, 200);
    const center = box(300, 220);
    const below = box(560, 180);
    expect(pickCenterPhoto([above, center, below], height)).toBe(center);
  });

  it("keeps a tall photo that covers the middle even if its center is high", () => {
    const tall = box(40, 700);
    expect(pickCenterPhoto([tall, box(900, 200)], height)).toBe(tall);
  });

  it("ignores an empty viewport", () => {
    expect(pickCenterPhoto([box(0, 100)], 0)).toBeNull();
  });
});
