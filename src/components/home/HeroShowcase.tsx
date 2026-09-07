"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle, ExternalLink, Sparkles, Layers, Box, Info } from "lucide-react";
import { VerificationBadge } from "../ui/VerificationBadge";

export const HeroShowcase: React.FC = () => {
  const [activeAngle, setActiveAngle] = useState<number>(0);

  const angleImages = [
    {
      title: "Front View",
      badge: "Master Specification",
      subtitle: "Multi-Hazard Chemical & PPE Integrity",
    },
    {
      title: "Side Profile",
      badge: "Ergonomic & Fit Analysis",
      subtitle: "Material Thickness & Gauntlet Cuff",
    },
    {
      title: "Material Micro-Structure",
      badge: "Barrier Testing View",
      subtitle: "Pinhole & Tensile Stress Points",
    },
  ];

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Editorial Headline - matching "Feel the Future" from reference image */}
      <div className="max-w-6xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-200/60 text-zinc-800 text-xs font-semibold mb-6 border border-zinc-300/60 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
          <span>Industrial Inventory &bull; Verified Reviews &bull; Zero Hallucinations</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-zinc-950 uppercase leading-[0.95]">
          Feel the Future
        </h1>
        <p className="mt-4 text-sm md:text-base text-zinc-500 font-medium max-w-xl mx-auto">
          Industrial-grade product intelligence, real-time inventory telemetry, and authenticated safety assessments.
        </p>
      </div>

      {/* Main Interactive Showcase Canvas */}
      <div className="max-w-6xl mx-auto relative rounded-[2.5rem] bg-gradient-to-b from-zinc-100 to-zinc-200/70 p-6 md:p-12 border border-zinc-300/80 shadow-inner">
        {/* Floating Callout Tag 1 (Top Left) */}
        <div className="hidden lg:flex absolute top-12 left-16 z-20 flex-col items-start gap-1 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200 shadow-md max-w-xs transition-all hover:scale-105">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px]">
              <Layers className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold text-zinc-900">Barrier Integrity</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-snug">
            Latex-Free & EN 374 ratings: <strong className="text-zinc-700">Requires verification</strong> against official SDS documentation.
          </p>
        </div>

        {/* Floating Callout Tag 2 (Top Right) */}
        <div className="hidden lg:flex absolute top-12 right-16 z-20 flex-col items-start gap-1 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200 shadow-md max-w-xs transition-all hover:scale-105">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
              <ShieldCheck className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold text-zinc-900">No Hallucinations</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-snug">
            Chemical hazards and prices are never fabricated. Missing items are strictly labeled pending.
          </p>
        </div>

        {/* Central Visual Showcase Container */}
        <div className="relative z-10 flex flex-col items-center justify-center py-8">
          {/* Angle Switcher Pills */}
          <div className="flex items-center gap-2 mb-6">
            {angleImages.map((ang, idx) => (
              <button
                key={ang.title}
                onClick={() => setActiveAngle(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeAngle === idx
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "bg-white/80 text-zinc-700 border border-zinc-200 hover:bg-white"
                }`}
              >
                {ang.title}
              </button>
            ))}
          </div>

          {/* Central Hero Graphic (High-contrast industrial helmet/device stylized render) */}
          <div className="relative w-full max-w-xl aspect-[16/10] flex items-center justify-center">
            {/* Ambient Shadow Ring */}
            <div className="absolute inset-0 bg-radial from-zinc-400/20 via-transparent to-transparent rounded-full blur-2xl" />

            {/* Stylized Futuristic Headset / Industrial Safety Shield Representation */}
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-zinc-800 via-zinc-950 to-zinc-700 p-2 shadow-2xl flex items-center justify-center border-4 border-zinc-600/40">
              {/* Reflective Visor Effect */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-900 via-zinc-850 to-black p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Metallic glare highlight */}
                <div className="absolute -top-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-3 shadow-inner">
                  <Box className="w-8 h-8" />
                </div>
                <span className="text-white font-black tracking-tight text-xl md:text-2xl uppercase">
                  VERISPEC 360&deg;
                </span>
                <span className="text-zinc-400 text-xs font-mono mt-1">
                  {angleImages[activeAngle].subtitle}
                </span>
                <div className="mt-4 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-semibold">
                  STATUS: 19 INITIAL MASTER ITEMS SEEDED
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Row: Floating Dark Card (Left) + Stats (Right) */}
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6 items-end mt-6">
          {/* Floating Dark Card - Visora Style */}
          <div className="md:col-span-2 p-6 md:p-8 rounded-3xl bg-[#0d0d11]/95 backdrop-blur-xl text-white border border-white/10 shadow-2xl">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Verified Platform Engine
            </span>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
              Experience the future of industrial safety & inventory intelligence
            </h3>
            <p className="mt-2 text-xs md:text-sm text-zinc-400 leading-relaxed max-w-lg">
              Explore 19 initial master products across PPE, chemical hygiene, and waste management.
              Every spec is traceable, every stock change is audit-logged, and all purchase links lead to verified external suppliers.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs shadow-lg hover:bg-zinc-100 transition-all group"
              >
                <span>Show Now</span>
                <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors border border-white/10"
              >
                <span>Compare Specs</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Statistics & Mini Feature Pill */}
          <div className="flex flex-col gap-4">
            {/* Stats Counter 1 */}
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-3xl font-black tracking-tight text-zinc-950">19</div>
                <div className="text-xs text-zinc-500 font-medium">Initial Master Products</div>
              </div>
              <div className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-100 text-zinc-700">
                10 PPE / 9 Chem
              </div>
            </div>

            {/* Stats Counter 2 */}
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-3xl font-black tracking-tight text-zinc-950">100%</div>
                <div className="text-xs text-zinc-500 font-medium">Audit-Logged Stock Moves</div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Mini Product Card - Visora Style ($1,499 floating pill) */}
            <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  VS
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">Safety shoes</div>
                  <div className="text-[11px] text-zinc-500">Indicative ref. &bull; ₹1,450</div>
                </div>
              </div>
              <Link
                href="/products/safety-shoes"
                className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors"
                title="View verified details"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
