"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/content/messages";
import type { Locale } from "@/lib/site";
import { pathFor } from "@/lib/site";
import { IconGear, IconHome, IconPin, IconPrice, IconTeam } from "./icons";

const items = [
  { key: "home" as const, href: "/", Icon: IconHome },
  { key: "team" as const, href: "/team", Icon: IconTeam },
  { key: "prices" as const, href: "/prices", Icon: IconPrice },
  { key: "contacts" as const, href: "/contacts", Icon: IconPin },
  { key: "settings" as const, href: "/settings", Icon: IconGear },
];

export const BottomNav = ({ locale }: { locale: Locale }) => {
  const pathname = usePathname();
  const copy = t(locale);

  const active = (href: string) => {
    const full = pathFor(locale, href);
    if (href === "/") return pathname === full;
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  return (
    <nav
      aria-label={locale === "uk" ? "Основна навігація" : "Hauptnavigation"}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[calc(0.55rem+var(--safe-bottom))] pt-2"
    >
      <ul className="glass pointer-events-auto flex w-full max-w-[34rem] items-stretch justify-between gap-0.5 rounded-[var(--radius-pill)] px-2 py-1.5 sm:px-3">
        {items.map(({ key, href, Icon }) => {
          const isActive = active(href);
          const label = copy.nav[key];
          return (
            <li key={key} className="flex-1">
              <Link
                href={pathFor(locale, href)}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-pill)] px-1 text-[0.65rem] font-medium sm:text-xs ${
                  isActive ? "text-[var(--lv-ink)]" : "text-[var(--lv-muted)]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden max-[379px]:sr-only min-[380px]:inline">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
