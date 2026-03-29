export type ApiHealth = {
  message: string;
  ok: boolean;
};

type PilotWaitlistResult = {
  data?: {
    email: string;
    id: number;
  };
  message?: string;
  ok?: boolean;
};

function getApiBaseUrl() {
  return (
    process.env.STAKELOOP_API_BASE_URL?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000"
  );
}

export async function getApiHealth(): Promise<ApiHealth> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/ping`, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      return {
        ok: false,
        message: "StakeLoop API is unavailable right now.",
      };
    }

    const payload = (await response.json()) as {
      message?: string;
      ok?: boolean;
    };

    return {
      ok: Boolean(payload.ok),
      message: payload.message ?? "StakeLoop API is live.",
    };
  } catch {
    return {
      ok: false,
      message: "StakeLoop API is unavailable right now.",
    };
  }
}

export async function submitPilotWaitlist(email: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/pilot-waitlist`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ email }),
  });

  const payload = (await response.json().catch(() => null)) as
    | PilotWaitlistResult
    | null;

  return {
    payload,
    status: response.status,
  };
}
