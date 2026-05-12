import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { UserDashboard } from "@/components/dashboard/user-dashboard";
import type {
  ActiveSlotOfferPayload,
  UserPurchasesPayload,
} from "@/lib/stakeloop-api";
import {
  normalizeWalletCategory,
  normalizeWalletLimit,
  normalizeWalletMonth,
  normalizeWalletPage,
} from "@/lib/dashboard-wallet";
import { getPostAuthRedirect } from "@/lib/stakeloop-routing";
import {
  getAuthToken,
  getServerSession,
  requestBackend,
} from "@/lib/stakeloop-session";

export const metadata: Metadata = {
  title: "Dashboard | Stakeloop",
  description:
    "Track your verified onboarding state, live slot offers, recent activity, and monthly performance from one dashboard.",
};

function getNextOfferMonthKey() {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + 1);

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

type DashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const requestedTab = firstParam(resolvedSearchParams?.tab);
  const activeTab = requestedTab === "performance" ? "performance" : "overview";
  const walletCategory = normalizeWalletCategory(
    firstParam(resolvedSearchParams?.wallet_category),
  );
  const walletMonth = normalizeWalletMonth(
    firstParam(resolvedSearchParams?.wallet_month),
  );
  const walletPage = normalizeWalletPage(firstParam(resolvedSearchParams?.wallet_page));
  const walletLimit = normalizeWalletLimit(firstParam(resolvedSearchParams?.wallet_limit));
  const token = await getAuthToken();
  const [session, offerResult] = await Promise.all([
    getServerSession(),
    token
      ? requestBackend<ActiveSlotOfferPayload>("/api/user/slot-offer/active", {
          token,
        })
      : Promise.resolve(null),
  ]);

  if (!session) {
    redirect("/login");
  }

  const nextPath = getPostAuthRedirect(session);

  if (nextPath !== "/dashboard") {
    redirect(nextPath);
  }

  const activeOffer =
    offerResult?.ok && offerResult.payload && "offer" in offerResult.payload
      ? offerResult.payload
      : null;
  const purchasesMonth = activeOffer?.month ?? getNextOfferMonthKey();
  const purchasesQuery = new URLSearchParams({
    month: purchasesMonth,
    wallet_category: walletCategory,
    wallet_page: String(walletPage),
    wallet_limit: String(walletLimit),
  });
  if (walletMonth) {
    purchasesQuery.set("wallet_month", walletMonth);
  }
  const purchasesResult = token
    ? await requestBackend<UserPurchasesPayload>(
        `/api/user/slots/me?${purchasesQuery.toString()}`,
        {
          token,
        },
      )
    : null;
  const purchases =
    purchasesResult?.ok &&
    purchasesResult.payload &&
    "purchases" in purchasesResult.payload
      ? purchasesResult.payload
      : null;

  return (
    <UserDashboard
      activeOffer={activeOffer}
      activeTab={activeTab}
      purchases={purchases}
      session={session}
    />
  );
}
