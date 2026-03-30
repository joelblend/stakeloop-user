"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  type ApiErrorPayload,
  type BackendUser,
  type BankDirectoryPayload,
  type NigerianBank,
  firstFieldError,
  getErrorMessage,
} from "@/lib/stakeloop-api";

const avatarOptions = [
  {
    key: "atlas",
    accent: "from-sky-500 to-blue-700",
    label: "Atlas",
  },
  {
    key: "nova",
    accent: "from-emerald-400 to-teal-600",
    label: "Nova",
  },
  {
    key: "onyx",
    accent: "from-slate-700 to-slate-950",
    label: "Onyx",
  },
  {
    key: "luna",
    accent: "from-orange-400 to-rose-600",
    label: "Luna",
  },
] as const;

const countryOptions = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United States",
] as const;

const countryDialCodes: Record<(typeof countryOptions)[number], string> = {
  Ghana: "+233",
  Kenya: "+254",
  Nigeria: "+234",
  "South Africa": "+27",
  "United States": "+1",
};

type CompleteProfileFormProps = {
  user: BackendUser;
};

type Step = 1 | 2;

type FieldErrors = Partial<
  Record<
    | "avatar_key"
    | "address"
    | "bank_account_number"
    | "bank_name"
    | "city"
    | "country"
    | "phone"
    | "state",
    string
  >
>;

type ResolveBankPayload = {
  bank_account_name?: string;
  message?: string;
  user?: BackendUser;
};

function isPersonalStepComplete(values: {
  address: string;
  city: string;
  country: string;
  phone: string;
  state: string;
}) {
  return Boolean(
    values.address.trim() &&
      values.phone.trim() &&
      values.country.trim() &&
      values.state.trim() &&
      values.city.trim(),
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7.5a4 4 0 1 1 8 0V10" />
    </svg>
  );
}

