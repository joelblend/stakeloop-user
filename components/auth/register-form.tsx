"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  type ApiErrorPayload,
  type AuthSessionPayload,
  firstFieldError,
  getErrorMessage,
} from "@/lib/stakeloop-api";
import { getPostAuthRedirect } from "@/lib/stakeloop-routing";

function EyeIcon({ open }: { open: boolean }) {
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
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.5" />
      {open ? null : <path d="M4 4 20 20" />}
    </svg>
  );
}

const inputClasses =
  "w-full rounded-[1.55rem] border border-transparent bg-slate-100/90 px-5 py-4 text-base font-medium text-slate-950 placeholder:text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition focus:border-sky-200 focus:bg-white focus:ring-4 focus:ring-sky-100";

type FieldErrors = Partial<
  Record<"email" | "password" | "referral_code" | "username", string>
>;

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    router.prefetch("/login");
    router.prefetch("/verify-email");
    router.prefetch("/complete-profile");
  }, [router]);

  return (
    <>
      <form
        className="space-y-6"
        onSubmit={async (event) => {
          event.preventDefault();
          setIsSubmitting(true);
          setFieldErrors({});
          setFormMessage(null);

          try {
            const response = await fetch("/api/auth/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email.trim().toLowerCase(),
                password,
                referral_code: referralCode.trim() || undefined,
                username: username.trim(),
              }),
            });

            const payload = (await response.json().catch(() => null)) as
              | (ApiErrorPayload & Partial<AuthSessionPayload>)
              | null;

            if (!response.ok) {
              setFieldErrors({
                email: firstFieldError(payload?.errors, "email"),
                password: firstFieldError(payload?.errors, "password"),
                referral_code: firstFieldError(payload?.errors, "referral_code"),
                username: firstFieldError(payload?.errors, "username"),
              });
              setFormMessage(
                getErrorMessage(
                  payload,
                  "Unable to create your account right now.",
                ),
              );
              return;
            }

            if (payload?.user && payload?.status) {
              router.replace(
                getPostAuthRedirect(payload as AuthSessionPayload),
              );
              return;
            }

            router.replace(
              email
                ? `/verify-email?email=${encodeURIComponent(email.trim())}`
                : "/verify-email",
            );
          } catch {
            setFormMessage(
              "The frontend could not reach the StakeLoop API. Check STAKELOOP_API_BASE_URL and try again.",
            );
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="px-1 text-sm font-extrabold text-slate-700">
              Username
            </span>
            <input
              autoComplete="username"
              className={inputClasses}
              name="username"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="e.g. sharp_bettor_21"
              type="text"
              value={username}
            />
            {fieldErrors.username ? (
              <p className="px-1 text-sm font-medium text-rose-600">
                {fieldErrors.username}
              </p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="px-1 text-sm font-extrabold text-slate-700">
              Email
            </span>
            <input
              autoComplete="email"
              className={inputClasses}
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              type="email"
              value={email}
            />
            {fieldErrors.email ? (
              <p className="px-1 text-sm font-medium text-rose-600">
                {fieldErrors.email}
              </p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="px-1 text-sm font-extrabold text-slate-700">
              Password
            </span>
            <span className="relative block">
              <input
                autoComplete="new-password"
                className={`${inputClasses} pr-14`}
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="........"
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-950"
                onClick={() => setShowPassword((value) => !value)}
                type="button"
              >
                <EyeIcon open={showPassword} />
              </button>
            </span>
            {fieldErrors.password ? (
              <p className="px-1 text-sm font-medium text-rose-600">
                {fieldErrors.password}
              </p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="px-1 text-sm font-extrabold text-slate-700">
              Referral Code (Optional)
            </span>
            <input
              className={inputClasses}
              name="referral_code"
              onChange={(event) => setReferralCode(event.target.value)}
              placeholder="Enter code"
              type="text"
              value={referralCode}
            />
            {fieldErrors.referral_code ? (
              <p className="px-1 text-sm font-medium text-rose-600">
                {fieldErrors.referral_code}
              </p>
            ) : null}
          </label>
        </div>

        {formMessage ? (
          <div className="rounded-[1.2rem] bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {formMessage}
          </div>
        ) : null}

        <button
          className="inline-flex w-full items-center justify-center rounded-[1.45rem] bg-slate-950 px-6 py-4 text-base font-extrabold text-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.7)] transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="pt-3 text-center text-sm font-medium text-slate-500">
        Already have an account?{" "}
        <Link
          className="font-extrabold text-sky-700 transition hover:text-sky-800 hover:underline"
          href="/login"
        >
          Login
        </Link>
      </p>
    </>
  );
}
