"use client";

import { FormEvent, useState, useTransition } from "react";

type WaitlistFormProps = {
  className?: string;
  dark?: boolean;
};

type FormState = {
  kind: "idle" | "success" | "error";
  message: string;
};

export function WaitlistForm({
  className = "",
  dark = false,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>({
    kind: "idle",
    message: "Join the waitlist and we will notify you when onboarding opens.",
  });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextEmail = email.trim();

    if (!nextEmail) {
      setState({
        kind: "error",
        message: "Enter a valid email address to join the waitlist.",
      });
      return;
    }

    startTransition(() => {
      void submitEmail(nextEmail);
    });
  }

  async function submitEmail(nextEmail: string) {
    setState({
      kind: "idle",
      message: "Sending your request to StakeLoop...",
    });

    try {
      const response = await fetch("/api/public/pilot-waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: nextEmail }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        setState({
          kind: "error",
          message:
            payload?.message ??
            "We could not save your email right now. Please try again.",
        });
        return;
      }

      setEmail("");
      setState({
        kind: "success",
        message: payload?.message ?? "You have been added to the waitlist.",
      });
    } catch {
      setState({
        kind: "error",
        message:
          "StakeLoop could not reach the API right now. Check your backend URL and try again.",
      });
    }
  }

  const inputClassName = dark
    ? "border border-white/15 bg-white/10 text-white placeholder:text-slate-400 focus:border-white/40 focus:ring-white/20"
    : "border border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-200";

  const buttonClassName = dark
    ? "bg-white text-slate-950 hover:bg-slate-100"
    : "bg-slate-950 text-white hover:bg-slate-800";

  const messageClassName =
    state.kind === "success"
      ? dark
        ? "text-emerald-300"
        : "text-emerald-700"
      : state.kind === "error"
        ? dark
          ? "text-rose-300"
          : "text-rose-700"
        : dark
          ? "text-slate-300"
          : "text-slate-500";

  return (
    <div className={className}>
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="waitlist-email">
          Email address
        </label>
        <input
          id="waitlist-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={`h-14 w-full rounded-2xl px-4 text-sm font-medium outline-none ring-4 ring-transparent transition ${inputClassName}`}
        />
        <button
          type="submit"
          disabled={isPending}
          className={`inline-flex h-14 items-center justify-center rounded-2xl px-5 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${buttonClassName}`}
        >
          {isPending ? "Joining..." : "Join Waitlist"}
        </button>
      </form>
      <p className={`mt-3 text-sm ${messageClassName}`}>{state.message}</p>
    </div>
  );
}
