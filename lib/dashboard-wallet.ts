import type { UserWalletFilterCategory } from "@/lib/stakeloop-api";

export type DashboardTab = "overview" | "performance";

export type WalletQueryState = {
  category: UserWalletFilterCategory;
  limit: number;
  month: string | null;
  page: number;
};

export const WALLET_PAGE_SIZE_OPTIONS = [4, 8, 12] as const;

export const walletCategoryOptions = [
  { label: "All Entries", value: "all" },
  { label: "Profit Share", value: "profit_share" },
  { label: "Capital Returns", value: "capital_returns" },
  { label: "Reversals", value: "reversals" },
] as const;

export function normalizeWalletPage(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.trunc(parsed) : 1;
}

export function normalizeWalletLimit(value: string | undefined) {
  const parsed = Number(value);
  return parsed === 4 || parsed === 8 || parsed === 12 ? parsed : WALLET_PAGE_SIZE_OPTIONS[0];
}

export function normalizeWalletCategory(value: string | undefined): UserWalletFilterCategory {
  return value === "profit_share" ||
    value === "capital_returns" ||
    value === "reversals"
    ? value
    : "all";
}

export function normalizeWalletMonth(value: string | undefined) {
  return value && /^\d{4}-\d{2}$/.test(value) ? value : undefined;
}

export function buildDashboardTabHref(
  tab: DashboardTab,
  walletQuery: WalletQueryState,
  hash?: string,
) {
  const params = new URLSearchParams({ tab });

  if (walletQuery.category !== "all") {
    params.set("wallet_category", walletQuery.category);
  }

  if (walletQuery.month) {
    params.set("wallet_month", walletQuery.month);
  }

  if (walletQuery.page > 1) {
    params.set("wallet_page", String(walletQuery.page));
  }

  if (walletQuery.limit !== WALLET_PAGE_SIZE_OPTIONS[0]) {
    params.set("wallet_limit", String(walletQuery.limit));
  }

  const href = `/dashboard?${params.toString()}`;
  return hash ? `${href}#${hash}` : href;
}

export function buildWalletHistoryHref(
  tab: DashboardTab,
  walletQuery: WalletQueryState,
  overrides: Partial<WalletQueryState>,
  hash?: string,
) {
  return buildDashboardTabHref(tab, { ...walletQuery, ...overrides }, hash);
}
