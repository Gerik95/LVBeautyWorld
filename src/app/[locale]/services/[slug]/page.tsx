import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookButton } from "@/components/BookButton";
import { PriceRow } from "@/components/PriceRow";
import { ServiceBack } from "@/components/services/ServiceBack";
import { IconChevron } from "@/components/icons";
import { ServicePhotos } from "@/components/services/ServicePhotos";
import { t } from "@/content/messages";
import { pricesForService } from "@/content/prices";
import { getService, homeServices, services } from "@/content/services";
import { buildMetadata } from "@/lib/metadata";
import { formatGalleryCount } from "@/lib/serviceGallery";
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

  const bookHref = salonCheckout(serviceLeadId[service.id]);
  const name = service.name[locale];
  /* The home gallery is the visitor's sequence: six services. PMU and styling keep
     their pages without a place in it, so they show no count and no pager. */
  const sequence = homeServices();
  const position = sequence.indexOf(service);
  const inSequence = position >= 0;
  const prev = inSequence ? sequence[(position - 1 + sequence.length) % sequence.length] : null;
  const next = inSequence ? sequence[(position + 1) % sequence.length] : null;
  /* Long single words (Wimpernverlängerung) must fit the column without hyphen guessing. */
  const longest = Math.max(...name.split(/[\s-]+/).map((word) => word.length));
  const titleFit = {
    "--sp-fit": Math.min(1, 13 / longest).toFixed(3),
    "--sp-fit-narrow": Math.min(1, 17 / longest).toFixed(3),
  } as CSSProperties;

  return (
    <article className="sp">
      <header className="sp-hero">
        <div className="sp-copy">
          <ServiceBack
            href={`${pathFor(locale)}#services`}
            label={copy.serviceBack}
            serviceId={service.id}
          />
          <div className="sp-kicker">
            <span>{copy.serviceKicker}</span>
            {prev && next ? <span className="sp-kicker-rule" aria-hidden="true" /> : null}
            {prev && next ? (
              <nav className="sp-pager" aria-label={copy.servicePager}>
                <Link
                  className="sp-step"
                  href={pathFor(locale, `/services/${prev.id}`)}
                  aria-label={`${copy.servicePrev}: ${prev.name[locale]}`}
                >
                  <IconChevron flip />
                </Link>
                <span className="sp-kicker-count">{formatGalleryCount(position, sequence.length)}</span>
                <Link
                  className="sp-step"
                  href={pathFor(locale, `/services/${next.id}`)}
                  aria-label={`${copy.serviceNext}: ${next.name[locale]}`}
                >
                  <IconChevron />
                </Link>
              </nav>
            ) : null}
          </div>
          <h1 className="sp-title" style={titleFit}>
            {name}
          </h1>
          <p className="sp-lead">{service.short[locale]}</p>
          <div className="sp-actions">
            <BookButton locale={locale} href={bookHref} />
            <a className="discover ui-inline" href="#prices">
              {copy.nav.prices}
              <span className="discover-chevron" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </div>
        <ServicePhotos
          photos={photos.map((photo) => ({
            src: photo.src,
            alt: photo.alt[locale],
            objectPosition: photo.objectPosition,
          }))}
          prevLabel={copy.photoPrev}
          nextLabel={copy.photoNext}
        />
      </header>

      <section className="sp-chapter" aria-labelledby="sp-offer" data-reveal="">
        <h2 id="sp-offer" className="sp-chapter-title">
          {copy.serviceOffer}
        </h2>
        <ol className="sp-offer">
          {service.treatments.map((item, index) => (
            <li key={item.de} className="sp-offer-item">
              <span className="sp-offer-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="sp-offer-name">{item[locale]}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="sp-chapter" aria-labelledby="sp-story" data-reveal="">
        <h2 id="sp-story" className="sp-chapter-title">
          {copy.serviceStory}
        </h2>
        <p className="sp-story">{service.body[locale]}</p>
      </section>

      <section id="prices" className="sp-prices" aria-labelledby="sp-prices-title">
        <h2 id="sp-prices-title" className="sp-chapter-title">
          {copy.nav.prices}
        </h2>
        <p className="sp-prices-note">{copy.priceDisclaimer}</p>
        <ul className="price-menu divide-y divide-[var(--lv-line)] overflow-x-hidden rounded-[var(--radius-md)] bg-[var(--lv-elev)]">
          {list.map((item) => (
            <PriceRow key={item.id} locale={locale} item={item} menu />
          ))}
        </ul>
        <Link href={pathFor(locale, "/prices")} className="ui-inline text-sm font-semibold">
          {copy.pricesLink}
        </Link>
      </section>
      <BookButton locale={locale} href={bookHref} className="sp-book-end" />
    </article>
  );
};
