"use client";

import React from "react";
import Link from "next/link";
import {
  Play,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Check,
  Video,
  Sparkles,
  Download,
  Share2,
  Clock,
  Layers,
  FileText,
  ShieldCheck,
} from "lucide-react";

export const HeroShowcase: React.FC = () => {
  // Delicate twinkling sparkle stars for ambient depth (zero background dots)
  const SPARKLE_STARS = [
    { top: "6%", left: "8%", delay: 0.2, duration: 3.4, size: "w-3.5 h-3.5" },
    { top: "16%", left: "82%", delay: 0.8, duration: 3.6, size: "w-3 h-3" },
    { top: "8%", left: "92%", delay: 2.1, duration: 4.5, size: "w-4 h-4" },
    { top: "32%", left: "88%", delay: 1.1, duration: 3.9, size: "w-3 h-3" },
    { top: "42%", left: "5%", delay: 0.5, duration: 4.1, size: "w-3.5 h-3.5" },
    { top: "60%", left: "10%", delay: 1.6, duration: 4.0, size: "w-3 h-3" },
    { top: "78%", left: "6%", delay: 2.5, duration: 4.4, size: "w-4 h-4" },
    { top: "86%", left: "92%", delay: 1.2, duration: 3.7, size: "w-3 h-3" },
    { top: "65%", left: "72%", delay: 2.2, duration: 3.8, size: "w-3 h-3" },
  ];

  return (
    <section className="relative w-full bg-white overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-32 border-b border-slate-100">
      {/* 1. Subtle Ambient Soft Mesh Backdrop (Clean, no background dots) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 via-white to-white pointer-events-none" />

      {/* 2. Ambient Twinkling Sparkle Star Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {SPARKLE_STARS.map((star, idx) => (
          <div
            key={idx}
            className="absolute animate-star-pop"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className={`${star.size} fill-indigo-500/60 text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.55)]`}
            >
              <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
            </svg>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Constellation Header: Central Badge + Connector Rays + 4 Corner Pills */}
        <div className="relative w-full max-w-4xl mx-auto min-h-[160px] flex items-center justify-center mb-4">
          {/* Subtle Ambient Radial Back-Halo behind center badge */}
          <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-indigo-200/50 via-purple-200/40 to-pink-200/30 blur-2xl animate-halo-pulse pointer-events-none" />

          {/* Responsive SVG Connector Rays (Desktop & Tablet >= 768px) */}
          <svg
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 900 160"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Ray to Top-Left Pill (PPE Barrier) */}
            <path
              d="M 410 65 L 200 45"
              stroke="url(#rayGradient)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-ray-pulse"
            />
            <circle cx="200" cy="45" r="3" fill="#6366f1" />

            {/* Ray to Bottom-Left Pill (SDS Verified) */}
            <path
              d="M 410 95 L 210 120"
              stroke="url(#rayGradient)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-ray-pulse"
            />
            <circle cx="210" cy="120" r="3" fill="#7c3aed" />

            {/* Ray to Top-Right Pill (Audit Trail) */}
            <path
              d="M 490 65 L 700 45"
              stroke="url(#rayGradient)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-ray-pulse"
            />
            <circle cx="700" cy="45" r="3" fill="#6366f1" />

            {/* Ray to Bottom-Right Pill (Telemetry) */}
            <path
              d="M 490 95 L 690 120"
              stroke="url(#rayGradient)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-ray-pulse"
            />
            <circle cx="690" cy="120" r="3" fill="#9333ea" />

            {/* Secondary subtle ambient rays fanning out */}
            <path
              d="M 410 80 L 260 80"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <circle cx="260" cy="80" r="2" fill="#94a3b8" />

            <path
              d="M 490 80 L 640 80"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <circle cx="640" cy="80" r="2" fill="#94a3b8" />
          </svg>

          {/* Floating Pill 1: Top-Left (PPE Barrier) */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-lg shadow-slate-200/50 absolute left-4 lg:left-12 top-6 z-10 transition-transform hover:scale-105 duration-200">
            <span className="text-xs font-semibold text-slate-800 tracking-tight">
              PPE Barrier
            </span>
            <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              🛡️
            </div>
          </div>

          {/* Floating Pill 2: Bottom-Left (SDS Verified) */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-lg shadow-slate-200/50 absolute left-8 lg:left-16 bottom-4 z-10 transition-transform hover:scale-105 duration-200">
            <span className="text-xs font-semibold text-slate-800 tracking-tight">
              SDS Verified
            </span>
            <div className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              ⚡
            </div>
          </div>

          {/* Central Logo Badge with Polished Vector SVG */}
          <div className="relative z-20 w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-indigo-100/60 flex items-center justify-center transition-all hover:scale-105 duration-300 group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 pointer-events-none" />
            
            {/* Custom Modern Geometric Logo Mark */}
            <svg
              className="relative z-10 w-12 h-12 text-indigo-600 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="qusoGlyphGrad" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="dotGrad" x1="18" y1="15" x2="28" y2="25" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              {/* Outer sleek 'q' circular aperture */}
              <circle
                cx="23"
                cy="20"
                r="11"
                stroke="url(#qusoGlyphGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {/* Descender stem extending down with modern rounded terminal */}
              <path
                d="M34 11V34C34 38.4 30.6 41.5 26.5 41.5H23"
                stroke="url(#qusoGlyphGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Central focal core point */}
              <circle cx="23" cy="20" r="4.2" fill="url(#dotGrad)" />
            </svg>
          </div>

          {/* Floating Pill 3: Top-Right (Audit Trail) */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-lg shadow-slate-200/50 absolute right-4 lg:right-12 top-6 z-10 transition-transform hover:scale-105 duration-200">
            <div className="w-6 h-6 rounded-md bg-purple-900 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              📋
            </div>
            <span className="text-xs font-semibold text-slate-800 tracking-tight">
              Audit Trail
            </span>
          </div>

          {/* Floating Pill 4: Bottom-Right (Telemetry) */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-lg shadow-slate-200/50 absolute right-8 lg:right-16 bottom-4 z-10 transition-transform hover:scale-105 duration-200">
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              📊
            </div>
            <span className="text-xs font-semibold text-slate-800 tracking-tight">
              Telemetry
            </span>
          </div>
        </div>

        {/* Mobile Chips (Visible only < 768px) */}
        <div className="flex md:hidden flex-wrap items-center justify-center gap-2 mb-6 px-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-xs">
            🛡️ PPE Barrier
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-xs">
            ⚡ SDS Verified
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-xs">
            📋 Audit Trail
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-xs">
            📊 Telemetry
          </span>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] font-sans">
            World&apos;s First AI-Powered
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#8b5cf6]">
              Inventory &amp; Review Co-Pilot
            </span>
          </h1>

          {/* Subheading */}
          <div className="text-slate-600 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed space-y-0.5">
            <p>Industrial intelligence that verifies, tracks, and audits all in one place.</p>
            <p className="font-semibold text-slate-800">100% Verified Specifications. Automated.</p>
          </div>

          {/* Social Proof Avatars */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                alt="Auditor"
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
                alt="Auditor"
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&h=80&q=80"
                alt="Auditor"
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80"
                alt="Auditor"
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              4M+ trusted users
            </span>
          </div>

          {/* Exact Purple Primary CTA Button */}
          <div className="pt-4 flex flex-col items-center gap-2">
            <Link
              href="/#datasheet"
              className="px-8 py-3.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-base font-bold shadow-[0_12px_28px_-6px_rgba(99,102,241,0.55)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started for Free
            </Link>
            <span className="text-xs text-slate-500">No credit card required.</span>
          </div>
        </div>

        {/* Floating UI Mockup Showcase (Exact composition from Reference Image) */}
        <div className="mt-14 lg:mt-20 relative min-h-[380px] lg:min-h-[440px]">
          {/* Mobile Stacking Grid (< 1024px) / Absolute Layout (>= 1024px) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:block gap-6 max-w-6xl mx-auto">
            {/* 1. BOTTOM LEFT: Video Editor / Product Studio Window */}
            <div className="lg:absolute lg:left-0 lg:bottom-12 w-full lg:w-[300px] xl:w-[320px] rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden z-10 transition-transform hover:-translate-y-1">
              <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-indigo-600" />
                  AI Spec Studio
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[10px]">
                  Draft
                </span>
              </div>
              <div className="p-3 bg-slate-900 relative h-36 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80"
                  alt="Full-face respirator"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                  <span>00:04 / 00:30</span>
                  <span>EN 136 Barrier</span>
                </div>
              </div>
            </div>

            {/* 2. BOTTOM LEFT OVERLAY: Captions / Style Modal (Tilted slightly) */}
            <div className="lg:absolute lg:left-16 xl:left-24 lg:bottom-0 w-full lg:w-[270px] xl:w-[290px] rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-20 transition-transform hover:rotate-0 lg:-rotate-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-800">
                <span className="text-slate-900">Captions</span>
                <span className="text-slate-400 font-normal">Style</span>
              </div>
              <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>00:00:07:000 - 00:00:12:000</span>
                  <Trash2 className="w-3 h-3 text-red-400" />
                </div>
                <p className="text-[11px] font-medium text-slate-700">
                  To begin with, though, just make sure that barrier seals are verified.
                </p>
              </div>
              <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>00:00:12:000 - 00:00:32:000</span>
                <Trash2 className="w-3 h-3 text-red-300" />
              </div>
            </div>

            {/* 3. BOTTOM CENTER: Floating Platform 3D Tiles in an Arc */}
            <div className="md:col-span-2 lg:col-span-1 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:bottom-2 flex items-center justify-center gap-3 z-20 py-4 lg:py-0">
              {/* Tile 1: YouTube */}
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center justify-center hover:-translate-y-1.5 transition-transform duration-200 cursor-pointer group">
                <div className="w-7 h-5 rounded bg-red-600 text-white flex items-center justify-center">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
              </div>

              {/* Tile 2: TikTok */}
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center justify-center hover:-translate-y-1.5 transition-transform duration-200 cursor-pointer group">
                <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">
                  ♫
                </div>
              </div>

              {/* Tile 3: Instagram */}
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-2xl flex items-center justify-center hover:-translate-y-2 transition-transform duration-200 cursor-pointer group -translate-y-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-inner">
                  📸
                </div>
              </div>

              {/* Tile 4: LinkedIn */}
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center justify-center hover:-translate-y-1.5 transition-transform duration-200 cursor-pointer group">
                <div className="w-7 h-7 rounded bg-[#0077b5] text-white flex items-center justify-center text-xs font-bold">
                  in
                </div>
              </div>

              {/* Tile 5: X / Twitter */}
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center justify-center hover:-translate-y-1.5 transition-transform duration-200 cursor-pointer group">
                <div className="w-7 h-7 rounded bg-black text-white flex items-center justify-center text-xs font-black">
                  𝕏
                </div>
              </div>
            </div>

            {/* 4. BOTTOM RIGHT: Calendar Schedule Grid Card */}
            <div className="lg:absolute lg:right-0 lg:bottom-12 w-full lg:w-[300px] xl:w-[320px] rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-10 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">July 2026</span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                  Today
                </span>
              </div>

              {/* Calendar Grid Rows */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-[10px]">
                <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-100 text-purple-900 space-y-1">
                  <span className="font-bold block">11:00 AM</span>
                  <p className="truncate text-[9px] text-purple-700">Audit Batch #44</p>
                  <span className="inline-block w-full h-8 rounded bg-purple-200/50" />
                </div>
                <div className="p-2 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 space-y-1">
                  <span className="font-bold block">02:30 PM</span>
                  <p className="truncate text-[9px] text-indigo-700">SDS Review</p>
                  <span className="inline-block w-full h-8 rounded bg-indigo-200/50" />
                </div>
                <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-900 space-y-1">
                  <span className="font-bold block">05:00 PM</span>
                  <p className="truncate text-[9px] text-emerald-700">Restock Dispatch</p>
                  <span className="inline-block w-full h-8 rounded bg-emerald-200/50" />
                </div>
              </div>
            </div>

            {/* 5. BOTTOM RIGHT OVERLAY: Post Inspector Card (Tilted slightly) */}
            <div className="lg:absolute lg:right-16 xl:right-24 lg:bottom-0 w-full lg:w-[255px] xl:w-[270px] rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-20 transition-transform hover:rotate-0 lg:rotate-2">
              <div className="flex gap-2.5 items-start">
                <img
                  src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=160&q=80"
                  alt="Nitrile gloves"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Inspect Specs
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    Nitrile Barrier Gloves
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold inline-block">
                    AQL 1.5 Verified
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-[10px] text-slate-500">
                <div className="flex justify-between">
                  <span>Standard</span>
                  <strong className="text-slate-800">EN ISO 374-1</strong>
                </div>
                <div className="flex justify-between">
                  <span>Breakthrough</span>
                  <strong className="text-slate-800">&gt; 480 mins</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
