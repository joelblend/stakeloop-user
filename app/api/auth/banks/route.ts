import { NextResponse } from "next/server";

import { type BankDirectoryPayload } from "@/lib/stakeloop-api";
import {
  clearSessionCookie,
  getAuthToken,
  requestBackend,
} from "@/lib/stakeloop-session";

export async function GET(request: Request) {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        message: "Log in again to load supported banks.",
      },
      { status: 401 },
    );
  }

  const searchParams = new URL(request.url).searchParams;
  const country = searchParams.get("country")?.trim().toLowerCase() || "nigeria";

  try {
    const result = await requestBackend<BankDirectoryPayload>(
      `/api/auth/me/banks?country=${encodeURIComponent(country)}`,
      {
        token,
      },
    );

    const response = NextResponse.json(
      result.payload ?? {
        ok: false,
        message: "Unable to load supported banks right now.",
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
          "The frontend could not reach the StakeLoop API. Check STAKELOOP_API_BASE_URL and try again.",
      },
      { status: 502 },
    );
  }
}
