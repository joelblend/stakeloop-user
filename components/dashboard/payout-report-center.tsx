"use client";

import { useMemo, useState } from "react";

import {
  asDashboardNumber,
  formatDashboardCompactCurrency,
  formatDashboardCurrency,
  formatDashboardDateLabel,
  formatDashboardMonthLabel,
} from "@/lib/dashboard-formatters";
import type {
  UserSlotPurchase,
  UserWalletEntry,
  UserWalletFilterCategory,
  UserWalletMonthSummary,
} from "@/lib/stakeloop-api";

type PayoutReportCenterProps = {
  activeMonth: string | null;
  currentBalance: number;
  entries: UserWalletEntry[];
  filterCategory: UserWalletFilterCategory;
  filterMonth: string | null;
  monthSummary: UserWalletMonthSummary;
  monthlyHistory: UserWalletMonthSummary[];
  purchases: UserSlotPurchase[];
};

type CapitalScheduleRow = {
  amount: number;
  coverageEndMonth: string;
  id: number;
  purchasedAt: string;
  slotLabel: string;
  status: "Returned" | "Scheduled";
};

function normalizeText(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function entryAmountTone(entry: UserWalletEntry) {
  switch (entry.category) {
    case "TICKET_PROFIT_SHARE":
      return "text-emerald-600";
    case "CAPITAL_RETURN_REGULAR":
    case "CAPITAL_RETURN_PRO":
      return "text-blue-700";
    case "REVERSAL":
      return "text-rose-600";
    default:
      return "text-slate-700";
  }
}

function slotLabel(purchase: UserSlotPurchase) {
  return purchase.slot_type === "pro"
    ? `Pro slot • ${purchase.term_months} mo`
    : "Regular slot";
}

function getPurchaseIdFromEntry(entry: UserWalletEntry) {
  const meta = entry.meta;

  if (meta && typeof meta === "object" && "user_slot_purchase_id" in meta) {
    const value = meta.user_slot_purchase_id;
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  const match = entry.reference.match(/Purchase #(\d+)/i);
  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function isCapitalReturnEntry(entry: UserWalletEntry) {
  return (
    entry.category === "CAPITAL_RETURN_REGULAR" ||
    entry.category === "CAPITAL_RETURN_PRO"
  );
}

function csvEscape(value: unknown) {
  const text =
    value === null || value === undefined
      ? ""
      : typeof value === "string"
        ? value
        : String(value);

  return `"${text.replace(/"/g, '""')}"`;
}

function sanitizeFilePart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function downloadCsv(filename: string, rows: Array<Array<unknown>>) {
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function PayoutReportCenter({
  activeMonth,
  currentBalance,
  entries,
  filterCategory,
  filterMonth,
  monthSummary,
  monthlyHistory,
  purchases,
}: PayoutReportCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = normalizeText(searchQuery);
  const returnedPurchaseIds = useMemo(() => {
    const ids = new Set<number>();

    entries.forEach((entry) => {
      if (!isCapitalReturnEntry(entry)) {
        return;
      }

      const purchaseId = getPurchaseIdFromEntry(entry);
      if (purchaseId !== null) {
        ids.add(purchaseId);
      }
    });

    return ids;
  }, [entries]);

  const capitalSchedule = useMemo<CapitalScheduleRow[]>(
    () =>
      [...purchases]
        .map((purchase) => {
          const status: CapitalScheduleRow["status"] = returnedPurchaseIds.has(
            purchase.id,
          )
            ? "Returned"
            : "Scheduled";

          return {
            amount: asDashboardNumber(purchase.total_amount),
            coverageEndMonth: purchase.coverage_end_month,
            id: purchase.id,
            purchasedAt: purchase.purchased_at,
            slotLabel: slotLabel(purchase),
            status,
          };
        })
        .sort((left, right) => {
          const monthCompare = left.coverageEndMonth.localeCompare(
            right.coverageEndMonth,
          );
          if (monthCompare !== 0) {
            return monthCompare;
          }

          return (
            new Date(left.purchasedAt).getTime() - new Date(right.purchasedAt).getTime()
          );
        }),
    [purchases, returnedPurchaseIds],
  );

  const filteredEntries = useMemo(() => {
    if (!normalizedQuery) {
      return entries;
    }

    return entries.filter((entry) => {
      const haystack = normalizeText(
        [
          entry.label,
          entry.reference,
          entry.category,
          entry.earning_month,
          entry.payout_month,
          entry.occurred_at,
        ].join(" "),
      );

      return haystack.includes(normalizedQuery);
    });
  }, [entries, normalizedQuery]);

  const filteredMonthlyHistory = useMemo(() => {
    if (!normalizedQuery) {
      return monthlyHistory;
    }

    return monthlyHistory.filter((row) =>
      normalizeText(
        `${row.month} ${formatDashboardMonthLabel(row.month, "Awaiting month")} ${row.entry_count}`,
      ).includes(normalizedQuery),
    );
  }, [monthlyHistory, normalizedQuery]);

  const filteredCapitalSchedule = useMemo(() => {
    if (!normalizedQuery) {
      return capitalSchedule;
    }

    return capitalSchedule.filter((row) =>
      normalizeText(
        `${row.id} ${row.slotLabel} ${row.coverageEndMonth} ${row.status} ${row.purchasedAt}`,
      ).includes(normalizedQuery),
    );
  }, [capitalSchedule, normalizedQuery]);

  const visibleProfitShare = filteredEntries
    .filter((entry) => entry.category === "TICKET_PROFIT_SHARE")
    .reduce((total, entry) => total + asDashboardNumber(entry.amount), 0);
  const visibleCapitalReturns = filteredEntries
    .filter((entry) => isCapitalReturnEntry(entry))
    .reduce((total, entry) => total + asDashboardNumber(entry.amount), 0);
  const openCapitalReturns = filteredCapitalSchedule.filter(
    (row) => row.status === "Scheduled",
  ).length;
  const searchContextLabel =
    filterCategory === "all"
      ? "All payout categories"
      : filterCategory === "profit_share"
        ? "Profit share"
        : filterCategory === "capital_returns"
          ? "Capital returns"
          : "Reversals";

  const ledgerExportName = sanitizeFilePart(
    `stakeloop-wallet-ledger-${filterMonth ?? activeMonth ?? "all"}-${filterCategory}`,
  );
  const monthlyExportName = sanitizeFilePart(
    `stakeloop-wallet-months-${filterMonth ?? activeMonth ?? "all"}`,
  );
  const scheduleExportName = sanitizeFilePart(
    `stakeloop-capital-schedule-${activeMonth ?? "all"}`,
  );

  function handleLedgerExport() {
    downloadCsv(`${ledgerExportName}.csv`, [
      [
        "Entry ID",
        "Label",
        "Reference",
        "Category",
        "Direction",
        "Amount",
        "Balance Before",
        "Balance After",
        "Earning Month",
        "Payout Month",
        "Occurred At",
      ],
      ...filteredEntries.map((entry) => [
        entry.id,
        entry.label,
        entry.reference,
        entry.category,
        entry.direction,
        entry.amount,
        entry.balance_before,
        entry.balance_after,
        entry.earning_month ?? "",
        entry.payout_month ?? "",
        entry.occurred_at ?? "",
      ]),
    ]);
  }

  function handleMonthlyExport() {
    downloadCsv(`${monthlyExportName}.csv`, [
      [
        "Month",
        "Credited Total",
        "Debited Total",
        "Profit Share Total",
        "Capital Return Total",
        "Reversal Total",
        "Net Amount",
        "Entry Count",
      ],
      ...filteredMonthlyHistory.map((row) => [
        row.month,
        row.credited_total,
        row.debited_total,
        row.profit_share_total,
        row.capital_return_total,
        row.reversal_total,
        row.net_amount,
        row.entry_count,
      ]),
    ]);
  }

  function handleScheduleExport() {
    downloadCsv(`${scheduleExportName}.csv`, [
      [
        "Purchase ID",
        "Slot",
        "Capital Return Amount",
        "Coverage End Month",
        "Purchased At",
        "Status",
      ],
      ...filteredCapitalSchedule.map((row) => [
        row.id,
        row.slotLabel,
        row.amount,
        row.coverageEndMonth,
        row.purchasedAt,
        row.status,
      ]),
    ]);
  }

  return (
    <section
      className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.24)] sm:p-8"
      id="reports"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
            Payout Desk
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Search, export, and track what matures next
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            Search works against the ledger slice currently loaded by your month,
            category, and page filters. Exports mirror exactly what you are
            viewing right now.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-600">
            {searchContextLabel}
          </span>
          <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            {formatDashboardMonthLabel(filterMonth ?? monthSummary.month, "Awaiting month")}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.45rem] bg-slate-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            Statement Net
          </p>
          <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            {formatDashboardCompactCurrency(monthSummary.net_amount)}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            {formatDashboardMonthLabel(monthSummary.month, "Awaiting month")} across {monthSummary.entry_count} wallet posts.
          </p>
        </article>

        <article className="rounded-[1.45rem] bg-emerald-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
            Visible Profit Share
          </p>
          <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            {formatDashboardCompactCurrency(visibleProfitShare)}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Based on {filteredEntries.length} search-matched ledger rows.
          </p>
        </article>

        <article className="rounded-[1.45rem] bg-blue-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
            Visible Capital Returns
          </p>
          <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            {formatDashboardCompactCurrency(visibleCapitalReturns)}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Capital already credited inside the loaded ledger slice.
          </p>
        </article>

        <article className="rounded-[1.45rem] bg-slate-950 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            Capital Runway
          </p>
          <p className="mt-4 text-3xl font-black tracking-tight">
            {openCapitalReturns}
          </p>
          <p className="mt-3 text-sm text-slate-300">
            Scheduled capital returns still ahead of the current wallet balance of{" "}
            {formatDashboardCurrency(currentBalance)}.
          </p>
        </article>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]">
        <article className="rounded-[1.7rem] border border-slate-200/70 bg-slate-50 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="block flex-1">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Search Loaded Ledger
              </span>
              <input
                className="mt-3 w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 outline-none transition focus:border-sky-200 focus:ring-4 focus:ring-sky-100"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search label, reference, month, or entry type"
                type="search"
                value={searchQuery}
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                disabled={filteredEntries.length === 0}
                onClick={handleLedgerExport}
                type="button"
              >
                Export Ledger CSV
              </button>
              <button
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                disabled={filteredMonthlyHistory.length === 0}
                onClick={handleMonthlyExport}
                type="button"
              >
                Export Monthly CSV
              </button>
              <button
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-slate-700 ring-1 ring-slate-200 transition hover:text-slate-950 disabled:cursor-not-allowed disabled:text-slate-300"
                disabled={filteredCapitalSchedule.length === 0}
                onClick={handleScheduleExport}
                type="button"
              >
                Export Schedule CSV
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-[1.2rem] bg-white px-4 py-3 text-sm font-medium text-slate-500 ring-1 ring-slate-200/70">
            {normalizedQuery
              ? `${filteredEntries.length} ledger match${filteredEntries.length === 1 ? "" : "es"} and ${filteredCapitalSchedule.length} capital schedule match${filteredCapitalSchedule.length === 1 ? "" : "es"} for "${searchQuery}".`
              : "No local search applied yet. Use the field above to narrow the ledger already loaded by your active filters."}
          </div>

          <div className="mt-6 space-y-3">
            {filteredEntries.length ? (
              filteredEntries.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-[1.35rem] border border-slate-200/70 bg-white p-4 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.24)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                          {entry.label}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          {entry.reference}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        {entry.occurred_at
                          ? formatDashboardDateLabel(entry.occurred_at)
                          : "Pending post"}{" "}
                        • Balance after {formatDashboardCurrency(entry.balance_after)}
                      </p>
                    </div>
                    <p className={`text-base font-black ${entryAmountTone(entry)}`}>
                      {entry.direction === "DEBIT" ? "-" : "+"}
                      {formatDashboardCurrency(entry.amount)}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.3rem] border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm font-medium text-slate-500">
                No loaded wallet entries match this search yet.
              </div>
            )}
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-[1.7rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.18)]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
              Current Statement
            </p>
            <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950">
              {formatDashboardMonthLabel(monthSummary.month, "Awaiting month")}
            </h3>

            <div className="mt-5 space-y-3">
              {[
                ["Net movement", formatDashboardCurrency(monthSummary.net_amount)],
                ["Profit share", formatDashboardCurrency(monthSummary.profit_share_total)],
                ["Capital returns", formatDashboardCurrency(monthSummary.capital_return_total)],
                ["Reversals", formatDashboardCurrency(monthSummary.reversal_total)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-[1.15rem] bg-slate-50 px-4 py-3"
                >
                  <span className="text-sm font-semibold text-slate-500">
                    {label}
                  </span>
                  <span className="text-sm font-black text-slate-950">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.7rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.18)]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
              Capital Return Schedule
            </p>
            <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950">
              What is due next
            </h3>

            <div className="mt-6 space-y-3">
              {filteredCapitalSchedule.length ? (
                filteredCapitalSchedule.slice(0, 6).map((row) => (
                  <div
                    key={row.id}
                    className="rounded-[1.2rem] bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-slate-950">
                          {row.slotLabel}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          Purchase #{row.id} • Bought {formatDashboardDateLabel(row.purchasedAt)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
                          row.status === "Returned"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-500">
                        Matures {formatDashboardMonthLabel(row.coverageEndMonth, "Awaiting month")}
                      </span>
                      <span className="font-black text-slate-950">
                        {formatDashboardCurrency(row.amount)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.2rem] border border-dashed border-slate-300 px-4 py-6 text-sm font-medium text-slate-500">
                  No capital-return schedule rows match this search.
                </div>
              )}
            </div>
          </article>

          <article className="rounded-[1.7rem] border border-slate-200/70 bg-slate-950 p-5 text-white shadow-[0_24px_50px_-28px_rgba(15,23,42,0.9)]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
              Monthly Archive
            </p>
            <h3 className="mt-3 text-xl font-black tracking-tight">
              Recent payout months
            </h3>

            <div className="mt-6 space-y-3">
              {filteredMonthlyHistory.length ? (
                filteredMonthlyHistory.slice(0, 6).map((row) => (
                  <div
                    key={row.month}
                    className="rounded-[1.2rem] bg-white/5 px-4 py-4 ring-1 ring-white/10"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-white">
                          {formatDashboardMonthLabel(row.month, "Awaiting month")}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-300">
                          {row.entry_count} wallet event{row.entry_count === 1 ? "" : "s"}
                        </p>
                      </div>
                      <span className="text-sm font-black text-cyan-300">
                        {formatDashboardCurrency(row.net_amount)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.2rem] border border-dashed border-white/20 px-4 py-6 text-sm font-medium text-slate-300">
                  No monthly payout rows match this search yet.
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
