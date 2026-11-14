import { salonSchedule, type SalonSchedule } from "@/content/schedule";
import { formatMinutes } from "@/lib/hours";
import { pathFor, site, type Locale } from "@/lib/site";

/** Salon contact card. vCard 3.0: the version both iOS and Android contacts import. */

const shortDays: Record<Locale, string[]> = {
  de: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  uk: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
};

const words: Record<Locale, { hours: string; closed: string; booking: string; country: string }> = {
  de: { hours: "Öffnungszeiten", closed: "geschlossen", booking: "Termin online", country: "Deutschland" },
  uk: { hours: "Графік", closed: "зачинено", booking: "Запис онлайн", country: "Німеччина" },
};

/** Text values escape backslash, comma, semicolon and newlines (RFC 2426 §5). */
export const escapeText = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");

/**
 * Content lines longer than 75 octets continue after CRLF and one space.
 * Cuts fall between characters, never inside a UTF-8 sequence.
 */
export const foldLine = (line: string) => {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  let limit = 75;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > limit) {
      parts.push(current);
      current = char;
      bytes = size;
      // The leading space of a continuation line counts toward its 75 octets.
      limit = 74;
    } else {
      current += char;
      bytes += size;
    }
  }
  parts.push(current);
  return parts.join("\r\n ");
};

/** "Mo–Sa 10:00–19:00, So geschlossen". Monday first; equal neighbours share one range. */
export const describeWeek = (locale: Locale, schedule: SalonSchedule = salonSchedule) => {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const label = (weekday: number) => {
    const intervals = schedule.week[weekday] ?? [];
    return intervals.length
      ? intervals.map((interval) => `${formatMinutes(interval.start)}–${formatMinutes(interval.end)}`).join(", ")
      : words[locale].closed;
  };
  const groups: { from: number; to: number; text: string }[] = [];
  for (const weekday of order) {
    const text = label(weekday);
    const last = groups[groups.length - 1];
    if (last && last.text === text) last.to = weekday;
    else groups.push({ from: weekday, to: weekday, text });
  }
  const days = shortDays[locale];
  return groups
    .map(({ from, to, text }) => `${from === to ? days[from] : `${days[from]}–${days[to]}`} ${text}`)
    .join(", ");
};

export const buildVCard = (locale: Locale, { photo }: { photo?: string | null } = {}) => {
  const word = words[locale];
  const note = `${word.hours}: ${describeWeek(locale)}. ${word.booking}: ${site.bookingUrl}`;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeText(site.name)};;;;`,
    `FN:${escapeText(site.name)}`,
    `ORG:${escapeText(site.legalName)}`,
    "X-ABShowAs:COMPANY",
    `TEL;TYPE=WORK,VOICE:${site.phoneTel}`,
    `EMAIL;TYPE=INTERNET,WORK:${site.email}`,
    `ADR;TYPE=WORK:;;${escapeText(site.street)};${escapeText(site.city)};;${site.postalCode};${escapeText(word.country)}`,
    `URL:${site.domain}${pathFor(locale)}`,
    `X-SOCIALPROFILE;TYPE=instagram:${site.instagramUrl}`,
    `NOTE:${escapeText(note)}`,
    ...(photo ? [`PHOTO;ENCODING=b;TYPE=PNG:${photo}`] : []),
    "END:VCARD",
  ];
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
};
