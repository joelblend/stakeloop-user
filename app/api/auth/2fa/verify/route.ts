import { NextResponse } from "next/server";

import { type AuthSessionPayload } from "@/lib/stakeloop-api";
import {
  clearPendingTwoFactorCookie,
  clearSessionCookie,
  getAuthToken,
  requestBackend,
  setSessionCookie,
  stripToken,
} from "@/lib/stakeloop-session";

export async function POST(request: Request) {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        message: "Log in again to complete two-factor verification.",
      },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | Record<string, unknown>
    | null;

  if (!body) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid request body.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await requestBackend<AuthSessionPayload>("/api/auth/2fa/verify", {
      method: "POST",
      body,
      token,
    });

    const payload = result.payload;
    const response = NextResponse.json(
      result.ok && payload && "token" in payload
        ? stripToken(payload)
        : payload ?? {
            ok: false,
            message: "Unable to verify your code right now.",
          },
      { status: result.status },
    );

    if (result.ok && payload && "token" in payload && payload.token) {
      setSessionCookie(response, payload.token);
      clearPendingTwoFactorCookie(response);
    } else if (result.status === 401) {
      clearSessionCookie(response);
    }

    return response;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "We couldn't connect to Stakeloop right now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}
