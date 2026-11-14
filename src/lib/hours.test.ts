import { describe, expect, it } from "vitest";
import { salonSchedule, type SalonSchedule } from "@/content/schedule";
import { berlinParts, formatClock, readHours, zonedToUtc } from "@/lib/hours";

const openDay = { start: 10 * 60, end: 19 * 60 };

const fixture = (patch: Partial<SalonSchedule> = {}): SalonSchedule => ({
  confirmed: true,
  timeZone: "Europe/Berlin",
  soonMinutes: 30,
  week: [[], [openDay], [openDay], [openDay], [openDay], [openDay], [openDay]],
  exceptions: [],
  ...patch,
});

describe("Europe/Berlin clock", () => {
  it("follows winter and summer time instead of a fixed offset", () => {
    expect(formatClock(berlinParts(new Date("2026-01-15T09:00:00Z")))).toBe("10:00:00");
    expect(formatClock(berlinParts(new Date("2026-07-15T08:00:00Z")))).toBe("10:00:00");
    expect(zonedToUtc("Europe/Berlin", 2026, 1, 15, 10, 0, 0)).toBe(Date.parse("2026-01-15T09:00:00Z"));
    expect(zonedToUtc("Europe/Berlin", 2026, 7, 15, 10, 0, 0)).toBe(Date.parse("2026-07-15T08:00:00Z"));
  });
});

describe("opening status", () => {
  const schedule = fixture();

  it("uses the 30 minute edges on a 10:00–19:00 day", () => {
    expect(readHours(schedule, new Date("2026-01-12T08:29:00Z")).status).toBe("closed");
    expect(readHours(schedule, new Date("2026-01-12T08:30:00Z")).status).toBe("openingSoon");
    expect(readHours(schedule, new Date("2026-01-12T09:00:00Z")).status).toBe("open");
    expect(readHours(schedule, new Date("2026-01-12T17:30:00Z")).status).toBe("closingSoon");
    expect(readHours(schedule, new Date("2026-01-12T18:00:00Z")).status).toBe("closed");
  });

  it("keeps Sunday closed and names the next Monday opening", () => {
    const reading = readHours(schedule, new Date("2026-01-11T11:00:00Z"));
    expect(reading.status).toBe("closed");
    expect(reading.nextOpen).toMatchObject({ year: 2026, month: 1, day: 12, hour: 10, minute: 0 });
  });

  it("treats the same edges in summer time", () => {
    expect(readHours(schedule, new Date("2026-07-13T07:29:00Z")).status).toBe("closed");
    expect(readHours(schedule, new Date("2026-07-13T07:30:00Z")).status).toBe("openingSoon");
    expect(readHours(schedule, new Date("2026-07-13T08:00:00Z")).status).toBe("open");
    expect(readHours(schedule, new Date("2026-07-13T16:30:00Z")).status).toBe("closingSoon");
    expect(readHours(schedule, new Date("2026-07-13T17:00:00Z")).status).toBe("closed");
  });

  it("lets a dated exception replace the weekday", () => {
    const closedMonday = fixture({
      exceptions: [{ date: "2026-01-12", intervals: [] }],
    });
    const reading = readHours(closedMonday, new Date("2026-01-12T09:00:00Z"));
    expect(reading.status).toBe("closed");
    expect(reading.nextOpen).toMatchObject({ day: 13, hour: 10 });
  });

  it("supports a break between two intervals", () => {
    const split = { ...openDay };
    const scheduleWithBreak = fixture({
      week: [[], [{ start: 10 * 60, end: 13 * 60 }, { start: 15 * 60, end: 19 * 60 }], [split], [split], [split], [split], [split]],
    });
    expect(readHours(scheduleWithBreak, new Date("2026-01-12T11:30:00Z")).status).toBe("closingSoon");
    expect(readHours(scheduleWithBreak, new Date("2026-01-12T12:00:00Z")).status).toBe("closed");
    expect(readHours(scheduleWithBreak, new Date("2026-01-12T13:30:00Z")).status).toBe("openingSoon");
    expect(readHours(scheduleWithBreak, new Date("2026-01-12T14:00:00Z")).status).toBe("open");
  });

  it("supports an interval that crosses midnight", () => {
    const night = fixture({
      week: [[], [{ start: 22 * 60, end: 2 * 60 }], [], [], [], [], []],
    });
    expect(readHours(night, new Date("2026-01-12T20:30:00Z")).status).toBe("openingSoon");
    expect(readHours(night, new Date("2026-01-12T21:00:00Z")).status).toBe("open");
    expect(readHours(night, new Date("2026-01-13T00:30:00Z")).status).toBe("closingSoon");
    expect(readHours(night, new Date("2026-01-13T01:00:00Z")).status).toBe("closed");
  });

  it("does not claim open or closed when the timetable is unconfirmed", () => {
    expect(readHours(fixture({ confirmed: false }), new Date("2026-01-12T12:00:00Z")).status).toBe("unknown");
  });
});

describe("published salon week", () => {
  it("matches the confirmed Salonkee week and does not invent holidays", () => {
    expect(salonSchedule.confirmed).toBe(true);
    expect(salonSchedule.soonMinutes).toBe(30);
    expect(salonSchedule.timeZone).toBe("Europe/Berlin");
    expect(salonSchedule.exceptions).toEqual([]);
    expect(salonSchedule.week[0]).toEqual([]);
    for (const day of salonSchedule.week.slice(1)) {
      expect(day).toEqual([{ start: 10 * 60, end: 19 * 60 }]);
    }
  });
});
