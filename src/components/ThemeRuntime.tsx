"use client";

import { useEffect } from "react";
import { getSkin, readOptInSkin } from "@/skins";
import { THEME_KEY, isThemePref, type ThemePref } from "@/lib/storage";

const readPref = (): ThemePref => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return isThemePref(stored) ? stored : "system";
  } catch {
    return "system";
  }
};

const applyTheme = (pref: ThemePref) => {
  const dark =
    pref === "dark" ||
    (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const resolved = dark ? "dark" : "light";
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  return resolved;
};

export const ThemeRuntime = () => {
  useEffect(() => {
    const root = document.documentElement;
    // The boot script does not run on Next's error shell (404); restore an opted-in skin here too.
    const optIn = readOptInSkin();
    if (optIn) root.dataset.skin = optIn;
    const resolvedSkin = getSkin(root.dataset.skin);
    if (resolvedSkin.id !== root.dataset.skin) root.dataset.skin = resolvedSkin.id;

    let applied: string[] = [];
    const paintTokens = () => {
      applied.forEach((key) => root.style.removeProperty(key));
      const skin = getSkin(root.dataset.skin);
      const mode = root.dataset.theme === "dark" ? "dark" : "light";
      const tokens = skin.tokens?.[mode] ?? {};
      applied = Object.keys(tokens);
      applied.forEach((key) => {
        const value = tokens[key];
        if (value) root.style.setProperty(key, value);
      });
    };

    applyTheme(readPref());
    paintTokens();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleScheme = () => {
      if (readPref() === "system") {
        applyTheme("system");
        paintTokens();
      }
    };
    media.addEventListener("change", handleScheme);
    const observer = new MutationObserver(paintTokens);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme", "data-skin"] });

    return () => {
      media.removeEventListener("change", handleScheme);
      observer.disconnect();
      applied.forEach((key) => root.style.removeProperty(key));
    };
  }, []);

  return null;
};
