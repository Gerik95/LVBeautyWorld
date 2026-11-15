"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { FooterDrift } from "./FooterDrift";
import { frostTextureUrl } from "./frostTexture";
import { HoursFrost } from "./HoursFrost";
import { PageSnow } from "./PageSnow";

const FAVICON_SRC = "/brand/favicon-48.png";

/** Favicon with a snow cap along its top edge. Null if the canvas is unavailable. */
const snowyFavicon = (source: HTMLImageElement) => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(source, 0, 0, size, size);
  const grad = ctx.createLinearGradient(0, 0, 0, 15);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(1, "#c9d6ea");
  ctx.fillStyle = grad;
  ctx.shadowColor = "rgba(120, 156, 210, 0.9)";
  ctx.shadowBlur = 2;
  ctx.shadowOffsetY = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.lineTo(size, 9);
  const bumps = [10, 13, 9, 12, 8, 11, 14, 9];
  bumps.forEach((depth, index) => {
    const x2 = size - ((index + 1) * size) / bumps.length;
    const x1 = x2 + size / bumps.length / 2;
    ctx.quadraticCurveTo(x1, depth + 3, x2, depth);
  });
  ctx.closePath();
  ctx.fill();
  try {
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
};

/** Waits for an element that a route renders a moment after navigation. */
const useElement = (selector: string, key: string) => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const find = () => document.querySelector<HTMLElement>(selector);
    setElement(find());
    const observer = new MutationObserver(() => {
      const next = find();
      setElement((current) => (current === next ? current : next));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const stop = window.setTimeout(() => observer.disconnect(), 4000);
    return () => {
      observer.disconnect();
      window.clearTimeout(stop);
    };
  }, [selector, key]);
  return element;
};

/**
 * Site-wide winter layer: the frost texture for frozen glass, a snow cap on
 * the favicon, the footer drift, snow over the whole home page and frost on
 * the opening-hours panel.
 */
export default function SiteWinter() {
  const pathname = usePathname() ?? "";
  const home = /^\/(de|uk)\/?$/.test(pathname);
  const footer = useElement(".site-footer", pathname);
  const hours = useElement(".hours-panel", pathname);

  useEffect(() => {
    const root = document.documentElement;
    const icons = [...document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')];
    const originals = icons.map((link) => link.href);
    let disposed = false;
    let frostUrl: string | null = null;

    const img = new Image();
    img.onload = () => {
      if (disposed) return;
      const url = snowyFavicon(img);
      if (!url) return;
      icons.forEach((link) => {
        link.href = url;
      });
    };
    img.src = FAVICON_SRC;

    const makeFrost = () => {
      frostTextureUrl().then((url) => {
        if (disposed) {
          if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
          return;
        }
        frostUrl = url;
        if (url) root.style.setProperty("--winter-frost-img", `url("${url}")`);
      });
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (idle) idle(makeFrost);
    else window.setTimeout(makeFrost, 50);

    return () => {
      disposed = true;
      root.style.removeProperty("--winter-frost-img");
      if (frostUrl?.startsWith("blob:")) URL.revokeObjectURL(frostUrl);
      icons.forEach((link, index) => {
        link.href = originals[index];
      });
    };
  }, []);

  return (
    <>
      {home ? <PageSnow /> : null}
      {footer ? createPortal(<FooterDrift />, footer) : null}
      {hours ? createPortal(<HoursFrost />, hours) : null}
    </>
  );
}
