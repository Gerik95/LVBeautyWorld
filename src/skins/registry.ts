import { defaultSkin } from "./default";
import type { EffectFlags, SkinDefinition } from "./types";
import { skinConfig } from "./config";
import { winterSkin } from "./winter";

export const skinRegistry: Record<string, SkinDefinition> = {
  default: defaultSkin,
  winter: winterSkin,
};

export const getSkin = (id: string | null | undefined): SkinDefinition => {
  if (id && skinRegistry[id]) return skinRegistry[id];
  return skinRegistry.default;
};

export const getActiveSkin = (): SkinDefinition => getSkin(skinConfig.activeSkinId);

const quietEffects: EffectFlags = {
  lampIgnition: false,
  spotlight: false,
  bookHover: false,
  reveal: false,
  photoGrayscale: false,
};

export const resolveEffects = (skin: SkinDefinition = getActiveSkin()): EffectFlags => {
  if (!skinConfig.effectsEnabled) return quietEffects;
  return skin.effects;
};
