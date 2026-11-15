import type { SalonSchedule } from "@/content/schedule";
import { readHours, zonedToUtc } from "@/lib/hours";

/** Minutes the glass needs to thaw after opening. */
export const THAW_MINUTES = 40;
/** Minutes before closing in which frost creeps back. */
export const FREEZE_MINUTES = 45;

const isOpen = (status: string) => status === "open" || status === "closingSoon";
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Frost on the hours glass, 0 clear … 1 frozen. Closed: frozen. After
 * opening it thaws over `THAW_MINUTES`, as if the room warmed up; in the
 * last `FREEZE_MINUTES` before closing it frosts over again.
 */
export const frostLevel = (schedule: SalonSchedule, now: Date): number => {
  const reading = readHours(schedule, now);
  if (reading.status === "unknown") return 0;
  if (!isOpen(reading.status)) return 1;

  const at = now.getTime();
  let openedMinutes = THAW_MINUTES;
  for (let k = 1; k <= THAW_MINUTES; k += 1) {
    if (!isOpen(readHours(schedule, new Date(at - k * 60_000)).status)) {
      openedMinutes = k - 1 + (now.getUTCSeconds() / 60);
      break;
    }
  }
  const thaw = clamp01(1 - openedMinutes / THAW_MINUTES);

  let freeze = 0;
  const until = reading.openUntil;
  if (until) {
    const closeAt = zonedToUtc(schedule.timeZone, until.year, until.month, until.day, until.hour, until.minute);
    const minutesLeft = (closeAt - at) / 60_000;
    freeze = clamp01(1 - minutesLeft / FREEZE_MINUTES);
  }
  return Math.max(thaw, freeze);
};
