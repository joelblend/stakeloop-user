import { NextResponse } from "next/server";

import {
  clearSessionCookie,
  getAuthToken,
  requestBackend,
} from "@/lib/stakeloop-session";

export async function POST() {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        message: "Log in again to request a new verification email.",
      },
      { status: 401 },
    );
  }

  try {
    const result = await requestBackend("/api/email/verification-notification", {
      method: "POST",
      token,
    });

    const response = NextResponse.json(
      result.payload ?? {
        ok: false,
        message: "Unable to resend the verification email right now.",
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
