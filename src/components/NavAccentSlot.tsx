import { lazy, Suspense } from "react";
import type { ComponentType } from "react";
import { getActiveSkin } from "@/skins";

const cache = new Map<string, ComponentType>();

const loadDecor = (kind: "hero" | "nav") => {
  const skin = getActiveSkin();
  const loader = kind === "hero" ? skin.loadHeroDecor : skin.loadNavAccent;
  if (!loader) return null;
  const key = `${skin.id}:${kind}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const Decor = lazy(loader);
  cache.set(key, Decor);
  return Decor;
};

export const NavAccentSlot = () => {
  const Decor = loadDecor("nav");
  if (!Decor) return null;
  return (
    <Suspense fallback={null}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Decor />
      </div>
    </Suspense>
  );
};
