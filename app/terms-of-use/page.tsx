import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { TermsAcceptanceView } from "@/components/auth/terms-acceptance-view";
import { getPostAuthRedirect } from "@/lib/stakeloop-routing";
import { getServerSession } from "@/lib/stakeloop-session";

export const metadata: Metadata = {
  title: "Terms of Use | Stakeloop",
  description:
    "Review and accept the Stakeloop terms of service, privacy policy, and compliance disclosures before accessing your dashboard.",
};

export default async function TermsOfUsePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const nextPath = getPostAuthRedirect(session);

  if (nextPath !== "/terms-of-use") {
    redirect(nextPath);
  }

  const displayName =
    session.user.name?.trim() && session.user.name !== session.user.username
      ? session.user.name.trim()
      : session.user.username || "there";

  return <TermsAcceptanceView displayName={displayName} />;
}
