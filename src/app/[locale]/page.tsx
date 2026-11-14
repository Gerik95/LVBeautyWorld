import { Hero } from "@/components/hero/Hero";
import { SalonStory } from "@/components/home/SalonStory";
import { SalonVisit } from "@/components/home/SalonVisit";
import { ServiceGallery } from "@/components/services/ServiceGallery";
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
    title: copy.homeSeoTitle,
    description: copy.homeSeoDesc,
    path: "/",
  });
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);
  return (
    <>
      <Hero
        locale={locale}
        kicker={copy.heroKicker}
        line1={copy.heroLine1}
        line2={copy.heroLine2}
        lead={copy.heroLead}
        discover={copy.discover}
      />
      <div className="home-after">
        <section id="services" className="svc" aria-labelledby="services-title">
          <ServiceGallery locale={locale} />
        </section>

        <SalonStory locale={locale} />
        <SalonVisit locale={locale} />
      </div>
    </>
  );
}
