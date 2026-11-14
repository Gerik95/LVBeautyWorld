import { site, type Locale } from "@/lib/site";
import { t } from "@/content/messages";

export const BookButton = ({
  locale,
  className = "",
  beam = false,
  href = site.bookingUrl,
}: {
  locale: Locale;
  className?: string;
  /** Hero instance. In the dark theme it takes light from the spotlight. */
  beam?: boolean;
  /** Exact Salonkee checkout. Defaults to the full salon menu. */
  href?: string;
}) => {
  const copy = t(locale);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-beam-target={beam ? "" : undefined}
      className={`book-btn ui-hover inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-5 text-sm font-semibold tracking-wide ${className}`}
      aria-label={copy.bookAria}
    >
      <span className="book-btn-label">{copy.book}</span>
      <span className="book-arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
};
