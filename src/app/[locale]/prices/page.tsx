import { BookButton } from "@/components/BookButton";
import { t } from "@/content/messages";
import { formatPrice, priceCategories, prices } from "@/content/prices";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, site } from "@/lib/site";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return buildMetadata({
    locale,
    title: copy.pricesSeoTitle,
    description: copy.pricesSeoDesc,
    path: "/prices",
  });
};

export default async function PricesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);

  return (
    <div className="space-y-8 pt-4">
      <h1 className="font-display text-4xl">{copy.nav.prices}</h1>
      <p className="max-w-2xl text-sm text-[var(--lv-muted)]">{copy.priceDisclaimer}</p>
      <nav aria-label={copy.priceNav} className="flex flex-wrap gap-2">
        {priceCategories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="min-h-11 rounded-[var(--radius-pill)] border border-[var(--lv-line)] px-3 text-sm leading-[2.75rem]"
          >
            {category[locale]}
          </a>
        ))}
      </nav>
      {priceCategories.map((category) => {
        const items = prices.filter((item) => item.categoryId === category.id);
        return (
          <section key={category.id} id={category.id} className="scroll-mt-24 space-y-3">
            <h2 className="font-display text-2xl">{category[locale]}</h2>
            <ul className="divide-y divide-[var(--lv-line)] overflow-x-hidden rounded-[var(--radius-md)] bg-[var(--lv-elev)]">
              {items.map((item) => (
                <li key={item.id} className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm">
                  <span className="min-w-0 break-words">{item[locale]}</span>
                  <span className="shrink-0 font-semibold tabular-nums">{formatPrice(locale, item)}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <div className="space-y-2">
        <BookButton locale={locale} />
        <p className="text-xs text-[var(--lv-muted)]">{site.bookingUrl.replace("https://", "")}</p>
      </div>
    </div>
  );
}
