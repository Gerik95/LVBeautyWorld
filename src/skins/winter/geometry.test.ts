import { describe, expect, it } from "vitest";
import {
  beamWeight,
  capProfile,
  findCaps,
  isSilvester,
  meetTransform,
  parseRotate,
  parseViewBox,
} from "./geometry";

const grid = (rows: string[]) => {
  const cols = rows[0].length;
  const solid = new Uint8Array(cols * rows.length);
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      solid[y * cols + x] = ch === "#" ? 1 : 0;
    });
  });
  return { solid, cols, rows: rows.length };
};

describe("findCaps", () => {
  it("puts one cap on a flat bar", () => {
    const { solid, cols, rows } = grid([
      "..........",
      "..........",
      "..######..",
      "..######..",
    ]);
    const caps = findCaps(solid, cols, rows);
    expect(caps).toHaveLength(1);
    expect(caps[0].map((ledge) => ledge.x)).toEqual([2, 3, 4, 5, 6, 7]);
    expect(caps[0].every((ledge) => ledge.y === 2)).toBe(true);
  });

  it("keeps separate ledges apart", () => {
    const { solid, cols, rows } = grid([
      "...........",
      "...........",
      "####...####",
      "####...####",
    ]);
    expect(findCaps(solid, cols, rows)).toHaveLength(2);
  });

  it("puts no snow on a vertical wall", () => {
    const { solid, cols, rows } = grid([
      "....",
      "....",
      ".#..",
      ".#..",
      ".#..",
    ]);
    expect(findCaps(solid, cols, rows)).toHaveLength(0);
  });

  it("follows a gentle slope", () => {
    const { solid, cols, rows } = grid([
      "........",
      "........",
      "......##",
      "....####",
      "..######",
      "########",
    ]);
    const caps = findCaps(solid, cols, rows);
    expect(caps).toHaveLength(1);
    expect(caps[0][0]).toMatchObject({ x: 0, y: 5 });
    expect(caps[0][caps[0].length - 1]).toMatchObject({ x: 7, y: 2 });
  });
});

describe("capProfile", () => {
  it("is deepest in the middle of a flat cap and rounds off at the ends", () => {
    const cap = Array.from({ length: 30 }, (_, x) => ({ x, y: 4, slope: 0 }));
    const depth = capProfile(cap, 6);
    expect(depth[0]).toBeLessThan(depth[15]);
    expect(depth[29]).toBeLessThan(depth[15]);
    expect(Math.max(...depth)).toBeLessThanOrEqual(6);
  });

  it("puts less snow on a steep ledge", () => {
    const flat = Array.from({ length: 30 }, (_, x) => ({ x, y: 4, slope: 0 }));
    const steep = Array.from({ length: 30 }, (_, x) => ({ x, y: 4, slope: 2 }));
    expect(capProfile(steep, 6)[15]).toBeLessThan(capProfile(flat, 6)[15]);
  });
});

describe("beamWeight", () => {
  it("is bright on the beam line and dark beside it", () => {
    const on = beamWeight(400, 400, 1000, 800, 45);
    const off = beamWeight(700, 100, 1000, 800, 45);
    expect(on).toBeGreaterThan(0.5);
    expect(off).toBeLessThan(0.05);
  });

  it("fades along the beam", () => {
    const near = beamWeight(100, 100, 1000, 800, 45);
    const far = beamWeight(800, 800, 1000, 800, 45);
    expect(near).toBeGreaterThan(far);
  });

  it("is dark behind the lamp", () => {
    expect(beamWeight(-10, -10, 1000, 800, 45)).toBe(0);
  });
});

describe("parsing", () => {
  it("reads the beam rotation", () => {
    expect(parseRotate("rotate(12.5deg)", 34)).toBe(12.5);
    expect(parseRotate("rotate(-3deg)", 34)).toBe(-3);
    expect(parseRotate("", 34)).toBe(34);
  });

  it("reads a viewBox", () => {
    expect(parseViewBox("40 160 1380 1190")).toEqual({ x: 40, y: 160, width: 1380, height: 1190 });
    expect(parseViewBox("0 0 0 10")).toBeNull();
    expect(parseViewBox(null)).toBeNull();
  });

  it("centres a meet viewBox", () => {
    const fit = meetTransform({ width: 200, height: 100 }, { x: 0, y: 0, width: 100, height: 100 });
    expect(fit).toEqual({ scale: 1, offsetX: 50, offsetY: 0 });
  });
});

describe("isSilvester", () => {
  it("starts at 23:59 on 31 December in Berlin", () => {
    expect(isSilvester(new Date("2026-12-31T22:58:30Z"))).toBe(false);
    expect(isSilvester(new Date("2026-12-31T22:59:00Z"))).toBe(true);
  });

  it("lasts until half past midnight", () => {
    expect(isSilvester(new Date("2026-12-31T23:29:00Z"))).toBe(true);
    expect(isSilvester(new Date("2026-12-31T23:30:00Z"))).toBe(false);
  });

  it("is off on other days", () => {
    expect(isSilvester(new Date("2026-12-30T22:59:30Z"))).toBe(false);
    expect(isSilvester(new Date("2026-07-01T00:10:00Z"))).toBe(false);
  });
});

describe("silvesterPhase", () => {
  it("runs the show before midnight and the finale right after", async () => {
    const { silvesterPhase } = await import("./geometry");
    expect(silvesterPhase(new Date("2026-12-31T22:59:30Z"))).toBe("show");
    expect(silvesterPhase(new Date("2026-12-31T23:00:30Z"))).toBe("finale");
    expect(silvesterPhase(new Date("2026-12-31T23:05:00Z"))).toBe("show");
    expect(silvesterPhase(new Date("2026-12-31T12:00:00Z"))).toBe("off");
  });
});
