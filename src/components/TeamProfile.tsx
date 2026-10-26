import { t } from "@/content/messages";
import type { TeamMember } from "@/content/team";
import { site, type Locale } from "@/lib/site";
import { Photo } from "./Photo";
import { BookButton } from "./BookButton";

export const TeamProfile = ({
  locale,
  member,
}: {
  locale: Locale;
  member: TeamMember;
}) => {
  const copy = t(locale);
  const role = member.specialty?.[locale] ?? copy.teamMissingRole;
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,18rem)_1fr] md:items-start">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--lv-graphite)]">
        {member.photo ? (
          <Photo
            src={member.photo}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 100vw, 18rem"
            className="object-cover"
            style={{ objectPosition: member.objectPosition }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-white.svg" alt="" className="h-28 w-28 opacity-70" />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <h1 className="font-display text-4xl">{member.name}</h1>
        <p className="text-[var(--lv-muted)]">{role}</p>
        {member.line ? <p>{member.line[locale]}</p> : null}
        <p className="text-sm text-[var(--lv-muted)]">{copy.teamNoBio}</p>
        <p className="text-sm">{copy.teamBookingNote}</p>
        <BookButton locale={locale} />
        <p className="text-xs text-[var(--lv-muted)]">{site.bookingUrl.replace("https://", "")}</p>
      </div>
    </div>
  );
};
