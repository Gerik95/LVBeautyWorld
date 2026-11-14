export const THEME_KEY = "lvbw-theme";
export const LOCALE_COOKIE = "lvbw-locale";
export const INITIAL_THEME_KEY = "lvbw-initial-theme";
/** Selected home-gallery service. Survives language changes and back navigation in this tab. */
export const SERVICE_KEY = "lvbw-svc";
/** The gallery entrance has already played in this tab. */
export const SERVICE_SEEN_KEY = "lvbw-svc-seen";

export type ThemePref = "system" | "light" | "dark";

export const isThemePref = (value: string | null): value is ThemePref =>
  value === "system" || value === "light" || value === "dark";
