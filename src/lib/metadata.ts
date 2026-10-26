import type { Metadata } from "next";
import type { Locale } from "@/lib/site";
import { pathFor, site } from "@/lib/site";

export const buildMetadata = ({
  locale,
  title,
  description,
  path,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
}): Metadata => {
  const canonical = `${site.domain}${pathFor(locale, path)}`;
  const other = locale === "de" ? "uk" : "de";
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        de: `${site.domain}${pathFor("de", path)}`,
        uk: `${site.domain}${pathFor("uk", path)}`,
        "x-default": `${site.domain}${pathFor("de", path)}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: locale === "de" ? "de_DE" : "uk_UA",
      alternateLocale: [other === "de" ? "de_DE" : "uk_UA"],
      siteName: site.name,
      type: "website",
      images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/brand/og-image.png"],
    },
  };
};
