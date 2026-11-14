"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pickCenterPhoto } from "@/lib/photoTone";

const FINE_HOVER = "(hover: hover) and (pointer: fine)";

export const PhotoTone = () => {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const fineHover = window.matchMedia(FINE_HOVER);
    let frame = 0;
    let current: HTMLElement | null = null;

    const clear = () => {
      current?.classList.remove("is-lit");
      current = null;
    };

    const update = () => {
      frame = 0;
      if (root.dataset.photo !== "mono" || fineHover.matches) {
        clear();
        return;
      }
      const nodes = [...document.querySelectorAll<HTMLElement>(".photo-hit:not(.photo-stay)")];
      const boxes = nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { node, top: rect.top, bottom: rect.bottom, height: rect.height };
      });
      const picked = pickCenterPhoto(boxes, window.innerHeight);
      const next = picked?.node ?? null;
      if (next === current) return;
      current?.classList.remove("is-lit");
      next?.classList.add("is-lit");
      current = next;
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    const content = document.getElementById("content");
    const resizeObserver = new ResizeObserver(requestUpdate);
    if (content) resizeObserver.observe(content);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    fineHover.addEventListener("change", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      fineHover.removeEventListener("change", requestUpdate);
      clear();
    };
  }, [pathname]);

  return null;
};
