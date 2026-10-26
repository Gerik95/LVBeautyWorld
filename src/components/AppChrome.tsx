import type { ReactNode } from "react";
import type { Locale } from "@/lib/site";
import { BottomNav } from "./BottomNav";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export const AppChrome = ({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) => (
  <div className="mx-auto flex min-h-dvh max-w-6xl flex-col">
    <a className="skip-link" href="#content">
      {locale === "uk" ? "До змісту" : "Zum Inhalt"}
    </a>
    <SiteHeader locale={locale} />
    <main id="content" className="page-pad flex-1 px-4">
      {children}
    </main>
    <SiteFooter locale={locale} />
    <BottomNav locale={locale} />
  </div>
);
