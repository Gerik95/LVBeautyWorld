"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { t } from "@/content/messages";
import { legalDocs } from "@/content/legal";
import { LOCALE_COOKIE, MAPS_KEY, THEME_KEY, type ThemePref, isThemePref } from "@/lib/storage";
import { pathFor, type Locale } from "@/lib/site";

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
  const [maps, setMaps] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    setTheme(isThemePref(stored) ? stored : "system");
    setMaps(localStorage.getItem(MAPS_KEY) === "1");
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
    const stripped = pathname.replace(/^\/(de|uk)/, "") || "/";
    router.push(pathFor(next, stripped));
  };

  const handleMaps = (on: boolean) => {
    setMaps(on);
    localStorage.setItem(MAPS_KEY, on ? "1" : "0");
    document.cookie = `${MAPS_KEY}=${on ? "1" : "0"}; path=/; max-age=31536000; SameSite=Lax`;
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
              className={`min-h-11 rounded-[var(--radius-pill)] px-4 text-sm font-semibold ${
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
              className={`min-h-11 rounded-[var(--radius-pill)] px-4 text-sm font-semibold ${
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
        <h2 className="font-display text-2xl">{copy.settingsConsent}</h2>
        <p className="text-sm text-[var(--lv-muted)]">{copy.consentEssential}</p>
        <p className="text-sm">{copy.consentMaps}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleMaps(true)}
            className={`min-h-11 rounded-[var(--radius-pill)] px-4 text-sm font-semibold ${
              maps ? "bg-[var(--lv-ink)] text-[var(--lv-paper)]" : "border border-[var(--lv-line)]"
            }`}
            aria-pressed={maps}
          >
            {copy.consentMapsOn}
          </button>
          <button
            type="button"
            onClick={() => handleMaps(false)}
            className={`min-h-11 rounded-[var(--radius-pill)] px-4 text-sm font-semibold ${
              !maps ? "bg-[var(--lv-ink)] text-[var(--lv-paper)]" : "border border-[var(--lv-line)]"
            }`}
            aria-pressed={!maps}
          >
            {copy.consentMapsOff}
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">{copy.settingsLegal}</h2>
        <ul className="space-y-2">
          {legalDocs.map((doc) => (
            <li key={doc.id}>
              <Link className="underline-offset-4 hover:underline" href={pathFor(locale, `/legal/${doc.id}`)}>
                {doc.title[locale]}
                {doc.draft ? ` (${copy.legalDraftBadge})` : ""}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
