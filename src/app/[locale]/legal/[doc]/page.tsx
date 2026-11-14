import { notFound } from "next/navigation";
import { getLegal, legalDocs } from "@/content/legal";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, locales } from "@/lib/site";

export const generateStaticParams = () =>
  locales.flatMap((locale) => legalDocs.map((doc) => ({ locale, doc: doc.id })));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) => {
  const { locale, doc: id } = await params;
  if (!isLocale(locale)) return {};
  const doc = getLegal(id);
  if (!doc) return {};
  return buildMetadata({
    locale,
    title: doc.title[locale],
    description: doc.seoDesc[locale],
    path: `/legal/${doc.id}`,
  });
};

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) {
  const { locale, doc: id } = await params;
  if (!isLocale(locale)) notFound();
  const doc = getLegal(id);
  if (!doc) notFound();

  return (
    <article className="prose-legal mx-auto max-w-2xl space-y-4 pt-4">
      <h1 className="font-display text-4xl">{doc.title[locale]}</h1>
      {doc.body[locale].map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="text-sm leading-relaxed text-[var(--lv-muted)]">
          {paragraph}
        </p>
      ))}
    </article>
  );
}
