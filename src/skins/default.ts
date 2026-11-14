import type { SkinDefinition } from "./types";

/**
 * Gallery tokens. A seasonal skin replaces these keys; the gallery does not read the skin id.
 * Durations match `galleryMotion`. Light has no gleam.
 */
const galleryLight = {
  "--svc-marker": "#1c1c1e",
  "--svc-marker-glow": "transparent",
  "--svc-frame": "rgba(28, 28, 30, 0.08)",
  "--svc-photo-shadow": "0 18px 42px rgba(20, 20, 24, 0.12)",
  "--svc-gleam": "transparent",
  "--svc-panel-ms": "360ms",
  "--svc-photo-ms": "450ms",
  "--svc-wave-in-ms": "1500ms",
  "--svc-wave-out-ms": "1050ms",
  "--svc-gleam-ms": "680ms",
  "--svc-reveal-ms": "420ms",
  "--svc-reveal-gap": "60ms",
  "--svc-reveal-shift": "14px",
} as const;

const galleryDark = {
  ...galleryLight,
  "--svc-marker": "#f7f7f8",
  "--svc-marker-glow": "rgba(255, 255, 255, 0.45)",
  "--svc-frame": "rgba(255, 255, 255, 0.18)",
  "--svc-photo-shadow": "none",
  "--svc-gleam": "rgba(255, 255, 255, 0.85)",
} as const;

export const defaultSkin: SkinDefinition = {
  id: "default",
  tokens: {
    light: { ...galleryLight },
    dark: { ...galleryDark },
  },
  effects: {
    lampIgnition: true,
    spotlight: true,
    bookHover: true,
    reveal: true,
    photoGrayscale: true,
  },
};
