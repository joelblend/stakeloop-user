"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  type ApiErrorPayload,
  type AuthSessionPayload,
  firstFieldError,
  getErrorMessage,
} from "@/lib/stakeloop-api";
import { getPostAuthRedirect } from "@/lib/stakeloop-routing";

type TwoFactorVerificationViewProps = {
  email: string;
};

export function TwoFactorVerificationView({
  email,
}: TwoFactorVerificationViewProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/complete-profile");
    router.prefetch("/terms-of-use");
    router.prefetch("/verify-email");
  }, [router]);

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/95 p-8 shadow-[0_35px_90px_-48px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-10">
      <div className="rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-[0.7rem] font-black uppercase tracking-[0.24em] text-sky-700">
        Two-Factor Verification
      </div>

      <div className="mt-6 space-y-3">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-[2.4rem]">
          Confirm it&apos;s really you
        </h1>
        <p className="text-sm leading-7 text-slate-500 sm:text-base">
          Enter the 6-digit code from your authenticator app for{" "}
          <span className="font-bold text-slate-700">{email}</span> to finish
          signing in.
        </p>
      </div>

      <form
        className="mt-8 space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();

          const normalizedCode = code.replace(/\D/g, "").slice(0, 6);
          setCode(normalizedCode);
          setFieldError(null);
          setFormMessage(null);

          if (normalizedCode.length !== 6) {
            setFieldError("Enter the 6-digit verification code from your authenticator app.");
            return;
          }

          setIsSubmitting(true);

          try {
            const response = await fetch("/api/auth/2fa/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                code: normalizedCode,
              }),
            });

            const payload = (await response.json().catch(() => null)) as
              | (ApiErrorPayload & Partial<AuthSessionPayload>)
              | null;

            if (!response.ok) {
              if (response.status === 401) {
                router.replace("/login");
                return;
              }

              setFieldError(firstFieldError(payload?.errors, "code") ?? null);
              setFormMessage(
                getErrorMessage(payload, "We couldn't verify that code right now."),
              );
              return;
            }

            if (payload?.user && payload?.status) {
              router.replace(getPostAuthRedirect(payload as AuthSessionPayload));
              return;
            }

            router.replace("/dashboard");
          } catch {
            setFormMessage(
              "We couldn't connect to Stakeloop right now. Please try again in a moment.",
            );
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <label className="block space-y-2">
          <span className="text-sm font-extrabold tracking-wide text-slate-600">
            Authentication code
          </span>
          <input
            autoComplete="one-time-code"
            className="w-full rounded-[1.2rem] border border-transparent bg-slate-100/90 px-5 py-4 text-center text-2xl font-black tracking-[0.35em] text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition focus:border-sky-200 focus:bg-white focus:ring-4 focus:ring-sky-100"
            inputMode="numeric"
            maxLength={6}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="000000"
            value={code}
          />
          {fieldError ? (
            <p className="text-sm font-medium text-rose-600">{fieldError}</p>
          ) : null}
        </label>

        {formMessage ? (
          <div className="rounded-[1rem] bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {formMessage}
          </div>
        ) : null}

        <button
          className="inline-flex w-full items-center justify-center rounded-[1rem] bg-slate-950 px-6 py-4 text-base font-extrabold text-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.7)] transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Verifying..." : "Complete sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm leading-7 text-slate-500">
        Don&apos;t have access to your authenticator app? Contact{" "}
        <a
          className="font-bold text-sky-700 transition hover:text-sky-800 hover:underline"
          href="mailto:support@stakeloop.io?subject=Stakeloop%202FA%20Help"
        >
          support
        </a>{" "}
        so we can help you recover access safely.
      </p>
    </div>
  );
}
