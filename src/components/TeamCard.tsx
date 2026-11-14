import Link from "next/link";
import { t } from "@/content/messages";
import type { TeamMember } from "@/content/team";
import type { Locale } from "@/lib/site";
import { pathFor } from "@/lib/site";
import { Photo } from "./Photo";

export const TeamCard = ({
  locale,
  member,
  priority = false,
}: {
  locale: Locale;
  member: TeamMember;
  /** First row of the grid: in view on load, so it should not wait for lazy loading. */
  priority?: boolean;
}) => {
  const copy = t(locale);
  const role = member.specialty?.[locale];
  return (
    <div data-reveal="">
      <article className="team-card ui-hover">
        <Link href={pathFor(locale, `/team/${member.slug}`)} className="block">
          <div className="team-photo">
            {member.photo ? (
              <Photo
                src={member.photo}
                alt={member.name}
                fill
                priority={priority}
                sizes="(max-width: 640px) 100vw, 33vw"
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
          <div className="space-y-1 px-4 py-4">
            <h2 className="font-display text-2xl">{member.name}</h2>
            {role ? <p className="text-sm text-[var(--lv-muted)]">{role}</p> : null}
            {member.line ? <p className="text-sm">{member.line[locale]}</p> : null}
            <span className="mt-2 inline-block text-sm font-semibold">{copy.teamMore}</span>
          </div>
        </Link>
      </article>
    </div>
  );
};
