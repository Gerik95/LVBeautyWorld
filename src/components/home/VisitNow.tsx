"use client";

import { useEffect, useState } from "react";
import { salonSchedule } from "@/content/schedule";
import { readHours } from "@/lib/hours";
import { describeHours, hoursStatusLabel } from "@/lib/hoursText";
import type { Locale } from "@/lib/site";

export const VisitNow = ({ locale }: { locale: Locale }) => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer = 0;
    const tick = () => setNow(new Date());
    const start = () => {
      tick();
      timer = window.setInterval(tick, 30_000);
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
  const label = reading ? hoursStatusLabel(locale, reading.status) : "";
  const detail = reading ? describeHours(locale, reading) : "";

  return (
    <p
      className="hours-status visit-now"
      data-status={reading && reading.status !== "unknown" ? reading.status : undefined}
    >
      {label ? <span className="hours-status-label">{label}</span> : null}
      <span className="hours-status-detail">{detail || "\u00a0"}</span>
    </p>
  );
};
