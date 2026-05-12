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
  terms_accepted: boolean;
};

export type SlotType = "pro" | "regular";

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
  terms_accepted_at?: string | null;
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

export type SlotPurchasePricing = {
  contract_value: number;
  service_charge_amount: number;
  service_charge_rate: number;
  total_payable_amount: number;
};

export type PaymentTransactionRecord = {
  amount?: number | string;
  currency?: string;
  id?: number;
  payment_method?: string;
  provider_reference?: string | null;
  reference?: string;
  resolved_at?: string | null;
  status?: string;
  type?: string;
};

export type UserSlotCheckoutPayload = {
  covered_months: string[];
  message: string;
  pricing: SlotPurchasePricing;
  purchase: UserSlotPurchase & {
    created_at?: string;
    updated_at?: string;
    user_id?: number;
  };
  transaction?: PaymentTransactionRecord;
};

export type UserWalletEntry = {
  amount: number;
  balance_after: number;
  balance_before: number;
  category: string;
  direction: string;
  earning_month?: string | null;
  id: number;
  label: string;
  meta?: Record<string, unknown> | null;
  occurred_at?: string | null;
  payout_month?: string | null;
  reference: string;
  source_id?: number | null;
  source_type?: string | null;
};

export type UserWalletMonthSummary = {
  capital_return_total: number;
  credited_total: number;
  debited_total: number;
  entry_count: number;
  month: string;
  net_amount: number;
  profit_share_total: number;
  reversal_total: number;
};

export type UserWalletFilterCategory =
  | "all"
  | "profit_share"
  | "capital_returns"
  | "reversals";

export type UserWalletFilters = {
  category: UserWalletFilterCategory;
  limit: number;
  month?: string | null;
  page: number;
};

export type UserWalletPagination = {
  from: number;
  has_more: boolean;
  page: number;
  per_page: number;
  to: number;
  total: number;
  total_pages: number;
};

export type UserWalletPayload = {
  current_balance: number;
  filters: UserWalletFilters;
  last_posted_at?: string | null;
  month_summary: UserWalletMonthSummary;
  monthly_history: UserWalletMonthSummary[];
  pagination: UserWalletPagination;
  recent_entries: UserWalletEntry[];
  summary: {
    capital_return_pro_total: number;
    capital_return_regular_total: number;
    entry_count: number;
    profit_share_total: number;
    reversal_total: number;
    total_credits: number;
    total_debits: number;
  };
};

export type UserPurchasesPayload = {
  month: string;
  purchases: UserSlotPurchase[];
  slots_bought: number;
  slots_reserved: number;
  wallet: UserWalletPayload;
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
        message: "Stakeloop is temporarily unavailable right now.",
      };
    }

    const payload = (await response.json()) as {
      message?: string;
      ok?: boolean;
    };

    return {
      ok: Boolean(payload.ok),
      message: Boolean(payload.ok) ? "Stakeloop is online." : payload.message ?? "Stakeloop is temporarily unavailable right now.",
    };
  } catch {
    return {
      ok: false,
      message: "Stakeloop is temporarily unavailable right now.",
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
