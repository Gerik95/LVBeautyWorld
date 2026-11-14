export const locales = ["de", "uk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export const site = {
  name: "LV Beauty World",
  legalName: "LV Beauty World GmbH",
  managingDirector: "Inna Laychuk",
  street: "Weingartenstraße 9",
  postalCode: "44263",
  city: "Dortmund",
  district: "Hörde",
  country: "Deutschland",
  countryCode: "DE",
  phoneDisplay: "+49 176 63707383",
  phoneTel: "+4917663707383",
  email: "info@lvbeautyworld.de",
  instagramUrl: "https://www.instagram.com/lvbeautyworld",
  instagramHandle: "@lvbeautyworld",
  tiktokUrl: "https://www.tiktok.com/@lv_beautyworld",
  facebookUrl: "https://www.facebook.com/profile.php?id=100090206877849",
  bookingUrl: "https://salonkee.de/salon/lv-beauty-world-gmbh",
  taplinkUrl: "https://taplink.cc/lvbeautyworld",
  googleReviewUrl: "https://g.page/r/CR4kMBVWhSJbEBM/review",
  areaSqm: 265,
  vatId: "DE362304304",
  registerCourt: "Amtsgericht Dortmund",
  registerNumber: "HRB 35322",
  supervisoryAuthority: "Ordnungsamt der Stadt Dortmund, Südwall 2–4, 44122 Dortmund",
  odrUrl: "https://ec.europa.eu/consumers/odr/",
  domain: "https://lvbeautyworld.de",
} as const;

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export const pathFor = (locale: Locale, path = "") => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
};

/** The current path in another language: `/de/prices` → `/uk/prices`. */
export const localeSwitchPath = (pathname: string, next: Locale) => {
  const rest = pathname.replace(/^\/(de|uk)(?=\/|$)/, "") || "/";
  return pathFor(next, rest);
};
