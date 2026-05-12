import { NextResponse } from "next/server";

import type { UserSlotCheckoutPayload } from "@/lib/stakeloop-api";
import {
  clearSessionCookie,
  getAuthToken,
  requestBackend,
} from "@/lib/stakeloop-session";

export async function POST(request: Request) {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        message: "Log in again to reserve slots.",
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
    const result = await requestBackend<UserSlotCheckoutPayload>(
      "/api/user/slots/buy",
      {
        method: "POST",
        body,
        token,
      },
    );

    const response = NextResponse.json(
      result.payload ?? {
        ok: false,
        message: "Unable to reserve slots right now.",
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
