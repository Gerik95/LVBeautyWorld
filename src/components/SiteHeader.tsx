import Link from "next/link";
import type { Locale } from "@/lib/site";
import { pathFor } from "@/lib/site";
import { BookButton } from "./BookButton";

export const SiteHeader = ({ locale }: { locale: Locale }) => (
  <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-md">
    <Link href={pathFor(locale)} className="flex items-center gap-2" aria-label="LV Beauty World">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo.svg" alt="" className="logo-on-light h-9 w-9" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo-white.svg" alt="" className="logo-on-dark h-9 w-9" />
      <span className="font-display text-lg leading-none">LV</span>
    </Link>
    <BookButton locale={locale} />
  </header>
);
