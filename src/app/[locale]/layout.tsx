import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { AppChrome } from "@/components/AppChrome";
import { LangAttr } from "@/components/LangAttr";
import { SalonJsonLd } from "@/components/JsonLd";
import { isLocale, locales } from "@/lib/site";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <LangAttr locale={locale} />
      <SalonJsonLd />
      <AppChrome locale={locale}>{children}</AppChrome>
    </>
  );
}
