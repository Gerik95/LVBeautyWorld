import Link from "next/link";
import { notFound } from "next/navigation";
import { TeamProfile } from "@/components/TeamProfile";
import { t } from "@/content/messages";
import { getMember, team } from "@/content/team";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, locales, pathFor } from "@/lib/site";

export const generateStaticParams = () =>
  locales.flatMap((locale) => team.map((member) => ({ locale, slug: member.slug })));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) => {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const member = getMember(slug);
  if (!member) return {};
  return buildMetadata({
    locale,
    title: `${member.name} | ${t(locale).teamTitle}`,
    description: member.specialty?.[locale] ?? t(locale).teamSeoDesc,
    path: `/team/${member.slug}`,
  });
};

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const member = getMember(slug);
  if (!member) notFound();
  const copy = t(locale);
  return (
    <div className="space-y-6 pt-4">
      <Link href={pathFor(locale, "/team")} className="ui-inline text-sm font-semibold">
        ← {copy.teamAll}
      </Link>
      <TeamProfile locale={locale} member={member} />
    </div>
  );
}
