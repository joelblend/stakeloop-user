export type ApiHealth = {
  message: string;
  ok: boolean;
};

export type ValidationErrors = Record<string, string[]>;

export type ApiErrorPayload = {
  code?: string;
  details?: unknown;
  errors?: ValidationErrors;
  message?: string;
  ok?: boolean;
};

export type OnboardingStatus = {
  bank_verified: boolean;
  can_purchase_slots: boolean;
  email_verified: boolean;
  profile_completed: boolean;
};

export type NigerianBank = {
  code: string;
  name: string;
  slug?: string;
  type?: string;
};

export type BankDirectoryPayload = {
  data: NigerianBank[];
  message?: string;
  ok?: boolean;
};

export type BackendUser = {
  address?: string | null;
  avatar_key?: string | null;
  bank_account_name?: string | null;
  bank_account_number?: string | null;
  bank_code?: string | null;
  bank_name?: string | null;
  city?: string | null;
  country?: string | null;
  email: string;
  email_verified_at?: string | null;
  id: number;
  name: string;
  phone?: string | null;
  profile_completed_at?: string | null;
  referral_code?: string | null;
  role?: string;
  state?: string | null;
  username: string;
};

export type AuthSessionPayload = {
  message?: string;
  ok: boolean;
  requires_2fa?: boolean;
  status: OnboardingStatus;
  token?: string;
  user: BackendUser;
};

export type SlotOfferRecord = {
  id?: number;
  is_active?: boolean;
  month: string;
  price_per_slot: number | string;
  pro_slots_sold?: number | string;
  pro_slots_total?: number | string;
  regular_slots_sold?: number | string;
  regular_slots_total?: number | string;
  sales_close_at?: string;
  sales_open_at?: string;
  sold_slots?: number | string;
  total_slots?: number | string;
};

export type ProTermAvailability = {
  available: boolean;
  covered_months: string[];
  missing_months: string[];
  remaining_slots: number;
  service_charge_rate: number;
  term_months: number;
};

export type ActiveSlotOfferPayload = {
  inventory: {
    pro: {
      remaining_slots: number;
      slot_type: string;
      sold_slots: number;
      terms: ProTermAvailability[];
      total_slots: number;
    };
    regular: {
      remaining_slots: number;
      service_charge_rate: number;
      slot_type: string;
      sold_slots: number;
      term_months: number;
      total_slots: number;
    };
  };
  month: string;
  offer: SlotOfferRecord;
  remaining_slots: number;
};

export type UserSlotPurchase = {
  coverage_end_month: string;
  id: number;
  purchased_at: string;
  quantity: number;
  service_charge_amount: number | string;
  service_charge_rate: number | string;
  slot_type: string;
  term_months: number;
  total_amount: number | string;
  total_payable_amount: number | string;
  unit_price: number | string;
  user_slot_offer_id: number;
};

export type UserPurchasesPayload = {
  month: string;
  purchases: UserSlotPurchase[];
  slots_bought: number;
  slots_reserved: number;
};

type PilotWaitlistResult = {
  data?: {
    email: string;
    id: number;
  };
  message?: string;
  ok?: boolean;
};

export function getApiBaseUrl() {
  return (
    process.env.STAKELOOP_API_BASE_URL?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000"
  );
}

export function getErrorMessage(
  payload: ApiErrorPayload | null | undefined,
  fallback: string,
) {
  return payload?.message?.trim() || fallback;
}

export function firstFieldError(
  errors: ValidationErrors | undefined,
  field: string,
) {
  const messages = errors?.[field];
  return Array.isArray(messages) && messages.length > 0
    ? messages[0]
    : undefined;
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
