import { lazy, Suspense } from "react";
import type { ComponentType } from "react";
import { getActiveSkin } from "@/skins";

const cache = new Map<string, ComponentType>();

export const HeroDecorSlot = () => {
  const skin = getActiveSkin();
  if (!skin.loadHeroDecor) return null;
  const key = skin.id;
  let Decor = cache.get(key);
  if (!Decor) {
    Decor = lazy(skin.loadHeroDecor);
    cache.set(key, Decor);
  }
  return (
    <Suspense fallback={null}>
      <div className="hero-decor" aria-hidden="true">
        <Decor />
      </div>
    </Suspense>
  );
};
