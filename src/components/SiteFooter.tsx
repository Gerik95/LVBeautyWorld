import Link from "next/link";
import { t } from "@/content/messages";
import { legalDocs } from "@/content/legal";
import type { Locale } from "@/lib/site";
import { pathFor } from "@/lib/site";

export const SiteFooter = ({ locale }: { locale: Locale }) => {
  const copy = t(locale);
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer mt-16 border-t border-[var(--lv-line)] px-4 pb-6 pt-8 text-center text-sm text-[var(--lv-muted)] sm:px-6">
      <p className="font-medium text-[var(--lv-ink)]">{copy.footerCopy(year)}</p>
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {legalDocs.map((doc) => (
          <li key={doc.id}>
            <Link className="ui-inline" href={pathFor(locale, `/legal/${doc.id}`)}>
              {doc.title[locale]}
            </Link>
          </li>
        ))}
        <li>
          <Link className="ui-inline" href={pathFor(locale, "/settings")}>
            {copy.nav.settings}
          </Link>
        </li>
      </ul>
    </footer>
  );
};
