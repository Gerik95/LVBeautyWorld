import { t } from "@/content/messages";
import { googleQueryEmbedUrl } from "@/lib/maps";
import type { Locale } from "@/lib/site";

/** Route links sit beside the map in "Anfahrt" and in the contact rows; the map only shows the place. */
export const ContactMap = ({ locale }: { locale: Locale }) => {
  const copy = t(locale);
  const embed = googleQueryEmbedUrl(locale);

  return (
    <div className="map-block">
      <div className="map-frame">
        <iframe
          title={copy.mapTitle}
          src={embed}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
};
