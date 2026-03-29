type IconName =
  | "loop"
  | "user-plus"
  | "shield"
  | "wallet"
  | "ticket"
  | "spark"
  | "eye"
  | "pulse"
  | "receipt"
  | "lock"
  | "dashboard"
  | "stamp"
  | "flow"
  | "gavel";

type LandingIconProps = {
  className?: string;
  name: IconName;
};

export function LandingIcon({ className = "size-5", name }: LandingIconProps) {
  const sharedProps = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "loop":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "user-plus":
      return (
        <svg {...sharedProps}>
          <path d="M15 19c0-2.21-2.24-4-5-4s-5 1.79-5 4" />
          <circle cx="10" cy="8" r="3" />
          <path d="M19 8v6" />
          <path d="M16 11h6" />
        </svg>
      );
    case "shield":
      return (
        <svg {...sharedProps}>
          <path d="M12 3l7 3v5c0 4.5-2.7 7.3-7 10-4.3-2.7-7-5.5-7-10V6l7-3z" />
          <path d="m9.5 11.5 1.8 1.8 3.7-4.1" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...sharedProps}>
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5z" />
          <path d="M4 8h13a3 3 0 0 1 0 6H4" />
          <circle cx="16.5" cy="11" r=".9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "ticket":
      return (
        <svg {...sharedProps}>
          <path d="M5 8a2 2 0 1 1 0 4v4h14v-4a2 2 0 1 1 0-4V4H5z" />
          <path d="M12 7v10" />
        </svg>
      );
    case "spark":
      return (
        <svg {...sharedProps}>
          <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" />
          <path d="M19 4v3" />
          <path d="M20.5 5.5h-3" />
        </svg>
      );
    case "eye":
      return (
        <svg {...sharedProps}>
          <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "pulse":
      return (
        <svg {...sharedProps}>
          <path d="M3 12h4l2-4 3 8 2-4h7" />
        </svg>
      );
    case "receipt":
      return (
        <svg {...sharedProps}>
          <path d="M7 3h10v18l-2-1.5L13 21l-2-1.5L9 21l-2-1.5L5 21V5a2 2 0 0 1 2-2z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
        </svg>
      );
    case "lock":
      return (
        <svg {...sharedProps}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7.5a4 4 0 1 1 8 0V10" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...sharedProps}>
          <rect x="4" y="4" width="6" height="6" rx="1.5" />
          <rect x="14" y="4" width="6" height="10" rx="1.5" />
          <rect x="4" y="14" width="6" height="6" rx="1.5" />
          <rect x="14" y="16" width="6" height="4" rx="1.5" />
        </svg>
      );
    case "stamp":
      return (
        <svg {...sharedProps}>
          <path d="M8 8a4 4 0 1 1 8 0c0 2.5 1 3.5 2 4v2H6v-2c1-.5 2-1.5 2-4z" />
          <path d="M7 18h10" />
        </svg>
      );
    case "flow":
      return (
        <svg {...sharedProps}>
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <path d="M8.5 11h4" />
          <path d="M12.5 11c2 0 3-1.2 4-2.5" />
          <path d="M12.5 13c2 0 3 1.2 4 2.5" />
        </svg>
      );
    case "gavel":
      return (
        <svg {...sharedProps}>
          <path d="m14.5 5 4.5 4.5" />
          <path d="m11 8.5 4.5 4.5" />
          <path d="m7 12.5 4.5 4.5" />
          <path d="M5 19h6" />
        </svg>
      );
  }
}
