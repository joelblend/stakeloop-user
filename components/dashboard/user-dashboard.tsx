import Link from "next/link";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { SiteLogo } from "@/components/landing/site-logo";
import type {
  ActiveSlotOfferPayload,
  AuthSessionPayload,
  UserPurchasesPayload,
  UserSlotPurchase,
} from "@/lib/stakeloop-api";

const primaryNavigation = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard", active: true },
  { href: "/dashboard#offer", icon: "ticket", label: "Offer" },
  { href: "/dashboard#inventory", icon: "trend", label: "Inventory" },
  { href: "/dashboard#activity", icon: "receipt", label: "Activity" },
  { href: "/dashboard#referrals", icon: "users", label: "Referrals" },
] as const;

const supportNavigation = [
  { href: "/dashboard#support", icon: "help", label: "Help/Support" },
  { href: "/complete-profile", icon: "settings", label: "Profile" },
] as const;

type UserDashboardProps = {
  activeOffer: ActiveSlotOfferPayload | null;
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
  | "receipt"
  | "search"
  | "settings"
  | "shield"
  | "support"
  | "ticket"
  | "trend"
  | "user"
  | "users";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  month: "short",
  year: "numeric",
});

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
          active ? "bg-white text-blue-700 shadow-sm" : "bg-slate-100 text-slate-500"
        }`}
      >
        <DashboardIcon className="size-4.5" name={icon} />
      </span>
      {label}
    </Link>
  );
}

function asNumber(value: number | string | undefined) {
  const nextValue = Number(value ?? 0);
  return Number.isFinite(nextValue) ? nextValue : 0;
}

function formatCurrency(value: number | string | undefined) {
  return currencyFormatter.format(asNumber(value));
}

function formatMonthLabel(month: string | undefined) {
  if (!month) {
    return "Awaiting Offer";
  }

  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, (monthIndex || 1) - 1, 1));

  return monthFormatter.format(date);
}

function formatDateLabel(value: string) {
  const date = new Date(value);

  return dateFormatter.format(date);
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
            through {purchase.coverage_end_month}
          </p>
        </div>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-sm font-black text-emerald-600 sm:text-base">
          {formatCurrency(purchase.total_payable_amount)}
        </p>
        <p className="text-xs font-medium text-slate-400">
          {formatDateLabel(purchase.purchased_at)}
        </p>
      </div>
    </article>
  );
}

export function UserDashboard({
  activeOffer,
  purchases,
  session,
}: UserDashboardProps) {
  const firstNameSource =
    session.user.name?.trim() && session.user.name !== session.user.username
      ? session.user.name
      : session.user.username;
  const firstName = firstNameSource.split(/\s+/)[0];
  const reservedSlots = purchases?.slots_reserved ?? 0;
  const activeMonthLabel = formatMonthLabel(activeOffer?.month);
  const regularInventory = activeOffer?.inventory.regular;
  const proInventory = activeOffer?.inventory.pro;
  const totalRegular = regularInventory?.total_slots ?? 0;
  const soldRegular = regularInventory?.sold_slots ?? 0;
  const totalPro = proInventory?.total_slots ?? 0;
  const soldPro = proInventory?.sold_slots ?? 0;
  const completionSteps = [
    { label: "Email", done: session.status.email_verified },
    { label: "Bank", done: session.status.bank_verified },
    { label: "Profile", done: session.status.profile_completed },
  ];
  const completionCount = completionSteps.filter((step) => step.done).length;
  const readinessPercent = Math.round(
    (completionCount / completionSteps.length) * 100,
  );
  const inventoryBars = activeOffer
    ? [
        Math.max(18, Math.round((asNumber(soldRegular) / Math.max(asNumber(totalRegular), 1)) * 100)),
        Math.max(18, Math.round((asNumber(soldPro) / Math.max(asNumber(totalPro), 1)) * 100)),
        Math.max(18, Math.round((reservedSlots / 5) * 100)),
        Math.max(18, Math.round((asNumber(activeOffer.remaining_slots) / Math.max(asNumber(activeOffer.remaining_slots) + reservedSlots, 1)) * 100)),
      ]
    : [22, 35, 18, 28];
  const planRows = activeOffer
    ? [
        {
          title: "Regular slot",
          detail: `${regularInventory?.remaining_slots ?? 0} left • 1 month access`,
          value: formatCurrency(activeOffer.offer.price_per_slot),
        },
        ...(proInventory?.terms ?? []).map((term) => ({
          title: `Pro slot • ${term.term_months} months`,
          detail: `${term.remaining_slots} left • ${Math.round(term.service_charge_rate * 100)}% service charge`,
          value: term.available ? "Available" : "Unavailable",
        })),
      ]
    : [];

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

            <div className="px-3 pt-8 pb-2 text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
              Support
            </div>

            {supportNavigation.map((item) => (
              <SidebarLink key={item.label} {...item} />
            ))}
          </nav>

          <div className="space-y-5 px-2">
            <Link
              className="inline-flex w-full items-center justify-center gap-2 rounded-[1.15rem] bg-slate-950 px-4 py-3.5 text-sm font-extrabold text-white shadow-[0_22px_40px_-26px_rgba(15,23,42,0.8)] transition hover:bg-slate-800"
              href="#offer"
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
                    placeholder="Search stakes..."
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

              <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-700">
                    Dashboard Overview
                  </p>
                  <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Good morning, {firstName}.
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                    Your account is connected to the live StakeLoop backend.
                    Email verification, profile completion, and slot inventory
                    now reflect the real onboarding state instead of mock data.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    className="inline-flex items-center justify-center rounded-[1.15rem] bg-slate-200/80 px-5 py-3 text-sm font-extrabold text-slate-800 transition hover:bg-slate-300/80"
                    href="#activity"
                  >
                    View Activity
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-[1.15rem] bg-slate-950 px-5 py-3 text-sm font-extrabold text-white shadow-[0_22px_40px_-26px_rgba(15,23,42,0.75)] transition hover:bg-slate-800"
                    href="#offer"
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
                      <span className="text-sm font-black">{readinessPercent}%</span>
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
                              {formatCurrency(activeOffer.offer.price_per_slot)}
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
                      </>
                    ) : (
                      <div className="relative z-10 mt-8 rounded-[1.4rem] bg-slate-50 p-6">
                        <p className="text-base font-bold text-slate-900">
                          Monthly inventory is not open yet.
                        </p>
                        <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
                          Your session is connected and ready. As soon as the
                          backend publishes a live user slot offer, it will
                          appear here automatically.
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
                      {purchases?.purchases.length ? (
                        purchases.purchases.map((purchase) => (
                          <PurchaseCard key={purchase.id} purchase={purchase} />
                        ))
                      ) : (
                        <article className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm font-medium text-slate-500">
                          No slot purchases yet. Once you reserve inventory from
                          the backend, your activity will show up here.
                        </article>
                      )}
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
                          {session.user.referral_code || "Generated after signup"}
                        </p>
                      </div>
                    </div>
                    <span className="text-slate-400">
                      <DashboardIcon className="size-4.5" name="arrow-right" />
                    </span>
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
                        Registration, verification, profile completion, and slot
                        inventory all flow through the live API now, so the
                        dashboard reflects the same truth as the backend.
                      </p>
                      <Link
                        className="mt-6 inline-flex items-center gap-2 text-sm font-black text-white transition hover:text-blue-300"
                        href="/verify-email/success"
                      >
                        Learn More
                        <DashboardIcon className="size-4.5" name="arrow-right" />
                      </Link>
                    </div>

                    <div className="absolute bottom-[-1.8rem] right-[-1.2rem] text-slate-700/35">
                      <DashboardIcon className="size-28" name="shield" />
                    </div>
                  </article>

                  <article
                    className="rounded-[1.8rem] border border-slate-200/70 bg-white p-6 text-center shadow-[0_18px_40px_-30px_rgba(15,23,42,0.24)]"
                    id="support"
                  >
                    <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <DashboardIcon name="support" />
                    </span>
                    <h2 className="mt-4 text-lg font-black tracking-tight text-slate-950">
                      Need assistance?
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Our premium support team is available 24/7 for onboarding,
                      verification, and slot reservation questions.
                    </p>
                    <a
                      className="mt-5 inline-flex w-full items-center justify-center rounded-[1rem] bg-slate-100 px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-200"
                      href="mailto:support@stakeloop.io?subject=StakeLoop%20Support"
                    >
                      Open Ticket
                    </a>
                  </article>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
