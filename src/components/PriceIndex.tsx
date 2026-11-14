"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";

/** Same breakpoint as `.price-layout` in globals.css: a side column from here on. */
const SIDE = "(min-width: 1024px)";

export type PriceIndexCategory = {
  id: string;
  label: string;
};

/**
 * Category index for the price list. Below 1024px a sticky row of chips that
 * scrolls sideways; from 1024px a sticky column beside the list. One lens
 * marks the section in view and glides between items in both forms.
 */
export const PriceIndex = ({
  label,
  categories,
}: {
  label: string;
  categories: PriceIndexCategory[];
}) => {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const trackRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLSpanElement>(null);
  const linkRef = useRef(new Map<string, HTMLAnchorElement>());
  const placed = useRef(false);
  /** A clicked category stays marked while the page glides to it, until the visitor scrolls. */
  const pinned = useRef<string | null>(null);
  const activeRef = useRef(activeId);
  activeRef.current = activeId;

  const place = useCallback((id: string, animate: boolean) => {
    const track = trackRef.current;
    const lens = lensRef.current;
    const link = linkRef.current.get(id);
    if (!track || !lens || !link) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const side = window.matchMedia(SIDE).matches;
    lens.classList.toggle("is-instant", !animate || reduce);
    lens.style.left = `${link.offsetLeft}px`;
    lens.style.width = `${link.offsetWidth}px`;
    lens.style.top = side ? `${link.offsetTop}px` : "";
    lens.style.height = side ? `${link.offsetHeight}px` : "";
    lens.classList.add("is-ready");
    if (side) return;
    const next = link.offsetLeft - (track.clientWidth - link.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(0, next), behavior: animate && !reduce ? "smooth" : "auto" });
  }, []);

  useLayoutEffect(() => {
    if (!activeId) return;
    place(activeId, placed.current);
    placed.current = true;
  }, [activeId, place]);

  useEffect(() => {
    const sideQuery = window.matchMedia(SIDE);
    let frame = 0;

    const read = () => {
      frame = 0;
      const side = sideQuery.matches;
      // The chip row covers the top of the window; the side column does not.
      const line = side
        ? window.innerHeight * 0.3
        : (trackRef.current?.getBoundingClientRect().bottom ?? 0) + 12;
      let current = categories[0]?.id ?? "";
      for (const category of categories) {
        const section = document.getElementById(category.id);
        if (!section) continue;
        if (section.getBoundingClientRect().top <= line) current = category.id;
      }
      // The last short sections may never reach the line; a click keeps its choice.
      if (pinned.current) current = pinned.current;
      setActiveId((previous) => (previous === current ? previous : current));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    const relayout = () => {
      place(activeRef.current, false);
      schedule();
    };

    const release = () => {
      pinned.current = null;
    };

    schedule();
    sideQuery.addEventListener("change", relayout);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", relayout);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    window.addEventListener("keydown", release);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      sideQuery.removeEventListener("change", relayout);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", relayout);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("keydown", release);
    };
  }, [categories, place]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${id}`);
    pinned.current = id;
    setActiveId(id);
  };

  if (categories.length === 0) return null;

  return (
    <nav className="price-index" aria-label={label}>
      <div className="price-index-track" ref={trackRef}>
        <span className="price-index-lens" ref={lensRef} aria-hidden="true" />
        {categories.map((category) => {
          const current = category.id === activeId;
          return (
            <a
              key={category.id}
              href={`#${category.id}`}
              ref={(node) => {
                if (node) linkRef.current.set(category.id, node);
                else linkRef.current.delete(category.id);
              }}
              className={current ? "is-current" : undefined}
              aria-current={current ? "location" : undefined}
              onClick={(event) => handleClick(event, category.id)}
            >
              {category.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
};
