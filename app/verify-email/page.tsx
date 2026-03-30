import type { Metadata } from "next";
import { Suspense } from "react";

import { VerifyEmailContent } from "@/components/auth/verify-email-content";

export const metadata: Metadata = {
  title: "Verify Your Email | StakeLoop",
  description:
    "Check your inbox to verify your StakeLoop account and complete registration.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[linear-gradient(180deg,#fbfcff_0%,#f5f7fb_100%)] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_28px_80px_-46px_rgba(15,23,42,0.18)] sm:p-10">
            <div className="space-y-4">
              <div className="skeleton-shimmer h-4 w-28 rounded-full" />
              <div className="skeleton-shimmer h-10 w-3/4 rounded-2xl" />
              <div className="skeleton-shimmer h-5 w-full rounded-full" />
              <div className="skeleton-shimmer h-5 w-5/6 rounded-full" />
            </div>
            <div className="mt-10 rounded-[1.75rem] border border-slate-100 bg-slate-50 p-6">
              <div className="skeleton-shimmer h-28 rounded-[1.4rem]" />
              <div className="mt-6 space-y-3">
                <div className="skeleton-shimmer h-4 w-1/2 rounded-full" />
                <div className="skeleton-shimmer h-4 w-2/3 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
