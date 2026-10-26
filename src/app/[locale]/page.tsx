import Link from "next/link";
import { BookButton } from "@/components/BookButton";
import { HeroLogo } from "@/components/HeroLogo";
import { Photo } from "@/components/Photo";
import { ServiceCard } from "@/components/ServiceCard";
import { t } from "@/content/messages";
import { services } from "@/content/services";
import { team } from "@/content/team";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, pathFor, site } from "@/lib/site";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return buildMetadata({
    locale,
    title: copy.homeSeoTitle,
    description: copy.homeSeoDesc,
    path: "/",
  });
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);
  const teaser = team.slice(0, 3);

  return (
    <div className="space-y-16 pt-4">
      <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <HeroLogo />
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--lv-muted)]">
            {copy.heroEyebrow}
          </p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">{copy.heroTitle}</h1>
          <p className="max-w-xl text-[var(--lv-muted)]">{copy.heroLead}</p>
          <div className="flex flex-wrap gap-3">
            <BookButton locale={locale} />
            <a
              href="#services"
              className="min-h-11 rounded-[var(--radius-pill)] border border-[var(--lv-line)] px-5 text-sm font-semibold leading-[2.75rem]"
            >
              {copy.toServices}
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="space-y-6">
        <div>
          <h2 className="font-display text-3xl">{copy.servicesTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--lv-muted)]">{copy.servicesLead}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} locale={locale} service={service} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] md:aspect-[4/5]">
          <Photo
            src="/photos/salon/interior.jpg"
            alt={locale === "uk" ? "Інтер’єр салону" : "Saloninnenraum"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-3xl">{copy.aboutTitle}</h2>
          <p className="text-[var(--lv-muted)]">{copy.aboutBody}</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl">{copy.teamTitle}</h2>
          <Link className="text-sm font-semibold underline-offset-4 hover:underline" href={pathFor(locale, "/team")}>
            {copy.teamAll}
          </Link>
        </div>
        <p className="text-sm text-[var(--lv-muted)]">{copy.teamLead}</p>
        <ul className="grid gap-3 sm:grid-cols-3">
          {teaser.map((member) => (
            <li key={member.slug}>
              <Link
                href={pathFor(locale, `/team/${member.slug}`)}
                className="block rounded-[var(--radius-md)] bg-[var(--lv-elev)] px-4 py-4 shadow-[var(--lv-shadow)]"
              >
                <p className="font-display text-xl">{member.name}</p>
                <p className="text-sm text-[var(--lv-muted)]">
                  {member.specialty?.[locale] ?? copy.teamMissingRole}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-[var(--radius-lg)] bg-[var(--lv-elev)] p-6 shadow-[var(--lv-shadow)]">
        <h2 className="font-display text-3xl">{copy.contactsTitle}</h2>
        <p>
          {site.street}, {site.postalCode} {site.city}
        </p>
        <p>
          <a className="underline-offset-4 hover:underline" href={`tel:${site.phoneTel}`}>
            {site.phoneDisplay}
          </a>
        </p>
        <p>
          <a className="underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </p>
        <Link className="inline-block text-sm font-semibold underline-offset-4 hover:underline" href={pathFor(locale, "/contacts")}>
          {copy.nav.contacts}
        </Link>
        <div className="pt-2">
          <BookButton locale={locale} />
        </div>
      </section>
    </div>
  );
}
