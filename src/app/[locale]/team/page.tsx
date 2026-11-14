import { TeamCard } from "@/components/TeamCard";
import { t } from "@/content/messages";
import { team } from "@/content/team";
import { buildMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/site";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return buildMetadata({ locale, title: copy.teamSeoTitle, description: copy.teamSeoDesc, path: "/team" });
};

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);
  return (
    <div className="space-y-6 pt-4">
      <h1 className="font-display text-4xl">{copy.teamTitle}</h1>
      <p className="max-w-2xl text-[var(--lv-muted)]">{copy.teamLead}</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member, index) => (
          <TeamCard key={member.slug} locale={locale} member={member} priority={index < 3} />
        ))}
      </div>
    </div>
  );
}
