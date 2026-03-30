import { NextResponse } from "next/server";

import { type AuthSessionPayload } from "@/lib/stakeloop-api";
import {
  requestBackend,
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
    const result = await requestBackend<AuthSessionPayload>("/api/auth/register", {
      method: "POST",
      body,
    });

    const payload = result.payload;
    const response = NextResponse.json(
      result.ok && payload && "token" in payload
        ? stripToken(payload)
        : payload ?? {
            ok: false,
            message: "Unable to create your account right now.",
          },
      { status: result.status },
    );

    if (result.ok && payload && "token" in payload && payload.token) {
      setSessionCookie(response, payload.token);
    }

    return response;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "The frontend could not reach the StakeLoop API. Check STAKELOOP_API_BASE_URL and try again.",
      },
      { status: 502 },
    );
  }
}
