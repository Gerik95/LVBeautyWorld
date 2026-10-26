import Link from "next/link";
import { t } from "@/content/messages";
import type { TeamMember } from "@/content/team";
import type { Locale } from "@/lib/site";
import { pathFor } from "@/lib/site";
import { Photo } from "./Photo";

export const TeamCard = ({
  locale,
  member,
}: {
  locale: Locale;
  member: TeamMember;
}) => {
  const copy = t(locale);
  const role = member.specialty?.[locale] ?? copy.teamMissingRole;
  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--lv-elev)] shadow-[var(--lv-shadow)]">
      <Link href={pathFor(locale, `/team/${member.slug}`)} className="block">
        <div className="relative aspect-[3/4] bg-[var(--lv-graphite)]">
          {member.photo ? (
            <Photo
              src={member.photo}
              alt={member.name}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover"
              style={{ objectPosition: member.objectPosition }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-white.svg" alt="" className="h-24 w-24 opacity-70" />
            </div>
          )}
        </div>
        <div className="space-y-1 px-4 py-4">
          <h2 className="font-display text-2xl">{member.name}</h2>
          <p className="text-sm text-[var(--lv-muted)]">{role}</p>
          {member.line ? <p className="text-sm">{member.line[locale]}</p> : null}
          <span className="mt-2 inline-block text-sm font-semibold underline-offset-4 hover:underline">
            {copy.teamMore}
          </span>
        </div>
      </Link>
    </article>
  );
};
