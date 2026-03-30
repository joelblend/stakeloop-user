import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CompleteProfileForm } from "@/components/auth/complete-profile-form";
import { SiteLogo } from "@/components/landing/site-logo";
import { getPostAuthRedirect } from "@/lib/stakeloop-routing";
import { getServerSession } from "@/lib/stakeloop-session";

export const metadata: Metadata = {
  title: "Complete Profile | StakeLoop",
  description:
    "Complete your StakeLoop profile in two steps with verified bank details before accessing the dashboard.",
};

export default async function CompleteProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  if (!session.status.email_verified) {
    redirect(getPostAuthRedirect(session));
  }

  if (session.status.profile_completed) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-slate-950">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <SiteLogo />
          <div className="flex items-center gap-4">
            <Link
              className="text-sm font-medium text-slate-500 transition hover:text-blue-600"
              href="mailto:support@stakeloop.io?subject=StakeLoop%20Profile%20Help"
            >
              Help
            </Link>
            <div className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <svg
                aria-hidden="true"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M18 20a6 6 0 0 0-12 0" />
                <circle cx="12" cy="10" r="4" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-73px)] items-start justify-center px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="w-full max-w-3xl rounded-md border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 lg:max-w-[48rem]">
          <CompleteProfileForm user={session.user} />
        </div>
      </main>

      <footer className="pb-10 text-center">
        <p className="text-xs font-medium tracking-[0.16em] text-slate-400 uppercase">
          © 2026 StakeLoop. Profile access remains locked until onboarding is
          complete.
        </p>
      </footer>
    </div>
  );
}
