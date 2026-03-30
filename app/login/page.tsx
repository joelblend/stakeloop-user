import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { LandingIcon } from "@/components/landing/icon";
import { getPostAuthRedirect } from "@/lib/stakeloop-routing";
import { getServerSession } from "@/lib/stakeloop-session";

export const metadata: Metadata = {
  title: "Login | StakeLoop",
  description:
    "Log in to your StakeLoop account to access transparent sports performance tracking.",
};

const trustCards = [
  {
    eyebrow: "Bank Grade",
    icon: "shield" as const,
    textClass: "text-sky-400",
    title: "Secure",
    description: "End-to-end encrypted ledger data.",
  },
  {
    eyebrow: "Live Feed",
    icon: "pulse" as const,
    textClass: "text-emerald-400",
    title: "99.9%",
    description: "Uptime on real-time market data.",
  },
];

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect(getPostAuthRedirect(session));
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="flex min-h-screen">
        <section className="flex w-full flex-col bg-white px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24">
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
            <div className="mb-12">
              <span className="text-2xl font-black tracking-tight text-slate-950">
                StakeLoop
              </span>
            </div>

            <div className="my-auto">
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-[3.1rem]">
                  Welcome back
                </h1>
                <p className="text-base font-medium text-slate-500">
                  Log in to your account
                </p>
              </div>

              <div className="mt-10">
                <LoginForm />
              </div>
            </div>

            <footer className="mt-10 flex flex-wrap gap-x-6 gap-y-2 py-6 text-xs font-medium text-slate-400">
              <a className="transition hover:text-slate-950" href="#">
                Privacy Policy
              </a>
              <a className="transition hover:text-slate-950" href="#">
                Terms of Service
              </a>
              <span>© 2026 StakeLoop</span>
            </footer>
          </div>
        </section>

        <section className="relative hidden w-1/2 overflow-hidden bg-[linear-gradient(135deg,#111827_0%,#06090f_100%)] px-10 py-12 text-white lg:flex lg:items-center lg:justify-center xl:px-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute -right-24 -top-24 size-80 rounded-full bg-sky-500/10 blur-[120px]" />
          <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-white/5 blur-[120px]" />

          <div className="relative z-10 w-full max-w-xl space-y-8">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-sky-500/30 bg-sky-500/15 px-4 py-1 text-xs font-black uppercase tracking-[0.26em] text-sky-400">
                Premium Insights
              </span>
              <h2 className="max-w-lg text-5xl font-black tracking-tight text-white xl:text-[4rem] xl:leading-[1.03]">
                Precision in every stake.
              </h2>
              <p className="max-w-md text-lg leading-9 text-slate-400">
                Access institutional-grade sports analytics and real-time
                performance tracking with the world&apos;s most transparent
                ledger.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {trustCards.map((card) => (
                <article
                  key={card.eyebrow}
                  className="rounded-[1.7rem] border border-white/10 bg-white/75 p-6 text-slate-950 shadow-[0_25px_70px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                >
                  <div className={`flex items-center gap-2 ${card.textClass}`}>
                    <LandingIcon className="size-5" name={card.icon} />
                    <span className="text-[0.68rem] font-black uppercase tracking-[0.14em]">
                      {card.eyebrow}
                    </span>
                  </div>
                  <p className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/55 shadow-[0_35px_90px_-45px_rgba(0,0,0,0.95)]">
              <div className="relative aspect-[16/10] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-6">
                <div className="rounded-[1.1rem] border border-white/8 bg-white/4 p-4">
                  <div className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.14em] text-slate-500">
                    <span>$310</span>
                    <span className="text-slate-700">Live Table</span>
                  </div>
                  <div className="mt-4 grid grid-cols-6 gap-2 text-[0.6rem] font-semibold text-slate-600">
                    {["Outcome", "Stake", "Created", "Odds", "Status", "ROI"].map(
                      (heading) => (
                        <span key={heading}>{heading}</span>
                      ),
                    )}
                  </div>
                  <div className="mt-3 space-y-2">
                    {[0, 1, 2, 3, 4].map((row) => (
                      <div
                        key={row}
                        className="grid grid-cols-6 gap-2 rounded-xl bg-white/[0.03] px-3 py-2"
                      >
                        {Array.from({ length: 6 }).map((_, index) => (
                          <span
                            key={index}
                            className={`h-2 rounded-full ${
                              index === 5
                                ? "bg-slate-400/60"
                                : "bg-slate-700/80"
                            }`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute inset-x-6 bottom-6 rounded-[1.4rem] bg-black/65 p-5 backdrop-blur-sm">
                  <p className="text-3xl font-black tracking-tight text-white">
                    Trusted by 50k+ Pro Analysts
                  </p>
                  <div className="mt-3 flex gap-1.5 text-emerald-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={index}
                        aria-hidden="true"
                        className="size-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="m10 1.5 2.47 5 5.53.8-4 3.9.94 5.5L10 14.1 5.06 16.7 6 11.2 2 7.3l5.53-.8Z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
