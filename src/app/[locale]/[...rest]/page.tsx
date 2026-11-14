import { notFound } from "next/navigation";

/** Any path under a language that no route claims. Renders `[locale]/not-found` inside the site chrome. */
export default function UnknownPage() {
  notFound();
}
