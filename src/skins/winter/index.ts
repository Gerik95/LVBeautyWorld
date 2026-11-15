import { defaultSkin } from "../default";
import type { SkinDefinition } from "../types";

/**
 * Winter skin. Opt-in only: the visitor switches it on with three taps on
 * the logo, a shake of the phone or the settings page (`src/skins/runtime.ts`).
 * Decor lives in lazy chunks, the CSS in `winter.css` is scoped to
 * `html[data-skin="winter"]`. Layout, copy and booking stay untouched.
 */
export const winterSkin: SkinDefinition = {
  id: "winter",
  tokens: {
    light: {
      ...defaultSkin.tokens?.light,
      "--svc-frame": "rgba(96, 128, 176, 0.2)",
      "--svc-photo-shadow": "0 18px 42px rgba(52, 72, 112, 0.14)",
    },
    dark: {
      ...defaultSkin.tokens?.dark,
      "--svc-marker-glow": "rgba(198, 222, 255, 0.55)",
      "--svc-frame": "rgba(206, 226, 255, 0.22)",
      "--svc-gleam": "rgba(214, 234, 255, 0.95)",
      "--svc-gleam-ms": "900ms",
    },
  },
  effects: defaultSkin.effects,
  loadHeroDecor: () => import("./HeroWinter"),
  loadNavAccent: () => import("./DockFrost"),
  loadSiteDecor: () => import("./SiteWinter"),
};
