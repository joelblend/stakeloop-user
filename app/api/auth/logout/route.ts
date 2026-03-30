import { NextResponse } from "next/server";

import {
  clearSessionCookie,
  getAuthToken,
  requestBackend,
} from "@/lib/stakeloop-session";

export async function POST() {
  const token = await getAuthToken();

  try {
    if (token) {
      await requestBackend("/api/auth/logout", {
        method: "POST",
        token,
      });
    }
  } catch {
    // Ignore backend logout failures and clear the frontend session anyway.
  }

  const response = NextResponse.json({
    ok: true,
    message: "Logged out successfully.",
  });

  clearSessionCookie(response);

  return response;
}
