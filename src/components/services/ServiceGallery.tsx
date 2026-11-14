"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { homeServiceIds, homeServices, serviceGalleryImage, type HomeServiceId, type Service } from "@/content/services";
import { t } from "@/content/messages";
import { GALLERY_IMAGE_SIZES, formatGalleryCount, isHomeServiceId, readCssMs, resolveStoredService } from "@/lib/serviceGallery";
import { SERVICE_KEY, SERVICE_SEEN_KEY } from "@/lib/storage";
import { pathFor, type Locale } from "@/lib/site";
import { galleryMotion } from "@/skins";
import { ServicePhoto, type WavePointer } from "./ServicePhoto";

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

const readStoredId = () => {
  try {
    return sessionStorage.getItem(SERVICE_KEY);
  } catch {
    return null;
  }
};

const writeStoredId = (id: HomeServiceId) => {
  try {
    sessionStorage.setItem(SERVICE_KEY, id);
  } catch {
    /* The tab may block storage. The open service still works for this view. */
  }
};

const rememberSeen = () => {
  try {
    sessionStorage.setItem(SERVICE_SEEN_KEY, "1");
  } catch {
    /* Entrance can play again next time. The list does not stay hidden. */
  }
  document.documentElement.dataset.svcSeen = "1";
};

const warmImage = (service: Service, warmed: Set<string>) => {
  const src = serviceGalleryImage(service);
  if (!src || warmed.has(service.id)) return;
  warmed.add(service.id);
  try {
    const { props } = getImageProps({
      alt: "",
      src,
      fill: true,
      sizes: GALLERY_IMAGE_SIZES,
    });
    const img = new Image();
    if (props.srcSet) img.srcset = props.srcSet;
    if (props.sizes) img.sizes = props.sizes;
    img.src = props.src;
  } catch {
    warmed.delete(service.id);
  }
};

const offsetWithin = (element: HTMLElement, ancestor: HTMLElement) => {
  let top = 0;
  let node: HTMLElement | null = element;
  while (node && node !== ancestor) {
    top += node.offsetTop;
    const parent: Element | null = node.offsetParent;
    if (!(parent instanceof HTMLElement)) break;
    node = parent;
  }
  return top;
};

