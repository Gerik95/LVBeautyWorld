import { t } from "@/content/messages";
import { formatPrice, type PriceItem } from "@/content/prices";
import { salonCheckout, salonkeeServiceIds } from "@/lib/booking";
import type { Locale } from "@/lib/site";

export const PriceRow = ({
  locale,
  item,
  menu = false,
}: {
  locale: Locale;
  item: PriceItem;
  menu?: boolean;
}) => {
  const copy = t(locale);
  const price = formatPrice(locale, item);
  const rowClass = menu
    ? "price-row flex min-h-11 items-baseline justify-between gap-4 px-4 py-3 text-sm text-inherit"
    : "group flex min-h-11 items-baseline justify-between gap-4 px-4 py-3 text-sm text-inherit";
  const nameClass = menu ? "min-w-0 break-words" : "min-w-0 break-words underline-offset-4 group-hover:underline";

  return (
    <li>
      <a
        href={salonCheckout(salonkeeServiceIds[item.id])}
        target="_blank"
        rel="noopener noreferrer"
        className={rowClass}
        aria-label={`${copy.book}: ${item[locale]}, ${price}`}
      >
        <span className={nameClass}>{item[locale]}</span>
        <span className="shrink-0 font-semibold tabular-nums">{price}</span>
      </a>
    </li>
  );
};
