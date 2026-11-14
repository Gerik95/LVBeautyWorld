"use client";

import { useEffect, useState } from "react";
import { salonSchedule } from "@/content/schedule";
import { t } from "@/content/messages";
import { formatClock, formatInterval, readHours, weekRowIntervals } from "@/lib/hours";
import { describeHours, hoursStatusLabel } from "@/lib/hoursText";
import type { Locale } from "@/lib/site";

const weekdayOrder = [1, 2, 3, 4, 5, 6, 0];

export const HoursPanel = ({ locale }: { locale: Locale }) => {
  const copy = t(locale);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer = 0;
    const tick = () => setNow(new Date());
    const start = () => {
      tick();
      timer = window.setInterval(tick, 1000);
    };
    const stop = () => window.clearInterval(timer);
    const onVisibility = () => {
      stop();
      if (!document.hidden) start();
    };
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const reading = now ? readHours(salonSchedule, now) : null;
  const today = reading?.today ?? null;
  const statusLabel = reading ? hoursStatusLabel(locale, reading.status) : "";
  const detail = reading ? describeHours(locale, reading) : "";

  return (
    <section className="hours-panel" aria-labelledby="hours-title">
      <div>
        <h2 id="hours-title" className="font-display text-2xl">
          {copy.hoursTitle}
        </h2>
        {salonSchedule.confirmed ? (
          <ol className="hours-week">
            {weekdayOrder.map((weekday) => {
              const intervals = weekRowIntervals(salonSchedule, weekday, today);
              const isToday = today?.weekday === weekday;
              return (
                <li key={weekday} className={isToday ? "is-today" : undefined}>
                  <span>{copy.weekdays[weekday]}</span>
                  <span>{intervals.length ? intervals.map(formatInterval).join(", ") : copy.hoursClosed}</span>
                </li>
              );
            })}
          </ol>
        ) : (
          <p>{copy.hoursAsk}</p>
        )}
      </div>
      <div className="hours-live">
        <p className="hours-clock" aria-hidden="true">
          {reading ? formatClock(reading.clock) : "--:--:--"}
        </p>
        <p className="hours-clock-label">{copy.clockLabel}</p>
        {reading && reading.status !== "unknown" ? (
          <p className="hours-status" data-status={reading.status}>
            <span className="hours-status-label">{statusLabel}</span>
            <span className="hours-status-detail">{detail}</span>
          </p>
        ) : null}
      </div>
    </section>
  );
};
