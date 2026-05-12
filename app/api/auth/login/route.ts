import { NextResponse } from "next/server";

import { type AuthSessionPayload } from "@/lib/stakeloop-api";
import {
  clearPendingTwoFactorCookie,
  requestBackend,
  setPendingTwoFactorCookie,
  setSessionCookie,
  stripToken,
} from "@/lib/stakeloop-session";

export async function POST(request: Request) {
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
    const result = await requestBackend<AuthSessionPayload>("/api/auth/login", {
      method: "POST",
      body,
    });

    const payload = result.payload;
    const response = NextResponse.json(
      result.ok && payload && "token" in payload
        ? stripToken(payload)
        : payload ?? {
            ok: false,
            message: "Unable to log in right now.",
          },
      { status: result.status },
    );

    if (result.ok && payload && "token" in payload && payload.token) {
      setSessionCookie(response, payload.token);
      if (payload.requires_2fa) {
        setPendingTwoFactorCookie(response);
      } else {
        clearPendingTwoFactorCookie(response);
      }
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
