import type { Metadata } from "next";

import { VerifyEmailSuccessView } from "@/components/auth/verify-email-success-view";

export const metadata: Metadata = {
  title: "Email Verified | StakeLoop",
  description:
    "Your StakeLoop email has been verified successfully. Continue to login and access your account.",
};

export default function VerifyEmailSuccessPage() {
  return <VerifyEmailSuccessView />;
}
