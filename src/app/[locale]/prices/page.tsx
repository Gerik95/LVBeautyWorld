import { BookButton } from "@/components/BookButton";
import { PriceIndex } from "@/components/PriceIndex";
import { PriceRow } from "@/components/PriceRow";
import { t } from "@/content/messages";
import { priceCategories, prices } from "@/content/prices";
import { buildMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/site";
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
    <div className="price-page pt-4">
      <header className="space-y-8">
        <h1 className="font-display text-4xl">{copy.nav.prices}</h1>
        <p className="max-w-2xl text-sm text-[var(--lv-muted)]">{copy.priceDisclaimer}</p>
      </header>
      <div className="price-layout">
        <PriceIndex
          label={copy.nav.prices}
          categories={priceCategories.map((category) => ({ id: category.id, label: category[locale] }))}
        />
        <div className="price-body">
          {priceCategories.map((category) => {
            const items = prices.filter((item) => item.categoryId === category.id);
            return (
              <section key={category.id} id={category.id} className="price-section space-y-3" data-reveal="">
                <h2 className="font-display text-2xl">{category[locale]}</h2>
                <ul className="price-menu divide-y divide-[var(--lv-line)] overflow-x-hidden rounded-[var(--radius-md)] bg-[var(--lv-elev)]">
                  {items.map((item) => (
                    <PriceRow key={item.id} locale={locale} item={item} menu />
                  ))}
                </ul>
              </section>
            );
          })}
          <BookButton locale={locale} />
        </div>
      </div>
    </div>
  );
}
