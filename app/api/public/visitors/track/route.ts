import { NextResponse } from "next/server";

import { getAuthToken, requestBackend } from "@/lib/stakeloop-session";

type TrackVisitInput = {
  city?: unknown;
  country?: unknown;
  country_code?: unknown;
  full_url?: unknown;
  page_title?: unknown;
  path?: unknown;
  referrer?: unknown;
  region?: unknown;
  screen_height?: unknown;
  screen_width?: unknown;
  session_id?: unknown;
  timezone?: unknown;
  visitor_id?: unknown;
};

function stringOrNull(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function numberOrNull(value: unknown, max: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value < 1 || value > max) return null;
  return Math.floor(value);
}

function extractClientIp(request: Request) {
  const candidates = [
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-vercel-forwarded-for"),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const first = candidate.split(",")[0]?.trim() ?? "";
    if (first) return first;
  }

  return null;
}

export async function POST(request: Request) {
  const input = (await request.json().catch(() => null)) as TrackVisitInput | null;

  const visitorId = stringOrNull(input?.visitor_id, 80);
  const sessionId = stringOrNull(input?.session_id, 80);
  const path = stringOrNull(input?.path, 255);

  if (!visitorId || !path) {
    return NextResponse.json(
      {
        ok: false,
        message: "visitor_id and path are required.",
      },
      { status: 400 },
    );
  }

  const ipAddress = extractClientIp(request);
  const countryCodeHeader = request.headers.get("x-vercel-ip-country");
  const countryCode = stringOrNull(countryCodeHeader, 2) ?? stringOrNull(input?.country_code, 2);

  const token = await getAuthToken();

  try {
    const result = await requestBackend<{ ok?: boolean; message?: string }>("/api/analytics/visits", {
      method: "POST",
      token,
      body: {
        visitor_id: visitorId,
        session_id: sessionId,
        path,
        full_url: stringOrNull(input?.full_url, 5000),
        referrer: stringOrNull(input?.referrer, 5000),
        page_title: stringOrNull(input?.page_title, 190),
        timezone: stringOrNull(input?.timezone, 100),
        screen_width: numberOrNull(input?.screen_width, 65535),
        screen_height: numberOrNull(input?.screen_height, 65535),
        ip_address: ipAddress,
        country_code: countryCode,
        country:
          stringOrNull(request.headers.get("x-vercel-ip-country-name"), 100) ??
          stringOrNull(input?.country, 100),
        region:
          stringOrNull(request.headers.get("x-vercel-ip-country-region"), 120) ??
          stringOrNull(input?.region, 120),
        city: stringOrNull(request.headers.get("x-vercel-ip-city"), 120) ?? stringOrNull(input?.city, 120),
        user_agent: stringOrNull(request.headers.get("user-agent"), 700),
      },
    });

    return NextResponse.json(result.payload ?? { ok: false }, { status: result.status });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to forward visitor tracking event.",
      },
      { status: 502 },
    );
  }
}
