"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  asDashboardNumber,
  formatDashboardCurrency,
  formatDashboardMonthLabel,
} from "@/lib/dashboard-formatters";
import {
  getErrorMessage,
  type ActiveSlotOfferPayload,
  type ApiErrorPayload,
  type SlotType,
  type UserSlotCheckoutPayload,
} from "@/lib/stakeloop-api";

type SlotPurchasePanelProps = {
  activeOffer: ActiveSlotOfferPayload;
  reservedSlots: number;
};

type PurchaseOption = {
  available: boolean;
  coveredMonths: string[];
  id: string;
  label: string;
  missingMonths: string[];
  remainingSlots: number;
  serviceChargeRate: number;
  slotType: SlotType;
  termMonths: number;
};

type PurchaseReceipt = {
  coveredMonths: string[];
  message: string;
  quantity: number;
  reference?: string;
  totalPayableAmount: number;
};

type FormMessage = {
  text: string;
  tone: "error" | "success";
};

function buildPurchaseOptions(
  activeOffer: ActiveSlotOfferPayload,
): PurchaseOption[] {
  return [
    {
      available: activeOffer.inventory.regular.remaining_slots > 0,
      coveredMonths: [activeOffer.month],
      id: "regular",
      label: "Regular • 1 month",
      missingMonths: [],
      remainingSlots: activeOffer.inventory.regular.remaining_slots,
      serviceChargeRate: activeOffer.inventory.regular.service_charge_rate,
      slotType: "regular",
      termMonths: 1,
    },
    ...activeOffer.inventory.pro.terms.map((term) => ({
      available: term.available,
      coveredMonths: term.covered_months,
      id: `pro-${term.term_months}`,
      label: `Pro • ${term.term_months} months`,
      missingMonths: term.missing_months,
      remainingSlots: term.remaining_slots,
      serviceChargeRate: term.service_charge_rate,
      slotType: "pro" as const,
      termMonths: term.term_months,
    })),
  ];
}

function formatMonthsList(months: string[]) {
  if (!months.length) {
    return "Awaiting inventory";
  }

  if (months.length === 1) {
    return formatDashboardMonthLabel(months[0]);
  }

  return `${formatDashboardMonthLabel(months[0])} to ${formatDashboardMonthLabel(
    months[months.length - 1],
  )}`;
}

