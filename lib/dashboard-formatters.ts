const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
});

export function asDashboardNumber(value: number | string | undefined) {
  const nextValue = Number(value ?? 0);
  return Number.isFinite(nextValue) ? nextValue : 0;
}

export function formatDashboardCurrency(value: number | string | undefined) {
  return currencyFormatter.format(asDashboardNumber(value));
}

export function formatDashboardCompactCurrency(value: number | string | undefined) {
  return compactCurrencyFormatter.format(asDashboardNumber(value));
}

export function formatDashboardMonthLabel(
  month: string | null | undefined,
  fallback = "Awaiting Offer",
) {
  if (!month) {
    return fallback;
  }

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return month;
  }

  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthIndex - 1, 1));

  return monthFormatter.format(date);
}

export function formatDashboardDateLabel(
  value: string | null | undefined,
  fallback = "Pending",
) {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return dateFormatter.format(date);
}

export function formatDashboardDateTimeLabel(
  value: string | null | undefined,
  fallback = "Pending",
) {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return dateTimeFormatter.format(date);
}

export function formatDashboardShortDateLabel(
  value: string | null | undefined,
  fallback = "Pending",
) {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return shortDateFormatter.format(date);
}
