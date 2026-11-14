import type { DayInterval, SalonSchedule } from "@/content/schedule";

export type BerlinParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** 0 Sunday … 6 Saturday. */
  weekday: number;
};

export type HoursStatus = "open" | "closingSoon" | "closed" | "openingSoon" | "unknown";

export type ClockStamp = { hour: number; minute: number; second: number };

export type OpenStamp = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export type HoursReading = {
  status: HoursStatus;
  clock: ClockStamp;
  today: { year: number; month: number; day: number; weekday: number };
  /** Closing instant of the interval that contains now. */
  openUntil: OpenStamp | null;
  nextOpen: OpenStamp | null;
};

const weekdayIndex: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export const berlinParts = (date: Date, timeZone = "Europe/Berlin"): BerlinParts => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const bag: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== "literal") bag[part.type] = part.value;
  }
  let hour = Number(bag.hour);
  let day = Number(bag.day);
  let month = Number(bag.month);
  let year = Number(bag.year);
  if (hour === 24) {
    hour = 0;
    const next = shiftCivil(year, month, day, 1);
    year = next.year;
    month = next.month;
    day = next.day;
  }
  return {
    year,
    month,
    day,
    hour,
    minute: Number(bag.minute),
    second: Number(bag.second),
    weekday: weekdayIndex[bag.weekday] ?? 0,
  };
};

/** UTC milliseconds for a civil time in `timeZone`. Handles CET/CEST. */
export const zonedToUtc = (
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second = 0,
) => {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  const offsetAt = (ms: number) => {
    const parts = berlinParts(new Date(ms), timeZone);
    const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    return asUtc - ms;
  };
  const first = offsetAt(utcGuess);
  let result = utcGuess - first;
  const secondOffset = offsetAt(result);
  if (secondOffset !== first) result = utcGuess - secondOffset;
  return result;
};

export const shiftCivil = (year: number, month: number, day: number, delta: number) => {
  const utc = new Date(Date.UTC(year, month - 1, day + delta));
  return { year: utc.getUTCFullYear(), month: utc.getUTCMonth() + 1, day: utc.getUTCDate() };
};

export const civilKey = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const formatClock = (clock: ClockStamp) =>
  [clock.hour, clock.minute, clock.second].map((part) => String(part).padStart(2, "0")).join(":");

export const formatMinutes = (minutes: number) => {
  const wrapped = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(wrapped / 60);
  const minute = wrapped % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

export const formatInterval = (interval: DayInterval) =>
  `${formatMinutes(interval.start)}–${formatMinutes(interval.end)}`;

type Span = { start: number; end: number };

const weekdayOf = (schedule: SalonSchedule, year: number, month: number, day: number) => {
  const noon = zonedToUtc(schedule.timeZone, year, month, day, 12, 0, 0);
  return berlinParts(new Date(noon), schedule.timeZone).weekday;
};

const intervalsOn = (schedule: SalonSchedule, year: number, month: number, day: number) => {
  const key = civilKey(year, month, day);
  const exception = schedule.exceptions.find((item) => item.date === key);
  if (exception) return exception.intervals;
  return schedule.week[weekdayOf(schedule, year, month, day)] ?? [];
};

const spansOn = (schedule: SalonSchedule, year: number, month: number, day: number): Span[] =>
  intervalsOn(schedule, year, month, day).flatMap((interval) => {
    const startHour = Math.floor(interval.start / 60);
    const startMinute = interval.start % 60;
    const start = zonedToUtc(schedule.timeZone, year, month, day, startHour, startMinute, 0);
    const crosses = interval.end <= interval.start;
    const endDay = crosses ? shiftCivil(year, month, day, 1) : { year, month, day };
    const endMinutes = crosses ? interval.end : interval.end;
    const end = zonedToUtc(
      schedule.timeZone,
      endDay.year,
      endDay.month,
      endDay.day,
      Math.floor(endMinutes / 60),
      endMinutes % 60,
      0,
    );
    if (end <= start) return [];
    return [{ start, end }];
  });

const collectSpans = (schedule: SalonSchedule, today: BerlinParts, aheadDays: number) => {
  const spans: Span[] = [];
  for (let delta = -1; delta <= aheadDays; delta += 1) {
    const day = shiftCivil(today.year, today.month, today.day, delta);
    spans.push(...spansOn(schedule, day.year, day.month, day.day));
  }
  spans.sort((a, b) => a.start - b.start);
  return spans;
};

const stampFrom = (date: Date, timeZone: string): OpenStamp => {
  const parts = berlinParts(date, timeZone);
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
  };
};

export const isSameCivilDay = (
  today: { year: number; month: number; day: number },
  stamp: { year: number; month: number; day: number },
) => today.year === stamp.year && today.month === stamp.month && today.day === stamp.day;

export const readHours = (schedule: SalonSchedule, instant: Date): HoursReading => {
  const parts = berlinParts(instant, schedule.timeZone);
  const clock = { hour: parts.hour, minute: parts.minute, second: parts.second };
  const today = { year: parts.year, month: parts.month, day: parts.day, weekday: parts.weekday };
  if (!schedule.confirmed) {
    return { status: "unknown", clock, today, openUntil: null, nextOpen: null };
  }
  const spans = collectSpans(schedule, parts, 8);
  const now = instant.getTime();
  const soon = schedule.soonMinutes * 60_000;
  const current = spans.find((span) => span.start <= now && now < span.end) ?? null;
  if (current) {
    const remaining = current.end - now;
    return {
      status: remaining <= soon ? "closingSoon" : "open",
      clock,
      today,
      openUntil: stampFrom(new Date(current.end), schedule.timeZone),
      nextOpen: null,
    };
  }
  const next = spans.find((span) => span.start > now) ?? null;
  if (!next) {
    return { status: "closed", clock, today, openUntil: null, nextOpen: null };
  }
  const nextOpen = stampFrom(new Date(next.start), schedule.timeZone);
  const openingSoon = next.start - now <= soon;
  return {
    status: openingSoon ? "openingSoon" : "closed",
    clock,
    today,
    openUntil: null,
    nextOpen,
  };
};

/** Intervals for a weekday row in the current Berlin week. An exception on that date wins. */
export const weekRowIntervals = (
  schedule: SalonSchedule,
  weekday: number,
  today: { year: number; month: number; day: number; weekday: number } | null,
) => {
  if (!today) return schedule.week[weekday] ?? [];
  const delta = (weekday === 0 ? 7 : weekday) - (today.weekday === 0 ? 7 : today.weekday);
  const date = shiftCivil(today.year, today.month, today.day, delta);
  return intervalsOn(schedule, date.year, date.month, date.day);
};
