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
      className={`book-btn btn-glow inline-flex min-h-11 shrink-0 items-center justify-center rounded-[var(--radius-pill)] px-5 text-sm font-semibold tracking-wide whitespace-nowrap ${className}`}
      style={{
        backgroundColor: "var(--book-bg)",
        color: "var(--book-fg)",
        WebkitTextFillColor: "var(--book-fg)",
      }}
      aria-label={copy.bookAria}
    >
      <span
        className="book-btn-label"
        style={{ color: "var(--book-fg)", WebkitTextFillColor: "var(--book-fg)" }}
      >
        {copy.book}
      </span>
    </a>
  );
};
