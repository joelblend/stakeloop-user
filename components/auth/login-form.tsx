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

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path
        d="M21.8 12.23c0-.77-.07-1.51-.2-2.23H12v4.22h5.49a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.05-4.39 3.05-7.63Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.07-.91 6.76-2.46l-3.3-2.56c-.91.61-2.08.97-3.46.97-2.66 0-4.91-1.8-5.72-4.21H2.88v2.64A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.28 13.74A5.98 5.98 0 0 1 5.96 12c0-.6.11-1.18.32-1.74V7.62H2.88A10 10 0 0 0 2 12c0 1.61.39 3.12 1.08 4.38l3.2-2.64Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.05c1.5 0 2.84.51 3.9 1.5l2.93-2.92C17.06 2.98 14.75 2 12 2A10 10 0 0 0 3.08 7.62l3.2 2.64c.81-2.41 3.06-4.21 5.72-4.21Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M16.76 12.32c.03 2.56 2.25 3.42 2.27 3.43-.02.06-.35 1.2-1.15 2.37-.69 1.01-1.4 2.01-2.52 2.03-1.1.02-1.46-.65-2.72-.65s-1.66.63-2.68.67c-1.08.04-1.9-1.09-2.6-2.09-1.43-2.07-2.52-5.84-1.05-8.39.73-1.26 2.03-2.06 3.45-2.08 1.08-.02 2.1.73 2.76.73.66 0 1.9-.9 3.21-.77.55.02 2.09.22 3.08 1.67-.08.05-1.84 1.07-1.82 3.08Zm-2.14-7.7c.58-.7.97-1.67.86-2.64-.84.03-1.86.56-2.46 1.26-.54.62-1.01 1.6-.88 2.54.94.07 1.9-.48 2.48-1.16Z" />
    </svg>
  );
}

const inputClasses =
  "w-full rounded-[1.1rem] border border-transparent bg-slate-100/90 px-4 py-4 text-base font-medium text-slate-950 placeholder:text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition focus:border-sky-200 focus:bg-white focus:ring-4 focus:ring-sky-100";

type FieldErrors = Partial<Record<"email" | "password", string>>;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    router.prefetch("/register");
    router.prefetch("/dashboard");
    router.prefetch("/complete-profile");
    router.prefetch("/verify-email");
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
            const response = await fetch("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email.trim().toLowerCase(),
                password,
              }),
            });

            const payload = (await response.json().catch(() => null)) as
              | (ApiErrorPayload & Partial<AuthSessionPayload>)
              | null;

            if (!response.ok) {
              setFieldErrors({
                email: firstFieldError(payload?.errors, "email"),
                password: firstFieldError(payload?.errors, "password"),
              });
              setFormMessage(
                getErrorMessage(payload, "Unable to log in right now."),
              );
              return;
            }

            if (payload?.requires_2fa) {
              setFormMessage(
                payload.message?.trim() ||
                  "This account requires two-factor verification. The dedicated 2FA screen has not been added yet.",
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
              "The frontend could not reach the StakeLoop API. Check STAKELOOP_API_BASE_URL and try again.",
            );
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <label className="block space-y-2">
          <span className="px-0.5 text-sm font-extrabold tracking-wide text-slate-600">
            Email
          </span>
          <input
            autoComplete="email"
            className={inputClasses}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            type="email"
            value={email}
          />
          {fieldErrors.email ? (
            <p className="px-0.5 text-sm font-medium text-rose-600">
              {fieldErrors.email}
            </p>
          ) : null}
        </label>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="px-0.5 text-sm font-extrabold tracking-wide text-slate-600">
              Password
            </span>
            <a
              className="text-sm font-extrabold text-sky-700 transition hover:text-sky-800"
              href="mailto:support@stakeloop.io?subject=StakeLoop%20Password%20Reset"
            >
              Forgot password?
            </a>
          </div>
          <input
            autoComplete="current-password"
            className={inputClasses}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="........"
            type="password"
            value={password}
          />
          {fieldErrors.password ? (
            <p className="px-0.5 text-sm font-medium text-rose-600">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

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
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            Or Continue With
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          className="inline-flex items-center justify-center gap-3 rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50"
          type="button"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          className="inline-flex items-center justify-center gap-3 rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50"
          type="button"
        >
          <AppleIcon />
          Apple ID
        </button>
      </div>

      <p className="pt-8 text-center text-sm font-medium text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          className="font-extrabold text-slate-950 transition hover:text-sky-700 hover:underline"
          href="/register"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
