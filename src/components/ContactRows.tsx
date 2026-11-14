import { IconInstagram, IconMailOpen, IconRoute } from "./BrandMarks";
import { IconPhone } from "./icons";
import { t } from "@/content/messages";
import { googleDirectionsUrl } from "@/lib/maps";
import { site, type Locale } from "@/lib/site";

/**
 * Call, write, Instagram, route: icon, small label and value on one line.
 * The same rows and the same hover marks on the home page and on Kontakt.
 * `markId` keeps the Instagram gradient id unique on a page.
 * `route={false}` drops the route row where the page has its own Anfahrt block.
 */
export const ContactRows = ({
  locale,
  markId,
  route = true,
}: {
  locale: Locale;
  markId: string;
  route?: boolean;
}) => {
  const copy = t(locale);
  return (
    <ul className="visit-rows">
      <li>
        <a className="visit-row mark-phone" href={`tel:${site.phoneTel}`}>
          <span className="visit-row-icon">
            <IconPhone className="phone-icon" />
          </span>
          <span className="visit-row-label">{copy.contactCall}</span>
          <span className="visit-row-value">{site.phoneDisplay}</span>
        </a>
      </li>
      <li>
        <a className="visit-row mark-mail" href={`mailto:${site.email}`}>
          <span className="visit-row-icon">
            <IconMailOpen />
          </span>
          <span className="visit-row-label">{copy.contactWrite}</span>
          <span className="visit-row-value">{site.email}</span>
        </a>
      </li>
      <li>
        <a className="visit-row mark-ig" href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
          <span className="visit-row-icon">
            <IconInstagram markId={markId} />
          </span>
          <span className="visit-row-label">{copy.contactInstagram}</span>
          <span className="visit-row-value">{site.instagramHandle}</span>
        </a>
      </li>
      {route ? (
        <li>
          <a className="visit-row mark-route" href={googleDirectionsUrl()} target="_blank" rel="noopener noreferrer">
            <span className="visit-row-icon">
              <IconRoute />
            </span>
            <span className="visit-row-label">{copy.contactRoute}</span>
            <span className="visit-row-value">{copy.mapRoute}</span>
          </a>
        </li>
      ) : null}
    </ul>
  );
};
