"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Photo } from "@/components/Photo";
import { IconChevron } from "@/components/icons";

const ROTATE_MS = 8000;
const AXIS_LOCK = 8;
const EDGE = 0.34;

export type ServicePhotoSlide = {
  src: string;
  alt: string;
  objectPosition?: string;
};

type ServicePhotosProps = {
  photos: ServicePhotoSlide[];
  prevLabel: string;
  nextLabel: string;
};

type Drag = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  axis: "x" | "y" | null;
};

const swipeDistance = (width: number) => Math.min(72, Math.max(28, width * 0.12));

const edgeAt = (frame: HTMLDivElement, clientX: number) => {
  const rect = frame.getBoundingClientRect();
  if (rect.width <= 0) return "";
  const ratio = (clientX - rect.left) / rect.width;
  if (ratio < EDGE) return "prev";
  if (ratio > 1 - EDGE) return "next";
  return "";
};

export const ServicePhotos = ({ photos, prevLabel, nextLabel }: ServicePhotosProps) => {
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const dragRef = useRef<Drag | null>(null);
  const count = photos.length;
  const active = count === 0 ? 0 : ((index % count) + count) % count;
  const manual = count > 1;

  useEffect(() => {
    if (!manual || hold) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % count);
    }, ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [count, active, hold, manual]);

  const step = (delta: number) => {
    setIndex((current) => {
      const base = ((current % count) + count) % count;
      return (base + delta + count) % count;
    });
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!manual) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    step(event.key === "ArrowRight" ? 1 : -1);
  };

  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!manual || event.pointerType !== "mouse") return;
    setHold(true);
    event.currentTarget.dataset.edge = edgeAt(event.currentTarget, event.clientX);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) return;
    dragRef.current = null;
    event.currentTarget.dataset.edge = "";
    setHold(false);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!manual) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dy: 0, axis: null };
    if (event.pointerType !== "mouse") setHold(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const frame = event.currentTarget;
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) {
      if (event.pointerType === "mouse" && manual) frame.dataset.edge = edgeAt(frame, event.clientX);
      return;
    }
    drag.dx = event.clientX - drag.x;
    drag.dy = event.clientY - drag.y;
    if (drag.axis !== null) return;
    if (Math.abs(drag.dx) < AXIS_LOCK && Math.abs(drag.dy) < AXIS_LOCK) return;
    drag.axis = Math.abs(drag.dx) > Math.abs(drag.dy) ? "x" : "y";
    if (drag.axis === "y") {
      dragRef.current = null;
      return;
    }
    frame.dataset.edge = "";
    try {
      frame.setPointerCapture(event.pointerId);
    } catch {
      /* The pointer can vanish before capture. pointerup still closes the gesture. */
    }
  };

  const releaseCapture = (frame: HTMLDivElement, pointerId: number) => {
    try {
      if (frame.hasPointerCapture(pointerId)) frame.releasePointerCapture(pointerId);
    } catch {
      /* The pointer is already gone. */
    }
  };

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>, commit: boolean) => {
    const frame = event.currentTarget;
    const drag = dragRef.current;
    dragRef.current = null;
    releaseCapture(frame, event.pointerId);
    const hovered = event.pointerType === "mouse" && frame.matches(":hover");
    if (hovered) {
      frame.dataset.edge = edgeAt(frame, event.clientX);
      setHold(true);
    } else {
      frame.dataset.edge = "";
      setHold(false);
    }
    if (!commit || !drag || drag.id !== event.pointerId || !manual) return;
    if (drag.axis === "x" && Math.abs(drag.dx) >= swipeDistance(frame.clientWidth)) {
      step(drag.dx < 0 ? 1 : -1);
      return;
    }
    if (event.pointerType !== "mouse") return;
    if (drag.axis !== null) return;
    if (Math.abs(drag.dx) > AXIS_LOCK || Math.abs(drag.dy) > AXIS_LOCK) return;
    const edge = edgeAt(frame, event.clientX);
    if (edge === "prev") step(-1);
    if (edge === "next") step(1);
  };

  if (count === 0) return null;

  const counter = `${String(active + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;

  return (
    <div
      className={["sp-photos", manual && "is-manual", hold && "is-hold"].filter(Boolean).join(" ")}
      style={{ "--sp-rotate": `${ROTATE_MS}ms` } as CSSProperties}
      onKeyDown={handleKeyDown}
    >
      <div
        className="sp-frame"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => finishPointer(event, true)}
        onPointerCancel={(event) => finishPointer(event, false)}
      >
        {photos.map((photo, photoIndex) => {
          const selected = photoIndex === active;
          return (
            <div key={photo.src} className={selected ? "sp-slide is-active" : "sp-slide"} aria-hidden={selected ? undefined : true}>
              <Photo
                src={photo.src}
                alt={photo.alt}
                stayColor
                fill
                priority={photoIndex === 0}
                sizes="(max-width: 860px) 100vw, 34rem"
                className="object-cover"
                style={photo.objectPosition ? { objectPosition: photo.objectPosition } : undefined}
              />
            </div>
          );
        })}
        <span className="sp-frame-veil" aria-hidden="true" />
        {manual ? (
          <div className="sp-frame-bar">
            <span className="sp-count" aria-live="polite">
              {counter}
            </span>
            <span className="sp-arrows">
              <button type="button" className="sp-arrow" aria-label={prevLabel} onClick={() => step(-1)}>
                <IconChevron flip />
              </button>
              <button type="button" className="sp-arrow" aria-label={nextLabel} onClick={() => step(1)}>
                <IconChevron />
              </button>
            </span>
          </div>
        ) : null}
      </div>
      {manual ? (
        <div className="sp-progress" role="tablist" aria-label={photos[active]?.alt}>
          {photos.map((photo, photoIndex) => {
            const selected = photoIndex === active;
            return (
              <button
                key={photo.src}
                type="button"
                role="tab"
                className={selected ? "sp-tick is-active" : photoIndex < active ? "sp-tick is-past" : "sp-tick"}
                aria-selected={selected}
                aria-label={photo.alt}
                onClick={() => setIndex(photoIndex)}
              >
                <span key={selected ? `on-${index}-${hold ? "hold" : "run"}` : "off"} className="sp-tick-fill" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
