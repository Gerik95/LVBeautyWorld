import { SettingsPanel } from "@/components/SettingsPanel";
import { t } from "@/content/messages";
import { buildMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/site";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return buildMetadata({
    locale,
    title: copy.settingsSeoTitle,
    description: copy.settingsSeoDesc,
    path: "/settings",
  });
};

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);
  return (
    <div className="space-y-6 pt-4">
      <h1 className="font-display text-4xl">{copy.settingsTitle}</h1>
      <SettingsPanel locale={locale} />
    </div>
  );
}
