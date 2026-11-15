"use client";

import { Suspense } from "react";
import { useSkinDecor } from "./skinDecor";

/** Site-wide layer of the active skin. Renders nothing for `default`. */
export const SiteDecorSlot = () => {
  const Decor = useSkinDecor("site");
  if (!Decor) return null;
  return (
    <Suspense fallback={null}>
      <Decor />
    </Suspense>
  );
};
