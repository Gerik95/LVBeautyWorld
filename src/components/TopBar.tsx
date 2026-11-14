"use client";

import Link from "next/link";
import { type AnimationEvent, type MouseEvent, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { IconInstagram, IconMailOpen } from "./BrandMarks";
import { t } from "@/content/messages";
import { localeSwitchPath, locales, pathFor, site, type Locale } from "@/lib/site";
import { LOCALE_COOKIE } from "@/lib/storage";
import { motion } from "@/skins/motion";

const langCodes: Record<Locale, string> = { de: "DE", uk: "UA" };
const langNames: Record<Locale, string> = { de: "Deutsch", uk: "Українська" };

const rememberLocale = (next: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
};

/** Same page in the other language. Plain links, so it also works before hydration. */
const LangSwitch = ({ locale, pathname }: { locale: Locale; pathname: string }) => (
  <nav className="topbar-lang" aria-label={t(locale).langLabel}>
    {locales.map((item) => {
      const current = item === locale;
      return (
        <Link
          key={item}
          href={localeSwitchPath(pathname, item)}
          hrefLang={item}
          lang={item}
          scroll={false}
          aria-label={langNames[item]}
          aria-current={current ? "true" : undefined}
          className={current ? "topbar-lang-opt is-current" : "topbar-lang-opt"}
          onClick={(event) => {
            if (current) {
              event.preventDefault();
              return;
            }
            rememberLocale(item);
          }}
        >
          {langCodes[item]}
        </Link>
      );
    })}
  </nav>
);

type BarPad = { left: number; right: number };

const readPad = (bar: HTMLElement): BarPad => {
  const style = getComputedStyle(bar);
  return {
    left: Number.parseFloat(style.paddingLeft) || 0,
    right: Number.parseFloat(style.paddingRight) || 0,
  };
};

const padsMatch = (a: BarPad, b: BarPad) =>
  Math.abs(a.left - b.left) < 0.5 && Math.abs(a.right - b.right) < 0.5;

const padFrame = (pad: BarPad) => ({
  paddingLeft: `${pad.left}px`,
  paddingRight: `${pad.right}px`,
});

export const TopBar = ({ locale, className = "" }: { locale: Locale; className?: string }) => {
  const copy = t(locale);
  const pathname = usePathname();
  const home = pathFor(locale);
  const barRef = useRef<HTMLElement>(null);
  const padRef = useRef<BarPad | null>(null);
  const slideRef = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let from = padRef.current;
    const running = slideRef.current;
    if (running) {
      from = readPad(bar);
      running.cancel();
      slideRef.current = null;
    }

    const to = readPad(bar);
    if (!from || reduced || padsMatch(from, to)) {
      padRef.current = to;
      return;
    }

    const slide = bar.animate([padFrame(from), padFrame(to)], {
      duration: motion.topbarMs,
      easing: "cubic-bezier(0.22, 0.8, 0.28, 1)",
      fill: "none",
    });
    slideRef.current = slide;

    const handleFinish = () => {
      if (slideRef.current !== slide) return;
      slideRef.current = null;
      padRef.current = to;
    };
    slide.addEventListener("finish", handleFinish);

    return () => {
      slide.removeEventListener("finish", handleFinish);
      if (slideRef.current !== slide) return;
      // A finished slide no longer overrides padding, and the next route's
      // class is already on the element. Keep the slide's own target.
      padRef.current = slide.playState === "finished" ? to : readPad(bar);
      slide.cancel();
      slideRef.current = null;
    };
  }, [pathname]);

  useLayoutEffect(() => {
    const handleResize = () => {
      const bar = barRef.current;
      if (!bar) return;
      slideRef.current?.cancel();
      slideRef.current = null;
      padRef.current = readPad(bar);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== home) return;
    event.preventDefault();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = event.currentTarget;
    node.classList.remove("is-shaking");
    void node.getBoundingClientRect();
    node.classList.add("is-shaking");
  };

  const handleBrandAnimationEnd = (event: AnimationEvent<HTMLAnchorElement>) => {
    if (event.animationName !== "brand-shake") return;
    event.currentTarget.classList.remove("is-shaking");
  };

  return (
    <header ref={barRef} className={`topbar ${className}`.trim()}>
      <Link
        href={home}
        className="topbar-brand"
        onClick={handleBrandClick}
        onAnimationEnd={handleBrandAnimationEnd}
      >
        {copy.brandMark}
      </Link>
      <div className="topbar-actions">
        <LangSwitch locale={locale} pathname={pathname} />
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy.instagramAria}
          className="topbar-icon mark-ig"
        >
          <IconInstagram markId="topbar" />
        </a>
        <Link href={pathFor(locale, "/contacts")} className="topbar-contact mark-mail" aria-label={copy.nav.contacts}>
          <IconMailOpen />
        </Link>
      </div>
    </header>
  );
};
