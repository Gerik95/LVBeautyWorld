type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconHome = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M4.5 11.2 12 4.8l7.5 6.4V19a1 1 0 0 1-1 1h-4.2v-5.2H9.7V20H5.5a1 1 0 0 1-1-1v-7.8Z" />
  </svg>
);

export const IconTeam = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="9" cy="8.2" r="2.6" />
    <path d="M4.2 18.6a4.8 4.8 0 0 1 9.6 0" />
    <circle cx="16.4" cy="9" r="2.1" />
    <path d="M15 18.6a4 4 0 0 1 4.6-3.4" />
  </svg>
);

export const IconPrice = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M8 7.2h10.5M8 12h10.5M8 16.8h10.5" />
    <path d="M5 7.2h.01M5 12h.01M5 16.8h.01" strokeWidth="2.4" />
  </svg>
);

export const IconMail = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="3.8" y="5.5" width="16.4" height="13" rx="1.6" />
    <path d="m4.4 7.2 7.6 5.6 7.6-5.6" />
  </svg>
);

export const IconSliders = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M4 8h16M4 16h16" />
    <circle cx="9" cy="8" r="1.7" fill="currentColor" stroke="none" />
    <circle cx="15" cy="16" r="1.7" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPhone = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M7.1 3.9h2.3c.5 0 1 .3 1.1.8l.8 2.7c.1.5-.1 1.1-.6 1.4l-1.6.8a11.6 11.6 0 0 0 5.1 5.1l.8-1.6c.3-.5.9-.7 1.4-.6l2.7.8c.5.1.8.6.8 1.1v2.3c0 .9-.7 1.6-1.6 1.6A14.7 14.7 0 0 1 5.5 5.5c0-.9.7-1.6 1.6-1.6Z" />
  </svg>
);

/** Front of a car. Travel modes on the contacts page. */
export const IconCar = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M6.2 11.6 7.5 7.9a1.6 1.6 0 0 1 1.5-1.1h6a1.6 1.6 0 0 1 1.5 1.1l1.3 3.7" />
    <path d="M4.6 12.6a1 1 0 0 1 1-1h12.8a1 1 0 0 1 1 1v3.9a.9.9 0 0 1-.9.9H5.5a.9.9 0 0 1-.9-.9Z" />
    <path d="M6.9 17.4v1.7M17.1 17.4v1.7" />
    <circle cx="7.9" cy="14.6" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="16.1" cy="14.6" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

/** Front of a tram. */
export const IconTram = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="6.2" y="4.6" width="11.6" height="13.2" rx="2.3" />
    <path d="M6.2 10.6h11.6M9.6 7.2h4.8" />
    <circle cx="9" cy="14.4" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="15" cy="14.4" r="0.75" fill="currentColor" stroke="none" />
    <path d="m8.6 17.8-1.6 2.4M15.4 17.8l1.6 2.4" />
  </svg>
);

/** A walking figure. */
export const IconWalk = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="13.4" cy="4.6" r="1.6" />
    <path d="m12.6 8.4-1.4 6.3 3 2.4.8 3.6" />
    <path d="m11.2 14.7-1.9 2.6-2.1 3" />
    <path d="M12.6 8.4 9.8 9.9l-1 2.8M12.6 8.4l1.3 2.9 2.7 1.1" />
  </svg>
);

/** Address card with a plus. "Save to contacts". */
export const IconContactAdd = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="3.6" y="5.2" width="12.6" height="13.6" rx="1.8" />
    <circle cx="9.9" cy="10.4" r="2.1" />
    <path d="M6.6 16a3.5 3.5 0 0 1 6.6 0" />
    <path className="contact-add-plus" d="M19.4 9.2v5.2M16.8 11.8H22" />
  </svg>
);

/** Thin chevron for steppers. Points right; `flip` points left. */
export const IconChevron = ({ flip = false }: { flip?: boolean }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M6.2 3.6 10.6 8l-4.4 4.4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
