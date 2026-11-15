"use client";

import { Suspense } from "react";
import { useSkinDecor } from "./skinDecor";

export const NavAccentSlot = () => {
  const Decor = useSkinDecor("nav");
  if (!Decor) return null;
  return (
    <Suspense fallback={null}>
      <div className="dock-accent pointer-events-none absolute inset-0" aria-hidden="true">
        <Decor />
      </div>
    </Suspense>
  );
};
