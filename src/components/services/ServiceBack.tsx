"use client";

import Link from "next/link";
import { isHomeServiceId } from "@/lib/serviceGallery";
import { SERVICE_KEY } from "@/lib/storage";

/** Back to the home gallery. The gallery reopens on the service the visitor was reading. */
export const ServiceBack = ({ href, label, serviceId }: { href: string; label: string; serviceId: string }) => {
  const remember = () => {
    if (!isHomeServiceId(serviceId)) return;
    try {
      sessionStorage.setItem(SERVICE_KEY, serviceId);
    } catch {
      /* Storage can be blocked. The gallery then opens on its first service. */
    }
  };

  return (
    <Link className="sp-back" href={href} onClick={remember}>
      <span className="sp-back-icon" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M12.6 8H3.6M7.4 4.2 3.6 8l3.8 3.8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{label}</span>
    </Link>
  );
};
