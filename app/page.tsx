import type { ComponentProps } from "react";
import Link from "next/link";

import { LandingIcon } from "@/components/landing/icon";
import { SiteLogo } from "@/components/landing/site-logo";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { getApiHealth } from "@/lib/stakeloop-api";

const steps = [
  {
    description:
      "Open your account in minutes and get access to the StakeLoop member flow.",
    icon: "user-plus",
    title: "1. Create Account",
  },
  {
    description:
      "Complete a quick identity and bank profile check before you participate.",
    icon: "shield",
    title: "2. Verify Identity",
  },
  {
    description:
      "Choose the monthly offer that fits you and reserve your slot securely.",
    icon: "wallet",
    title: "3. Buy Slots",
  },
  {
    description:
      "Track tickets, outcomes, and your reservation history from one dashboard.",
    icon: "ticket",
    title: "4. View Tickets",
  },
] as const;

const benefits = [
  {
    description:
      "Daily football selections curated around discipline, structure, and clear decision-making.",
    icon: "spark",
    title: "Curated Tickets",
  },
  {
    description:
      "Clear activity updates and payout trails so users can see what happened, not just promises.",
    icon: "eye",
    title: "Transparent Outcomes",
  },
  {
    description:
      "A calm, modern frontend built to keep focus on the bankroll experience rather than noise.",
    icon: "pulse",
    title: "Real-time Activity",
  },
  {
    description:
      "Receipts and ledger-friendly records that make purchases and settlements easier to verify.",
    icon: "receipt",
    title: "Digital Receipts",
  },
  {
    description:
      "A safer onboarding path with verification, protected profile steps, and server-side API rules.",
    icon: "lock",
    title: "Secure Onboarding",
  },
  {
    description:
      "A clean dashboard foundation for slots, history, and account-level visibility as the app grows.",
    icon: "dashboard",
    title: "Clean Dashboard",
  },
] as const;

const transparencyCards = [
  {
    cta: "Preview Checks",
    description:
      "See the discipline behind each pool with clearer status cues and verified activity signals.",
    icon: "stamp",
    title: "Verified Status",
  },
  {
    cta: "Explore Flow",
    description:
      "Follow your movement from onboarding to purchase history with a cleaner user-facing audit path.",
    icon: "flow",
    title: "Transaction Trail",
  },
  {
    cta: "Read Rules",
    description:
      "Simple policies, clear responsibilities, and fewer hidden assumptions between frontend and backend.",
    icon: "gavel",
    title: "Clear Rules",
  },
] as const;

const testimonials = [
  {
    accent: "bg-sky-100 text-sky-700",
    body: "Finally a betting-adjacent product that feels structured, readable, and honest about outcomes.",
    initials: "JD",
    name: "James D.",
  },
  {
    accent: "bg-violet-100 text-violet-700",
    body: "The layout is calm and premium. I can understand the offer flow without digging through clutter.",
    initials: "MK",
    name: "Marcus K.",
  },
  {
    accent: "bg-emerald-100 text-emerald-700",
    body: "What sold me was the transparency story. The interface makes trust feel visible instead of abstract.",
    initials: "SL",
    name: "Sarah L.",
  },
] as const;

const faqs = [
  {
    answer:
      "The admin team curates the operational side, while the user frontend is focused on visibility, clarity, and access to the correct pool information.",
    question: "How are the tickets selected?",
  },
  {
    answer:
      "The product still carries financial risk, but the frontend is designed to reduce ambiguity with stronger transparency, verified flows, and traceable actions.",
    question: "Is my money safe?",
  },
  {
    answer:
      "Slot pricing is controlled by the monthly offer configured in the backend, and the frontend will reflect the active offer that users are eligible to buy.",
    question: "What determines the entry amount?",
  },
  {
    answer:
      "Distribution is handled after settlement through the backend rules. The user frontend's role is to show the inputs, status, and history clearly.",
    question: "How are winnings distributed?",
  },
] as const;

