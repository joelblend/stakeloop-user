import { NextResponse } from "next/server";

import type {
  BackendUser,
  OnboardingStatus,
} from "@/lib/stakeloop-api";
import {
  clearSessionCookie,
  getAuthToken,
  requestBackend,
} from "@/lib/stakeloop-session";

type TermsAcceptancePayload = {
  accepted_at?: string | null;
  message?: string;
  ok?: boolean;
  status?: OnboardingStatus;
  user?: BackendUser;
};

export async function POST() {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        message: "Log in again to review and accept the terms.",
      },
      { status: 401 },
    );
  }

  try {
    const result = await requestBackend<TermsAcceptancePayload>(
      "/api/auth/me/terms/accept",
      {
        method: "POST",
        token,
      },
    );

    const response = NextResponse.json(
      result.payload ?? {
        ok: false,
        message: "We couldn't save your acceptance right now. Please try again.",
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
