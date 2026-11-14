/**
 * Weekly hours confirmed by Salonkee and already published on this site:
 * Monday–Saturday 10:00–19:00, Sunday closed.
 * The previous website did not list hours, so there is no second timetable to reconcile.
 * No public-holiday closures are assumed.
 */
export type DayInterval = {
  /** Minutes from local midnight, 0–1440. */
  start: number;
  /** Exclusive end. When `end <= start`, the interval continues after midnight. */
  end: number;
};

export type HoursException = {
  /** Civil date in Europe/Berlin, YYYY-MM-DD. Overrides that weekday. */
  date: string;
  intervals: DayInterval[];
};

export type SalonSchedule = {
  confirmed: boolean;
  timeZone: "Europe/Berlin";
  soonMinutes: number;
  /** Index 0 is Sunday. */
  week: DayInterval[][];
  exceptions: HoursException[];
};

const day = (start: string, end: string): DayInterval => {
  const toMinutes = (value: string) => {
    const [hour, minute] = value.split(":").map(Number);
    return hour * 60 + minute;
  };
  return { start: toMinutes(start), end: toMinutes(end) };
};

const open = day("10:00", "19:00");

export const salonSchedule: SalonSchedule = {
  confirmed: true,
  timeZone: "Europe/Berlin",
  soonMinutes: 30,
  week: [[], [open], [open], [open], [open], [open], [open]],
  exceptions: [],
};
