import { site } from "@/lib/site";

export const SalonJsonLd = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: site.name,
    legalName: site.legalName,
    url: site.domain,
    telephone: site.phoneTel,
    email: site.email,
    image: `${site.domain}/brand/og-image.png`,
    logo: `${site.domain}/brand/icon-512.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.street,
      postalCode: site.postalCode,
      addressLocality: site.city,
      addressRegion: "Nordrhein-Westfalen",
      addressCountry: site.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.lat,
      longitude: site.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: site.hours.weekdays.open,
        closes: site.hours.weekdays.close,
      },
    ],
    sameAs: [site.instagramUrl, site.tiktokUrl, site.facebookUrl, site.bookingUrl],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
};
