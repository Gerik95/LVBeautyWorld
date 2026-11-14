import type { TeamMember } from "@/content/team";
import { salonCategoryList } from "@/lib/booking";
import type { Locale } from "@/lib/site";
import { Photo } from "./Photo";
import { BookButton } from "./BookButton";

export const TeamProfile = ({
  locale,
  member,
  titleId,
}: {
  locale: Locale;
  member: TeamMember;
  /** Lets the modal name its dialog by this heading. */
  titleId?: string;
}) => {
  const role = member.specialty?.[locale];
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,18rem)_1fr] md:items-start">
      <div className="team-photo">
        {member.photo ? (
          <Photo
            src={member.photo}
            alt={member.name}
            stayColor
            priority
            fill
            sizes="(max-width: 768px) 100vw, 18rem"
            className="object-cover"
            style={{ objectPosition: member.objectPosition }}
          />
        ) : (
          <span className="mark-plate" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.svg" alt="" />
          </span>
        )}
      </div>
      <div className="space-y-4">
        <h1 id={titleId} className="font-display text-4xl">
          {member.name}
        </h1>
        {role ? <p className="text-[var(--lv-muted)]">{role}</p> : null}
        {member.line ? <p>{member.line[locale]}</p> : null}
        <BookButton locale={locale} href={salonCategoryList(member.salonkeeCategory)} />
      </div>
    </div>
  );
};
