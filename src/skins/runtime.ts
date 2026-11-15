import { SKIN_KEY } from "@/lib/storage";
import { skinConfig } from "./config";

/**
 * Skins a visitor may switch on by themselves: easter egg on the logo or the
 * settings page. They stay off until chosen and are stored on this device only.
 */
export const optInSkins = ["winter"] as const;
export type OptInSkin = (typeof optInSkins)[number];

export const isOptInSkin = (value: string | null | undefined): value is OptInSkin =>
  optInSkins.some((id) => id === value);

/** Fired on `window` when the snow globe should be shaken. */
export const GLOBE_EVENT = "lvbw:globe";

let pendingGlobe = 0;

export const readOptInSkin = (): OptInSkin | null => {
  try {
    const stored = localStorage.getItem(SKIN_KEY);
    return isOptInSkin(stored) ? stored : null;
  } catch {
    return null;
  }
};

/** Switches the runtime skin. `ThemeRuntime` repaints tokens, slots mount their decor. */
export const setOptInSkin = (id: OptInSkin | null) => {
  try {
    if (id) localStorage.setItem(SKIN_KEY, id);
    else localStorage.removeItem(SKIN_KEY);
  } catch {
    /* private mode: the switch still applies to this page */
  }
  document.documentElement.dataset.skin = id ?? skinConfig.activeSkinId;
};

/** Asks the hero decor to shake the globe. Survives the decor still loading. */
export const requestGlobe = () => {
  pendingGlobe = performance.now();
  window.dispatchEvent(new CustomEvent(GLOBE_EVENT));
};

/** True once if a globe was requested in the last `withinMs`. */
export const takePendingGlobe = (withinMs = 2500) => {
  const fresh = pendingGlobe > 0 && performance.now() - pendingGlobe < withinMs;
  pendingGlobe = 0;
  return fresh;
};
