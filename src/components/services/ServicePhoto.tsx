"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type MutableRefObject, type PointerEvent as ReactPointerEvent } from "react";
import type { Service } from "@/content/services";
import { serviceGalleryImage } from "@/content/services";
import { GALLERY_IMAGE_SIZES, WAVE_COVER, readCssMs, shouldResetWaveOrigin } from "@/lib/serviceGallery";
import type { Locale } from "@/lib/site";

export type WavePointer = { x: number; y: number; type: string };

type ServicePhotoProps = {
  service: Service;
  locale: Locale;
  countLabel: string;
  href: string;
  linkLabel: string;
  unavailable: string;
  gleamToken: number;
  pointerRef: MutableRefObject<WavePointer | null>;
  touchOrigin: { x: number; y: number } | null;
};

const FINE_HOVER = "(hover: hover) and (pointer: fine)";
const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

const supportsWave = () => {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  const mask = CSS.supports("mask-image", "radial-gradient(circle at 0 0, #000 20%, transparent 20%)");
  const property = typeof CSS.registerProperty === "function" || typeof CSSPropertyRule !== "undefined";
  return mask && property;
};

const percentIn = (frame: HTMLElement, clientX: number, clientY: number) => {
  const rect = frame.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return { x: 50, y: 50 };
  const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
  return { x, y };
};

