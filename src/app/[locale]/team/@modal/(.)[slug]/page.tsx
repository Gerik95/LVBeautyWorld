import { notFound } from "next/navigation";
import { TeamModal } from "@/components/TeamModal";
import { getMember } from "@/content/team";
import { isLocale } from "@/lib/site";

export default async function InterceptedTeamModal({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const member = getMember(slug);
  if (!member) notFound();
  return <TeamModal locale={locale} member={member} />;
}
