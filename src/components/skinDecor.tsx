"use client";

import { lazy, type ComponentType } from "react";
import { getSkin } from "@/skins";
import { useSkinId } from "@/skins/useSkinId";

export type DecorKind = "hero" | "nav" | "site";

const cache = new Map<string, ComponentType>();

/**
 * Lazy decor of the skin on `<html data-skin>`. Null when the skin has none,
 * so a switched-off skin loads nothing. Follows a runtime skin switch.
 */
export const useSkinDecor = (kind: DecorKind): ComponentType | null => {
  const skin = getSkin(useSkinId());
  const loader =
    kind === "hero" ? skin.loadHeroDecor : kind === "nav" ? skin.loadNavAccent : skin.loadSiteDecor;
  if (!loader) return null;
  const key = `${skin.id}:${kind}`;
  let Decor = cache.get(key);
  if (!Decor) {
    Decor = lazy(loader);
    cache.set(key, Decor);
  }
  return Decor;
};
