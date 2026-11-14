import Link from "next/link";
import { notFound } from "next/navigation";
import { BookButton } from "@/components/BookButton";
import { PriceRow } from "@/components/PriceRow";
import { ServicePhotos } from "@/components/services/ServicePhotos";
import { t } from "@/content/messages";
import { pricesForService } from "@/content/prices";
import { getService, services } from "@/content/services";
import { buildMetadata } from "@/lib/metadata";
import { salonCheckout, serviceLeadId } from "@/lib/booking";
import { isLocale, locales, pathFor } from "@/lib/site";

export const generateStaticParams = () =>
  locales.flatMap((locale) => services.map((service) => ({ locale, slug: service.id })));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) => {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({
    locale,
    title: service.name[locale],
    description: service.short[locale],
    path: `/services/${service.id}`,
  });
};

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const service = getService(slug);
  if (!service) notFound();
  const copy = t(locale);
  const list = pricesForService(service.id);
  const photos = service.gallery?.length
    ? service.gallery
    : [{ src: service.image, alt: service.imageAlt, objectPosition: service.objectPosition }];

  return (
    <article className="service-page space-y-8 pt-4">
      <header className="space-y-3">
        <h1 className="font-display text-4xl">{service.name[locale]}</h1>
        <p className="max-w-2xl text-[var(--lv-muted)]">{service.short[locale]}</p>
      </header>
      <div className="service-stage">
        <ServicePhotos
          photos={photos.map((photo) => ({
            src: photo.src,
            alt: photo.alt[locale],
            objectPosition: photo.objectPosition,
          }))}
          prevLabel={copy.photoPrev}
          nextLabel={copy.photoNext}
        />
        <section className="service-offer space-y-3">
          <h2 className="font-display text-2xl">{copy.serviceOffer}</h2>
          <ul className="list-disc space-y-1 pl-5">
            {service.treatments.map((item) => (
              <li key={item.de}>{item[locale]}</li>
            ))}
          </ul>
        </section>
      </div>
      <section className="service-story space-y-3">
        <h2 className="font-display text-2xl">{copy.serviceStory}</h2>
        <p>{service.body[locale]}</p>
      </section>
      <section className="space-y-3">
        <h2 className="font-display text-2xl">{copy.nav.prices}</h2>
        <p className="text-sm text-[var(--lv-muted)]">{copy.priceDisclaimer}</p>
        <ul className="price-menu divide-y divide-[var(--lv-line)] overflow-x-hidden rounded-[var(--radius-md)] bg-[var(--lv-elev)]">
          {list.map((item) => (
            <PriceRow key={item.id} locale={locale} item={item} menu />
          ))}
        </ul>
        <Link href={pathFor(locale, "/prices")} className="ui-inline text-sm font-semibold">
          {copy.pricesLink}
        </Link>
      </section>
      <BookButton locale={locale} href={salonCheckout(serviceLeadId[service.id])} />
    </article>
  );
};
