"use client";

import React, { useState } from "react";
import { ProductItem } from "@/lib/catalog-data";
import { calculateTrustScore, TrustScoreBreakdown } from "@/lib/services/trust-score";
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  X,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  ChevronRight,
} from "lucide-react";

interface TrustScoreBadgeProps {
  product: ProductItem;
  size?: "sm" | "md" | "lg";
  showModalTrigger?: boolean;
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({
  product,
  size = "md",
  showModalTrigger = true,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const breakdown = calculateTrustScore(product);

  const getBadgeColor = (score: number) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-900 border-emerald-300";
    if (score >= 65) return "bg-amber-50 text-amber-900 border-amber-300";
    return "bg-red-50 text-red-900 border-red-300";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700";
    if (score >= 65) return "text-amber-700";
    return "text-red-700";
  };

  return (
    <>
      <button
        type="button"
        onClick={() => showModalTrigger && setModalOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full border transition-all ${getBadgeColor(
          breakdown.totalScore
        )} ${
          size === "sm"
            ? "px-2.5 py-0.5 text-[10px]"
            : size === "lg"
            ? "px-4 py-2 text-sm"
            : "px-3 py-1 text-xs"
        } ${showModalTrigger ? "hover:scale-105 cursor-pointer shadow-xs" : ""}`}
        title="Click to view transparent Trust Score breakdown"
      >
        <span className="font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Trust Score:</span>
        </span>
        <span className={`font-mono font-black ${getScoreColor(breakdown.totalScore)}`}>
          {breakdown.totalScore}/100
        </span>
        <span className="text-[10px] font-mono opacity-70">({breakdown.grade})</span>
        {showModalTrigger && <Info className="w-3 h-3 opacity-60 ml-0.5" />}
      </button>

      {/* Trust Score Breakdown Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-zinc-200 shadow-2xl p-6 md:p-8 space-y-6 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-zinc-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-mono">
                    VeriSpec Intelligence
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    SKU: {product.sku}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-950">
                  Transparent Trust Score Breakdown
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Overview Card */}
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-zinc-500 font-mono">Overall Rating</div>
                <div className="text-3xl font-black text-zinc-950 mt-0.5">
                  {breakdown.totalScore}
                  <span className="text-sm font-normal text-zinc-400">/100</span>
                </div>
                <div className="text-xs text-zinc-600 mt-1 font-medium">
                  Grade: <strong className="text-zinc-900">{breakdown.grade}</strong> &bull; Non-Commercial Formula
                </div>
              </div>

              <div className="text-right max-w-xs text-xs text-zinc-600 leading-snug">
                {breakdown.statusSummary}
              </div>
            </div>

            {/* 7 Factual Factors Table */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Audited Factual Criteria (Zero Guesswork)
              </div>

              <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-2xl overflow-hidden bg-white text-xs">
                {breakdown.factors.map((factor, i) => (
                  <div
                    key={i}
                    className="p-3.5 flex items-center justify-between gap-4 hover:bg-zinc-50"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                        {factor.status === "VERIFIED" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : factor.status === "PARTIAL" ? (
                          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        )}
                        <span>{factor.name}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-snug">
                        {factor.detail}
                      </p>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <span className="font-bold text-zinc-900">{factor.score}</span>
                      <span className="text-zinc-400">/{factor.maxScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>How this differs from other websites:</strong> We do not rank products
                by sponsored ads or unverified 5-star reviews. The Trust Score reflects factual
                traceability, laboratory test availability, and physical manufacturer corroboration.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
