import { AppChrome } from "@/components/AppChrome";
import { LostPage } from "@/components/LostPage";
import { defaultLocale } from "@/lib/site";

/** Paths outside `/de` and `/uk` that skip the middleware, for example ones with a dot. */
export default function RootNotFound() {
  return (
    <AppChrome locale={defaultLocale}>
      <LostPage />
    </AppChrome>
  );
}
