"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

type PlatformStatus = {
  loading: boolean;
  message: string;
  ok: boolean;
};

type PlatformStatusPayload = {
  message?: string;
  ok?: boolean;
};

const defaultPlatformStatus: PlatformStatus = {
  loading: true,
  message: "Checking live platform status...",
  ok: false,
};

const PlatformStatusContext =
  createContext<PlatformStatus>(defaultPlatformStatus);

function usePlatformStatus() {
  return useContext(PlatformStatusContext);
}

export function PlatformStatusProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [status, setStatus] = useState(defaultPlatformStatus);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStatus() {
      try {
        const response = await fetch("/api/public/platform-status", {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = (await response.json().catch(() => null)) as
          | PlatformStatusPayload
          | null;

        if (controller.signal.aborted) {
          return;
        }

        setStatus({
          loading: false,
          message:
            payload?.message?.trim() ||
            (response.ok
              ? "Stakeloop is online."
              : "Stakeloop is temporarily unavailable right now."),
          ok: Boolean(response.ok && payload?.ok),
        });
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setStatus({
          loading: false,
          message:
            "We couldn't connect to Stakeloop right now. Please try again in a moment.",
          ok: false,
        });
      }
    }

    void loadStatus();

    return () => controller.abort();
  }, []);

  return (
    <PlatformStatusContext.Provider value={status}>
      {children}
    </PlatformStatusContext.Provider>
  );
}

export function PlatformHeroStatusBadge() {
  const { loading, ok } = usePlatformStatus();

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-xs font-bold ${
        ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      {ok ? "System online" : loading ? "Checking status" : "Retrying"}
    </span>
  );
}

export function PlatformConnectionBadge() {
  const { loading, ok } = usePlatformStatus();

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {ok ? "Connected" : loading ? "Checking" : "Retrying"}
    </span>
  );
}

export function PlatformSystemValue() {
  const { loading, ok } = usePlatformStatus();

  return <>{ok ? "Online" : loading ? "Checking" : "Queued"}</>;
}

export function PlatformStatusMessage() {
  const { message } = usePlatformStatus();

  return <>{message}</>;
}
