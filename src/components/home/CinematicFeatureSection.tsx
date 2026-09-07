"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ShieldAlert, Cpu, Eye, FileText, CheckCircle2, Lock, ArrowUpRight, ArrowRight } from "lucide-react";

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

          {/* Video / Interactive Simulation Stage with High-Tech Photographic Backdrop */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl bg-zinc-950 border border-white/15 overflow-hidden group shadow-2xl">
            {/* Background Facility Image */}
            <img
              src="/images/hero_hazardous.jpg"
              alt="VeriSpec Chemical Facility"
              className={`w-full h-full object-cover transition-all duration-700 ${
                isPlaying ? "scale-105 filter brightness-40 contrast-125" : "filter brightness-60 group-hover:scale-102"
              }`}
            />

            {/* Dark Ambient Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

            {/* Telemetry Corner Brackets */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-[10px] font-mono text-zinc-300 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FACILITY SENSORS ACTIVE &bull; ZONE A-04</span>
            </div>

            <div className="absolute top-4 right-4 z-20 text-[10px] font-mono text-amber-300 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-400/30">
              HAZMAT PROTOCOL: GHS-08 ENFORCED
            </div>

            {/* Interactive Overlay When Playing */}
            {isPlaying ? (
              <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col justify-between bg-black/50 backdrop-blur-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
                  <div className="p-3.5 rounded-xl bg-black/80 border border-white/15 text-left">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Containment Sump</span>
                    <span className="text-base md:text-lg font-black text-emerald-400 font-mono">12% Nominal</span>
                    <span className="text-[9px] text-zinc-500 block mt-0.5">Spill Barrier Intact</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/80 border border-white/15 text-left">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Airborne Vapor</span>
                    <span className="text-base md:text-lg font-black text-cyan-400 font-mono">0.03 PPM</span>
                    <span className="text-[9px] text-zinc-500 block mt-0.5">Below OSHA Ceiling</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/80 border border-white/15 text-left">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Airflow Pressure</span>
                    <span className="text-base md:text-lg font-black text-white font-mono">+24 Pa Positive</span>
                    <span className="text-[9px] text-zinc-500 block mt-0.5">Cleanroom Differential</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/80 border border-white/15 text-left">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Audit Verification</span>
                    <span className="text-base md:text-lg font-black text-amber-300 font-mono">100% Traceable</span>
                    <span className="text-[9px] text-zinc-500 block mt-0.5">Mandatory Reason Gate</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/15">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Streaming live movements from 2 facility depots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
                    >
                      Pause Stream
                    </button>
                    <Link
                      href="/management"
                      className="px-4 py-2 rounded-full bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      <span>Open Management Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform mb-3 group/btn"
                  title="Inspect real-time facility telemetry stream"
                >
                  <Play className="w-6 h-6 fill-zinc-950 ml-0.5 group-hover/btn:scale-110 transition-transform" />
                </button>
                <span className="text-base font-bold tracking-tight text-white drop-shadow-md">
                  Inspect Live Warehouse & Environmental Telemetry
                </span>
                <span className="text-xs text-zinc-300 mt-1 font-mono drop-shadow-sm">
                  Continuous Stock Monitoring &bull; 19 Master Products &bull; Zero Fabricated Records
                </span>
              </div>
            )}
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
