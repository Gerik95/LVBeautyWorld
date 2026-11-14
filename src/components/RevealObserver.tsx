"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const RevealObserver = () => {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("js") || root.dataset.reveal !== "on") return;
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" },
    );
    nodes.forEach((node) => {
      if (node.classList.contains("is-in")) return;
      const rect = node.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.94 && rect.bottom > 0;
      if (inView) {
        node.classList.add("is-in");
        return;
      }
      node.classList.add("reveal-arm");
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
};
