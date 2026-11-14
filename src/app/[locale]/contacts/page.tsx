import { BookButton } from "@/components/BookButton";
import { ContactMap } from "@/components/ContactMap";
import { ContactRows } from "@/components/ContactRows";
import { HoursPanel } from "@/components/HoursPanel";
import { IconCar, IconContactAdd, IconTram, IconWalk } from "@/components/icons";
import { directionsModes } from "@/content/directions";
import { t } from "@/content/messages";
import { googleDirectionsUrl, mapsDestination, type TravelMode } from "@/lib/maps";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, site } from "@/lib/site";
import { notFound } from "next/navigation";

const travelIcons: Record<TravelMode, typeof IconCar> = {
  driving: IconCar,
  transit: IconTram,
  walking: IconWalk,
};

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return buildMetadata({
    locale,
    title: copy.contactsSeoTitle,
    description: copy.contactsSeoDesc,
    path: "/contacts",
  });
};

export default async function ContactsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);

  return (
    <div className="contact-page pt-4">
      <header className="space-y-4">
        <h1 className="font-display text-4xl">{copy.contactsTitle}</h1>
        <p className="max-w-xl text-[var(--lv-muted)]">{copy.contactsLead}</p>
      </header>

      <div className="contact-grid">
        <div className="contact-reach">
          <ContactRows locale={locale} markId="contacts" route={false} />
          <div className="contact-actions">
            <BookButton locale={locale} />
            <a className="vcard-btn ui-hover" href={`/api/vcard/${locale}`} aria-label={copy.vcardAria}>
              <IconContactAdd className="vcard-icon" />
              <span>{copy.vcard}</span>
            </a>
          </div>
        </div>
        <HoursPanel locale={locale} />
      </div>

      <section className="contact-place" aria-labelledby="place-title">
        <div className="contact-place-copy">
          <h2 id="place-title" className="font-display text-2xl">
            {copy.addressTitle}
          </h2>
          <address className="contact-address">
            {site.name}
            <br />
            {site.street}
            <br />
            {site.postalCode} {site.city}-{site.district}
            <br />
            {site.country}
          </address>

          <div className="directions">
            <h3 id="directions-title" className="font-display text-xl">
              {copy.directionsTitle}
            </h3>
            <p className="directions-lead">{copy.directionsLead}</p>
            <ul className="visit-rows">
              {directionsModes.map(({ mode, note }) => {
                const Icon = travelIcons[mode];
                return (
                  <li key={mode}>
                    <a
                      className={`visit-row mark-travel is-${mode}`}
                      href={googleDirectionsUrl(mapsDestination, mode)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="visit-row-icon">
                        <Icon className="travel-icon" />
                      </span>
                      <span className="visit-row-label">{copy.directionsModes[mode]}</span>
                      <span className="visit-row-value">{note ? note[locale] : copy.directionsOpen}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <ContactMap locale={locale} />
      </section>
    </div>
  );
}
