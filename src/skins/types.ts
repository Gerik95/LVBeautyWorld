import type { ComponentType } from "react";

export type EffectFlags = {
  lampIgnition: boolean;
  spotlight: boolean;
  bookHover: boolean;
  reveal: boolean;
  photoGrayscale: boolean;
};

/** Decorative token overrides. Keys are CSS custom properties, including the leading dashes. */
export type SkinTokens = {
  light?: Record<string, string>;
  dark?: Record<string, string>;
};

export type SkinDefinition = {
  id: string;
  tokens?: SkinTokens;
  effects: EffectFlags;
  /** Lazy decorative layer inside the hero. Must not capture clicks. */
  loadHeroDecor?: () => Promise<{ default: ComponentType }>;
  /** Lazy accent rendered inside the glass nav, behind the items. */
  loadNavAccent?: () => Promise<{ default: ComponentType }>;
};
