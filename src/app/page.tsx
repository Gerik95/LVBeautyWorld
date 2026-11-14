import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/site";
import { LOCALE_COOKIE } from "@/lib/storage";

/** `src/middleware.ts` redirects `/` first. This is the fallback when it does not run. */
export default async function RootPage() {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  redirect(saved === "uk" ? "/uk" : `/${defaultLocale}`);
}
