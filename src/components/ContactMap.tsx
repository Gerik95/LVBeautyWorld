"use client";

import { useEffect, useId, useRef, useState } from "react";
import { t } from "@/content/messages";
import { MAPS_KEY } from "@/lib/storage";
import { site, type Locale } from "@/lib/site";

type TokenState = "unknown" | "missing" | "ready";

const appleDir = `https://maps.apple.com/?daddr=${site.lat},${site.lng}&q=${encodeURIComponent(site.name)}`;
const googleDir = `https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`;

const uaIsApple = () => {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
};

const uaIsAndroid = () => {
  if (typeof navigator === "undefined") return false;
  return /Android/.test(navigator.userAgent);
};

export const ContactMap = ({ locale }: { locale: Locale }) => {
  const copy = t(locale);
  const mapId = useId();
  const hostRef = useRef<HTMLDivElement>(null);
  const [consent, setConsent] = useState(false);
  const [showChooser, setShowChooser] = useState(false);
  const [tokenState, setTokenState] = useState<TokenState>("unknown");
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    setConsent(localStorage.getItem(MAPS_KEY) === "1");
  }, []);

  useEffect(() => {
    if (!loadMap || !consent) return;
    let cancelled = false;
    const run = async () => {
      const res = await fetch("/api/maps/token", { credentials: "same-origin" });
      if (cancelled) return;
      if (!res.ok) {
        setTokenState("missing");
        return;
      }
      const data = (await res.json()) as { token?: string };
      if (!data.token) {
        setTokenState("missing");
        return;
      }
      setTokenState("ready");
      await loadMapKit(data.token);
      const mapkit = window.mapkit;
      if (cancelled || !hostRef.current || !mapkit) return;
      const map = new mapkit.Map(hostRef.current, {
        isZoomEnabled: true,
        isScrollEnabled: true,
        showsMapTypeControl: false,
      });
      const coord = new mapkit.Coordinate(site.lat, site.lng);
      const annotation = new mapkit.MarkerAnnotation(coord, {
        title: site.name,
        subtitle: `${site.street}, ${site.city}`,
      });
      map.showItems([annotation], { animate: false });
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [loadMap, consent]);

  const handleConsent = () => {
    localStorage.setItem(MAPS_KEY, "1");
    document.cookie = `${MAPS_KEY}=1; path=/; max-age=31536000; SameSite=Lax`;
    setConsent(true);
    setLoadMap(true);
  };

  const handleRoute = () => {
    if (uaIsApple()) {
      window.open(appleDir, "_blank", "noopener,noreferrer");
      return;
    }
    if (uaIsAndroid()) {
      window.open(googleDir, "_blank", "noopener,noreferrer");
      return;
    }
    setShowChooser(true);
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--lv-line)] bg-[var(--lv-elev)]">
        {!loadMap ? (
          <div className="space-y-3 p-5">
            <p className="text-sm">{copy.mapPlaceholder}</p>
            <p className="text-sm text-[var(--lv-muted)]">{copy.mapConsent}</p>
            <button
              type="button"
              onClick={handleConsent}
              className="btn-glow min-h-11 rounded-[var(--radius-pill)] bg-[var(--lv-ink)] px-4 text-sm font-semibold text-[var(--lv-paper)]"
            >
              {copy.mapConsentAction}
            </button>
          </div>
        ) : tokenState === "missing" ? (
          <p className="p-5 text-sm">{copy.mapUnavailable}</p>
        ) : (
          <div className="space-y-2 p-2">
            <div
              id={mapId}
              ref={hostRef}
              className="h-64 w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--lv-graphite)]/20"
            />
            <p className="px-2 pb-2 text-xs text-[var(--lv-muted)]">{copy.mapAttribution}</p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleRoute}
          className="min-h-11 rounded-[var(--radius-pill)] border border-[var(--lv-line)] px-4 text-sm font-semibold"
        >
          {copy.mapRoute}
        </button>
      </div>
      {showChooser ? (
        <div className="flex flex-wrap gap-3 text-sm">
          <a className="underline" href={appleDir} target="_blank" rel="noopener noreferrer">
            {copy.mapApple}
          </a>
          <a className="underline" href={googleDir} target="_blank" rel="noopener noreferrer">
            {copy.mapGoogle}
          </a>
        </div>
      ) : null}
    </div>
  );
};

const loadMapKit = (token: string) =>
  new Promise<void>((resolve, reject) => {
    if (window.mapkit) {
      window.mapkit.init({ authorizationCallback: (done) => done(token) });
      resolve();
      return;
    }
    const existing = document.querySelector("script[data-mapkit]");
    const start = () => {
      window.mapkit?.init({ authorizationCallback: (done) => done(token) });
      resolve();
    };
    if (existing) {
      existing.addEventListener("load", () => start());
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";
    script.async = true;
    script.dataset.mapkit = "true";
    script.onload = () => start();
    script.onerror = () => reject(new Error("mapkit"));
    document.head.appendChild(script);
  });

declare global {
  interface Window {
    mapkit?: {
      init: (opts: { authorizationCallback: (done: (token: string) => void) => void }) => void;
      Map: new (el: HTMLElement, opts: Record<string, unknown>) => {
        showItems: (items: unknown[], opts?: { animate?: boolean }) => void;
      };
      Coordinate: new (lat: number, lng: number) => unknown;
      MarkerAnnotation: new (coord: unknown, opts: Record<string, unknown>) => unknown;
    };
  }
}