const formMessageClasses: Record<FormMessage["tone"], string> = {
  error: "border-rose-200 bg-rose-50 text-rose-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function SlotPurchasePanel({
  activeOffer,
  reservedSlots,
}: SlotPurchasePanelProps) {
  const router = useRouter();
  const options = buildPurchaseOptions(activeOffer);
  const firstAvailableOption = options.find((option) => option.available) ?? options[0];
  const [selectedOptionId, setSelectedOptionId] = useState(firstAvailableOption.id);
  const [quantity, setQuantity] = useState(1);
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<PurchaseReceipt | null>(null);

  const selectedOption =
    options.find((option) => option.id === selectedOptionId) ?? firstAvailableOption;
  const purchaseRoom = Math.max(0, 5 - reservedSlots);
  const maxQuantity = Math.max(
    0,
    Math.min(5, purchaseRoom, selectedOption.remainingSlots),
  );
  const unitPrice = asDashboardNumber(activeOffer.offer.price_per_slot);
  const contractValue = unitPrice * quantity * selectedOption.termMonths;
  const serviceChargeAmount = contractValue * selectedOption.serviceChargeRate;
  const totalPayableAmount = contractValue + serviceChargeAmount;
  const quantityOptions = Array.from(
    { length: maxQuantity },
    (_, index) => index + 1,
  );

  useEffect(() => {
    if (!options.some((option) => option.id === selectedOptionId)) {
      setSelectedOptionId(firstAvailableOption.id);
    }
  }, [firstAvailableOption.id, options, selectedOptionId]);

  useEffect(() => {
    if (maxQuantity > 0 && quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
  }, [maxQuantity, quantity]);

  async function handleSubmit() {
    if (isSubmitting || !selectedOption.available || maxQuantity === 0) {
      return;
    }

    setIsSubmitting(true);
    setFormMessage(null);
    setReceipt(null);

    try {
      const response = await fetch("/api/user/slots/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month: activeOffer.month,
          quantity,
          slot_type:
            selectedOption.slotType === "pro" ? selectedOption.slotType : undefined,
          term_months:
            selectedOption.slotType === "pro"
              ? selectedOption.termMonths
              : undefined,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | (ApiErrorPayload & Partial<UserSlotCheckoutPayload>)
        | null;

      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        setFormMessage({
          text: getErrorMessage(
            payload,
            "We couldn't reserve slots right now. Please try again.",
          ),
          tone: "error",
        });
        return;
      }

      setReceipt({
        coveredMonths:
          payload?.covered_months?.length ? payload.covered_months : selectedOption.coveredMonths,
        message: payload?.message?.trim() || "Slots reserved successfully.",
        quantity,
        reference: payload?.transaction?.reference,
        totalPayableAmount:
          payload?.pricing?.total_payable_amount ?? totalPayableAmount,
      });
      setFormMessage({
        text: payload?.message?.trim() || "Slots reserved successfully.",
        tone: "success",
      });
      setQuantity(1);
      router.refresh();
    } catch {
      setFormMessage({
        text:
          "We couldn't connect to Stakeloop right now. Please try again in a moment.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-[1.7rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#f2f6ff_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-700">
            Reserve Slots
          </p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950">
            Choose your slot contract
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Select a regular or Pro Slot plan, choose quantity, and confirm the
            reservation against the live inventory for {formatDashboardMonthLabel(activeOffer.month)}.
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
          <span className="text-slate-400">Current monthly cap:</span>{" "}
          <span className="font-black text-slate-950">{reservedSlots}/5 reserved</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        {options.map((option) => {
          const isSelected = option.id === selectedOption.id;
          const availabilityText = option.available
            ? `${option.remainingSlots} slot${option.remainingSlots === 1 ? "" : "s"} left`
            : option.missingMonths.length
              ? `Needs ${option.missingMonths
                  .map((month) => formatDashboardMonthLabel(month))
                  .join(", ")} inventory`
              : "Unavailable right now";

          return (
            <button
              key={option.id}
              className={`rounded-[1.35rem] border p-4 text-left transition ${
                isSelected
                  ? "border-slate-950 bg-slate-950 text-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.85)]"
                  : "border-slate-200 bg-white text-slate-950 hover:border-slate-300"
              } ${!option.available ? "opacity-75" : ""}`}
              onClick={() => setSelectedOptionId(option.id)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black">{option.label}</p>
                  <p
                    className={`mt-1 text-xs font-semibold ${
                      isSelected ? "text-white/75" : "text-slate-500"
                    }`}
                  >
                    {availabilityText}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
                    option.available
                      ? isSelected
                        ? "bg-white/14 text-white"
                        : "bg-emerald-50 text-emerald-700"
                      : isSelected
                        ? "bg-white/10 text-white"
                        : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {option.available ? "Available" : "Locked"}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <p
                  className={`text-xs font-black uppercase tracking-[0.22em] ${
                    isSelected ? "text-white/60" : "text-slate-400"
                  }`}
                >
                  Coverage
                </p>
                <p className="text-sm font-semibold">
                  {formatMonthsList(option.coveredMonths)}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm font-semibold">
                <span className={isSelected ? "text-white/75" : "text-slate-500"}>
                  Service charge
                </span>
                <span>{Math.round(option.serviceChargeRate * 100)}%</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
            Quantity
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {quantityOptions.length ? (
              quantityOptions.map((optionQuantity) => (
                <button
                  key={optionQuantity}
                  className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-black transition ${
                    optionQuantity === quantity
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  onClick={() => setQuantity(optionQuantity)}
                  type="button"
                >
                  {optionQuantity}
                </button>
              ))
            ) : (
              <div className="rounded-[1rem] bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                {purchaseRoom === 0
                  ? "You are already at the 5-slot monthly cap for this offer."
                  : "This plan has no immediately reservable inventory."}
              </div>
            )}
          </div>

          <div className="mt-5 space-y-3 rounded-[1.2rem] bg-slate-50 px-4 py-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-slate-500">Selected plan</span>
              <span className="font-black text-slate-950">{selectedOption.label}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-slate-500">Coverage end</span>
              <span className="font-black text-slate-950">
                {formatDashboardMonthLabel(
                  selectedOption.coveredMonths[selectedOption.coveredMonths.length - 1],
                )}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-slate-500">Plan inventory</span>
              <span className="font-black text-slate-950">
                {selectedOption.remainingSlots} remaining
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
            Reservation summary
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.15rem] bg-slate-50 px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Contract value
              </p>
              <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                {formatDashboardCurrency(contractValue)}
              </p>
            </div>
            <div className="rounded-[1.15rem] bg-slate-50 px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Service charge
              </p>
              <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                {formatDashboardCurrency(serviceChargeAmount)}
              </p>
            </div>
            <div className="rounded-[1.15rem] bg-blue-50 px-4 py-4 sm:col-span-2">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Estimated total payable
              </p>
              <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {formatDashboardCurrency(totalPayableAmount)}
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                Estimate is based on the live unit price and backend-provided
                service-charge rules for this offer.
              </p>
            </div>
          </div>

          {formMessage ? (
            <div
              className={`mt-4 rounded-[1.2rem] border px-4 py-3 text-sm font-medium ${formMessageClasses[formMessage.tone]}`}
            >
              {formMessage.text}
            </div>
          ) : null}

          {receipt ? (
            <div className="mt-4 rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
              <p className="font-black uppercase tracking-[0.18em]">
                Latest reservation
              </p>
              <p className="mt-2 font-semibold">
                {receipt.quantity} slot{receipt.quantity === 1 ? "" : "s"} covering{" "}
                {formatMonthsList(receipt.coveredMonths)} for{" "}
                {formatDashboardCurrency(receipt.totalPayableAmount)}.
              </p>
              {receipt.reference ? (
                <p className="mt-1 font-medium text-emerald-700">
                  Reference: {receipt.reference}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-sm leading-7 text-slate-500">
              Every reservation is checked against the monthly 5-slot cap and,
              for Pro Slots, the covered-month inventory before it is confirmed.
            </p>
            <button
              className="inline-flex h-12 items-center justify-center rounded-[1.1rem] bg-slate-950 px-5 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || !selectedOption.available || maxQuantity === 0}
              onClick={() => {
                void handleSubmit();
              }}
              type="button"
            >
              {isSubmitting ? "Reserving..." : "Reserve slots now"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
