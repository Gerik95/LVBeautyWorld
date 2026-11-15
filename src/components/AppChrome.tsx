"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { t } from "@/content/messages";
import type { Locale } from "@/lib/site";
import { BottomNav } from "./BottomNav";
import { PhotoTone } from "./PhotoTone";
import { RevealObserver } from "./RevealObserver";
import { SiteDecorSlot } from "./SiteDecorSlot";
import { SiteFooter } from "./SiteFooter";
import { SkinEgg } from "./SkinEgg";
import { ThemeRuntime } from "./ThemeRuntime";
import { TopBar } from "./TopBar";

export const AppChrome = ({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) => {
  const pathname = usePathname();
  const home = pathname === `/${locale}`;
  return (
    <div className="flex min-h-dvh w-full min-w-0 max-w-full flex-col">
      <a className="skip-link" href="#content">
        {t(locale).skip}
      </a>
      <TopBar locale={locale} className={home ? "is-home" : "is-inset"} />
      <main id="content" className={home ? "home-main min-w-0 flex-1" : "mx-auto w-full min-w-0 max-w-5xl flex-1 px-4 sm:px-6"}>
        {children}
      </main>
      <SiteFooter locale={locale} />
      <BottomNav locale={locale} />
      <RevealObserver />
      <PhotoTone />
      <ThemeRuntime />
      <SkinEgg locale={locale} />
      <SiteDecorSlot />
    </div>
  );
};
