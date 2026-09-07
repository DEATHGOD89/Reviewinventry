"use client";

import React, { useState } from "react";
import { SUPPORTED_CURRENCIES } from "@/lib/services/currency";
import { Globe } from "lucide-react";

export interface CurrencySelectorProps {
  currentCurrency: string;
  onCurrencyChange: (code: string) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onCurrencyChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 border border-zinc-200 shadow-xs hover:bg-zinc-50 transition-colors"
      >
        <Globe className="w-3.5 h-3.5 text-zinc-500" />
        <span>{currentCurrency}</span>
        <span className="text-zinc-400">({SUPPORTED_CURRENCIES[currentCurrency]?.symbol || "₹"})</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-zinc-200 shadow-xl py-2 z-50 text-xs">
            <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase border-b border-zinc-100">
              Select Currency
            </div>
            {Object.values(SUPPORTED_CURRENCIES).map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  onCurrencyChange(c.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-50 transition-colors ${
                  currentCurrency === c.code ? "bg-zinc-100 font-bold" : ""
                }`}
              >
                <span>{c.code} - {c.name}</span>
                <span className="text-zinc-400 font-mono">{c.symbol}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