const IconArrow = () => (
  <svg className="svc-arrow" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4.2 11.8 11.8 4.2M6.4 4.2H11.8V9.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ServicePhoto = ({
  service,
  locale,
  countLabel,
  href,
  linkLabel,
  unavailable,
  gleamToken,
  pointerRef,
  touchOrigin,
}: ServicePhotoProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const serviceIdRef = useRef(service.id);
  serviceIdRef.current = service.id;
  const [readyId, setReadyId] = useState<string | null>(null);
  const [failedId, setFailedId] = useState<string | null>(null);
  const image = serviceGalleryImage(service);
  const position = service.objectPosition ?? "center";
  const ready = readyId === service.id && !failedId;
  const failed = failedId === service.id;
  const quiet = !image;

  useEffect(() => {
    setReadyId((current) => (current === service.id ? current : null));
    setFailedId(null);
  }, [service.id]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || gleamToken < 1) return;
    if (window.matchMedia(REDUCE_MOTION).matches) return;
    if (document.documentElement.dataset.theme !== "dark") return;
    frame.classList.remove("is-gleam");
    void frame.offsetWidth;
    frame.classList.add("is-gleam");
    const handleEnd = () => frame.classList.remove("is-gleam");
    frame.addEventListener("animationend", handleEnd);
    return () => {
      frame.removeEventListener("animationend", handleEnd);
      frame.classList.remove("is-gleam");
    };
  }, [gleamToken, service.id]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const reduceQuery = window.matchMedia(REDUCE_MOTION);
    const fineQuery = window.matchMedia(FINE_HOVER);
    let rect = frame.getBoundingClientRect();

    const refreshRect = () => {
      rect = frame.getBoundingClientRect();
    };

    const syncMode = () => {
      const reduce = reduceQuery.matches;
      const mouse = pointerRef.current?.type === "mouse";
      const fine = fineQuery.matches || mouse;
      if (reduce || !fine) {
        delete document.documentElement.dataset.svcWave;
        frame.dataset.wave = "off";
        return;
      }
      document.documentElement.dataset.svcWave = "on";
      frame.dataset.wave = supportsWave() ? "on" : "off";
    };

    const writeOrigin = (x: number, y: number) => {
      frame.style.setProperty("--svc-x", `${x}%`);
      frame.style.setProperty("--svc-y", `${y}%`);
    };

    const openWave = (reset: boolean) => {
      if (frame.dataset.wave !== "on" || pointerRef.current?.type !== "mouse") return;
      const radius = Number.parseFloat(getComputedStyle(frame).getPropertyValue("--svc-wave"));
      const pointer = pointerRef.current;
      if (reset || shouldResetWaveOrigin(radius)) writeOrigin(pointer.x, pointer.y);
      if (reset) {
        frame.style.setProperty("--svc-wave-ms", "0ms");
        frame.style.setProperty("--svc-wave", "0%");
        void frame.offsetWidth;
      }
      frame.style.removeProperty("--svc-wave-ms");
      frame.dataset.dir = "in";
      frame.style.setProperty("--svc-wave", WAVE_COVER);
    };

    const closeWave = () => {
      frame.dataset.dir = "out";
      frame.style.removeProperty("--svc-wave-ms");
      frame.style.setProperty("--svc-wave", "0%");
    };

    const remember = (event: PointerEvent) => {
      refreshRect();
      const point = percentIn(frame, event.clientX, event.clientY);
      pointerRef.current = { ...point, type: event.pointerType };
      rect = frame.getBoundingClientRect();
    };

    const handleEnter = (event: PointerEvent) => {
      remember(event);
      syncMode();
      if (event.pointerType === "mouse") openWave(false);
    };

    const handleLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      closeWave();
    };

    const handleMove = (event: PointerEvent) => {
      if (rect.width <= 0) refreshRect();
      const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));
      pointerRef.current = { x, y, type: event.pointerType };
    };

    const handleScroll = () => refreshRect();

    syncMode();
    if (frame.matches(":hover") && pointerRef.current?.type === "mouse") openWave(true);

    frame.addEventListener("pointerenter", handleEnter);
    frame.addEventListener("pointerleave", handleLeave);
    frame.addEventListener("pointermove", handleMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    fineQuery.addEventListener("change", syncMode);
    reduceQuery.addEventListener("change", syncMode);

    return () => {
      frame.removeEventListener("pointerenter", handleEnter);
      frame.removeEventListener("pointerleave", handleLeave);
      frame.removeEventListener("pointermove", handleMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      fineQuery.removeEventListener("change", syncMode);
      reduceQuery.removeEventListener("change", syncMode);
    };
  }, [pointerRef, service.id]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !touchOrigin || !ready) return;
    if (window.matchMedia(REDUCE_MOTION).matches) return;
    if (window.matchMedia(FINE_HOVER).matches) return;
    if (!supportsWave()) return;

    let raf = 0;
    let attempts = 0;
    let timer = 0;
    let stopped = false;

    const settle = () => {
      frame.dataset.wave = "off";
      frame.style.removeProperty("--svc-wave");
      frame.style.removeProperty("--svc-wave-ms");
    };

    const open = () => {
      if (stopped) return;
      const rect = frame.getBoundingClientRect();
      if ((rect.width < 2 || rect.height < 2) && attempts < 8) {
        attempts += 1;
        raf = window.requestAnimationFrame(open);
        return;
      }
      if (rect.width < 2 || rect.height < 2) return;
      const x = touchOrigin.x - window.scrollX;
      const y = touchOrigin.y - window.scrollY;
      const px = Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100));
      const py = Math.min(100, Math.max(0, ((y - rect.top) / rect.height) * 100));
      frame.style.setProperty("--svc-x", `${px}%`);
      frame.style.setProperty("--svc-y", `${py}%`);
      frame.dataset.wave = "on";
      frame.dataset.dir = "in";
      frame.style.setProperty("--svc-wave-ms", "0ms");
      frame.style.setProperty("--svc-wave", "0%");
      void frame.offsetWidth;
      frame.style.removeProperty("--svc-wave-ms");
      frame.style.setProperty("--svc-wave", WAVE_COVER);
      const ms = readCssMs(getComputedStyle(document.documentElement).getPropertyValue("--svc-wave-in-ms"), 1500);
      timer = window.setTimeout(() => {
        if (!stopped) settle();
      }, ms + 40);
    };

    open();
    return () => {
      stopped = true;
      if (raf) window.cancelAnimationFrame(raf);
      if (timer) window.clearTimeout(timer);
      settle();
    };
  }, [ready, service.id, touchOrigin]);

  const handleLoad = (id: string) => () => {
    if (serviceIdRef.current !== id) return;
    setFailedId((current) => (current === id ? null : current));
    setReadyId(id);
  };

  const handleError = (id: string) => () => {
    if (serviceIdRef.current !== id) return;
    setReadyId(null);
    setFailedId(id);
  };

  const handlePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") {
      const frame = frameRef.current;
      if (frame) frame.dataset.wave = "off";
      delete document.documentElement.dataset.svcWave;
    }
  };

  return (
    <div
      ref={frameRef}
      className={quiet ? "svc-frame is-quiet" : failed ? "svc-frame is-failed" : "svc-frame"}
      style={{ "--svc-pos": position } as CSSProperties}
      onPointerDown={handlePointer}
    >
      {image && !failed ? (
        <div className={ready ? "svc-photo-stack is-ready" : "svc-photo-stack"} aria-hidden={!ready}>
          <Image
            src={image}
            alt=""
            fill
            sizes={GALLERY_IMAGE_SIZES}
            loading="eager"
            fetchPriority="low"
            draggable={false}
            className="svc-photo-mono"
            style={{ objectPosition: position }}
          />
          <Image
            src={image}
            alt={service.imageAlt[locale]}
            fill
            sizes={GALLERY_IMAGE_SIZES}
            loading="eager"
            fetchPriority="low"
            draggable={false}
            className="svc-photo-color"
            style={{ objectPosition: position }}
            onLoad={handleLoad(service.id)}
            onError={handleError(service.id)}
          />
        </div>
      ) : null}
      {failed ? (
        <p className="svc-photo-missing" role="status">
          {unavailable}
        </p>
      ) : null}
      <div className="svc-shot-scrim" aria-hidden="true" />
      <div className="svc-shot-top" aria-hidden="true">
        <span className="svc-shot-count">{countLabel}</span>
        <span className="svc-shot-name">{service.name[locale]}</span>
      </div>
      <Link className="svc-glass" href={href} aria-label={`${linkLabel}: ${service.name[locale]}`}>
        <IconArrow />
      </Link>
    </div>
  );
};
