"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ShieldAlert, Cpu, Eye, FileText, CheckCircle2, Lock, ArrowUpRight } from "lucide-react";

export const CinematicFeatureSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const featureCards = [
    {
      title: "Documented Data Sheets",
      subtitle: "Verified SDS / MSDS",
      description: "Direct access to manufacturer technical sheets, hazard statements, and official first aid steps.",
      badge: "ISO 11014",
    },
    {
      title: "PPE Compliance Standards",
      subtitle: "EN ISO & ASTM Specs",
      description: "Tensile strength, dielectric voltage class, and chemical breakthrough times indexed transparently.",
      badge: "EN 374 / 388",
    },
    {
      title: "Safe Chemical Containment",
      subtitle: "Strict SDS Gatekeeper",
      description: "Caustic soda, degreasers, and sanitizers require documented formulation evidence before publishing.",
      badge: "Corrosive / Flammable",
    },
    {
      title: "Immutable Audit Log",
      subtitle: "Every Change Recorded",
      description: "Stock adjustments require mandatory reasons, timestamped actors, and tamper-proof history.",
      badge: "Zero Tampering",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#0a0a0c] text-white overflow-hidden relative">
      <div className="max-w-6xl mx-auto">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Precision Architecture
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-2">
            Experience VeriSpec in Full Action
          </h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            Witness the standard of verified industrial intelligence. Capturing authentic specifications with unmatched precision, blurring the line between physical inventory and digital telemetry.
          </p>
        </div>

        {/* Central Cinematic Container - Visora Style */}
        <div className="relative rounded-3xl bg-[#111116] border border-white/10 p-6 md:p-12 overflow-hidden shadow-2xl mb-12">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-700/20 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Spec Tags */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/10">
              <Eye className="w-3.5 h-3.5 text-zinc-300" />
              <span>Transparent Public Catalogue</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/10">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Protected Management & Owner RBAC</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Moderated Community Reviews</span>
            </div>
          </div>

          {/* Video / Interactive Simulation Stage */}
          <div className="relative aspect-[21/9] rounded-2xl bg-gradient-to-tr from-black via-zinc-900 to-zinc-950 border border-white/10 flex flex-col items-center justify-center text-center p-6 overflow-hidden">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-xl hover:scale-110 transition-transform mb-3 group"
              title="Toggle interactive telemetry view"
            >
              <Play className="w-6 h-6 fill-zinc-950 ml-0.5" />
            </button>
            <span className="text-sm font-bold tracking-tight text-white">
              {isPlaying ? "Telemetry Simulation Active" : "Click to Inspect Telemetry Stream"}
            </span>
            <span className="text-xs text-zinc-400 mt-1 font-mono">
              Live Stock Tracking &bull; 19 Initial Master Products &bull; 2 Warehouses
            </span>
          </div>
        </div>

        {/* 4 Feature Cards Grid - Visora Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-2xl bg-[#121217] border border-white/8 hover:border-white/20 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                    {card.badge}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-base font-bold text-white tracking-tight">{card.title}</h4>
                <div className="text-xs font-medium text-zinc-400 mt-0.5">{card.subtitle}</div>
                <p className="text-xs text-zinc-500 mt-3 leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
