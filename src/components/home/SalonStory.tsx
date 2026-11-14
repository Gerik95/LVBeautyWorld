import type { CSSProperties } from "react";
import { Photo } from "@/components/Photo";
import { t } from "@/content/messages";
import type { Locale } from "@/lib/site";

export const SalonStory = ({ locale }: { locale: Locale }) => {
  const copy = t(locale);

  return (
    <section className="chapter" aria-labelledby="salon-title">
      <div className="salon-spread">
        <figure className="salon-figure" data-reveal="">
          <Photo
            src="/photos/salon/interior.jpg"
            alt={copy.aboutPhotoAlt}
            fill
            sizes="(max-width: 859px) 92vw, 36vw"
            className="salon-photo"
          />
        </figure>
        <div className="salon-copy" data-reveal="" style={{ "--d": 1 } as CSSProperties}>
          <h2 id="salon-title" className="chapter-title">
            {copy.aboutTitle}
          </h2>
          <p className="salon-body">{copy.aboutBody}</p>
          <dl className="salon-facts">
            {copy.aboutFacts.map((fact) => (
              <div key={fact.value} className="salon-fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
