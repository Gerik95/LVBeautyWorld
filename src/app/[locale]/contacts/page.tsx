import { BookButton } from "@/components/BookButton";
import { ContactMap } from "@/components/ContactMap";
import { t } from "@/content/messages";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, site } from "@/lib/site";
import { notFound } from "next/navigation";

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
    <div className="space-y-8 pt-4">
      <h1 className="font-display text-4xl">{copy.contactsTitle}</h1>
      <p className="text-[var(--lv-muted)]">{copy.contactsLead}</p>
      <ul className="space-y-2">
        <li>
          <a className="underline-offset-4 hover:underline" href={`tel:${site.phoneTel}`}>
            {site.phoneDisplay}
          </a>
        </li>
        <li>
          <a className="underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </li>
        <li>
          <a
            className="underline-offset-4 hover:underline"
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram {site.instagramHandle}
          </a>
        </li>
      </ul>
      <BookButton locale={locale} />
      <section className="space-y-2">
        <h2 className="font-display text-2xl">{copy.hoursTitle}</h2>
        <p>
          {copy.hoursWeek}: {site.hours.weekdays.open}–{site.hours.weekdays.close}
        </p>
        <p>
          {copy.hoursSunday}: {copy.hoursClosed}
        </p>
        <p className="text-xs text-[var(--lv-muted)]">{copy.hoursSource}</p>
      </section>
      <section className="space-y-3">
        <h2 className="font-display text-2xl">{copy.addressTitle}</h2>
        <p>
          {site.name}
          <br />
          {site.street}
          <br />
          {site.postalCode} {site.city}-{site.district}
          <br />
          {site.country}
        </p>
        <p className="text-xs text-[var(--lv-muted)]">
          {site.lat.toFixed(7)}, {site.lng.toFixed(7)} (OpenStreetMap, Shop „Beauty World“)
        </p>
        <ContactMap locale={locale} />
      </section>
    </div>
  );
}
