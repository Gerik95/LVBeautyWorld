import Link from "next/link";
import { BookButton } from "@/components/BookButton";
import { ContactRows } from "@/components/ContactRows";
import { VisitNow } from "@/components/home/VisitNow";
import { t } from "@/content/messages";
import { pathFor, site, type Locale } from "@/lib/site";

const IconArrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M4.2 11.8 11.8 4.2M6.4 4.2H11.8V9.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SalonVisit = ({ locale }: { locale: Locale }) => {
  const copy = t(locale);

  return (
    <section className="chapter" aria-labelledby="visit-title">
      <div className="visit-plate" data-reveal="">
        <div className="visit-head">
          <div>
            <h2 id="visit-title" className="chapter-title">
              {copy.contactsTitle}
            </h2>
          </div>
          <VisitNow locale={locale} />
        </div>
        <p className="visit-lead">{copy.contactsLead}</p>
        <div className="visit-layout">
          <address className="visit-place">
            <span className="visit-street">{site.street}</span>
            <span className="visit-city">
              {site.postalCode} {site.city}-{site.district}
            </span>
          </address>
          <ContactRows locale={locale} markId="home-visit" />
          <div className="visit-actions">
            <BookButton locale={locale} />
            <Link className="visit-more" href={pathFor(locale, "/contacts")}>
              {copy.contactsMore}
              <IconArrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
