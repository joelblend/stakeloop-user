import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { TwoFactorVerificationView } from "@/components/auth/two-factor-verification-view";
import { SiteLogo } from "@/components/landing/site-logo";
import { getPostAuthRedirect } from "@/lib/stakeloop-routing";
import { getServerSession } from "@/lib/stakeloop-session";

export const metadata: Metadata = {
  title: "Verify 2FA | Stakeloop",
  description:
    "Enter your Stakeloop authenticator code to complete sign-in securely.",
};

export default async function VerifyTwoFactorPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const nextPath = getPostAuthRedirect(session);

  if (nextPath !== "/verify-2fa") {
    redirect(nextPath);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fcfdff_0%,#f4f8ff_48%,#e9f0ff_100%)] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-16">
        <div className="mb-12">
          <SiteLogo />
        </div>

        <div className="grid flex-1 items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="max-w-xl space-y-6">
            <div className="inline-flex rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[0.7rem] font-black uppercase tracking-[0.26em] text-slate-500 shadow-sm backdrop-blur">
              Account Protection
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Your account is one step away.
            </h1>
            <p className="max-w-lg text-base leading-8 text-slate-500 sm:text-lg">
              Stakeloop requires a fresh authenticator code before we unlock
              your session. This extra check protects access to slot activity,
              profile updates, and your dashboard history.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.6rem] border border-white/80 bg-white/85 p-5 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.35)] backdrop-blur">
                <p className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-sky-700">
                  Security
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Every new login needs the code generated on your trusted device.
                </p>
              </article>
              <article className="rounded-[1.6rem] border border-white/80 bg-white/85 p-5 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.35)] backdrop-blur">
                <p className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-emerald-700">
                  Fast Access
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Once verified, we&apos;ll send you straight back to the right next step.
                </p>
              </article>
            </div>
          </section>

          <section className="flex justify-center lg:justify-end">
            <TwoFactorVerificationView email={session.user.email} />
          </section>
        </div>
      </div>
    </main>
  );
}
