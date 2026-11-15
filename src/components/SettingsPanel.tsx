"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { t } from "@/content/messages";
import { legalDocs } from "@/content/legal";
import { LOCALE_COOKIE, THEME_KEY, type ThemePref, isThemePref } from "@/lib/storage";
import { localeSwitchPath, pathFor, type Locale } from "@/lib/site";
import { setOptInSkin } from "@/skins";
import { useSkinId } from "@/skins/useSkinId";
import { askMotionPermission } from "./SkinEgg";

const applyTheme = (pref: ThemePref) => {
  const dark =
    pref === "dark" ||
    (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const resolved = dark ? "dark" : "light";
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
};

export const SettingsPanel = ({ locale }: { locale: Locale }) => {
  const copy = t(locale);
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState<ThemePref>("system");
  const winter = useSkinId() === "winter";

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    setTheme(isThemePref(stored) ? stored : "system");
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const pref = localStorage.getItem(THEME_KEY);
      if (!isThemePref(pref) || pref === "system") applyTheme("system");
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const handleTheme = (next: ThemePref) => {
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  };

  const handleLocale = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(localeSwitchPath(pathname, next));
  };

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="font-display text-2xl">{copy.settingsLang}</h2>
        <div className="flex gap-2">
          {(["de", "uk"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleLocale(item)}
              className={`ui-hover min-h-11 rounded-[var(--radius-pill)] px-4 text-sm font-semibold ${
                locale === item ? "bg-[var(--lv-ink)] text-[var(--lv-paper)]" : "border border-[var(--lv-line)]"
              }`}
              aria-pressed={locale === item}
            >
              {item === "de" ? "Deutsch" : "Українська"}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">{copy.settingsTheme}</h2>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["system", copy.themeSystem],
              ["light", copy.themeLight],
              ["dark", copy.themeDark],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => handleTheme(value)}
              className={`ui-hover min-h-11 rounded-[var(--radius-pill)] px-4 text-sm font-semibold ${
                theme === value ? "bg-[var(--lv-ink)] text-[var(--lv-paper)]" : "border border-[var(--lv-line)]"
              }`}
              aria-pressed={theme === value}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">{copy.settingsWinter}</h2>
        <p className="text-sm text-[var(--lv-muted)]">{copy.winterNote}</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              [true, copy.winterOn],
              [false, copy.winterOff],
            ] as const
          ).map(([value, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (value) askMotionPermission();
                setOptInSkin(value ? "winter" : null);
              }}
              className={`ui-hover min-h-11 rounded-[var(--radius-pill)] px-4 text-sm font-semibold ${
                winter === value ? "bg-[var(--lv-ink)] text-[var(--lv-paper)]" : "border border-[var(--lv-line)]"
              }`}
              aria-pressed={winter === value}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">{copy.settingsConsent}</h2>
        <p className="text-sm text-[var(--lv-muted)]">{copy.consentEssential}</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">{copy.settingsLegal}</h2>
        <ul className="space-y-2">
          {legalDocs.map((doc) => (
            <li key={doc.id}>
              <Link className="ui-inline" href={pathFor(locale, `/legal/${doc.id}`)}>
                {doc.title[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
