"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { SiteLogo } from "@/components/landing/site-logo";
import {
  TERMS_EFFECTIVE_DATE_LABEL,
  TERMS_GROUP_ORDER,
  TERMS_LAST_UPDATED_LABEL,
  TERMS_SECTIONS,
  TERMS_VERSION,
  type TermsCallout,
  type TermsSection,
} from "@/lib/stakeloop-terms";

const groupedTermsSections = TERMS_GROUP_ORDER.map((group) => ({
  group,
  sections: TERMS_SECTIONS.filter((section) => section.group === group),
}));

const calloutToneClasses: Record<TermsCallout["tone"], string> = {
  info: "border-sky-200 bg-sky-50 text-sky-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
};

function LegalCallout({ callout }: { callout: TermsCallout }) {
  return (
    <div
      className={`rounded-[1.5rem] border px-5 py-4 sm:px-6 ${calloutToneClasses[callout.tone]}`}
    >
      <p className="text-xs font-black uppercase tracking-[0.24em]">
        {callout.title}
      </p>
      <p className="mt-3 text-sm leading-7 opacity-90">{callout.body}</p>
    </div>
  );
}

function LegalSection({ section }: { section: TermsSection }) {
  return (
    <section
      className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.35)] sm:p-8"
      id={section.id}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.22em] text-slate-500">
          {section.group}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {section.id.replace(/-/g, " ")}
        </span>
      </div>
      <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-[2rem]">
        {section.title}
      </h2>
      <div className="mt-5 space-y-4 text-sm leading-8 text-slate-600 sm:text-[0.98rem]">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {section.bullets?.length ? (
        <ul className="mt-5 space-y-3 rounded-[1.5rem] bg-slate-50 px-5 py-5 text-sm leading-7 text-slate-700">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {section.callout ? (
        <div className="mt-6">
          <LegalCallout callout={section.callout} />
        </div>
      ) : null}
    </section>
  );
}

type TermsAcceptanceCardProps = {
  accepted: boolean;
  formMessage: string | null;
  isSubmitting: boolean;
  onAccept: () => Promise<void>;
  onPrint: () => void;
  setAccepted: (value: boolean) => void;
};

function TermsAcceptanceCard({
  accepted,
  formMessage,
  isSubmitting,
  onAccept,
  onPrint,
  setAccepted,
}: TermsAcceptanceCardProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)]">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
        Acceptance
      </p>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
        One final step before your dashboard unlocks
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Confirm that you have reviewed the Terms of Service, Privacy Policy,
        and compliance notes. Your acceptance is saved to your account so it
        follows you across signed-in devices.
      </p>

      <label className="mt-6 flex gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
        <input
          checked={accepted}
          className="mt-1 size-4 rounded border-slate-300 text-slate-950 focus:ring-slate-300"
          onChange={(event) => setAccepted(event.target.checked)}
          type="checkbox"
        />
        <span className="text-sm leading-7 text-slate-700">
          I have read and agree to the Stakeloop Terms of Service, Privacy
          Policy, and onboarding compliance requirements.
        </span>
      </label>

      {formMessage ? (
        <div className="mt-4 rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {formMessage}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          className="inline-flex h-12 flex-1 items-center justify-center rounded-[1.25rem] bg-slate-950 px-5 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting || !accepted}
          onClick={() => {
            void onAccept();
          }}
          type="button"
        >
          {isSubmitting ? "Saving acceptance..." : "Agree and continue"}
        </button>
        <button
          className="inline-flex h-12 items-center justify-center rounded-[1.25rem] border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          onClick={onPrint}
          type="button"
        >
          Print copy
        </button>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Version {TERMS_VERSION}
      </p>
    </div>
  );
}

export function TermsAcceptanceView({
  displayName,
}: {
  displayName: string;
}) {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAccept() {
    if (!accepted || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFormMessage(null);

    try {
      const response = await fetch("/api/auth/terms-acceptance", {
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        setFormMessage(
          payload?.message ??
            "We couldn't save your acceptance right now. Please try again.",
        );
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setFormMessage(
        "We couldn't connect to Stakeloop right now. Please try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f5f7fb_40%,#eef2f8_100%)] text-slate-950">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <SiteLogo />
          <div className="hidden items-center gap-6 sm:flex">
            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Legal Step
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                Terms acceptance required before dashboard access
              </p>
            </div>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              href="mailto:support@stakeloop.io?subject=Stakeloop%20Terms%20Questions"
            >
              Contact support
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[18rem,minmax(0,1fr)] xl:grid-cols-[20rem,minmax(0,1fr)]">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.45)]">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-700">
                Welcome back
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Review the legal terms, {displayName}
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                This is the final onboarding checkpoint before Stakeloop unlocks
                your account experience.
              </p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-slate-400">
                    Effective
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {TERMS_EFFECTIVE_DATE_LABEL}
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-slate-400">
                    Last Updated
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {TERMS_LAST_UPDATED_LABEL}
                  </p>
                </div>
              </div>
            </div>

            <nav className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]">
              <p className="px-2 text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                Jump to section
              </p>
              <div className="mt-4 space-y-5">
                {groupedTermsSections.map(({ group, sections }) => (
                  <div key={group}>
                    <p className="px-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-slate-400">
                      {group}
                    </p>
                    <div className="mt-2 space-y-1">
                      {sections.map((section) => (
                        <a
                          key={section.id}
                          className="flex rounded-[1rem] px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                          href={`#${section.id}`}
                        >
                          {section.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </nav>

            <div className="hidden lg:block">
              <TermsAcceptanceCard
                accepted={accepted}
                formMessage={formMessage}
                isSubmitting={isSubmitting}
                onAccept={handleAccept}
                onPrint={handlePrint}
                setAccepted={setAccepted}
              />
            </div>
          </aside>

          <div className="space-y-6">
            <section className="overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white shadow-[0_28px_80px_-52px_rgba(15,23,42,0.4)]">
              <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#0f172a_0%,#111827_48%,#1d4ed8_100%)] px-6 py-8 text-white sm:px-8 sm:py-10">
                <div className="max-w-3xl">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-200">
                    Terms of Service & Privacy Policy
                  </p>
                  <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-[3.4rem] sm:leading-[1.02]">
                    Read carefully before you continue
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-200 sm:text-base">
                    These terms explain how Stakeloop operates, how your data is
                    handled, what risks you accept, and the compliance standards
                    that apply to your account.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 px-6 py-6 sm:px-8 lg:grid-cols-3">
                {[
                  {
                    label: "Account use",
                    value: "Restricted to lawful, verified participation",
                  },
                  {
                    label: "Privacy",
                    value: "Data used only for operations, security, and compliance",
                  },
                  {
                    label: "Risk",
                    value: "Financial losses remain possible at all times",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4"
                  >
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-7 text-slate-800">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {TERMS_SECTIONS.map((section) => (
              <LegalSection key={section.id} section={section} />
            ))}

            <div className="lg:hidden">
              <TermsAcceptanceCard
                accepted={accepted}
                formMessage={formMessage}
                isSubmitting={isSubmitting}
                onAccept={handleAccept}
                onPrint={handlePrint}
                setAccepted={setAccepted}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
