import { t } from "@/content/messages";
import { isSameCivilDay, zonedToUtc, type HoursReading, type OpenStamp } from "@/lib/hours";
import type { Locale } from "@/lib/site";

const clockTime = (stamp: { hour: number; minute: number }) =>
  `${String(stamp.hour).padStart(2, "0")}:${String(stamp.minute).padStart(2, "0")}`;

const formatWhen = (locale: Locale, stamp: OpenStamp) =>
  new Intl.DateTimeFormat(locale === "uk" ? "uk-UA" : "de-DE", {
    timeZone: "Europe/Berlin",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(zonedToUtc("Europe/Berlin", stamp.year, stamp.month, stamp.day, stamp.hour, stamp.minute)));

export const describeHours = (locale: Locale, reading: HoursReading) => {
  const copy = t(locale);
  if (reading.status === "unknown") return copy.hoursAsk;
  if (reading.openUntil) {
    const time = clockTime(reading.openUntil);
    if (isSameCivilDay(reading.today, reading.openUntil)) {
      return (reading.status === "closingSoon" ? copy.hoursClosingUntil : copy.hoursOpenUntil).replace("{time}", time);
    }
    return copy.hoursOpenUntilWhen.replace("{when}", formatWhen(locale, reading.openUntil));
  }
  if (reading.nextOpen) {
    if (reading.status === "openingSoon" && isSameCivilDay(reading.today, reading.nextOpen)) {
      return copy.hoursOpensSoon.replace("{time}", clockTime(reading.nextOpen));
    }
    return copy.hoursNext.replace("{when}", formatWhen(locale, reading.nextOpen));
  }
  return copy.hoursAsk;
};

export const hoursStatusLabel = (locale: Locale, status: HoursReading["status"]) => {
  const copy = t(locale);
  if (status === "open") return copy.statusOpen;
  if (status === "closingSoon") return copy.statusClosing;
  if (status === "openingSoon") return copy.statusOpening;
  if (status === "closed") return copy.statusClosed;
  return "";
};
