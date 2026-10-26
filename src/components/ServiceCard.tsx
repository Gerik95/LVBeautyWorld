import Link from "next/link";
import { t } from "@/content/messages";
import type { Service } from "@/content/services";
import { pricesForService, formatPrice } from "@/content/prices";
import type { Locale } from "@/lib/site";
import { pathFor } from "@/lib/site";
import { BookButton } from "./BookButton";
import { Photo } from "./Photo";

export const ServiceCard = ({
  locale,
  service,
}: {
  locale: Locale;
  service: Service;
}) => {
  const copy = t(locale);
  const jump: Record<string, string> = {
    nails: "nails",
    "lashes-brows": "brows-lift",
    "lash-extensions": "lash-ext",
    hair: "hair",
    skin: "skin",
    laser: "laser-w",
    pmu: "pmu",
    makeup: "styling",
  };
  const lowest = pricesForService(service.id).sort((a, b) => a.amount - b.amount)[0];
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--lv-elev)] shadow-[var(--lv-shadow)]">
      <div className="relative aspect-[4/3]">
        <Photo
          src={service.image}
          alt={service.imageAlt[locale]}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-2xl">{service.name[locale]}</h3>
        <p className="text-sm text-[var(--lv-muted)]">{service.short[locale]}</p>
        <ul className="list-disc space-y-1 pl-4 text-sm">
          {service.treatments.map((item) => (
            <li key={item.de}>{item[locale]}</li>
          ))}
        </ul>
        {lowest ? (
          <p className="text-sm font-semibold">
            {formatPrice(locale, { ...lowest, kind: "from" })}
          </p>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          <Link
            href={pathFor(locale, `/services/${service.id}`)}
            className="min-h-11 rounded-[var(--radius-pill)] border border-[var(--lv-line)] px-4 text-sm font-semibold leading-[2.75rem]"
          >
            {copy.details}
          </Link>
          <Link
            href={pathFor(locale, `/prices#${jump[service.id]}`)}
            className="min-h-11 px-2 text-sm font-semibold leading-[2.75rem] underline-offset-4 hover:underline"
          >
            {copy.pricesLink}
          </Link>
          <BookButton locale={locale} />
        </div>
      </div>
    </article>
  );
};