const IconArrow = () => (
  <svg className="svc-arrow" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M4.2 11.8 11.8 4.2M6.4 4.2H11.8V9.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconExpand = () => (
  <svg className="svc-expand" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.8 6.2 8 10.2l4.2-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ServiceGallery = ({ locale }: { locale: Locale }) => {
  const copy = t(locale);
  const items = homeServices();
  const total = items.length;
  const [activeId, setActiveId] = useState<HomeServiceId>(homeServiceIds[0]);
  const [enhanced, setEnhanced] = useState(false);
  const [gleamToken, setGleamToken] = useState(0);
  const [entered, setEntered] = useState<"idle" | "pending" | "shown">("idle");
  const layoutRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const pointerRef = useRef<WavePointer | null>(null);
  const anchorTop = useRef<number | null>(null);
  const touchRef = useRef<{ id: string; x: number; y: number; at: number } | null>(null);
  const [touchOrigin, setTouchOrigin] = useState<{ id: string; x: number; y: number } | null>(null);
  const warmed = useRef(new Set<string>());
  useLayoutEffect(() => {
    const stored = resolveStoredService(readStoredId());
    if (stored !== homeServiceIds[0]) setActiveId(stored);
    setEnhanced(true);
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (root.dataset.svcSeen === "1") return;
    if (window.matchMedia(REDUCE_MOTION).matches) return;
    const list = listRef.current;
    if (!list) return;
    setEntered("pending");
    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setEntered("shown");
      rememberSeen();
    };
    const safety = window.setTimeout(show, 1400);
    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) show();
        },
        { threshold: 0.18 },
      );
      observer.observe(list);
    } catch {
      show();
    }
    return () => {
      observer?.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  useLayoutEffect(() => {
    const layout = layoutRef.current;
    if (!layout) return;
    let raf = 0;
    let stopped = false;
    const measure = () => {
      const item = layout.querySelector<HTMLElement>(".svc-item.is-open");
      const head = item?.querySelector<HTMLElement>(".svc-heading");
      const panel = item?.querySelector<HTMLElement>(".svc-panel");
      if (!item || !head || !panel) return;
      const frame = item.querySelector<HTMLElement>(".svc-frame");
      const inFlow = !!frame && getComputedStyle(frame).position !== "absolute";
      const top = offsetWithin(head, layout);
      const bottom = inFlow ? top + head.offsetHeight : offsetWithin(panel, layout) + panel.offsetHeight;
      const height = Math.max(head.offsetHeight * 0.45, bottom - top);
      layout.style.setProperty("--svc-marker-y", `${top}px`);
      layout.style.setProperty("--svc-marker-h", `${height}px`);
    };
    measure();
    const reduce = window.matchMedia(REDUCE_MOTION).matches;
    const duration = reduce
      ? 0
      : readCssMs(getComputedStyle(document.documentElement).getPropertyValue("--svc-panel-ms"), galleryMotion.panelMs);
    const started = performance.now();
    const step = () => {
      if (stopped) return;
      measure();
      if (performance.now() - started < duration) raf = window.requestAnimationFrame(step);
    };
    if (duration > 0) step();
    const observer = new ResizeObserver(() => measure());
    observer.observe(layout);
    const panel = layout.querySelector(".svc-item.is-open .svc-panel");
    if (panel) observer.observe(panel);
    let dropFonts = false;
    const fonts = document.fonts;
    fonts?.ready.then(() => {
      if (!dropFonts) measure();
    });
    const reduceQuery = window.matchMedia(REDUCE_MOTION);
    const handleReduce = () => {
      if (reduceQuery.matches) stopped = true;
      measure();
    };
    reduceQuery.addEventListener("change", handleReduce);
    return () => {
      stopped = true;
      dropFonts = true;
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      reduceQuery.removeEventListener("change", handleReduce);
    };
  }, [activeId]);

  useLayoutEffect(() => {
    const anchor = anchorTop.current;
    anchorTop.current = null;
    if (anchor == null) return;
    const button = document.getElementById(`svc-button-${activeId}`);
    if (!button) return;
    const reduce = window.matchMedia(REDUCE_MOTION).matches;
    const duration = reduce
      ? 0
      : readCssMs(getComputedStyle(document.documentElement).getPropertyValue("--svc-panel-ms"), galleryMotion.panelMs);
    const section = document.getElementById("services");
    const parsedInset = section ? Number.parseFloat(getComputedStyle(section).scrollMarginTop) : 16;
    const inset = Number.isFinite(parsedInset) ? parsedInset : 16;
    let raf = 0;
    let stopped = false;
    const started = performance.now();
    const halt = () => {
      stopped = true;
    };
    const step = () => {
      if (stopped) return;
      const top = button.getBoundingClientRect().top;
      if (top < inset) window.scrollBy(0, top - inset);
      if (performance.now() - started < duration) raf = window.requestAnimationFrame(step);
    };
    step();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "PageUp" || event.key === "PageDown" || event.key === "Home" || event.key === "End") {
        halt();
      }
    };
    window.addEventListener("wheel", halt, { passive: true });
    window.addEventListener("touchmove", halt, { passive: true });
    window.addEventListener("keydown", handleKey);
    return () => {
      stopped = true;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("wheel", halt);
      window.removeEventListener("touchmove", halt);
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeId]);

  const handleSelect = (id: string) => {
    if (!isHomeServiceId(id) || id === activeId) return;
    const closing = document.getElementById(`svc-panel-${activeId}`);
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && closing?.contains(focused)) {
      document.getElementById(`svc-button-${activeId}`)?.focus();
    }
    const nextButton = document.getElementById(`svc-button-${id}`);
    anchorTop.current = nextButton?.getBoundingClientRect().top ?? null;
    const touch = touchRef.current;
    touchRef.current = null;
    const fresh = touch !== null && touch.id === id && performance.now() - touch.at < 900;
    setTouchOrigin(fresh ? { id: touch.id, x: touch.x, y: touch.y } : null);
    writeStoredId(id);
    setGleamToken((current) => current + 1);
    setActiveId(id);
  };

  const handleWarm = (service: Service, event?: ReactPointerEvent<HTMLButtonElement>) => {
    if (event && event.pointerType === "touch") return;
    warmImage(service, warmed.current);
  };

  return (
    <div className="svc-layout" ref={layoutRef}>
      <span className="svc-marker" aria-hidden="true" />
      <h2 id="services-title" className="svc-title">
        {copy.facetsTitle}
      </h2>
      <ol
        ref={listRef}
        className={cx("svc-list", entered === "pending" && "is-pending", entered === "shown" && "is-shown")}
      >
        {items.map((service, index) => {
          const open = service.id === activeId;
          const href = pathFor(locale, `/services/${service.id}`);
          const number = String(index + 1).padStart(2, "0");
          return (
            <li
              key={service.id}
              className={open ? "svc-item is-open" : "svc-item"}
              style={{ "--i": index } as CSSProperties}
            >
              <h3 className="svc-heading">
                <button
                  type="button"
                  id={`svc-button-${service.id}`}
                  aria-expanded={open}
                  aria-controls={`svc-panel-${service.id}`}
                  aria-disabled={open ? true : undefined}
                  aria-label={service.name[locale]}
                  onClick={() => handleSelect(service.id)}
                  onPointerEnter={(event) => handleWarm(service, event)}
                  onFocus={() => handleWarm(service)}
                  onPointerDown={(event) => {
                    if (event.pointerType !== "mouse") warmImage(service, warmed.current);
                    if (event.pointerType !== "touch") return;
                    touchRef.current = {
                      id: service.id,
                      x: event.pageX,
                      y: event.pageY,
                      at: performance.now(),
                    };
                  }}
                >
                  <span className="svc-index" aria-hidden="true">
                    {number}
                  </span>
                  <span className="svc-name">{service.name[locale]}</span>
                  {open ? (
                    <span className="svc-expand-slot" aria-hidden="true" />
                  ) : (
                    <span className="svc-expand-slot" aria-hidden="true">
                      <IconExpand />
                    </span>
                  )}
                </button>
              </h3>
              {open ? (
                <ServicePhoto
                  service={service}
                  locale={locale}
                  countLabel={formatGalleryCount(index, total)}
                  href={href}
                  linkLabel={copy.galleryPhotoLink}
                  unavailable={copy.galleryPhotoError}
                  gleamToken={gleamToken}
                  pointerRef={pointerRef}
                  touchOrigin={touchOrigin && touchOrigin.id === service.id ? touchOrigin : null}
                />
              ) : null}
              <div
                id={`svc-panel-${service.id}`}
                role="region"
                aria-labelledby={`svc-button-${service.id}`}
                className="svc-panel"
                inert={enhanced && !open ? true : undefined}
                aria-hidden={enhanced && !open ? true : undefined}
              >
                <div className="svc-panel-body">
                  <div className="svc-panel-inner">
                    <p>{service.short[locale]}</p>
                    <Link className="svc-more" href={href}>
                      {copy.more}
                      <IconArrow />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
