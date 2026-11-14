import { salonSchedule } from "@/content/schedule";
import { formatMinutes } from "@/lib/hours";
import { site } from "@/lib/site";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const openingHours = salonSchedule.week.flatMap((intervals, index) =>
  intervals
    .filter((interval) => interval.end > interval.start)
    .map((interval) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayNames[index],
      opens: formatMinutes(interval.start),
      closes: formatMinutes(interval.end),
    })),
);

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
    openingHoursSpecification: openingHours,
    sameAs: [site.instagramUrl, site.tiktokUrl, site.facebookUrl, site.bookingUrl],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
};
