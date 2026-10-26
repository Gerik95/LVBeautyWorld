import Link from "next/link";
import { t } from "@/content/messages";
import { legalDocs } from "@/content/legal";
import type { Locale } from "@/lib/site";
import { pathFor } from "@/lib/site";

export const SiteFooter = ({ locale }: { locale: Locale }) => {
  const copy = t(locale);
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-[var(--lv-line)] px-4 pb-6 pt-8 text-sm text-[var(--lv-muted)]">
      <p className="font-medium text-[var(--lv-ink)]">{copy.footerCopy(year)}</p>
      <p className="mt-3">{copy.footerLegal}</p>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
        {legalDocs.map((doc) => (
          <li key={doc.id}>
            <Link className="underline-offset-4 hover:underline" href={pathFor(locale, `/legal/${doc.id}`)}>
              {doc.title[locale]}
            </Link>
          </li>
        ))}
        <li>
          <Link className="underline-offset-4 hover:underline" href={pathFor(locale, "/settings")}>
            {copy.nav.settings}
          </Link>
        </li>
      </ul>
    </footer>
  );
};
