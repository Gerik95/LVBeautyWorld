import { readFile } from "node:fs/promises";
import path from "node:path";
import { isLocale, locales } from "@/lib/site";
import { buildVCard } from "@/lib/vcard";

/** "In Kontakte speichern" on the contacts page. Built once per language at build time. */
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

const readPhoto = async () => {
  try {
    const file = await readFile(path.join(process.cwd(), "public/brand/apple-touch-icon.png"));
    return file.toString("base64");
  } catch {
    return null;
  }
};

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return new Response("Not found", { status: 404 });
  const body = buildVCard(lang, { photo: await readPhoto() });
  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      // Inline: iOS Safari opens the contact sheet directly; other browsers save the file.
      "Content-Disposition": 'inline; filename="LV-Beauty-World.vcf"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}
