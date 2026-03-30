"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { VerifyEmailSuccessView } from "@/components/auth/verify-email-success-view";
import { LandingIcon } from "@/components/landing/icon";
import { type ApiErrorPayload, getErrorMessage } from "@/lib/stakeloop-api";

function StatusBadge({ state }: { state: "pending" | "error" }) {
  const classes =
    state === "error"
      ? "bg-amber-100 text-amber-700"
      : "bg-sky-100 text-sky-700";

  const icon =
    state === "error" ? (
      <svg
        aria-hidden="true"
        className="size-7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <path d="M12 16h.01" />
      </svg>
    ) : (
      <svg
        aria-hidden="true"
        className="size-7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M4 6.5h16A1.5 1.5 0 0 1 21.5 8v8a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 16V8A1.5 1.5 0 0 1 4 6.5Z" />
        <path d="m4 8 8 5 8-5" />
      </svg>
    );

  return (
    <span
      className={`inline-flex size-16 items-center justify-center rounded-[1.4rem] ${classes}`}
    >
      {icon}
    </span>
  );
}

function ArrowIcon() {
  return (
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email")?.trim() ?? "";
  const verified = searchParams.get("verified");
  const [isResending, setIsResending] = useState(false);
  const [feedback, setFeedback] = useState<{
    text: string;
    tone: "error" | "success";
  } | null>(null);

  if (verified === "1") {
    return <VerifyEmailSuccessView />;
  }

  const state = verified === "0" ? "error" : "pending";
  const heading =
    state === "error" ? "Verification link expired." : "Check your inbox.";
  const description =
    state === "error"
      ? "The verification link is invalid, used already, or has expired. Request a fresh link and try again."
      : email
        ? `We've sent a verification link to ${email}. Please click the link to activate your account and start tracking your performance.`
        : "We've sent a verification link to your email address. Please click the link to activate your account and start tracking your performance.";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fbfcff_0%,#f5f7fb_100%)] text-slate-950">
      <main className="flex min-h-screen flex-col md:flex-row">
        <section className="flex flex-1 items-center justify-center bg-[linear-gradient(135deg,#fbfcff_0%,#f7f9fc_100%)] px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-md">
            <div className="mb-12">
              <span className="text-2xl font-black tracking-tight text-slate-950">
                StakeLoop
              </span>
            </div>

            <div className="mb-8">
              <StatusBadge state={state} />
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-[3.1rem]">
              {heading}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-500">
              {state === "pending" && email ? (
                <>
                  We&apos;ve sent a verification link to{" "}
                  <span className="font-bold text-slate-950">{email}</span>.
                  {" "}Please click the link to activate your account and start
                  tracking your performance.
                </>
              ) : (
                description
              )}
            </p>

            <div className="mt-10 space-y-6">
              {state === "error" ? (
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[1rem] bg-[linear-gradient(135deg,#111827_0%,#06090f_100%)] px-6 py-4 text-base font-extrabold text-white shadow-[0_24px_55px_-30px_rgba(15,23,42,0.7)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isResending}
                  onClick={async () => {
                    setIsResending(true);
                    setFeedback(null);

                    try {
                      const response = await fetch(
                        "/api/auth/verification-notification",
                        {
                          method: "POST",
                        },
                      );
                      const payload = (await response.json().catch(
                        () => null,
                      )) as ApiErrorPayload | null;

                      setFeedback({
                        tone: response.ok ? "success" : "error",
                        text: getErrorMessage(
                          payload,
                          response.ok
                            ? "A fresh verification link has been sent."
                            : "Unable to resend the verification email right now.",
                        ),
                      });
                    } catch {
                      setFeedback({
                        tone: "error",
                        text:
                          "The frontend could not reach the StakeLoop API. Check STAKELOOP_API_BASE_URL and try again.",
                      });
                    } finally {
                      setIsResending(false);
                    }
                  }}
                  type="button"
                >
                  {isResending ? "Sending new link..." : "Request New Link"}
                  <ArrowIcon />
                </button>
              ) : (
                <a
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[1rem] bg-[linear-gradient(135deg,#111827_0%,#06090f_100%)] px-6 py-4 text-base font-extrabold text-white shadow-[0_24px_55px_-30px_rgba(15,23,42,0.7)] transition hover:opacity-95"
                  href="mailto:"
                >
                  Open Email App
                  <ArrowIcon />
                </a>
              )}

              <div className="flex flex-col gap-3 pt-4">
                <button
                  className="inline-flex items-center gap-2 text-left text-sm font-medium text-slate-500 transition hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isResending}
                  onClick={async () => {
                    setIsResending(true);
                    setFeedback(null);

                    try {
                      const response = await fetch(
                        "/api/auth/verification-notification",
                        {
                          method: "POST",
                        },
                      );
                      const payload = (await response.json().catch(
                        () => null,
                      )) as ApiErrorPayload | null;

                      setFeedback({
                        tone: response.ok ? "success" : "error",
                        text: getErrorMessage(
                          payload,
                          response.ok
                            ? "A fresh verification link has been sent."
                            : "Unable to resend the verification email right now.",
                        ),
                      });
                    } catch {
                      setFeedback({
                        tone: "error",
                        text:
                          "The frontend could not reach the StakeLoop API. Check STAKELOOP_API_BASE_URL and try again.",
                      });
                    } finally {
                      setIsResending(false);
                    }
                  }}
                  type="button"
                >
                  <svg
                    aria-hidden="true"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                    <path d="M21 3v6h-6" />
                  </svg>
                  Didn&apos;t receive the email? Resend link
                </button>
                <Link
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-sky-700"
                  href="/register"
                >
                  <svg
                    aria-hidden="true"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 20.5v-2.7a2.2 2.2 0 0 1 .65-1.56L15.6 5.3a2.2 2.2 0 0 1 3.11 3.11L7.76 19.35A2.2 2.2 0 0 1 6.2 20H4Z" />
                    <path d="m13.5 7.5 3 3" />
                  </svg>
                  Change email address
                </Link>
              </div>

              {feedback ? (
                <div
                  className={`rounded-[1rem] px-4 py-3 text-sm font-medium ${
                    feedback.tone === "error"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {feedback.text}
                </div>
              ) : null}
            </div>

            <div className="mt-16 border-t border-slate-200/70 pt-8">
              <Link
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
                href="/login"
              >
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 12H5" />
                  <path d="m11 18-6-6 6-6" />
                </svg>
                Back to login
              </Link>
            </div>
          </div>
        </section>

        <section className="relative hidden flex-1 items-center justify-center overflow-hidden bg-slate-100 px-12 py-14 md:flex">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(226,232,240,0.65))]" />
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sky-300/10 blur-[90px]" />
          <div className="absolute bottom-0 left-10 h-52 w-52 rounded-full bg-slate-900/5 blur-[80px]" />

          <div className="relative z-10 max-w-lg">
            <h2 className="max-w-md text-5xl font-black tracking-tight text-slate-950 xl:text-[4rem] xl:leading-[1.02]">
              Precision in every play.
            </h2>

            <ul className="mt-10 space-y-7">
              <li className="flex items-start gap-4">
                <span className="mt-1 inline-flex size-7 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  <LandingIcon className="size-4" name="receipt" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Access verified receipts
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Every transaction is validated against the global ledger
                    for absolute certainty.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-1 inline-flex size-7 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  <LandingIcon className="size-4" name="pulse" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Track daily performance
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Real-time visualization of your capital flows and
                    operational efficiency.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-1 inline-flex size-7 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  <LandingIcon className="size-4" name="spark" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Unlock premium insights
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    AI-driven forecasts to help you anticipate market shifts
                    before they happen.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
