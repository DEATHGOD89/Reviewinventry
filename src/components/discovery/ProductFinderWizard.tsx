"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getAllDynamicProducts } from "@/lib/services/products-crud";
import { ProductItem } from "@/lib/catalog-data";
import { TrustScoreBadge } from "@/components/ui/TrustScoreBadge";
import {
  Compass,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

export const ProductFinderWizard: React.FC = () => {
  const [step, setStep] = useState<number>(1);

  // User selections
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [environment, setEnvironment] = useState<"indoor" | "outdoor" | "both">("both");
  const [durability, setDurability] = useState<"disposable" | "reusable" | "any">("any");
  const [requiresDoc, setRequiresDoc] = useState<boolean>(true);
  const [quantityBand, setQuantityBand] = useState<"small" | "bulk">("small");

  const allProducts = getAllDynamicProducts();

  // Filter matched products based on questionnaire
  const matchedProducts = allProducts.filter((p) => {
    // 1. Category match
    if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
      return false;
    }

    // 2. Durability match (disposable vs reusable)
    if (durability === "disposable") {
      const isDisposable =
        p.name.toLowerCase().includes("disposable") ||
        p.shortDescription.toLowerCase().includes("single-use") ||
        p.ppeDetail?.isReusable === false;
      if (!isDisposable) return false;
    } else if (durability === "reusable") {
      const isReusable =
        p.ppeDetail?.isReusable === true ||
        p.name.toLowerCase().includes("heavy-duty") ||
        p.name.toLowerCase().includes("helmet") ||
        p.name.toLowerCase().includes("respirator");
      if (!isReusable && p.ppeDetail?.isReusable === false) return false;
    }

    return true;
  });

  const resetWizard = () => {
    setStep(1);
    setSelectedCategory("all");
    setEnvironment("both");
    setDurability("any");
    setRequiresDoc(true);
    setQuantityBand("small");
  };

  return (
    <div className="rounded-3xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
      {/* Wizard Header */}
      <div className="p-6 md:p-8 bg-zinc-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Product Intelligence Navigator</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Find The Right Verified Product
          </h2>
          <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">
            Answer a few simple questions to match verified workplace equipment and chemicals tailored to your specific application.
          </p>
        </div>

        {step > 1 && (
          <button
            onClick={resetWizard}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>
        )}
      </div>

      {/* Progress Indicators */}
      <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <span>Step {Math.min(step, 4)} of 4: Guided Recommendation</span>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step
                  ? "w-8 bg-zinc-950"
                  : s < step
                  ? "w-4 bg-emerald-600"
                  : "w-4 bg-zinc-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* QUESTION 1: Category & Application Domain */}
      {step === 1 && (
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-950">
              1. What type of workplace product do you need?
            </h3>
            <p className="text-xs text-zinc-500">
              Select the primary domain or application for your facility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: "all", title: "All Workplace Supplies", desc: "Browse full master inventory across all domains" },
              { id: "ppe-gloves", title: "PPE & Protective Gloves", desc: "Nitrile barrier, mechanical & electrical safety gloves" },
              { id: "ppe-respiratory", title: "Respiratory & Face Protection", desc: "Chemical gas masks, anti-fog visors, helmets" },
              { id: "cleaning-chemicals", title: "Cleaning Chemicals & Alkalis", desc: "Caustic soda, Suma Det., degreasers, descalers" },
              { id: "waste-management", title: "Waste Management & Bins", desc: "Biohazard pedal bins, outdoor wheelie dumpsters" },
              { id: "facility-hygiene", title: "Facility Sanitation & Paper", desc: "Disinfectant wipes, microfiber, hand care" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedCategory(opt.id);
                  setStep(2);
                }}
                className="p-4 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-950 hover:shadow-md text-left transition-all space-y-1 group"
              >
                <div className="text-sm font-bold text-zinc-900 group-hover:text-zinc-950 flex items-center justify-between">
                  <span>{opt.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-950 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUESTION 2: Environment & Durability */}
      {step === 2 && (
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-950">
              2. Operating Environment & Durability Requirement
            </h3>
            <p className="text-xs text-zinc-500">
              Specify indoor/outdoor setting and whether you need single-use disposable or reusable equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Setting */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Primary Setting
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "indoor", label: "Indoor / Cleanroom" },
                  { id: "outdoor", label: "Outdoor / Yard" },
                  { id: "both", label: "Both / Flexible" },
                ].map((env) => (
                  <button
                    key={env.id}
                    onClick={() => setEnvironment(env.id as any)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      environment === env.id
                        ? "bg-zinc-950 text-white border-zinc-950"
                        : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    {env.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Durability */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Durability Requirement
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "disposable", label: "Single-Use" },
                  { id: "reusable", label: "Heavy Reusable" },
                  { id: "any", label: "Any / Either" },
                ].map((dur) => (
                  <button
                    key={dur.id}
                    onClick={() => setDurability(dur.id as any)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      durability === dur.id
                        ? "bg-zinc-950 text-white border-zinc-950"
                        : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-zinc-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-600 hover:text-zinc-950"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              Next: Documentation & Volume &rarr;
            </button>
          </div>
        </div>
      )}

      {/* QUESTION 3: Documentation & Scale */}
      {step === 3 && (
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-950">
              3. Verification Documentation & Order Volume
            </h3>
            <p className="text-xs text-zinc-500">
              Do you require official manufacturer SDS/lab certificates for audit compliance?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRequiresDoc(true)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                requiresDoc
                  ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs text-zinc-900 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Requires Verified Documentation</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                Prioritizes items with verified lab certs or strict SDS placeholder notices.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRequiresDoc(false)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                !requiresDoc
                  ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs text-zinc-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-zinc-600" />
                <span>General Information Only</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                Includes all catalog items regardless of documentation completion.
              </p>
            </button>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-zinc-100">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-600 hover:text-zinc-950"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              View Verified Recommendations ({matchedProducts.length}) &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Results Display */}
      {step === 4 && (
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recommendation Ready</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-950 mt-0.5">
                Matched Verified Products ({matchedProducts.length})
              </h3>
            </div>

            <button
              onClick={resetWizard}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 underline self-start sm:self-auto"
            >
              Adjust Preferences
            </button>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedProducts.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between hover:border-zinc-400 transition-all group"
              >
                <div>
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 mb-3 relative">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                        Photo Pending
                      </div>
                    )}
                    <span className="absolute top-2 left-2 text-[9px] font-mono px-2 py-0.5 rounded bg-black/75 text-white font-bold">
                      {p.sku}
                    </span>
                  </div>

                  <div className="mb-2">
                    <TrustScoreBadge product={p} size="sm" />
                  </div>

                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                    {p.categoryName}
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 leading-snug mt-0.5">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-zinc-600 line-clamp-2 mt-1 leading-relaxed">
                    {p.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-900">
                    ₹{p.indicativePriceInr.toFixed(2)} ref
                  </span>
                  <Link
                    href={`/products/${p.slug}`}
                    className="py-1.5 px-3 rounded-full bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-2xs"
                  >
                    View Passport
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-100 text-[11px] text-zinc-600 flex items-center justify-between">
            <span>Non-commercial policy: VeriSpec does not sell items directly. All purchases are external.</span>
            <Link href="/products" className="font-bold text-zinc-900 underline">
              Browse All ({allProducts.length}) &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
