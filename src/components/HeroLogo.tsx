"use client";

import { useEffect, useState } from "react";
import { HERO_KEY } from "@/lib/storage";

export const HeroLogo = () => {
  const [state, setState] = useState<"idle" | "playing" | "steady">("idle");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setState("steady");
      return;
    }
    try {
      if (sessionStorage.getItem(HERO_KEY) === "1") {
        setState("steady");
        return;
      }
      sessionStorage.setItem(HERO_KEY, "1");
    } catch {
      /* ignore */
    }
    setState("playing");
    const timer = window.setTimeout(() => setState("steady"), 2100);
    return () => window.clearTimeout(timer);
  }, []);

  const cls =
    state === "playing" ? "is-playing" : state === "steady" ? "is-steady" : "";

  return (
    <div className="relative mx-auto flex w-full max-w-[18rem] items-center justify-center sm:max-w-[22rem]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo.svg"
        alt=""
        width={512}
        height={512}
        className={`logo-backlight logo-on-light h-auto w-full ${cls}`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-white.svg"
        alt="LV Beauty World"
        width={512}
        height={512}
        className={`logo-backlight logo-on-dark h-auto w-full ${cls}`}
      />
    </div>
  );
};
