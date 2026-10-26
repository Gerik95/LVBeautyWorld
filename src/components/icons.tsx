type IconProps = { className?: string };

export const IconHome = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.8Z" />
  </svg>
);

export const IconTeam = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="9" cy="8" r="3" />
    <path d="M4 19a5 5 0 0 1 10 0" />
    <circle cx="16.5" cy="9" r="2.4" />
    <path d="M15 19a4.2 4.2 0 0 1 5-4" />
  </svg>
);

export const IconPrice = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 3v18M8 8.5c0-1.5 1.6-2.5 4-2.5s4 1 4 2.5-1.8 2.4-4 2.5-4 1-4 2.7 1.8 2.8 4 2.8 4-1.1 4-2.6" />
  </svg>
);

export const IconPin = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
);

export const IconGear = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a7.7 7.7 0 0 0 .1-1.5 7.7 7.7 0 0 0-.1-1.5l2-1.5-2-3.4-2.3.7a7 7 0 0 0-2.6-1.5L14 2h-4l-.5 2.8A7 7 0 0 0 7 6.3L4.6 5.6 2.6 9l2 1.5a7.7 7.7 0 0 0-.1 1.5 7.7 7.7 0 0 0 .1 1.5l-2 1.5 2 3.4 2.3-.7a7 7 0 0 0 2.6 1.5L10 22h4l.5-2.8A7 7 0 0 0 17 17.7l2.4.7 2-3.4-2-1.5Z" />
  </svg>
);
