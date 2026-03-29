import { NextResponse } from "next/server";

import { submitPilotWaitlist } from "@/lib/stakeloop-api";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: unknown }
    | null;
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json(
      {
        ok: false,
        message: "Email is required.",
      },
      { status: 400 },
    );
  }

  try {
    const { payload, status } = await submitPilotWaitlist(email);

    return NextResponse.json(
      payload ?? {
        ok: false,
        message: "Unable to join waitlist right now.",
      },
      { status },
    );
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