function SectionHeading({
  align = "center",
  eyebrow,
  title,
  description,
}: {
  align?: "center" | "left";
  description: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"}`}
    >
      {eyebrow ? (
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-brand">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-8 text-muted">{description}</p>
    </div>
  );
}

function SectionIcon({
  name,
  strong = false,
}: {
  name: ComponentProps<typeof LandingIcon>["name"];
  strong?: boolean;
}) {
  return (
    <span
      className={`inline-flex size-12 items-center justify-center rounded-2xl ${
        strong
          ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
          : "bg-white text-slate-950 ring-1 ring-slate-200"
      }`}
    >
      <LandingIcon className="size-5" name={name} />
    </span>
  );
}

export default async function Home() {
  const apiHealth = await getApiHealth();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <SiteLogo />
          <div className="hidden items-center gap-8 md:flex">
            <Link
              className="text-sm font-semibold text-muted transition hover:text-slate-950"
              href="#how-it-works"
            >
              How it works
            </Link>
            <Link
              className="text-sm font-semibold text-muted transition hover:text-slate-950"
              href="#transparency"
            >
              Transparency
            </Link>
            <Link
              className="text-sm font-semibold text-muted transition hover:text-slate-950"
              href="#testimonials"
            >
              Testimonials
            </Link>
            <Link
              className="text-sm font-semibold text-muted transition hover:text-slate-950"
              href="#faq"
            >
              FAQ
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="hidden text-sm font-semibold text-muted transition hover:text-slate-950 sm:inline-flex"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
              href="/register"
            >
              Create account
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pb-24 pt-16 sm:pt-20 lg:pb-32 lg:pt-24">
        <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.16),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_35%)]" />
        <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
              </span>
              Daily ticket pool open
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-bold ${
                  apiHealth.ok
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {apiHealth.ok ? "API live" : "API checking"}
              </span>
            </div>

            <h1 className="mt-8 max-w-xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
              A smarter pooled bankroll experience.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Join a cleaner, more transparent product experience for curated
              football ticket participation, reservation history, and verified
              status updates.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-7 py-4 text-base font-bold text-white transition hover:bg-slate-800"
                href="/register"
              >
                Get Started
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-950 transition hover:border-slate-300 hover:bg-slate-50"
                href="#transparency"
              >
                View Demo
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted">
              <div className="flex -space-x-2">
                {["AL", "JD", "MK"].map((initials) => (
                  <span
                    key={initials}
                    className="inline-flex size-10 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-bold text-slate-700"
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <p>Built for users who want clearer visibility before they commit.</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 -top-8 h-36 w-36 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="absolute -bottom-10 -right-8 h-36 w-36 rounded-full bg-indigo-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] sm:p-7">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-sm font-semibold text-muted">Today&apos;s Ticket</p>
                  <h3 className="mt-1 text-xl font-extrabold text-slate-950">
                    Pool Snapshot
                  </h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    apiHealth.ok
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {apiHealth.ok ? "Connected" : "Retrying"}
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    fixture: "Man City vs Arsenal",
                    market: "Over 2.5 Goals",
                    odds: "1.85",
                    short: "MC",
                  },
                  {
                    fixture: "Real Madrid vs Barca",
                    market: "Home Win",
                    odds: "2.10",
                    short: "RM",
                  },
                ].map((item) => (
                  <div
                    key={item.fixture}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-950 ring-1 ring-slate-200">
                        {item.short}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-950">
                          {item.fixture}
                        </p>
                        <p className="text-xs text-muted">{item.market}</p>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-slate-950">
                      {item.odds}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] bg-slate-950 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Potential Return
                  </p>
                  <p className="mt-3 text-3xl font-extrabold">3.88x</p>
                </div>
                <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Pool Share
                  </p>
                  <p className="mt-3 text-3xl font-extrabold text-slate-950">
                    15%
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "API", value: apiHealth.ok ? "Online" : "Queued" },
                  { label: "Ledger", value: "Visible" },
                  { label: "Status", value: "Tracked" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-950">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="content-auto border-y border-border/70 bg-white py-24"
        id="how-it-works"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            description="Start pooling your bankroll in four simple, secure steps."
            title="How It Works"
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[1.75rem] border border-slate-100 bg-slate-50 px-6 py-7 transition hover:-translate-y-1 hover:border-slate-200 hover:bg-white hover:shadow-[0_24px_50px_-28px_rgba(15,23,42,0.28)]"
              >
                <SectionIcon name={step.icon} strong={index === 0} />
                <h3 className="mt-6 text-lg font-extrabold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-auto bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            description="Experience a cleaner, more transparent platform designed to feel premium from the first page."
            title="Why Choose StakeLoop"
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-[1.75rem] border border-white/70 bg-white p-6 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.35)] transition hover:-translate-y-1"
              >
                <div className="text-brand">
                  <SectionIcon name={benefit.icon} />
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-slate-950">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="content-auto overflow-hidden bg-white py-24"
        id="transparency"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            description="We believe trust should feel visible in the interface, not hidden behind support messages."
            eyebrow="Trust & Safety"
            title="Transparency First"
          />
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {transparencyCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[1.9rem] border border-slate-100 bg-slate-50 p-3 pb-6 transition hover:border-slate-200"
              >
                <div className="flex aspect-[16/10] items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,#eef4ff,#f8fafc)] text-slate-400">
                  <LandingIcon className="size-10" name={card.icon} />
                </div>
                <div className="px-3 pt-6">
                  <h3 className="text-xl font-extrabold text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {card.description}
                  </p>
                  <Link
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand transition hover:text-sky-700"
                    href="#waitlist"
                  >
                    {card.cta}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="content-auto border-y border-border/70 bg-slate-50 py-24"
        id="testimonials"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            description="Social proof for now, with room to evolve into richer verified-history modules later."
            title="Trusted by Early Adopters"
          />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-[1.75rem] border border-slate-100 bg-white p-8 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.25)]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex size-11 items-center justify-center rounded-full text-sm font-extrabold ${testimonial.accent}`}
                  >
                    {testimonial.initials}
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-950">
                      {testimonial.name}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      Early User
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-muted">
                  &ldquo;{testimonial.body}&rdquo;
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-auto bg-white py-24" id="faq">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            description="A few clear answers to set expectations while the user app grows page by page."
            title="Frequently Asked Questions"
          />
          <div className="mt-14 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[1.5rem] border border-slate-100 bg-slate-50 p-6 open:bg-white open:shadow-[0_20px_45px_-32px_rgba(15,23,42,0.28)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <h3 className="text-base font-extrabold text-slate-950">
                    {faq.question}
                  </h3>
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-white text-slate-950 transition group-open:rotate-180">
                    <span aria-hidden="true">⌄</span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="content-auto relative overflow-hidden bg-slate-950 py-24 text-white"
        id="waitlist"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_40%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.06),_transparent_48%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Join the early-access waitlist while we keep building the user
            frontend page by page.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-base font-bold text-slate-950 transition hover:bg-slate-100"
              href="/register"
            >
              Create Free Account
            </Link>
            <a
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-7 py-4 text-base font-bold text-white transition hover:bg-white/10"
              href="mailto:support@stakeloop.io"
            >
              Contact Support
            </a>
          </div>
          <div
            className="mx-auto mt-10 max-w-2xl rounded-[1.8rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm sm:p-6"
            id="waitlist-form"
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
              Public API Mapping
            </p>
            <p className="text-sm leading-7 text-slate-300">
              This landing page is already wired to the backend health endpoint
              and the pilot waitlist endpoint through the Next.js frontend.
            </p>
            <WaitlistForm className="mt-6 text-left" dark />
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              {apiHealth.message}
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 bg-background pb-10 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <SiteLogo />
            <div className="flex flex-wrap gap-6 text-sm font-semibold text-muted">
              <Link href="#how-it-works">About</Link>
              <Link href="#faq">Terms</Link>
              <Link href="#transparency">Privacy</Link>
              <a href="mailto:support@stakeloop.io">Responsible Use</a>
            </div>
          </div>
          <div className="mt-10 border-t border-border/80 pt-8 text-xs leading-7 text-muted">
            <p>
              <strong className="text-slate-950">Responsible Use Disclaimer:</strong>{" "}
              StakeLoop is a pooled bankroll product experience. Participation
              involves financial risk, and this frontend is designed to surface
              clearer information, not remove that risk entirely.
            </p>
            <p className="mt-4">© 2026 StakeLoop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
