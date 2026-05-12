import { NextResponse } from "next/server";

import { type AuthSessionPayload } from "@/lib/stakeloop-api";
import {
  clearSessionCookie,
  getAuthToken,
  requestBackend,
} from "@/lib/stakeloop-session";

export async function GET() {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        message: "You are not logged in.",
      },
      { status: 401 },
    );
  }

  try {
    const result = await requestBackend<AuthSessionPayload>("/api/auth/me", {
      token,
    });

    const response = NextResponse.json(
      result.payload ?? {
        ok: false,
        message: "Unable to load your session.",
      },
      { status: result.status },
    );

    if (result.status === 401) {
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
