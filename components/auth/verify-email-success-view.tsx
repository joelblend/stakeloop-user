"use client";

import Link from "next/link";

import { LandingIcon } from "@/components/landing/icon";
import { SiteLogo } from "@/components/landing/site-logo";

export function VerifyEmailSuccessView() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fbfcff_0%,#f6f8fc_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.9)_1px,transparent_0)] [background-size:20px_20px]" />
      <div className="pointer-events-none absolute right-[-8%] top-[-10%] h-[22rem] w-[22rem] rounded-full bg-sky-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-8%] h-[22rem] w-[22rem] rounded-full bg-emerald-500/10 blur-[120px]" />

      <header className="fixed inset-x-0 top-0 z-20 mx-auto flex h-20 w-full max-w-7xl items-center justify-center px-6">
        <SiteLogo />
      </header>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-12 pt-24">
        <div className="w-full max-w-md">
          <div className="rounded-[2rem] border border-slate-200/70 bg-white p-10 text-center shadow-[0_32px_64px_-16px_rgba(15,23,42,0.08)] md:p-14">
            <div className="relative mb-10 flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl" />
              </div>
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/5">
                <svg
                  aria-hidden="true"
                  className="size-16 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.5a9.5 9.5 0 1 0 9.5 9.5A9.5 9.5 0 0 0 12 2.5Zm-1.18 13.14-3.2-3.2 1.41-1.41 1.79 1.79 4.15-4.15 1.41 1.41Z" />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-[2.15rem]">
                Email Verified
              </h1>
              <p className="text-base leading-8 text-slate-500">
                Your account is now active and ready. You can now access your
                StakeLoop dashboard and track your performance.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <Link
                className="inline-flex w-full items-center justify-center rounded-[1.15rem] bg-[linear-gradient(135deg,#111827_0%,#06090f_100%)] px-8 py-4 text-base font-extrabold text-white shadow-[0_24px_55px_-30px_rgba(15,23,42,0.65)] transition hover:opacity-95 active:scale-[0.99]"
                href="/login"
              >
                Login to Continue
              </Link>
              <p className="text-sm font-medium text-slate-500">
                Need help?{" "}
                <a
                  className="font-extrabold text-sky-700 transition hover:text-sky-800 hover:underline"
                  href="mailto:support@stakeloop.io?subject=StakeLoop%20Support"
                >
                  Contact support
                </a>
              </p>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
            <span className="inline-flex items-center gap-2">
              <LandingIcon className="size-4" name="shield" />
              Secured
            </span>
            <span className="inline-flex items-center gap-2">
              <LandingIcon className="size-4" name="stamp" />
              Verified
            </span>
          </div>
        </div>
      </main>

      <div className="pointer-events-none fixed bottom-10 left-10 hidden xl:block">
        <div className="flex items-center gap-4 rounded-[1.25rem] border border-white/50 bg-white/55 p-4 backdrop-blur-md">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
            <LandingIcon className="size-5" name="spark" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Market Status
            </p>
            <p className="text-xs font-extrabold text-slate-950">
              System Operational
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed right-10 top-10 hidden xl:block">
        <div className="rotate-3 rounded-[1.75rem] border border-white/40 bg-white/35 p-6 backdrop-blur-sm">
          <div className="h-32 w-48 overflow-hidden rounded-[1.25rem] bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_38%,#f8fafc_100%)] shadow-sm">
            <div className="flex h-full items-end gap-2 px-4 pb-4">
              <span className="h-10 w-6 rounded-t-full bg-sky-200/80" />
              <span className="h-16 w-6 rounded-t-full bg-sky-300/80" />
              <span className="h-12 w-6 rounded-t-full bg-slate-300/70" />
              <span className="h-20 w-6 rounded-t-full bg-slate-900/75" />
              <span className="h-14 w-6 rounded-t-full bg-emerald-300/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
