import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { LandingIcon } from "@/components/landing/icon";
import { SiteLogo } from "@/components/landing/site-logo";
import { getPostAuthRedirect } from "@/lib/stakeloop-routing";
import { getServerSession } from "@/lib/stakeloop-session";

export const metadata: Metadata = {
  title: "Create Account | StakeLoop",
  description:
    "Create your StakeLoop account to start tracking transparent sports performance.",
};

const highlights = [
  {
    icon: "shield" as const,
    title: "Transparency",
  },
  {
    icon: "receipt" as const,
    title: "Verified Receipts",
  },
  {
    icon: "pulse" as const,
    title: "Daily Tracking",
  },
];

export default async function RegisterPage() {
  const session = await getServerSession();

  if (session) {
    redirect(getPostAuthRedirect(session));
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fcfdff_0%,#f5f8ff_50%,#eef4ff_100%)] text-slate-950">
      <div className="grid min-h-screen md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-md">
            <div className="mb-10 md:hidden">
              <SiteLogo />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-[3.2rem]">
                Join StakeLoop
              </h1>
              <p className="max-w-sm text-base leading-8 text-slate-500">
                The transparent way to track sports performance.
              </p>
            </div>

            <div className="mt-10">
              <RegisterForm />
            </div>
          </div>
        </section>

        <section className="relative hidden overflow-hidden border-l border-white/60 md:flex md:flex-col md:justify-between md:px-10 md:py-12 lg:px-16 lg:py-16 xl:px-24">
          <div className="absolute right-[-10%] top-[-8%] h-[26rem] w-[26rem] rounded-full bg-sky-300/20 blur-[120px]" />
          <div className="absolute bottom-[-8%] left-[-8%] h-[18rem] w-[18rem] rounded-full bg-indigo-200/30 blur-[110px]" />

          <div className="relative z-10">
            <SiteLogo />
          </div>

          <div className="relative z-10 max-w-xl">
            <h2 className="max-w-lg text-5xl font-black tracking-tight text-slate-950 xl:text-[4rem] xl:leading-[1.02]">
              Precision in every play.
            </h2>
            <p className="mt-6 max-w-xl text-xl leading-10 text-slate-500">
              Join the world&apos;s most trusted sports performance ledger
              where every stat is verified and every win is documented.
            </p>

            <ul className="mt-12 space-y-5">
              {highlights.map((item) => (
                <li key={item.title} className="flex items-center gap-4">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/80 text-sky-700 shadow-[0_16px_35px_-28px_rgba(37,99,235,0.45)] ring-1 ring-white/80 backdrop-blur-sm">
                    <LandingIcon className="size-5" name={item.icon} />
                  </span>
                  <span className="text-lg font-bold text-slate-800">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>

            <div className="relative mt-14 max-w-3xl translate-x-4 rotate-[-2deg] xl:translate-x-8">
              <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/45 p-6 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-2 w-20 rounded-full bg-slate-300" />
                    <div className="h-4 w-40 rounded-full bg-slate-400/70" />
                  </div>
                  <div className="flex gap-2">
                    <span className="size-8 rounded-full bg-white/70" />
                    <span className="size-8 rounded-full bg-white/70" />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="h-24 rounded-[1.5rem] bg-white/60 ring-1 ring-white/50" />
                  <div className="h-24 rounded-[1.5rem] bg-white/55 ring-1 ring-white/40" />
                  <div className="h-24 rounded-[1.5rem] bg-white/50 ring-1 ring-white/30" />
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="size-10 rounded-full bg-sky-200/65" />
                    <span className="h-3 w-4/5 rounded-full bg-slate-300/80" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="size-10 rounded-full bg-sky-200/55" />
                    <span className="h-3 w-3/5 rounded-full bg-slate-300/70" />
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.18),_transparent_32%),linear-gradient(120deg,rgba(255,255,255,0.05),rgba(255,255,255,0.45),rgba(255,255,255,0.04))]" />
              </div>
            </div>
          </div>

          <p className="relative z-10 text-sm font-black uppercase tracking-[0.28em] text-slate-400">
            Global Performance Ledger
          </p>
        </section>
      </div>
    </main>
  );
}
