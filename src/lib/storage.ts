export const THEME_KEY = "lvbw-theme";
export const MAPS_KEY = "lvbw-maps-consent";
export const LOCALE_COOKIE = "lvbw-locale";
export const HERO_KEY = "lvbw-hero-glow";

export type ThemePref = "system" | "light" | "dark";

export const isThemePref = (value: string | null): value is ThemePref =>
  value === "system" || value === "light" || value === "dark";
