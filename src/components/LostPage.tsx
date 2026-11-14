"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { t } from "@/content/messages";
import { defaultLocale, isLocale, pathFor, type Locale } from "@/lib/site";
import { resolveEffects } from "@/skins";
import { HeroDecorSlot } from "./hero/HeroDecorSlot";
import { HeroSpotlight } from "./hero/HeroSpotlight";
import { LogoMark, lostArt } from "./hero/LogoMark";
import { useLampIgnition } from "./hero/useLampIgnition";

/** `not-found` gets no params. The first path segment is the language. */
const localeFromPath = (pathname: string | null): Locale => {
  const first = pathname?.split("/")[1] ?? "";
  return isLocale(first) ? first : defaultLocale;
};

/**
 * 404 in the language of the home hero: the same stage, the same lamp curve,
 * rim and halo, and in the dark theme the same spotlight. Only the artwork
 * differs: 404 drawn in the strokes of the brand mark.
 */
export const LostPage = () => {
  const locale = localeFromPath(usePathname());
  const copy = t(locale);
  const heroRef = useRef<HTMLElement>(null);
  const [showSpot, setShowSpot] = useState(false);
  useLampIgnition(heroRef);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setShowSpot(root.dataset.theme === "dark" && resolveEffects().spotlight);
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="hero lost-hero" aria-labelledby="lost-title">
      <title>{`${copy.notFound} | LV Beauty World`}</title>
      {resolveEffects().spotlight ? (
        <div className="hero-spot" aria-hidden="true">
          <div className="hero-beam" data-beam="" />
        </div>
      ) : null}
      {showSpot ? <HeroSpotlight heroRef={heroRef} /> : null}
      <HeroDecorSlot />
      <div className="hero-stage">
        <div className="logo-slot lost-slot">
          <LogoMark art={lostArt} />
        </div>
        <div className="hero-copy">
          <p className="hero-kicker">{copy.lostKicker}</p>
          <h1 id="lost-title" className="hero-title">
            <span className="block">{copy.lostLine1}</span>
            <span className="block">{copy.lostLine2}</span>
          </h1>
          <p className="hero-lead">{copy.lostLead}</p>
          <div className="hero-actions">
            <Link
              href={pathFor(locale)}
              data-beam-target=""
              className="book-btn ui-hover inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-5 text-sm font-semibold tracking-wide"
            >
              <span className="book-btn-label">{copy.lostHome}</span>
              <span className="book-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <nav className="lost-links" aria-label={copy.navLabel}>
              <Link className="discover ui-inline" href={pathFor(locale, "/prices")}>
                {copy.nav.prices}
              </Link>
              <Link className="discover ui-inline" href={pathFor(locale, "/contacts")}>
                {copy.nav.contacts}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};
