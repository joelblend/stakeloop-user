"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const VISITOR_KEY_STORAGE = "stakeloop_visitor_key";
const SESSION_KEY_STORAGE = "stakeloop_session_key";
const LAST_VISIT_STORAGE = "stakeloop_last_visitor_event";

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const randomPart = Math.random().toString(36).slice(2, 12);
  return `${Date.now().toString(36)}-${randomPart}`;
}

function getOrCreate(storage: Storage, key: string) {
  const existing = storage.getItem(key);
  if (existing && existing.trim()) {
    return existing;
  }

  const created = createId();
  storage.setItem(key, created);
  return created;
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    const now = Date.now();
    const lastRaw = sessionStorage.getItem(LAST_VISIT_STORAGE);
    if (lastRaw) {
      try {
        const last = JSON.parse(lastRaw) as { path?: string; sentAt?: number };
        if (last.path === path && typeof last.sentAt === "number" && now - last.sentAt < 8000) {
          return;
        }
      } catch {
        // ignore malformed storage values
      }
    }

    const visitorId = getOrCreate(localStorage, VISITOR_KEY_STORAGE);
    const sessionId = getOrCreate(sessionStorage, SESSION_KEY_STORAGE);

    sessionStorage.setItem(
      LAST_VISIT_STORAGE,
      JSON.stringify({
        path,
        sentAt: now,
      }),
    );

    const payload = {
      visitor_id: visitorId,
      session_id: sessionId,
      path,
      full_url: window.location.href,
      referrer: document.referrer || null,
      page_title: document.title || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
      screen_width: window.screen?.width ?? null,
      screen_height: window.screen?.height ?? null,
    };

    const body = JSON.stringify(payload);
    const endpoint = "/api/public/visitors/track";

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
      return;
    }

    void fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      credentials: "same-origin",
      keepalive: true,
    });
  }, [pathname, searchParams]);

  return null;
}
