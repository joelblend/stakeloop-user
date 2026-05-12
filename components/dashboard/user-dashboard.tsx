import dynamic from "next/dynamic";
import Link from "next/link";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { SlotPurchasePanel } from "@/components/dashboard/slot-purchase-panel";
import { SiteLogo } from "@/components/landing/site-logo";
import {
  asDashboardNumber,
  formatDashboardCompactCurrency,
  formatDashboardCurrency,
  formatDashboardDateTimeLabel,
  formatDashboardMonthLabel,
  formatDashboardShortDateLabel,
} from "@/lib/dashboard-formatters";
import {
  buildDashboardTabHref,
  buildWalletHistoryHref,
  type DashboardTab,
  type WalletQueryState,
  WALLET_PAGE_SIZE_OPTIONS,
  walletCategoryOptions,
} from "@/lib/dashboard-wallet";
import type {
  ActiveSlotOfferPayload,
  AuthSessionPayload,
  UserPurchasesPayload,
  UserWalletFilters,
  UserWalletPagination,
  UserSlotPurchase,
  UserWalletEntry,
} from "@/lib/stakeloop-api";

const PayoutReportCenter = dynamic(
  () =>
    import("@/components/dashboard/payout-report-center").then(
      (module) => module.PayoutReportCenter,
    ),
  {
    loading: () => (
      <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 p-6 text-sm font-semibold text-slate-500 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.35)]">
        Loading payout desk...
      </div>
    ),
  },
);

type UserDashboardProps = {
  activeOffer: ActiveSlotOfferPayload | null;
  activeTab: DashboardTab;
  purchases: UserPurchasesPayload | null;
  session: AuthSessionPayload;
};

type DashboardIconName =
  | "arrow-right"
  | "bell"
  | "calendar"
  | "dashboard"
  | "help"
  | "menu"
  | "pulse"
  | "receipt"
  | "search"
  | "settings"
  | "shield"
  | "support"
  | "ticket"
  | "trend"
  | "user"
  | "users"
  | "wallet";

type DashboardNavItem = {
  active?: boolean;
  href: string;
  icon: DashboardIconName;
  label: string;
};

const dashboardTabs = [
  {
    icon: "dashboard",
    label: "Overview",
    tab: "overview",
  },
  {
    icon: "pulse",
    label: "Performance",
    tab: "performance",
  },
] as const;


function getPrimaryNavigation(
  activeTab: DashboardTab,
  walletQuery: WalletQueryState,
): DashboardNavItem[] {
  if (activeTab === "performance") {
    return [
      {
        active: true,
        href: buildDashboardTabHref("performance", walletQuery),
        icon: "pulse",
        label: "Performance",
      },
      {
        href: buildDashboardTabHref("performance", walletQuery, "snapshot"),
        icon: "dashboard",
        label: "Snapshot",
      },
      {
        href: buildDashboardTabHref("performance", walletQuery, "composition"),
        icon: "trend",
        label: "Composition",
      },
      {
        href: buildDashboardTabHref("performance", walletQuery, "coverage"),
        icon: "calendar",
        label: "Coverage",
      },
      {
        href: buildDashboardTabHref("performance", walletQuery, "payouts"),
        icon: "wallet",
        label: "Payouts",
      },
      {
        href: buildDashboardTabHref("performance", walletQuery, "reports"),
        icon: "receipt",
        label: "Reports",
      },
    ];
  }

  return [
    {
      active: true,
      href: buildDashboardTabHref("overview", walletQuery),
      icon: "dashboard",
      label: "Overview",
    },
    {
      href: buildDashboardTabHref("overview", walletQuery, "offer"),
      icon: "ticket",
      label: "Offer",
    },
    {
      href: buildDashboardTabHref("overview", walletQuery, "inventory"),
      icon: "trend",
      label: "Inventory",
    },
    {
      href: buildDashboardTabHref("overview", walletQuery, "activity"),
      icon: "receipt",
      label: "Activity",
    },
    {
      href: buildDashboardTabHref("overview", walletQuery, "referrals"),
      icon: "users",
      label: "Referrals",
    },
  ];
}

function getSupportNavigation(
  activeTab: DashboardTab,
  walletQuery: WalletQueryState,
): DashboardNavItem[] {
  return [
    {
      href: buildDashboardTabHref(activeTab, walletQuery, "support"),
      icon: "help",
      label: "Help/Support",
    },
    {
      href: "/complete-profile",
      icon: "settings",
      label: "Profile",
    },
  ];
}

function DashboardIcon({
  className = "size-5",
  name,
}: {
  className?: string;
  name: DashboardIconName;
}) {
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
    case "arrow-right":
      return (
        <svg {...sharedProps}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "bell":
      return (
        <svg {...sharedProps}>
          <path d="M7 10a5 5 0 1 1 10 0v4l2 2H5l2-2v-4" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...sharedProps}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M4 10h16" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...sharedProps}>
          <rect x="4" y="4" width="6" height="6" rx="1.2" />
          <rect x="14" y="4" width="6" height="10" rx="1.2" />
          <rect x="4" y="14" width="6" height="6" rx="1.2" />
          <rect x="14" y="16" width="6" height="4" rx="1.2" />
        </svg>
      );
    case "help":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.75 9a2.5 2.5 0 1 1 4.27 1.77c-.8.8-1.52 1.33-1.52 2.48" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "menu":
      return (
        <svg {...sharedProps}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );
    case "pulse":
      return (
        <svg {...sharedProps}>
          <path d="M3 12h4l2.2-5 4.2 10 2.1-5H21" />
        </svg>
      );
    case "receipt":
      return (
        <svg {...sharedProps}>
          <path d="M7 4h10v16l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5V6a2 2 0 0 1 2-2Z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
        </svg>
      );
    case "search":
      return (
        <svg {...sharedProps}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case "settings":
      return (
        <svg {...sharedProps}>
          <path d="M12 3.75 14 5l2.4-.35.95 2.2L19.5 8 18.75 10l.75 2-2.15 1.15-.95 2.2L14 15l-2 1.25L10 15l-2.4.35-.95-2.2L4.5 12 5.25 10 4.5 8l2.15-1.15.95-2.2L10 5z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "shield":
      return (
        <svg {...sharedProps}>
          <path d="M12 3 19 6v5c0 4.4-2.65 7.2-7 10-4.35-2.8-7-5.6-7-10V6l7-3Z" />
          <path d="m9.5 11.5 1.8 1.8 3.7-4.1" />
        </svg>
      );
    case "support":
      return (
        <svg {...sharedProps}>
          <path d="M6 18v-5a6 6 0 1 1 12 0v5" />
          <path d="M6 14H4v2a2 2 0 0 0 2 2h2v-4H6Z" />
          <path d="M18 14h2v2a2 2 0 0 1-2 2h-2v-4h2Z" />
          <path d="M12 18v2" />
        </svg>
      );
    case "ticket":
      return (
        <svg {...sharedProps}>
          <path d="M5 8a2 2 0 1 1 0 4v4h14v-4a2 2 0 1 1 0-4V4H5z" />
          <path d="M12 7v10" />
        </svg>
      );
    case "trend":
      return (
        <svg {...sharedProps}>
          <path d="M4 18h16" />
          <path d="m6 15 4-4 3 3 5-6" />
          <path d="M18 8h-3" />
          <path d="M18 8v3" />
        </svg>
      );
    case "user":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19c1.6-3 4.1-4.5 7-4.5s5.4 1.5 7 4.5" />
        </svg>
      );
    case "users":
      return (
        <svg {...sharedProps}>
          <circle cx="9" cy="9" r="3" />
          <circle cx="16.5" cy="10.5" r="2.5" />
          <path d="M4.5 19c1.2-2.5 3.3-3.75 6-3.75 2.1 0 4 .7 5.4 2.25" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...sharedProps}>
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v2.5H6.5A2.5 2.5 0 0 0 4 12v4.5A2.5 2.5 0 0 0 6.5 19H18a2 2 0 0 0 2-2V9.5" />
          <path d="M17 13.25h.01" />
          <path d="M4 12a2.5 2.5 0 0 1 2.5-2.5H20" />
        </svg>
      );
  }
}

