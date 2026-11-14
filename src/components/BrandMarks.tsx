type MarkProps = { markId: string };

export const IconInstagram = ({ markId }: MarkProps) => {
  const grad = `${markId}-ig`;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ig-icon" fill="none" strokeWidth="1.5">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#833AB4" />
          <stop offset="28%" stopColor="#C13584" />
          <stop offset="52%" stopColor="#E1306C" />
          <stop offset="74%" stopColor="#F77737" />
          <stop offset="100%" stopColor="#FCAF45" />
        </linearGradient>
      </defs>
      <g className="ig-ink" stroke="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.25" />
        <circle cx="17.2" cy="6.8" r="0.7" fill="currentColor" stroke="none" />
      </g>
      <g className="ig-brand" stroke={`url(#${grad})`}>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.25" />
        <circle cx="17.2" cy="6.8" r="0.7" fill={`url(#${grad})`} stroke="none" />
      </g>
    </svg>
  );
};

/** Closed envelope. On hover the lid folds up and a card rises out of the mouth. */
export const IconMailOpen = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="mail-icon"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path className="mail-seam" d="M4.15 8.15 12 13.15 19.85 8.15" />
    <rect className="mail-pocket" x="3" y="7.35" width="18" height="10.5" rx="1.4" />
    <g className="mail-sheet">
      <rect x="6.55" y="9.15" width="10.9" height="5.7" rx="0.35" fill="var(--lv-paper)" />
      <path d="M7.7 11h8.6M7.7 12.7h5.1" strokeWidth="1.1" />
    </g>
    <path className="mail-flap" d="M3.45 7.35 12 12.65 20.55 7.35" />
    <path className="mail-lid" d="M4.25 7.25 7.45 2.15h9.1l3.2 5.1" fill="currentColor" fillOpacity="0.12" />
  </svg>
);

/** Upward navigation arrow, the mark Google Maps uses for the driver. */
export const IconRoute = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="route-icon" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M12 3.5 5.7 20.2 12 16.6 18.3 20.2Z" />
  </svg>
);
