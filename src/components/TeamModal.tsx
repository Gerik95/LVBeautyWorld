"use client";

import { useEffect, useId, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/content/messages";
import type { TeamMember } from "@/content/team";
import type { Locale } from "@/lib/site";
import { TeamProfile } from "./TeamProfile";

export const TeamModal = ({
  locale,
  member,
}: {
  locale: Locale;
  member: TeamMember;
}) => {
  const router = useRouter();
  const copy = t(locale);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  const restoreFocus = useRef(true);

  const handleClose = () => {
    router.back();
  };

  const handleDismiss = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (event.detail > 0) restoreFocus.current = false;
    handleClose();
  };

  useEffect(() => {
    previous.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", handleKey);
      if (!restoreFocus.current) return;
      previous.current?.focus();
    };
    // close uses router.back; mount/unmount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        aria-label={copy.close}
        onClick={handleDismiss}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[94dvh] w-full overflow-y-auto rounded-t-[1.5rem] bg-[var(--lv-elev)] p-5 text-[var(--lv-ink)] shadow-[var(--lv-shadow)] sm:max-h-[88dvh] sm:max-w-3xl sm:rounded-[var(--radius-lg)]"
      >
        <div className="mb-2 flex justify-end">
          <button
            ref={closeRef}
            type="button"
            onClick={handleDismiss}
            className="min-h-11 rounded-[var(--radius-pill)] px-4 text-sm font-semibold"
          >
            {copy.close}
          </button>
        </div>
        <TeamProfile locale={locale} member={member} titleId={titleId} />
      </div>
    </div>
  );
};
