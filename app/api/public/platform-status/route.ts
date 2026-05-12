import { NextResponse } from "next/server";

import { getApiHealth } from "@/lib/stakeloop-api";

export async function GET() {
  const status = await getApiHealth();

  return NextResponse.json(status, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
