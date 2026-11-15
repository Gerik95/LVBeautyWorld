import { describe, expect, it } from "vitest";
import type { SalonSchedule } from "@/content/schedule";
import { frostLevel } from "./frostLevel";

const day = { start: 10 * 60, end: 19 * 60 };
const schedule: SalonSchedule = {
  confirmed: true,
  timeZone: "Europe/Berlin",
  soonMinutes: 30,
  week: [[], [day], [day], [day], [day], [day], [day]],
  exceptions: [],
};

/** Tuesday 1 December 2026, Berlin is UTC+1. */
const at = (hhmm: string) => new Date(`2026-12-01T${hhmm}:00+01:00`);

describe("frostLevel", () => {
  it("is frozen while closed", () => {
    expect(frostLevel(schedule, at("08:00"))).toBe(1);
    expect(frostLevel(schedule, at("09:50"))).toBe(1);
    expect(frostLevel(schedule, at("20:00"))).toBe(1);
  });

  it("thaws after opening", () => {
    expect(frostLevel(schedule, at("10:00"))).toBeCloseTo(1, 1);
    expect(frostLevel(schedule, at("10:20"))).toBeCloseTo(0.5, 1);
    expect(frostLevel(schedule, at("10:40"))).toBe(0);
  });

  it("is clear in the middle of the day", () => {
    expect(frostLevel(schedule, at("14:00"))).toBe(0);
  });

  it("frosts over before closing", () => {
    expect(frostLevel(schedule, at("18:15"))).toBe(0);
    expect(frostLevel(schedule, at("18:37"))).toBeCloseTo(0.5, 1);
    expect(frostLevel(schedule, at("18:59"))).toBeGreaterThan(0.95);
  });

  it("stays clear when hours are unconfirmed", () => {
    expect(frostLevel({ ...schedule, confirmed: false }, at("08:00"))).toBe(0);
  });
});