export function CompleteProfileForm({ user }: CompleteProfileFormProps) {
  const router = useRouter();
  const initialValues = {
    address: user.address?.trim() ?? "",
    city: user.city?.trim() ?? "",
    country: user.country?.trim() ?? "Nigeria",
    name: user.name === user.username ? "" : user.name,
    phone: user.phone?.trim() ?? "",
    state: user.state?.trim() ?? "",
  };
  const initialAvatarKey = user.avatar_key?.trim() || avatarOptions[0].key;
  const initialResolvedName = user.bank_account_name?.trim() || "";
  const initialBankCode = user.bank_code?.trim() ?? "";
  const initialBankName = user.bank_name?.trim() ?? "";
  const initialBankAccountNumber = user.bank_account_number?.trim() ?? "";
  const initialBankSignature =
    initialBankCode && initialBankAccountNumber
      ? `${initialBankCode}:${initialBankAccountNumber}`
      : "";
  const [step, setStep] = useState<Step>(
    isPersonalStepComplete(initialValues) ? 2 : 1,
  );
  const [name] = useState(initialValues.name);
  const [address, setAddress] = useState(initialValues.address);
  const [phone, setPhone] = useState(initialValues.phone);
  const [country, setCountry] = useState(initialValues.country);
  const [state, setState] = useState(initialValues.state);
  const [city, setCity] = useState(initialValues.city);
  const [banks, setBanks] = useState<NigerianBank[]>([]);
  const [bankCode, setBankCode] = useState(initialBankCode);
  const [bankName, setBankName] = useState(initialBankName);
  const [bankAccountNumber, setBankAccountNumber] = useState(
    initialBankAccountNumber,
  );
  const [avatarKey, setAvatarKey] = useState(initialAvatarKey);
  const [resolvedAccountName, setResolvedAccountName] =
    useState(initialResolvedName);
  const [resolvedSignature, setResolvedSignature] =
    useState(initialBankSignature);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState<{
    text: string;
    tone: "error" | "success";
  } | null>(null);
  const [banksError, setBanksError] = useState<string | null>(null);
  const [isBanksLoading, setIsBanksLoading] = useState(true);
  const [isResolving, setIsResolving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banksRefreshKey, setBanksRefreshKey] = useState(0);
  const bankSelectionRef = useRef({
    code: initialBankCode,
    name: initialBankName,
  });

  const currentBankSignature =
    bankCode.trim() && bankAccountNumber.trim()
      ? `${bankCode.trim()}:${bankAccountNumber.trim()}`
      : "";
  const phoneDialCode =
    countryDialCodes[country as keyof typeof countryDialCodes] ?? "+234";
  const stepProgress = step === 1 ? 50 : 100;

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  function clearBankResolutionIfDirty(nextCode: string, nextAccountNumber: string) {
    const nextSignature =
      nextCode.trim() && nextAccountNumber.trim()
        ? `${nextCode.trim()}:${nextAccountNumber.trim()}`
        : "";

    if (nextSignature !== resolvedSignature) {
      setResolvedAccountName("");
    }
  }

  useEffect(() => {
    bankSelectionRef.current = {
      code: bankCode,
      name: bankName,
    };
  }, [bankCode, bankName]);

  useEffect(() => {
    let isActive = true;

    async function loadBanks() {
      setIsBanksLoading(true);
      setBanksError(null);

      try {
        const response = await fetch("/api/auth/banks?country=nigeria", {
          cache: "no-store",
        });
        const payload = (await response.json().catch(() => null)) as
          | (ApiErrorPayload & Partial<BankDirectoryPayload>)
          | null;

        if (!isActive) {
          return;
        }

        if (!response.ok) {
          setBanks([]);
          setBanksError(
            getErrorMessage(payload, "Unable to load supported banks right now."),
          );
          return;
        }

        const nextBanks = Array.isArray(payload?.data) ? payload.data : [];
        setBanks(nextBanks);

        const latestSelection = bankSelectionRef.current;

        if (latestSelection.code && !latestSelection.name) {
          const matchedBank = nextBanks.find(
            (bank) => bank.code === latestSelection.code,
          );

          if (matchedBank) {
            setBankName(matchedBank.name);
          }
        }
      } catch {
        if (!isActive) {
          return;
        }

        setBanks([]);
        setBanksError(
          "The frontend could not reach the StakeLoop API. Check STAKELOOP_API_BASE_URL and try again.",
        );
      } finally {
        if (isActive) {
          setIsBanksLoading(false);
        }
      }
    }

    void loadBanks();

    return () => {
      isActive = false;
    };
  }, [banksRefreshKey]);

  function validateStepOne() {
    const nextErrors: FieldErrors = {
      address: address.trim() ? undefined : "Address is required.",
      city: city.trim() ? undefined : "City is required.",
      country: country.trim() ? undefined : "Country is required.",
      phone: phone.trim() ? undefined : "Phone number is required.",
      state: state.trim() ? undefined : "State is required.",
    };

    setFieldErrors((current) => ({
      ...current,
      address: nextErrors.address,
      city: nextErrors.city,
      country: nextErrors.country,
      phone: nextErrors.phone,
      state: nextErrors.state,
    }));

    return !Object.values(nextErrors).some(Boolean);
  }

  async function resolveBank(showSuccessMessage: boolean) {
    setIsResolving(true);
    setFormMessage(null);
    setFieldErrors((current) => ({
      ...current,
      bank_account_number: undefined,
      bank_name: undefined,
    }));

    try {
      const response = await fetch("/api/auth/bank/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bank_code: bankCode.trim(),
          bank_account_number: bankAccountNumber.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | (ApiErrorPayload & ResolveBankPayload)
        | null;

      if (!response.ok) {
        setFieldErrors({
          bank_account_number:
            firstFieldError(payload?.errors, "bank_account_number") ??
            firstFieldError(payload?.errors, "bank_code"),
          bank_name: firstFieldError(payload?.errors, "bank_code"),
        });
        setFormMessage({
          tone: "error",
          text: getErrorMessage(
            payload,
            "Unable to resolve that bank account right now.",
          ),
        });
        return false;
      }

      const accountName =
        payload?.bank_account_name?.trim() ||
        payload?.user?.bank_account_name?.trim() ||
        "";

      setResolvedAccountName(accountName);
      setResolvedSignature(currentBankSignature);

      if (showSuccessMessage) {
        setFormMessage({
          tone: "success",
          text:
            payload?.message?.trim() ||
            "Bank account resolved successfully.",
        });
      }

      return true;
    } catch {
      setFormMessage({
        tone: "error",
        text:
          "The frontend could not reach the StakeLoop API. Check STAKELOOP_API_BASE_URL and try again.",
      });
      return false;
    } finally {
      setIsResolving(false);
    }
  }

  return (
    <form
      className="space-y-8"
      onSubmit={async (event) => {
        event.preventDefault();

        if (step === 1) {
          if (validateStepOne()) {
            setFormMessage(null);
            setStep(2);
          }
          return;
        }

        setIsSubmitting(true);
        setFormMessage(null);
        setFieldErrors((current) => ({
          ...current,
          avatar_key: undefined,
          bank_account_number: undefined,
          bank_name: undefined,
        }));

        try {
          if (!bankCode.trim()) {
            setFieldErrors((current) => ({
              ...current,
              bank_name: "Select your bank.",
            }));
            return;
          }

          if (bankAccountNumber.trim().length !== 10) {
            setFieldErrors((current) => ({
              ...current,
              bank_account_number: "Enter a valid 10-digit account number.",
            }));
            return;
          }

          if (!resolvedAccountName || currentBankSignature !== resolvedSignature) {
            const resolved = await resolveBank(false);

            if (!resolved) {
              return;
            }
          }

          const response = await fetch("/api/auth/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: address.trim(),
              name: name.trim() || resolvedAccountName.trim(),
              phone: phone.trim(),
              country: country.trim(),
              state: state.trim(),
              city: city.trim(),
              bank_name: bankName.trim(),
              bank_code: bankCode.trim(),
              bank_account_number: bankAccountNumber.trim(),
              avatar_key: avatarKey,
            }),
          });

          const payload = (await response.json().catch(() => null)) as
            | ApiErrorPayload
            | null;

          if (!response.ok) {
            setFieldErrors((current) => ({
              ...current,
              address: firstFieldError(payload?.errors, "address"),
              avatar_key: firstFieldError(payload?.errors, "avatar_key"),
              bank_account_number: firstFieldError(
                payload?.errors,
                "bank_account_number",
              ),
              bank_name:
                firstFieldError(payload?.errors, "bank_name") ??
                firstFieldError(payload?.errors, "bank_code"),
              city: firstFieldError(payload?.errors, "city"),
              country: firstFieldError(payload?.errors, "country"),
              phone: firstFieldError(payload?.errors, "phone"),
              state: firstFieldError(payload?.errors, "state"),
            }));
            setFormMessage({
              tone: "error",
              text: getErrorMessage(
                payload,
                "Unable to complete your profile right now.",
              ),
            });
            return;
          }

          router.replace("/dashboard");
        } catch {
          setFormMessage({
            tone: "error",
            text:
              "The frontend could not reach the StakeLoop API. Check STAKELOOP_API_BASE_URL and try again.",
          });
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <div className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <p className="text-sm font-semibold text-slate-900">
            Step {step} of 2
          </p>
          <span className="text-xs font-medium text-slate-500">
            {stepProgress}% completed
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-[width] duration-300"
            style={{ width: `${stepProgress}%` }}
          />
        </div>
      </div>

      {step === 1 ? (
        <section className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Complete your profile
            </h1>
            <p className="text-sm leading-7 text-slate-500 sm:text-base">
              We need a few contact details to set up your monthly
              participation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium text-slate-900">
                Address
              </span>
              <textarea
                autoComplete="street-address"
                className="min-h-28 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Enter your full address"
                rows={3}
                value={address}
              />
              {fieldErrors.address ? (
                <p className="text-sm font-medium text-rose-600">
                  {fieldErrors.address}
                </p>
              ) : null}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-900">Country</span>
              <div className="relative">
                <select
                  autoComplete="country-name"
                  className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  onChange={(event) => setCountry(event.target.value)}
                  value={country}
                >
                  {countryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg
                    aria-hidden="true"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              {fieldErrors.country ? (
                <p className="text-sm font-medium text-rose-600">
                  {fieldErrors.country}
                </p>
              ) : null}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-900">State</span>
              <input
                autoComplete="address-level1"
                className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                onChange={(event) => setState(event.target.value)}
                placeholder="Enter state"
                type="text"
                value={state}
              />
              {fieldErrors.state ? (
                <p className="text-sm font-medium text-rose-600">
                  {fieldErrors.state}
                </p>
              ) : null}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-900">City</span>
              <input
                autoComplete="address-level2"
                className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                onChange={(event) => setCity(event.target.value)}
                placeholder="Enter city"
                type="text"
                value={city}
              />
              {fieldErrors.city ? (
                <p className="text-sm font-medium text-rose-600">
                  {fieldErrors.city}
                </p>
              ) : null}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-900">
                Phone number
              </span>
              <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                <div className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600">
                  {phoneDialCode}
                </div>
                <input
                  autoComplete="tel"
                  className="h-12 w-full px-4 text-base text-slate-950 outline-none placeholder:text-slate-400"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="80 1234 5678"
                  type="tel"
                  value={phone}
                />
              </div>
              {fieldErrors.phone ? (
                <p className="text-sm font-medium text-rose-600">
                  {fieldErrors.phone}
                </p>
              ) : null}
            </label>
          </div>

          <div className="space-y-4 pt-2">
            <button
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700"
              type="submit"
            >
              Next
              <ArrowRightIcon />
            </button>
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <LockIcon />
              <p className="text-xs font-medium text-center">
                You can&apos;t access the dashboard until your profile is complete.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Payment &amp; identity details
            </h1>
            <p className="text-sm leading-7 text-slate-500 sm:text-base">
              We&apos;ll fetch Nigerian banks from Paystack and verify the bank
              account name before saving your payout profile.
            </p>
          </div>

          <div className="space-y-5">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-900">
                Bank Name
              </span>
              <div className="relative">
                <select
                  className="block h-14 w-full appearance-none rounded-xl border border-slate-200 bg-white py-3.5 pl-4 pr-10 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  disabled={isBanksLoading || banks.length === 0}
                  onChange={(event) => {
                    const option = banks.find(
                      (item) => item.code === event.target.value,
                    );

                    setBankCode(event.target.value);
                    setBankName(option?.name ?? "");
                    clearBankResolutionIfDirty(
                      event.target.value,
                      bankAccountNumber,
                    );
                  }}
                  value={bankCode}
                >
                  <option value="">
                    {isBanksLoading
                      ? "Loading Nigerian banks..."
                      : "Select your bank"}
                  </option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg
                    aria-hidden="true"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              {fieldErrors.bank_name ? (
                <p className="text-sm font-medium text-rose-600">
                  {fieldErrors.bank_name}
                </p>
              ) : null}
              {banksError ? (
                <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                  <p>{banksError}</p>
                  <button
                    className="mt-2 font-semibold text-amber-800 underline"
                    onClick={() => {
                      setBanksRefreshKey((current) => current + 1);
                    }}
                    type="button"
                  >
                    Retry bank lookup
                  </button>
                </div>
              ) : null}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-900">
                Account Number
              </span>
              <input
                className="block h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                inputMode="numeric"
                maxLength={10}
                onChange={(event) => {
                  const nextValue = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  setBankAccountNumber(nextValue);
                  clearBankResolutionIfDirty(bankCode, nextValue);
                }}
                placeholder="0123456789"
                type="text"
                value={bankAccountNumber}
              />
              {fieldErrors.bank_account_number ? (
                <p className="text-sm font-medium text-rose-600">
                  {fieldErrors.bank_account_number}
                </p>
              ) : null}
            </label>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">
                  Bank Account Name
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  Auto-verified
                </span>
              </div>
              <div className="relative">
                <input
                  className="block h-14 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 pr-11 text-base italic text-slate-500 shadow-sm"
                  readOnly
                  type="text"
                  value={resolvedAccountName || "Waiting for account details..."}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                  <LockIcon />
                </div>
              </div>
            </div>

            <button
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={
                isResolving ||
                isBanksLoading ||
                !bankCode ||
                bankAccountNumber.length !== 10
              }
              onClick={async () => {
                await resolveBank(true);
              }}
              type="button"
            >
              {isResolving ? "Verifying account..." : "Verify account details"}
            </button>
          </div>

          <div className="space-y-4 pt-1">
            <label className="block text-center text-sm font-medium text-slate-900">
              Choose an avatar
            </label>
            <div className="mx-auto grid max-w-lg grid-cols-4 gap-4 sm:gap-6">
              {avatarOptions.map((option) => {
                const active = avatarKey === option.key;

                return (
                  <button
                    key={option.key}
                    className={`relative aspect-square overflow-hidden rounded-full border-2 transition-all ${
                      active
                        ? "border-blue-600 ring-4 ring-blue-100"
                        : "border-transparent hover:border-slate-300"
                    }`}
                    onClick={() => setAvatarKey(option.key)}
                    type="button"
                  >
                    <span
                      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${option.accent} text-lg font-black text-white`}
                    >
                      {option.label.slice(0, 2).toUpperCase()}
                    </span>
                    {active ? (
                      <span className="absolute right-1 top-1 inline-flex size-6 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                        <svg
                          aria-hidden="true"
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            {fieldErrors.avatar_key ? (
              <p className="text-center text-sm font-medium text-rose-600">
                {fieldErrors.avatar_key}
              </p>
            ) : null}
          </div>

          {formMessage ? (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                formMessage.tone === "error"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {formMessage.text}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 sm:w-40"
              onClick={() => {
                setFormMessage(null);
                setStep(1);
              }}
              type="button"
            >
              <ArrowLeftIcon />
              Back
            </button>
            <button
              className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 text-lg font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-65"
              disabled={isSubmitting || isResolving}
              type="submit"
            >
              {isSubmitting ? "Saving profile..." : "Save profile"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-500 pt-1">
            <LockIcon />
            <p className="text-sm font-medium">
              Your bank details are encrypted and never shared.
            </p>
          </div>
        </section>
      )}
    </form>
  );
}