function SidebarLink({
  href,
  icon,
  label,
  active = false,
}: {
  active?: boolean;
  href: string;
  icon: DashboardIconName;
  label: string;
}) {
  return (
    <Link
      className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
        active
          ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
      }`}
      href={href}
    >
      <span
        className={`inline-flex size-9 items-center justify-center rounded-xl ${
          active
            ? "bg-white text-blue-700 shadow-sm"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        <DashboardIcon className="size-4.5" name={icon} />
      </span>
      {label}
    </Link>
  );
}

function DashboardTabPill({
  href,
  icon,
  label,
  active,
}: {
  active: boolean;
  href: string;
  icon: DashboardIconName;
  label: string;
}) {
  return (
    <Link
      className={`inline-flex items-center gap-3 rounded-full px-4 py-3 text-sm font-black transition ${
        active
          ? "bg-slate-950 text-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.8)]"
          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-950"
      }`}
      href={href}
    >
      <span
        className={`inline-flex size-9 items-center justify-center rounded-full ${
          active ? "bg-white/12 text-white" : "bg-slate-100 text-slate-500"
        }`}
      >
        <DashboardIcon className="size-4.5" name={icon} />
      </span>
      {label}
    </Link>
  );
}

function parseMonthValue(month: string | null | undefined) {
  if (!month) {
    return null;
  }

  const [year, monthIndex] = month.split("-").map(Number);

  if (!year || !monthIndex) {
    return null;
  }

  return {
    monthIndex,
    year,
  };
}

function getMonthDistance(
  startMonth: string | null | undefined,
  endMonth: string | null | undefined,
) {
  const start = parseMonthValue(startMonth);
  const end = parseMonthValue(endMonth);

  if (!start || !end) {
    return 0;
  }

  return Math.max(
    0,
    (end.year - start.year) * 12 + (end.monthIndex - start.monthIndex),
  );
}

function PurchaseCard({ purchase }: { purchase: UserSlotPurchase }) {
  const slotLabel =
    purchase.slot_type === "pro"
      ? `Pro Slot • ${purchase.term_months} mo`
      : "Regular Slot";

  return (
    <article className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200/70 bg-white p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.22)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <DashboardIcon name="ticket" />
        </span>
        <div>
          <p className="text-sm font-black text-slate-950 sm:text-base">
            {slotLabel}
          </p>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            {purchase.quantity} slot{purchase.quantity > 1 ? "s" : ""} reserved
            through {formatDashboardMonthLabel(purchase.coverage_end_month)}
          </p>
        </div>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-sm font-black text-emerald-600 sm:text-base">
          {formatDashboardCurrency(purchase.total_payable_amount)}
        </p>
        <p className="text-xs font-medium text-slate-400">
          {formatDashboardDateTimeLabel(purchase.purchased_at)}
        </p>
      </div>
    </article>
  );
}

function walletEntryAccent(entry: UserWalletEntry) {
  switch (entry.category) {
    case "TICKET_PROFIT_SHARE":
      return {
        amountClass: "text-emerald-600",
        chipClass: "bg-emerald-50 text-emerald-700",
      };
    case "CAPITAL_RETURN_REGULAR":
      return {
        amountClass: "text-blue-700",
        chipClass: "bg-blue-50 text-blue-700",
      };
    case "CAPITAL_RETURN_PRO":
      return {
        amountClass: "text-indigo-700",
        chipClass: "bg-indigo-50 text-indigo-700",
      };
    case "REVERSAL":
      return {
        amountClass: "text-rose-600",
        chipClass: "bg-rose-50 text-rose-700",
      };
    default:
      return {
        amountClass: "text-slate-700",
        chipClass: "bg-slate-100 text-slate-600",
      };
  }
}

function WalletEntryCard({ entry }: { entry: UserWalletEntry }) {
  const accent = walletEntryAccent(entry);
  const signedAmount = `${entry.direction === "DEBIT" ? "-" : "+"}${formatDashboardCurrency(entry.amount)}`;

  return (
    <article className="rounded-[1.4rem] border border-slate-200/70 bg-white p-4 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.24)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${accent.chipClass}`}
            >
              {entry.label}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {entry.reference}
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-500">
            {entry.occurred_at ? formatDashboardDateTimeLabel(entry.occurred_at) : "Pending post"} • Balance after {formatDashboardCurrency(entry.balance_after)}
          </p>
        </div>

        <p className={`text-base font-black ${accent.amountClass}`}>{signedAmount}</p>
      </div>
    </article>
  );
}

function getWalletMonthOptions(
  monthlyHistory: UserPurchasesPayload["wallet"]["monthly_history"],
  monthSummary: UserPurchasesPayload["wallet"]["month_summary"],
  fallbackMonth: string | null,
) {
  const months = new Set<string>();

  if (monthSummary.month && /^\d{4}-\d{2}$/.test(monthSummary.month)) {
    months.add(monthSummary.month);
  }

  monthlyHistory.forEach((row) => {
    if (/^\d{4}-\d{2}$/.test(row.month)) {
      months.add(row.month);
    }
  });

  if (fallbackMonth && /^\d{4}-\d{2}$/.test(fallbackMonth)) {
    months.add(fallbackMonth);
  }

  return Array.from(months).sort((left, right) => right.localeCompare(left));
}

function WalletFilterLink({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      className={`inline-flex items-center justify-center rounded-full px-3.5 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${
        active
          ? "bg-slate-950 text-white"
          : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-950"
      }`}
      href={href}
    >
      {label}
    </Link>
  );
}

