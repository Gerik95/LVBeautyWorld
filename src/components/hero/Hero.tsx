"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { smoothScrollToElement } from "@/lib/smoothScroll";
import type { Locale } from "@/lib/site";
import { motion, resolveEffects } from "@/skins";
import { BookButton } from "../BookButton";
import { HeroDecorSlot } from "./HeroDecorSlot";
import { HeroSpotlight } from "./HeroSpotlight";
import { LogoMark } from "./LogoMark";
import { useLampIgnition } from "./useLampIgnition";

export const Hero = ({
  locale,
  kicker,
  line1,
  line2,
  lead,
  discover,
}: {
  locale: Locale;
  kicker: string;
  line1: string;
  line2: string;
  lead: string;
  discover: string;
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const [showSpot, setShowSpot] = useState(false);
  useLampIgnition(heroRef);

  const handleDiscover = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById("services");
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) target.scrollIntoView({ behavior: "auto", block: "start" });
    else smoothScrollToElement(target, motion.scrollMs);
    if (window.location.hash !== "#services") window.history.pushState(null, "", "#services");
  };

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      setShowSpot(root.dataset.theme === "dark" && resolveEffects().spotlight);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="hero" aria-labelledby="hero-title">
      {resolveEffects().spotlight ? (
        <div className="hero-spot" aria-hidden="true">
          <div className="hero-beam" data-beam="" />
        </div>
      ) : null}
      {showSpot ? <HeroSpotlight heroRef={heroRef} /> : null}
      <HeroDecorSlot />
      <div className="hero-stage">
        <div className="logo-slot">
          <LogoMark />
        </div>
        <div className="hero-copy">
          <p className="hero-kicker">{kicker}</p>
          <h1 id="hero-title" className="hero-title">
            <span className="block">{line1}</span>
            <span className="block">{line2}</span>
          </h1>
          <p className="hero-lead">{lead}</p>
          <div className="hero-actions">
            <BookButton locale={locale} beam />
            <a className="discover ui-inline" href="#services" onClick={handleDiscover}>
              {discover}
              <span className="discover-chevron" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
