import Link from "next/link";
import { notFound } from "next/navigation";
import { BookButton } from "@/components/BookButton";
import { Photo } from "@/components/Photo";
import { t } from "@/content/messages";
import { formatPrice, pricesForService } from "@/content/prices";
import { getService, services } from "@/content/services";
import { buildMetadata } from "@/lib/metadata";
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
    title: `${service.name[locale]} | LV Beauty World`,
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

  return (
    <article className="space-y-6 pt-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] sm:aspect-[16/8]">
        <Photo
          src={service.image}
          alt={service.imageAlt[locale]}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <h1 className="font-display text-4xl">{service.name[locale]}</h1>
      <p className="text-[var(--lv-muted)]">{service.body[locale]}</p>
      <ul className="list-disc space-y-1 pl-5">
        {service.treatments.map((item) => (
          <li key={item.de}>{item[locale]}</li>
        ))}
      </ul>
      <section className="space-y-3">
        <h2 className="font-display text-2xl">{copy.nav.prices}</h2>
        <p className="text-sm text-[var(--lv-muted)]">{copy.priceDisclaimer}</p>
        <ul className="divide-y divide-[var(--lv-line)] overflow-x-hidden rounded-[var(--radius-md)] bg-[var(--lv-elev)]">
          {list.map((item) => (
            <li key={item.id} className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm">
              <span className="min-w-0 break-words">{item[locale]}</span>
              <span className="shrink-0 font-semibold tabular-nums">{formatPrice(locale, item)}</span>
            </li>
          ))}
        </ul>
        <Link href={pathFor(locale, "/prices")} className="inline-block text-sm font-semibold underline-offset-4 hover:underline">
          {copy.pricesLink}
        </Link>
      </section>
      <BookButton locale={locale} />
    </article>
  );
}