function WalletHistoryControls({
  activeTab,
  hash,
  monthOptions,
  pagination,
  walletQuery,
}: {
  activeTab: DashboardTab;
  hash: string;
  monthOptions: string[];
  pagination: UserWalletPagination;
  walletQuery: WalletQueryState;
}) {
  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200/70 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
            Wallet Filters
          </p>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Showing {pagination.from}-{pagination.to} of {pagination.total} wallet entries.
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 ring-1 ring-slate-200/70">
          Page {pagination.page} of {pagination.total_pages}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {walletCategoryOptions.map((option) => (
            <WalletFilterLink
              key={option.value}
              active={walletQuery.category === option.value}
              href={buildWalletHistoryHref(
                activeTab,
                walletQuery,
                {
                  category: option.value,
                  page: 1,
                },
                hash,
              )}
              label={option.label}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <WalletFilterLink
            active={walletQuery.month === null}
            href={buildWalletHistoryHref(
              activeTab,
              walletQuery,
              {
                month: null,
                page: 1,
              },
              hash,
            )}
            label="All Months"
          />
          {monthOptions.map((month) => (
            <WalletFilterLink
              key={month}
              active={walletQuery.month === month}
              href={buildWalletHistoryHref(
                activeTab,
                walletQuery,
                {
                  month,
                  page: 1,
                },
                hash,
              )}
              label={formatDashboardMonthLabel(month)}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
            Rows
          </span>
          {WALLET_PAGE_SIZE_OPTIONS.map((size) => (
            <WalletFilterLink
              key={size}
              active={walletQuery.limit === size}
              href={buildWalletHistoryHref(
                activeTab,
                walletQuery,
                {
                  limit: size,
                  page: 1,
                },
                hash,
              )}
              label={String(size)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WalletPaginationBar({
  activeTab,
  hash,
  pagination,
  walletQuery,
}: {
  activeTab: DashboardTab;
  hash: string;
  pagination: UserWalletPagination;
  walletQuery: WalletQueryState;
}) {
  if (pagination.total_pages <= 1) {
    return null;
  }

  const previousPage = Math.max(1, pagination.page - 1);
  const nextPage = Math.min(pagination.total_pages, pagination.page + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-slate-200/70 bg-white px-4 py-3">
      <p className="text-sm font-medium text-slate-500">
        Showing {pagination.from}-{pagination.to} of {pagination.total} entries
      </p>
      <div className="flex items-center gap-2">
        {pagination.page > 1 ? (
          <Link
            className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-600 transition hover:bg-slate-200 hover:text-slate-950"
            href={buildWalletHistoryHref(
              activeTab,
              walletQuery,
              { page: previousPage },
              hash,
            )}
          >
            Previous
          </Link>
        ) : (
          <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-300">
            Previous
          </span>
        )}
        {pagination.page < pagination.total_pages ? (
          <Link
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
            href={buildWalletHistoryHref(
              activeTab,
              walletQuery,
              { page: nextPage },
              hash,
            )}
          >
            Next
          </Link>
        ) : (
          <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-300">
            Next
          </span>
        )}
      </div>
    </div>
  );
}

export function UserDashboard({
  activeOffer,
  activeTab,
  purchases,
  session,
}: UserDashboardProps) {
  const firstNameSource =
    session.user.name?.trim() && session.user.name !== session.user.username
      ? session.user.name
      : session.user.username;
  const firstName = firstNameSource.split(/\s+/)[0];
  const performanceMonth = activeOffer?.month ?? purchases?.month ?? null;
  const activeMonthLabel = formatDashboardMonthLabel(performanceMonth);
  const regularInventory = activeOffer?.inventory.regular;
  const proInventory = activeOffer?.inventory.pro;
  const totalRegular = regularInventory?.total_slots ?? 0;
  const soldRegular = regularInventory?.sold_slots ?? 0;
  const totalPro = proInventory?.total_slots ?? 0;
  const soldPro = proInventory?.sold_slots ?? 0;
  const reservedSlots = purchases?.slots_reserved ?? 0;
  const completionSteps = [
    { done: session.status.email_verified, label: "Email" },
    { done: session.status.bank_verified, label: "Bank" },
    { done: session.status.profile_completed, label: "Profile" },
    { done: session.status.terms_accepted, label: "Terms" },
  ];
  const completionCount = completionSteps.filter((step) => step.done).length;
  const readinessPercent = Math.round(
    (completionCount / completionSteps.length) * 100,
  );
  const sortedPurchases = [...(purchases?.purchases ?? [])].sort(
    (left, right) =>
      new Date(right.purchased_at).getTime() -
      new Date(left.purchased_at).getTime(),
  );
  const purchaseCount = sortedPurchases.length;
  const totalCommitment = sortedPurchases.reduce(
    (total, purchase) => total + asDashboardNumber(purchase.total_payable_amount),
    0,
  );
  const totalServiceCharge = sortedPurchases.reduce(
    (total, purchase) => total + asDashboardNumber(purchase.service_charge_amount),
    0,
  );
  const totalSlotsPurchased = sortedPurchases.reduce(
    (total, purchase) => total + asDashboardNumber(purchase.quantity),
    0,
  );
  const proSlotsPurchased = sortedPurchases.reduce(
    (total, purchase) =>
      total +
      (purchase.slot_type === "pro" ? asDashboardNumber(purchase.quantity) : 0),
    0,
  );
  const regularSlotsPurchased = Math.max(
    0,
    totalSlotsPurchased - proSlotsPurchased,
  );
  const proMixPercent =
    totalSlotsPurchased > 0
      ? Math.round((proSlotsPurchased / totalSlotsPurchased) * 100)
      : 0;
  const regularMixPercent =
    totalSlotsPurchased > 0 ? 100 - proMixPercent : 0;
  const averagePurchaseValue =
    purchaseCount > 0 ? totalCommitment / purchaseCount : 0;
  const remainingCapacity = Math.max(0, 5 - reservedSlots);
  const capacityUsedPercent = Math.min(
    100,
    Math.round((reservedSlots / 5) * 100),
  );
  const totalLiveInventory =
    asDashboardNumber(totalRegular) + asDashboardNumber(totalPro);
  const inventorySharePercent =
    totalLiveInventory > 0 ? (reservedSlots / totalLiveInventory) * 100 : 0;
  const coverageMonths = Array.from(
    new Set(
      sortedPurchases
        .map((purchase) => purchase.coverage_end_month)
        .filter(Boolean),
    ),
  ).sort((left, right) => left.localeCompare(right));
  const latestCoverageMonth = coverageMonths[coverageMonths.length - 1];
  const coverageSpan = latestCoverageMonth
    ? getMonthDistance(performanceMonth, latestCoverageMonth) + 1
    : 0;
  const latestPurchase = sortedPurchases[0] ?? null;
  const maxPurchaseQuantity = sortedPurchases.reduce(
    (maxQuantity, purchase) =>
      Math.max(maxQuantity, asDashboardNumber(purchase.quantity)),
    1,
  );
  const purchaseBars = sortedPurchases
    .slice(0, 6)
    .reverse()
    .map((purchase) => ({
      height: Math.max(
        18,
        Math.round((asDashboardNumber(purchase.quantity) / maxPurchaseQuantity) * 100),
      ),
      id: purchase.id,
      label: formatDashboardShortDateLabel(purchase.purchased_at),
      quantity: purchase.quantity,
      tone:
        purchase.slot_type === "pro" ? "bg-blue-600" : "bg-slate-300",
    }));
  const readinessMessage = session.status.can_purchase_slots
    ? "All onboarding checks are green and this account is cleared to participate."
    : !session.status.email_verified
      ? "Email verification is still blocking full slot access for this account."
      : !session.status.bank_verified
        ? "Bank verification is the next unlock to turn this dashboard into a live buying surface."
        : !session.status.profile_completed
          ? "Profile completion is the next step before full slot access opens."
          : "Accept the latest terms of use to unlock live slot participation.";
  const inventoryBars = activeOffer
    ? [
        Math.max(
          18,
          Math.round(
            (asDashboardNumber(soldRegular) / Math.max(asDashboardNumber(totalRegular), 1)) *
            100,
          ),
        ),
        Math.max(
          18,
          Math.round(
            (asDashboardNumber(soldPro) / Math.max(asDashboardNumber(totalPro), 1)) * 100,
          ),
        ),
        Math.max(18, Math.round((reservedSlots / 5) * 100)),
        Math.max(
          18,
          Math.round(
            (asDashboardNumber(activeOffer.remaining_slots) /
              Math.max(asDashboardNumber(activeOffer.remaining_slots) + reservedSlots, 1)) *
            100,
          ),
        ),
      ]
    : [22, 35, 18, 28];
  const planRows = activeOffer
    ? [
        {
          detail: `${regularInventory?.remaining_slots ?? 0} left • 1 month access`,
          title: "Regular slot",
          value: formatDashboardCurrency(activeOffer.offer.price_per_slot),
        },
        ...(proInventory?.terms ?? []).map((term) => ({
          detail: `${term.remaining_slots} left • ${Math.round(term.service_charge_rate * 100)}% service charge`,
          title: `Pro slot • ${term.term_months} months`,
          value: term.available ? "Available" : "Unavailable",
        })),
      ]
    : [];
  const performanceHighlights = [
    {
      label: "Monthly commitment",
      value: formatDashboardCompactCurrency(totalCommitment),
    },
    {
      label: "Average fill",
      value:
        purchaseCount > 0 ? formatDashboardCompactCurrency(averagePurchaseValue) : "No fills",
    },
    {
      label: "Service charge",
      value: formatDashboardCompactCurrency(totalServiceCharge),
    },
  ];
  const purchaseMix = [
    {
      detail: "Short-cycle access for the current monthly offer.",
      label: "Regular slots",
      quantity: regularSlotsPurchased,
      share: regularMixPercent,
      shellClass: "bg-slate-50 text-slate-950",
      toneClass: "bg-slate-950",
      valueClass: "text-slate-950",
    },
    {
      detail: "Longer coverage windows with service-charge adjusted access.",
      label: "Pro slots",
      quantity: proSlotsPurchased,
      share: proMixPercent,
      shellClass: "bg-blue-50 text-blue-950",
      toneClass: "bg-blue-600",
      valueClass: "text-blue-700",
    },
  ];
  const wallet = purchases?.wallet ?? null;
  const walletEntries = wallet?.recent_entries ?? [];
  const walletMonthlyHistory = wallet?.monthly_history ?? [];
  const walletMonthSummary = wallet?.month_summary ?? {
    capital_return_total: 0,
    credited_total: 0,
    debited_total: 0,
    entry_count: 0,
    month: performanceMonth ?? "Current",
    net_amount: 0,
    profit_share_total: 0,
    reversal_total: 0,
  };
  const walletFilters: UserWalletFilters = wallet?.filters ?? {
    category: "all",
    limit: WALLET_PAGE_SIZE_OPTIONS[0],
    month: null,
    page: 1,
  };
  const walletPagination: UserWalletPagination = wallet?.pagination ?? {
    from: walletEntries.length ? 1 : 0,
    has_more: false,
    page: 1,
    per_page: walletFilters.limit,
    to: walletEntries.length,
    total: walletEntries.length,
    total_pages: 1,
  };
  const walletQuery = {
    category: walletFilters.category,
    limit: walletFilters.limit,
    month: walletFilters.month ?? null,
    page: walletPagination.page,
  };
  const walletMonthOptions = getWalletMonthOptions(
    walletMonthlyHistory,
    walletMonthSummary,
    performanceMonth,
  );
  const primaryNavigation = getPrimaryNavigation(activeTab, walletQuery);
  const supportNavigation = getSupportNavigation(activeTab, walletQuery);
  const walletHighlights = [
    {
      label: "Wallet balance",
      value: formatDashboardCompactCurrency(wallet?.current_balance),
    },
    {
      label: "Profit share",
      value: formatDashboardCompactCurrency(wallet?.summary.profit_share_total),
    },
    {
      label: "Capital returned",
      value: formatDashboardCompactCurrency(
        (wallet?.summary.capital_return_regular_total ?? 0) +
          (wallet?.summary.capital_return_pro_total ?? 0),
      ),
    },
  ];
  const buySlotsHref =
    activeTab === "overview"
      ? "#offer"
      : buildDashboardTabHref("overview", walletQuery, "offer");
  const activityHref =
    activeTab === "overview"
      ? "#activity"
      : buildDashboardTabHref("overview", walletQuery, "activity");
  const performanceHref = buildDashboardTabHref("performance", walletQuery);

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-slate-200/70 bg-[#fbfcff] px-4 py-6 lg:flex">
          <div className="px-2">
            <SiteLogo />
            <p className="mt-1 text-xs font-semibold text-slate-400">
              Premium Sports Tracking
            </p>
          </div>

          <nav className="mt-10 flex-1 space-y-2">
            {primaryNavigation.map((item) => (
              <SidebarLink key={item.label} {...item} />
            ))}

            <div className="px-3 pb-2 pt-8 text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
              Support
            </div>

            {supportNavigation.map((item) => (
              <SidebarLink key={item.label} {...item} />
            ))}
          </nav>

          <div className="space-y-5 px-2">
            <Link
              className="inline-flex w-full items-center justify-center gap-2 rounded-[1.15rem] bg-slate-950 px-4 py-3.5 text-sm font-extrabold text-white shadow-[0_22px_40px_-26px_rgba(15,23,42,0.8)] transition hover:bg-slate-800"
              href={buySlotsHref}
            >
              <DashboardIcon className="size-4.5" name="ticket" />
              Buy Slots
            </Link>

            <div className="flex items-center gap-3 rounded-[1.4rem] bg-white p-3 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/60">
              <div className="flex size-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#111827,#3b82f6)] text-white">
                <span className="text-sm font-black">
                  {(firstNameSource.slice(0, 2) || "SL").toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-950">
                  {firstNameSource}
                </p>
                <p className="truncate text-xs font-medium text-slate-500">
                  {session.user.email}
                </p>
              </div>
              <LogoutButton
                className="inline-flex size-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
                iconOnly
              />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
            <div className="flex h-18 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 lg:hidden"
                  type="button"
                >
                  <DashboardIcon name="menu" />
                </button>
                <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 sm:flex">
                  <DashboardIcon className="size-4.5" name="calendar" />
                  {activeMonthLabel}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative hidden sm:block">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <DashboardIcon className="size-4.5" name="search" />
                  </span>
                  <input
                    className="w-64 rounded-full border border-transparent bg-slate-100 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-950 outline-none transition focus:border-sky-200 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    placeholder={
                      activeTab === "performance"
                        ? "Search performance..."
                        : "Search stakes..."
                    }
                    type="search"
                  />
                </label>
                <button
                  className="inline-flex size-10 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200 transition hover:text-slate-950"
                  type="button"
                >
                  <DashboardIcon className="size-4.5" name="bell" />
                </button>
                <LogoutButton
                  className="inline-flex size-10 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200 transition hover:text-slate-950"
                  iconOnly
                />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8 lg:space-y-10">
              <div className="flex gap-3 overflow-x-auto pb-1 lg:hidden">
                {primaryNavigation.map((item) => (
                  <SidebarLink key={item.label} {...item} />
                ))}
              </div>

              <section className="flex flex-wrap gap-3">
                {dashboardTabs.map((tab) => (
                  <DashboardTabPill
                    key={tab.label}
                    active={activeTab === tab.tab}
                    href={buildDashboardTabHref(tab.tab, walletQuery)}
                    icon={tab.icon}
                    label={tab.label}
                  />
                ))}
              </section>

              {activeTab === "overview" ? (
                <>
                  <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-700">
                        Dashboard Overview
                      </p>
                      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                        Good morning, {firstName}.
                      </h1>
                      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                        Your account is connected to live Stakeloop data.
                        Email verification, profile completion, slot inventory,
                        and the performance tab now reflect your real account
                        status in one place.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        className="inline-flex items-center justify-center rounded-[1.15rem] bg-slate-200/80 px-5 py-3 text-sm font-extrabold text-slate-800 transition hover:bg-slate-300/80"
                        href={activityHref}
                      >
                        View Activity
                      </Link>
                      <Link
                        className="inline-flex items-center justify-center rounded-[1.15rem] bg-slate-950 px-5 py-3 text-sm font-extrabold text-white shadow-[0_22px_40px_-26px_rgba(15,23,42,0.75)] transition hover:bg-slate-800"
                        href={buySlotsHref}
                      >
                        Buy Slots
                      </Link>
                    </div>
                  </section>

                  <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <article className="overflow-hidden rounded-[1.8rem] bg-[linear-gradient(145deg,#0f66da,#1d4ed8)] p-6 text-white shadow-[0_28px_60px_-30px_rgba(37,99,235,0.75)]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-100/80">
                            Account Status
                          </p>
                          <h2 className="mt-3 text-[1.9rem] font-black leading-tight">
                            Ready for
                            <br />
                            Slot Access
                          </h2>
                        </div>
                        <span className="rounded-2xl bg-white/12 p-3 text-white/90">
                          <DashboardIcon className="size-5" name="shield" />
                        </span>
                      </div>

                      <div className="mt-14">
                        <div className="flex items-end justify-between gap-3">
                          <span className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100/80">
                            Readiness
                          </span>
                          <span className="text-sm font-black">
                            {readinessPercent}%
                          </span>
                        </div>
                        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/18">
                          <div
                            className="h-full rounded-full bg-white"
                            style={{ width: `${readinessPercent}%` }}
                          />
                        </div>
                      </div>
                    </article>

                    {[
                      {
                        label: "Offer Month",
                        value: activeMonthLabel,
                      },
                      {
                        label: "Reserved Slots",
                        value: `${reservedSlots}/5`,
                      },
                      {
                        label: "Inventory Left",
                        value: activeOffer ? `${activeOffer.remaining_slots}` : "0",
                      },
                    ].map((card) => (
                      <article
                        key={card.label}
                        className="rounded-[1.8rem] border border-slate-200/70 bg-white p-6 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.22)]"
                      >
                        <p className="text-sm font-semibold text-slate-500">
                          {card.label}
                        </p>
                        <p className="mt-10 text-[2rem] font-black tracking-tight text-slate-950">
                          {card.value}
                        </p>
                      </article>
                    ))}
                  </section>

                  <section className="grid gap-6 xl:grid-cols-[minmax(0,1.72fr)_340px]">
                    <div className="space-y-6">
                      <article
                        className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.28)] sm:p-8"
                        id="offer"
                      >
                        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-blue-700">
                              Live Offer
                            </p>
                            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                              {activeOffer
                                ? `${activeMonthLabel} slot inventory`
                                : "No active monthly offer yet"}
                            </h2>
                          </div>
                          <div className="inline-flex items-center gap-2 self-start rounded-2xl bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-lg shadow-blue-600/25">
                            <DashboardIcon className="size-4.5" name="ticket" />
                            {activeOffer ? "Open" : "Pending"}
                          </div>
                        </div>

                        {activeOffer ? (
                          <>
                            <div className="relative z-10 mt-8 space-y-4">
                              {planRows.map((plan) => (
                                <div
                                  key={plan.title}
                                  className="flex items-center justify-between gap-4 rounded-[1.2rem] bg-slate-50 px-4 py-4"
                                >
                                  <div>
                                    <p className="text-sm font-black text-slate-950 sm:text-base">
                                      {plan.title}
                                    </p>
                                    <p className="text-xs font-medium text-slate-500 sm:text-sm">
                                      {plan.detail}
                                    </p>
                                  </div>
                                  <span className="text-sm font-black text-blue-700 sm:text-base">
                                    {plan.value}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="relative z-10 mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3">
                              <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                                  Base Price
                                </p>
                                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                                  {formatDashboardCurrency(activeOffer.offer.price_per_slot)}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                                  Reserved
                                </p>
                                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                                  {reservedSlots}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                                  Remaining
                                </p>
                                <p className="mt-2 text-3xl font-black tracking-tight text-blue-700">
                                  {activeOffer.remaining_slots}
                                </p>
                              </div>
                            </div>

                            <div className="relative z-10 mt-8">
                              <SlotPurchasePanel
                                activeOffer={activeOffer}
                                reservedSlots={reservedSlots}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="relative z-10 mt-8 rounded-[1.4rem] bg-slate-50 p-6">
                            <p className="text-base font-bold text-slate-900">
                              Monthly inventory is not open yet.
                            </p>
                            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
                              Your account is ready. As soon as a new monthly slot offer opens, it will appear here automatically.
                            </p>
                          </div>
                        )}

                        <div className="absolute right-[-6rem] top-[-6rem] h-56 w-56 rounded-full bg-blue-100/80 blur-3xl" />
                      </article>

                      <section className="space-y-4" id="activity">
                        <div className="flex items-center justify-between gap-3">
                          <h2 className="text-2xl font-black tracking-tight text-slate-950">
                            Recent Activity
                          </h2>
                          <Link
                            className="text-sm font-black text-blue-700 transition hover:text-blue-800"
                            href="#activity"
                          >
                            View All
                          </Link>
                        </div>

                        <div className="space-y-3">
                          {sortedPurchases.length ? (
                            sortedPurchases.map((purchase) => (
                              <PurchaseCard key={purchase.id} purchase={purchase} />
                            ))
                          ) : (
                            <article className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm font-medium text-slate-500">
                              No slot purchases yet. Once you reserve a slot, your activity will show up here.
                            </article>
                          )}
                        </div>
                      </section>

                      <section className="space-y-4" id="wallet-history">
                        <div className="flex items-center justify-between gap-3">
                          <h2 className="text-2xl font-black tracking-tight text-slate-950">
                            Wallet &amp; Payout History
                          </h2>
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <Link
                              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 ring-1 ring-slate-200 transition hover:text-blue-800"
                              href={buildDashboardTabHref("performance", walletQuery, "reports")}
                            >
                              Open Payout Desk
                            </Link>
                            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                              {walletPagination.total} tracked entries
                            </span>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          {walletHighlights.map((item) => (
                            <article
                              key={item.label}
                              className="rounded-[1.45rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.2)]"
                            >
                              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                                {item.label}
                              </p>
                              <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                                {item.value}
                              </p>
                            </article>
                          ))}
                        </div>

                        <WalletHistoryControls
                          activeTab={activeTab}
                          hash="wallet-history"
                          monthOptions={walletMonthOptions}
                          pagination={walletPagination}
                          walletQuery={walletQuery}
                        />

                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                          <article className="rounded-[1.7rem] border border-slate-200/70 bg-slate-50 p-5">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                                  Latest ledger events
                                </p>
                                <p className="mt-2 text-sm font-medium text-slate-500">
                                  Profit share, capital returns, and reversals appear here as soon as they are posted.
                                </p>
                              </div>
                              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/70">
                                <DashboardIcon name="wallet" />
                              </span>
                            </div>

                            <div className="mt-6 space-y-3">
                              {walletEntries.length ? (
                                walletEntries.map((entry) => (
                                  <WalletEntryCard key={entry.id} entry={entry} />
                                ))
                              ) : (
                                <article className="rounded-[1.4rem] border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm font-medium text-slate-500">
                                  No wallet movements match this filter set yet. As profit share, capital returns, and reversals post, they will land here automatically.
                                </article>
                              )}
                            </div>

                            <div className="mt-4">
                              <WalletPaginationBar
                                activeTab={activeTab}
                                hash="wallet-history"
                                pagination={walletPagination}
                                walletQuery={walletQuery}
                              />
                            </div>
                          </article>

                          <article className="rounded-[1.7rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.18)]">
                            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                              Monthly payout trail
                            </p>
                            <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950">
                              Recent monthly totals
                            </h3>

                            <div className="mt-6 space-y-3">
                              {walletMonthlyHistory.length ? (
                                walletMonthlyHistory.map((row) => (
                                  <div
                                    key={row.month}
                                    className="rounded-[1.2rem] bg-slate-50 px-4 py-4"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <p className="text-sm font-black text-slate-950">
                                          {formatDashboardMonthLabel(row.month)}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-slate-500">
                                          {row.entry_count} payout event{row.entry_count === 1 ? "" : "s"}
                                        </p>
                                      </div>
                                      <p className="text-sm font-black text-blue-700">
                                        {formatDashboardCurrency(row.net_amount)}
                                      </p>
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500">
                                      <span>Profit share {formatDashboardCurrency(row.profit_share_total)}</span>
                                      <span>Capital {formatDashboardCurrency(row.capital_return_total)}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="rounded-[1.2rem] border border-dashed border-slate-300 px-4 py-6 text-sm font-medium text-slate-500">
                                  Monthly payout history will appear here after the first wallet credit posts.
                                </div>
                              )}
                            </div>
                          </article>
                        </div>
                      </section>
                    </div>

                    <div className="space-y-6">
                      <article
                        className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.24)]"
                        id="inventory"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h2 className="text-lg font-black tracking-tight text-slate-950">
                            Inventory Snapshot
                          </h2>
                          <button
                            className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-500"
                            type="button"
                          >
                            Live
                          </button>
                        </div>

                        <div className="mt-8 flex h-44 items-end gap-3 px-2">
                          {inventoryBars.map((height, index) => (
                            <div
                              key={`${height}-${index}`}
                              className={`flex-1 rounded-t-[0.8rem] ${
                                index === 1 || index === 2
                                  ? "bg-blue-600"
                                  : "bg-slate-200"
                              }`}
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                              Regular
                            </p>
                            <p className="mt-2 text-lg font-black text-slate-950">
                              {regularInventory?.remaining_slots ?? 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                              Pro
                            </p>
                            <p className="mt-2 text-lg font-black text-slate-950">
                              {proInventory?.remaining_slots ?? 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                              Yours
                            </p>
                            <p className="mt-2 text-lg font-black text-slate-950">
                              {reservedSlots}
                            </p>
                          </div>
                        </div>
                      </article>

                      <Link
                        className="flex items-center justify-between gap-4 rounded-[1.8rem] bg-slate-100 px-5 py-5 transition hover:bg-slate-200/80"
                        href="#referrals"
                        id="referrals"
                      >
                        <div className="flex items-center gap-4">
                          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/70">
                            <DashboardIcon name="users" />
                          </span>
                          <div>
                            <p className="text-sm font-black text-slate-950">
                              Referral Code
                            </p>
                            <p className="text-xs font-medium text-slate-500">
                              {session.user.referral_code ||
                                "Generated after signup"}
                            </p>
                          </div>
                        </div>
                        <span className="text-slate-400">
                          <DashboardIcon className="size-4.5" name="arrow-right" />
                        </span>
                      </Link>

                      <Link
                        className="relative overflow-hidden rounded-[1.9rem] bg-[linear-gradient(145deg,#111827,#1d4ed8)] p-7 text-white shadow-[0_24px_50px_-28px_rgba(15,23,42,0.8)]"
                        href={performanceHref}
                      >
                        <div className="relative z-10">
                          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-blue-200/80">
                            Performance Tab
                          </p>
                          <h2 className="mt-5 text-2xl font-black tracking-tight">
                            Open your monthly pulse.
                          </h2>
                          <p className="mt-3 max-w-xs text-sm leading-7 text-blue-100/85">
                            Track slot mix, coverage horizon, service charges,
                            and live capacity from a dedicated performance view.
                          </p>
                          <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-white">
                            View Performance
                            <DashboardIcon className="size-4.5" name="arrow-right" />
                          </span>
                        </div>

                        <div className="absolute bottom-[-1.5rem] right-[-1rem] text-white/12">
                          <DashboardIcon className="size-28" name="pulse" />
                        </div>
                      </Link>

                      <article className="relative overflow-hidden rounded-[1.9rem] bg-slate-950 p-7 text-white shadow-[0_24px_50px_-28px_rgba(15,23,42,0.9)]">
                        <div className="relative z-10">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400">
                              <DashboardIcon className="size-5" name="shield" />
                            </span>
                            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
                              Trust &amp; Security
                            </p>
                          </div>
                          <h2 className="mt-5 text-2xl font-black tracking-tight">
                            Verified Receipts
                          </h2>
                          <p className="mt-3 max-w-xs text-sm leading-7 text-slate-300">
                            Registration, verification, profile completion, and
                            slot inventory all flow through live account data, so
                            your dashboard stays in sync with your account.
                          </p>
                          <Link
                            className="mt-6 inline-flex items-center gap-2 text-sm font-black text-white transition hover:text-blue-300"
                            href="/verify-email/success"
                          >
                            Learn More
                            <DashboardIcon
                              className="size-4.5"
                              name="arrow-right"
                            />
                          </Link>
                        </div>

                        <div className="absolute bottom-[-1.8rem] right-[-1.2rem] text-slate-700/35">
                          <DashboardIcon className="size-28" name="shield" />
                        </div>
                      </article>
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <section
                    className="grid gap-6 xl:grid-cols-[minmax(0,1.62fr)_340px]"
                    id="snapshot"
                  >
                    <article className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,#0f172a,#1d4ed8_70%,#38bdf8)] p-7 text-white shadow-[0_32px_70px_-36px_rgba(29,78,216,0.85)] sm:p-8">
                      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-100/80">
                            Performance Center
                          </p>
                          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                            {activeMonthLabel} pulse.
                          </h1>
                          <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50/88 sm:text-lg">
                            Follow how much inventory you&apos;ve committed to this
                            month, how your slot mix is shifting, and how far your
                            current coverage stretches with the latest confirmed
                            account data.
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/12 px-4 py-2 text-sm font-black text-white/90 backdrop-blur-sm">
                          <DashboardIcon className="size-4.5" name="pulse" />
                          {purchaseCount} fills
                        </span>
                      </div>

                      <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-3">
                        {performanceHighlights.map((item) => (
                          <article
                            key={item.label}
                            className="rounded-[1.35rem] bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/12"
                          >
                            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100/80">
                              {item.label}
                            </p>
                            <p className="mt-4 text-3xl font-black tracking-tight text-white">
                              {item.value}
                            </p>
                          </article>
                        ))}
                      </div>

                      <div className="relative z-10 mt-8 grid gap-4 lg:grid-cols-2">
                        <article className="rounded-[1.45rem] bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/12">
                          <div className="flex items-end justify-between gap-3">
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100/80">
                                Capacity used
                              </p>
                              <p className="mt-3 text-3xl font-black tracking-tight text-white">
                                {reservedSlots}/5
                              </p>
                            </div>
                            <p className="text-sm font-black text-blue-50">
                              {capacityUsedPercent}%
                            </p>
                          </div>
                          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/16">
                            <div
                              className="h-full rounded-full bg-white"
                              style={{ width: `${capacityUsedPercent}%` }}
                            />
                          </div>
                          <p className="mt-3 text-sm text-blue-50/82">
                            {remainingCapacity > 0
                              ? `${remainingCapacity} slot${remainingCapacity > 1 ? "s" : ""} still open before you hit current account capacity.`
                              : "You have filled the current account slot limit for this month."}
                          </p>
                        </article>

                        <article className="rounded-[1.45rem] bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/12">
                          <div className="flex items-end justify-between gap-3">
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100/80">
                                Live inventory share
                              </p>
                              <p className="mt-3 text-3xl font-black tracking-tight text-white">
                                {inventorySharePercent.toFixed(1)}%
                              </p>
                            </div>
                            <Link
                              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-blue-50"
                              href={buySlotsHref}
                            >
                              Buy Slots
                              <DashboardIcon
                                className="size-4"
                                name="arrow-right"
                              />
                            </Link>
                          </div>
                          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/16">
                            <div
                              className="h-full rounded-full bg-cyan-300"
                              style={{
                                width: `${Math.min(100, inventorySharePercent)}%`,
                              }}
                            />
                          </div>
                          <p className="mt-3 text-sm text-blue-50/82">
                            Based on your reserved slots against the live
                            inventory currently reported by Stakeloop.
                          </p>
                        </article>
                      </div>

                      <div className="absolute left-[-4rem] top-[-4rem] h-44 w-44 rounded-full bg-cyan-300/24 blur-3xl" />
                      <div className="absolute bottom-[-5rem] right-[-5rem] h-52 w-52 rounded-full bg-white/12 blur-3xl" />
                    </article>

                    <article className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.24)] sm:p-7">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                            Readiness Ladder
                          </p>
                          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                            Access posture
                          </h2>
                        </div>
                        <span
                          className={`rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.22em] ${
                            session.status.can_purchase_slots
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {session.status.can_purchase_slots ? "Live" : "Locked"}
                        </span>
                      </div>

                      <div className="mt-8 space-y-4">
                        {completionSteps.map((step, index) => (
                          <div
                            key={step.label}
                            className="flex items-center gap-4 rounded-[1.2rem] bg-slate-50 px-4 py-4"
                          >
                            <span
                              className={`inline-flex size-10 items-center justify-center rounded-full text-sm font-black ${
                                step.done
                                  ? "bg-emerald-500 text-white"
                                  : index === completionCount
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-200 text-slate-500"
                              }`}
                            >
                              {step.done ? "OK" : index + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-black text-slate-950">
                                {step.label}
                              </p>
                              <p className="text-xs font-medium text-slate-500">
                                {step.done ? "Connected" : "Awaiting completion"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 rounded-[1.5rem] bg-slate-950 p-5 text-white">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                          Next unlock
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-200">
                          {readinessMessage}
                        </p>
                      </div>
                    </article>
                  </section>

                  <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_360px]">
                    <article
                      className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.24)] sm:p-8"
                      id="composition"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                            Composition
                          </p>
                          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                            Slot mix and execution cadence
                          </h2>
                        </div>
                        <p className="text-sm font-semibold text-slate-500">
                          {purchaseCount > 0
                            ? `${purchaseCount} fills recorded for ${activeMonthLabel}`
                            : `No fills recorded for ${activeMonthLabel} yet`}
                        </p>
                      </div>

                      <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {purchaseMix.map((mix) => (
                          <article
                            key={mix.label}
                            className={`rounded-[1.5rem] p-5 ${mix.shellClass}`}
                          >
                            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                              {mix.label}
                            </p>
                            <div className="mt-4 flex items-end justify-between gap-3">
                              <p className={`text-4xl font-black ${mix.valueClass}`}>
                                {mix.quantity}
                              </p>
                              <p className="text-sm font-black text-slate-500">
                                {mix.share}%
                              </p>
                            </div>
                            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/80 ring-1 ring-black/5">
                              <div
                                className={`h-full rounded-full ${mix.toneClass}`}
                                style={{ width: `${mix.share}%` }}
                              />
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                              {mix.detail}
                            </p>
                          </article>
                        ))}
                      </div>

                      <div className="mt-8 rounded-[1.6rem] bg-slate-50 p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                              Execution cadence
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-500">
                              Purchase quantity by timestamp, using the most recent
                              confirmed fills for this month.
                            </p>
                          </div>
                          <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-slate-700 ring-1 ring-slate-200">
                            {totalSlotsPurchased} total slots
                          </span>
                        </div>

                        {purchaseBars.length ? (
                          <div className="mt-8 flex h-48 items-end gap-3">
                            {purchaseBars.map((bar) => (
                              <div
                                key={bar.id}
                                className="flex min-w-0 flex-1 flex-col items-center gap-3"
                              >
                                <div className="flex h-full w-full items-end">
                                  <div
                                    className={`w-full rounded-t-[1rem] ${bar.tone}`}
                                    style={{ height: `${bar.height}%` }}
                                  />
                                </div>
                                <div className="text-center">
                                  <p className="text-xs font-black text-slate-700">
                                    {bar.quantity}
                                  </p>
                                  <p className="text-[11px] font-medium text-slate-400">
                                    {bar.label}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-8 rounded-[1.35rem] border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm font-medium text-slate-500">
                            No purchase cadence yet. Your first confirmed fill
                            will begin populating this chart automatically.
                          </div>
                        )}
                      </div>
                    </article>

                    <article
                      className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.24)] sm:p-7"
                      id="coverage"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                        Coverage Horizon
                      </p>
                      <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                        How far your coverage reaches
                      </h2>

                      <div className="mt-8 rounded-[1.6rem] bg-slate-950 p-6 text-white">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                          Current runway
                        </p>
                        <p className="mt-3 text-5xl font-black tracking-tight">
                          {coverageSpan ? `${coverageSpan} mo` : "0 mo"}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                          {latestCoverageMonth
                            ? `Your latest coverage currently reaches through ${formatDashboardMonthLabel(latestCoverageMonth)}.`
                            : "Coverage tracking will begin as soon as the first slot fill lands."}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {coverageMonths.length ? (
                          coverageMonths.map((month) => (
                            <span
                              key={month}
                              className="rounded-full bg-blue-50 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700"
                            >
                              {formatDashboardMonthLabel(month)}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                            Awaiting coverage
                          </span>
                        )}
                      </div>

                      <div className="mt-8 space-y-4">
                        <div className="flex items-center justify-between gap-4 rounded-[1.2rem] bg-slate-50 px-4 py-4">
                          <div>
                            <p className="text-sm font-black text-slate-950">
                              Latest execution
                            </p>
                            <p className="text-xs font-medium text-slate-500">
                              Most recent confirmed purchase
                            </p>
                          </div>
                          <p className="text-right text-sm font-black text-slate-950">
                            {latestPurchase
                              ? formatDashboardDateTimeLabel(latestPurchase.purchased_at)
                              : "No fill yet"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-[1.2rem] bg-slate-50 px-4 py-4">
                          <div>
                            <p className="text-sm font-black text-slate-950">
                              Open capacity
                            </p>
                            <p className="text-xs font-medium text-slate-500">
                              Remaining slot room on this account
                            </p>
                          </div>
                          <p className="text-right text-sm font-black text-slate-950">
                            {remainingCapacity} slot
                            {remainingCapacity === 1 ? "" : "s"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-[1.2rem] bg-slate-50 px-4 py-4">
                          <div>
                            <p className="text-sm font-black text-slate-950">
                              Current offer
                            </p>
                            <p className="text-xs font-medium text-slate-500">
                              Active month being tracked
                            </p>
                          </div>
                          <p className="text-right text-sm font-black text-slate-950">
                            {activeMonthLabel}
                          </p>
                        </div>
                      </div>

                      <Link
                        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-[1.15rem] bg-slate-950 px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-slate-800"
                        href={buySlotsHref}
                      >
                        Buy Slots
                        <DashboardIcon className="size-4.5" name="arrow-right" />
                      </Link>
                    </article>
                  </section>

                  <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                    <article className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.24)] sm:p-7">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-2xl font-black tracking-tight text-slate-950">
                          Recent Purchase Signals
                        </h2>
                        <Link
                          className="text-sm font-black text-blue-700 transition hover:text-blue-800"
                          href={activityHref}
                        >
                          Open Activity
                        </Link>
                      </div>

                      <div className="mt-6 space-y-3">
                        {sortedPurchases.length ? (
                          sortedPurchases.slice(0, 4).map((purchase) => (
                            <PurchaseCard key={purchase.id} purchase={purchase} />
                          ))
                        ) : (
                          <article className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm font-medium text-slate-500">
                            No purchase signals yet. As soon as new activity is
                            recorded, this tab will reflect it here as well.
                          </article>
                        )}
                      </div>
                    </article>

                    <div className="space-y-6" id="payouts">
                      <article className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.24)] sm:p-7">
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                          Payout Trail
                        </p>
                        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                          Wallet credits you can reconcile
                        </h2>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                          <article className="rounded-[1.35rem] bg-blue-50 p-5">
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                              This Month
                            </p>
                            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                              {formatDashboardCompactCurrency(walletMonthSummary.net_amount)}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                              Net wallet movement for {formatDashboardMonthLabel(walletMonthSummary.month)} after credits and reversals.
                            </p>
                          </article>

                          <article className="rounded-[1.35rem] bg-slate-50 p-5">
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                              Last Post
                            </p>
                            <p className="mt-3 text-lg font-black tracking-tight text-slate-950">
                              {wallet?.last_posted_at
                                ? formatDashboardDateTimeLabel(wallet.last_posted_at)
                                : "Awaiting first credit"}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                              Current wallet balance is {formatDashboardCurrency(wallet?.current_balance)}.
                            </p>
                          </article>
                        </div>

                        <div className="mt-6">
                          <WalletHistoryControls
                            activeTab={activeTab}
                            hash="payouts"
                            monthOptions={walletMonthOptions}
                            pagination={walletPagination}
                            walletQuery={walletQuery}
                          />
                        </div>

                        <div className="mt-6 space-y-3">
                          {walletEntries.length ? (
                            walletEntries.map((entry) => (
                              <WalletEntryCard key={entry.id} entry={entry} />
                            ))
                          ) : (
                            <article className="rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm font-medium text-slate-500">
                              No payout entries match this filter set yet. Once ticket profit share, capital returns, or reversals hit your wallet, the audit trail will appear here automatically.
                            </article>
                          )}
                        </div>

                        <div className="mt-4">
                          <WalletPaginationBar
                            activeTab={activeTab}
                            hash="payouts"
                            pagination={walletPagination}
                            walletQuery={walletQuery}
                          />
                        </div>
                      </article>

                      <article className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-[0_24px_50px_-28px_rgba(15,23,42,0.9)]">
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                          Member Payout View
                        </p>
                        <h2 className="mt-3 text-2xl font-black tracking-tight">
                          Your live audit trail is now active
                        </h2>

                        <div className="mt-6 space-y-4">
                          {[
                            "Profit share credits post into the wallet trail as tickets settle.",
                            "Capital returns now have a clear maturity schedule tied to your slot coverage window.",
                            "CSV exports let you keep a copy of the exact ledger slice and monthly summaries you are viewing.",
                          ].map((line) => (
                            <article
                              key={line}
                              className="rounded-[1.4rem] bg-white/5 p-5 ring-1 ring-white/10"
                            >
                              <p className="text-sm leading-7 text-slate-300">
                                {line}
                              </p>
                            </article>
                          ))}
                        </div>

                        <p className="mt-6 text-sm leading-7 text-slate-300">
                          Use the payout desk below to search the loaded ledger,
                          export your current view, and see which purchases are
                          scheduled to return capital next.
                        </p>
                      </article>
                    </div>
                  </section>

                  <PayoutReportCenter
                    activeMonth={performanceMonth}
                    currentBalance={wallet?.current_balance ?? 0}
                    entries={walletEntries}
                    filterCategory={walletFilters.category}
                    filterMonth={walletFilters.month ?? null}
                    monthSummary={walletMonthSummary}
                    monthlyHistory={walletMonthlyHistory}
                    purchases={sortedPurchases}
                  />
                </>
              )}

              <section
                className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.24)] sm:p-7"
                id="support"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                      Help &amp; Support
                    </p>
                    <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                      Need assistance?
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                      Our premium support team is available 24/7 for onboarding,
                      verification, slot reservation, and dashboard questions,
                      including anything you want to tune inside the new
                      performance workspace.
                    </p>
                  </div>

                  <a
                    className="inline-flex items-center justify-center rounded-[1rem] bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                    href="mailto:support@stakeloop.io?subject=Stakeloop%20Support"
                  >
                    Open Ticket
                  </a>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
