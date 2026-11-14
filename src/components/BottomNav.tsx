"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { t } from "@/content/messages";
import { clampLensLeft, DRAG_THRESHOLD_PX, resolveLensDrop, shouldSlideLens } from "@/lib/navLens";
import { smoothScrollTo } from "@/lib/smoothScroll";
import type { Locale } from "@/lib/site";
import { pathFor } from "@/lib/site";
import { motion } from "@/skins";
import { IconHome, IconMail, IconPrice, IconSliders, IconTeam } from "./icons";
import { NavAccentSlot } from "./NavAccentSlot";

const items = [
  { key: "home" as const, href: "/", Icon: IconHome },
  { key: "team" as const, href: "/team", Icon: IconTeam },
  { key: "prices" as const, href: "/prices", Icon: IconPrice },
  { key: "contacts" as const, href: "/contacts", Icon: IconMail },
  { key: "settings" as const, href: "/settings", Icon: IconSliders },
];

export const BottomNav = ({ locale }: { locale: Locale }) => {
  const pathname = usePathname();
  const router = useRouter();
  const copy = t(locale);
  const [hidden, setHidden] = useState(false);
  const dockRef = useRef<HTMLUListElement>(null);
  const lensRef = useRef<HTMLLIElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
  });

  const activeIndex = items.findIndex(({ href }) => {
    const full = pathFor(locale, href);
    if (href === "/") return pathname === full;
    return pathname === full || pathname.startsWith(`${full}/`);
  });
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;
  const indexRef = useRef<number | null>(null);

  const place = useCallback((index: number, animate: boolean) => {
    const dock = dockRef.current;
    const lens = lensRef.current;
    const link = itemRefs.current[index];
    if (!dock || !lens || !link || index < 0) return;
    const dockRect = dock.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    lens.classList.toggle("is-instant", !animate);
    lens.style.left = `${linkRect.left - dockRect.left}px`;
    lens.style.width = `${linkRect.width}px`;
    if (!animate) {
      lens.getBoundingClientRect();
      lens.classList.remove("is-instant");
    }
  }, []);

  useLayoutEffect(() => {
    if (dragRef.current.active || activeIndex < 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const slide = shouldSlideLens(indexRef.current, activeIndex, reduce);
    indexRef.current = activeIndex;
    place(activeIndex, slide);
  }, [activeIndex, place, locale, pathname]);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const measure = () => {
      if (dragRef.current.active) return;
      place(activeRef.current, false);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(dock);
    document.fonts?.ready.then(measure).catch(() => undefined);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [place]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const handleResize = () => {
      setHidden(window.innerHeight - viewport.height > 160);
    };
    viewport.addEventListener("resize", handleResize);
    return () => viewport.removeEventListener("resize", handleResize);
  }, []);

  const scrollHomeToTop = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, 0);
      return;
    }
    smoothScrollTo(0, motion.scrollMs);
  };

  const readRects = () =>
    itemRefs.current.flatMap((node) => {
      if (!node) return [];
      const rect = node.getBoundingClientRect();
      return [{ left: rect.left, width: rect.width }];
    });

  const onPointerDown = (event: PointerEvent<HTMLLIElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLLIElement>) => {
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < DRAG_THRESHOLD_PX) return;
    drag.moved = true;
    const dock = dockRef.current;
    const lens = lensRef.current;
    const rects = readRects();
    if (!dock || !lens || !rects.length) return;
    const dockRect = dock.getBoundingClientRect();
    const first = rects[0];
    const last = rects[rects.length - 1];
    const minLeft = first.left - dockRect.left;
    const maxLeft = last.left + last.width - first.left - lens.offsetWidth + (first.left - dockRect.left);
    lens.classList.add("is-drag");
    lens.style.left = `${clampLensLeft(event.clientX, dockRect.left, lens.offsetWidth, minLeft, Math.max(minLeft, maxLeft))}px`;
  };

  const finish = (event: PointerEvent<HTMLLIElement>, cancelled: boolean) => {
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    const moved = drag.moved;
    drag.active = false;
    drag.moved = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const lens = lensRef.current;
    lens?.classList.remove("is-drag");
    lens?.getBoundingClientRect();
    const decision = resolveLensDrop({
      moved,
      cancelled,
      pointerX: event.clientX,
      rects: readRects(),
      activeIndex: activeRef.current,
    });
    place(decision.index, true);
    if (!moved && !cancelled && items[activeRef.current]?.key === "home") scrollHomeToTop();
    if (!decision.navigate) return;
    const dock = dockRef.current;
    const stopClick = (click: Event) => {
      click.preventDefault();
      click.stopPropagation();
    };
    dock?.addEventListener("click", stopClick, { capture: true, once: true });
    window.setTimeout(() => dock?.removeEventListener("click", stopClick, true), 500);
    const href = items[decision.index]?.href;
    if (href) router.push(pathFor(locale, href));
  };

  return (
    <nav aria-label={copy.navLabel} className={`dock-wrap${hidden ? " is-hidden" : ""}`}>
      <ul
        ref={dockRef}
        className="dock"
        style={
          {
            "--nav-index": Math.max(activeIndex, 0),
            "--lens-ms": `${motion.lensMs}ms`,
          } as CSSProperties
        }
      >
        <NavAccentSlot />
        <li
          ref={lensRef}
          className={`dock-lens${activeIndex < 0 ? " is-hidden" : ""}`}
          aria-hidden="true"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(event) => finish(event, false)}
          onPointerCancel={(event) => finish(event, true)}
        />
        {items.map(({ key, href, Icon }, index) => {
          const full = pathFor(locale, href);
          const current = activeIndex === index;
          const label = copy.nav[key];
          const short = key in copy.navShort ? copy.navShort[key as keyof typeof copy.navShort] : null;
          return (
            <li key={key} className="flex min-w-0 flex-1">
              <Link
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                href={full}
                aria-current={current ? "page" : undefined}
                aria-label={label}
                className="dock-link"
                onClick={(event) => {
                  if (!current) return;
                  event.preventDefault();
                  if (key === "home") scrollHomeToTop();
                }}
              >
                <Icon className="h-5 w-5" />
                <span className="dock-label" data-locale={locale}>
                  {short ? (
                    <>
                      <span className="dock-label-full">{label}</span>
                      <span className="dock-label-short">{short}</span>
                    </>
                  ) : (
                    label
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
