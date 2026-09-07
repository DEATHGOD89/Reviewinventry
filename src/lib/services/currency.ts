export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rateAgainstInr: number; // 1 INR = X Target
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyRate> = {
  INR: { code: "INR", name: "Indian Rupee", symbol: "₹", rateAgainstInr: 1.0 },
  USD: { code: "USD", name: "US Dollar", symbol: "$", rateAgainstInr: 0.012 },
  EUR: { code: "EUR", name: "Euro", symbol: "€", rateAgainstInr: 0.011 },
  GBP: { code: "GBP", name: "British Pound", symbol: "£", rateAgainstInr: 0.0095 },
  AED: { code: "AED", name: "UAE Dirham", symbol: "AED ", rateAgainstInr: 0.044 },
  SGD: { code: "SGD", name: "Singapore Dollar", symbol: "S$", rateAgainstInr: 0.016 },
  JPY: { code: "JPY", name: "Japanese Yen", symbol: "¥", rateAgainstInr: 1.80 },
  CAD: { code: "CAD", name: "Canadian Dollar", symbol: "CA$", rateAgainstInr: 0.016 },
  AUD: { code: "AUD", name: "Australian Dollar", symbol: "AU$", rateAgainstInr: 0.018 },
};

export const INDICATIVE_PRICE_DISCLAIMER =
  "Indicative only; prices vary by region, taxes, shipping, seller, and date. VeriSpec does not sell products or process payments.";

export function convertFromInr(
  amountInr: number,
  targetCurrencyCode: string = "INR"
): {
  amount: number;
  formatted: string;
  currency: CurrencyRate;
  timestamp: string;
  source: string;
  disclaimer: string;
} {
  const currency = SUPPORTED_CURRENCIES[targetCurrencyCode.toUpperCase()] || SUPPORTED_CURRENCIES.INR;
  const converted = amountInr * currency.rateAgainstInr;

  const formatted =
    currency.code === "INR"
      ? `₹${amountInr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `${currency.symbol}${converted.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

  return {
    amount: Number(converted.toFixed(2)),
    formatted,
    currency,
    timestamp: new Date().toISOString(),
    source: "Static Benchmark Rates (Verified financial source required for live feeds)",
    disclaimer: INDICATIVE_PRICE_DISCLAIMER,
  };
}
