import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { UserDashboard } from "@/components/dashboard/user-dashboard";
import type {
  ActiveSlotOfferPayload,
  UserPurchasesPayload,
} from "@/lib/stakeloop-api";
import { getPostAuthRedirect } from "@/lib/stakeloop-routing";
import {
  getAuthToken,
  getServerSession,
  requestBackend,
} from "@/lib/stakeloop-session";

export const metadata: Metadata = {
  title: "Dashboard | StakeLoop",
  description:
    "Track your verified onboarding state, live slot offers, and recent StakeLoop activity from one dashboard.",
};

function getNextOfferMonthKey() {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + 1);

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export default async function DashboardPage() {
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

  if (!session.status.email_verified) {
    redirect(getPostAuthRedirect(session));
  }

  if (!session.status.profile_completed) {
    redirect("/complete-profile");
  }

  const activeOffer =
    offerResult?.ok && offerResult.payload && "offer" in offerResult.payload
      ? offerResult.payload
      : null;
  const purchasesMonth = activeOffer?.month ?? getNextOfferMonthKey();
  const purchasesResult = token
    ? await requestBackend<UserPurchasesPayload>(
        `/api/user/slots/me?month=${encodeURIComponent(purchasesMonth)}`,
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
      purchases={purchases}
      session={session}
    />
  );
}
