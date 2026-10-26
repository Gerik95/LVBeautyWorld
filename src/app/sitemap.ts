import type { MetadataRoute } from "next";
import { legalDocs } from "@/content/legal";
import { services } from "@/content/services";
import { team } from "@/content/team";
import { locales, pathFor, site } from "@/lib/site";

const paths = [
  "/",
  "/team",
  "/prices",
  "/contacts",
  "/settings",
  ...services.map((item) => `/services/${item.id}`),
  ...team.map((item) => `/team/${item.slug}`),
  ...legalDocs.map((item) => `/legal/${item.id}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${site.domain}${pathFor(locale, path)}`,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
  );
}
