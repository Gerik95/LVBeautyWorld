"use client";

import { Suspense } from "react";
import { useSkinDecor } from "../skinDecor";

export const HeroDecorSlot = () => {
  const Decor = useSkinDecor("hero");
  if (!Decor) return null;
  return (
    <Suspense fallback={null}>
      <div className="hero-decor" aria-hidden="true">
        <Decor />
      </div>
    </Suspense>
  );
};
