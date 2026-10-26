import { site } from "@/lib/site";
import type { Locale } from "@/lib/site";
import { t } from "@/content/messages";

export const BookButton = ({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) => {
  const copy = t(locale);
  return (
    <a
      href={site.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`book-btn btn-glow inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] px-5 text-sm font-semibold tracking-wide ${className}`}
      aria-label={copy.bookAria}
    >
      {copy.book}
    </a>
  );
};
